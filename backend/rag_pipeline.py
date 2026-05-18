import os
import time
import logging
from typing import List, Optional
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import json
import re

load_dotenv()

logger = logging.getLogger(__name__)

CHROMA_DIR = "./chroma_db"


class TravelRAGPipeline:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set in environment.")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=api_key
        )
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-flash-latest",
            temperature=0.7,
            google_api_key=api_key
        )
        self.vector_store = self._init_vector_store()

    def _init_vector_store(self):
        return Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=self.embeddings
        )

    def ingest_pdf(self, file_path: str, city: str, category: str = "general"):
        """Ingest a PDF travel guide into ChromaDB with metadata."""
        logger.info(f"Ingesting {file_path} for city={city}")
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
        chunks = splitter.split_documents(documents)

        # Tag each chunk with city + category metadata
        for chunk in chunks:
            chunk.metadata["city"] = city.lower()
            chunk.metadata["category"] = category
            chunk.metadata["source"] = os.path.basename(file_path)

        # Add in batches to avoid rate limits with automatic retry logic
        batch_size = 5
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            
            # Retry loop for rate limits (429)
            retries = 4
            for attempt in range(retries):
                try:
                    self.vector_store.add_documents(batch)
                    break
                except Exception as e:
                    err_str = str(e)
                    if "429" in err_str or "Quota exceeded" in err_str.lower() or "rate-limits" in err_str.lower():
                        if attempt < retries - 1:
                            wait_time = 35.0 + (attempt * 10)
                            print(f"\n⚠️ Rate limit hit (429). Waiting {wait_time}s to reset quota before retrying batch...")
                            time.sleep(wait_time)
                            continue
                    raise e

            if i + batch_size < len(chunks):
                time.sleep(2.5)

        logger.info(f"Ingested {len(chunks)} chunks for {city}")
        return len(chunks)

    def retrieve_context(self, destination: str, travel_style: str, k: int = 10) -> List:
        """Retrieve relevant travel guide chunks for the destination."""
        query = f"{destination} travel guide {travel_style} activities sightseeing"
        try:
            # Try metadata-filtered search first
            results = self.vector_store.similarity_search(
                query,
                k=k,
                filter={"city": destination.lower()}
            )
            if not results:
                # Fallback: unfiltered search
                results = self.vector_store.similarity_search(query, k=k)
            return results
        except Exception as e:
            logger.warning(f"Vector Store retrieval failed (e.g. quota limit): {e}. Falling back to empty context.")
            return []

    def has_documents_for(self, destination: str) -> bool:
        """Check if we have any indexed documents for this destination."""
        try:
            results = self.vector_store.similarity_search(
                destination,
                k=1,
                filter={"city": destination.lower()}
            )
            return len(results) > 0
        except Exception:
            return False

    def generate_itinerary(
        self,
        destination: str,
        duration: int,
        travel_style: str,
        budget: str,
        weather_summary: str,
        rainy_days: List[str],
        context_docs: List,
        start_date: str,
    ) -> dict:
        """Generate a structured day-by-day itinerary using RAG context."""

        # Prepare context text with source citations
        context_parts = []
        for doc in context_docs:
            source = doc.metadata.get("source", "Travel Guide")
            context_parts.append(f"[Source: {source}]\n{doc.page_content}")
        context_text = "\n\n---\n\n".join(context_parts)

        rainy_note = ""
        if rainy_days:
            rainy_note = f"\n⚠️ RAINY DAYS: {', '.join(rainy_days)} — For these days, prefer INDOOR alternatives (museums, galleries, cooking classes, spas, shopping malls, indoor markets)."

        prompt = ChatPromptTemplate.from_template("""
You are an expert travel planner. Create a personalized {duration}-day itinerary for {destination}.

TRAVEL PREFERENCES:
- Destination: {destination}
- Duration: {duration} days
- Travel Style: {travel_style}
- Budget Level: {budget}
- Start Date: {start_date}

WEATHER FORECAST SUMMARY:
{weather_summary}{rainy_note}

TRAVEL GUIDE CONTEXT:
{context}

INSTRUCTIONS:
1. Create exactly {duration} days of activities.
2. Each day must have MORNING, AFTERNOON, and EVENING slots.
3. For each slot provide: activity_name, description (2-3 sentences), source (the [Source: ...] filename from context if available, otherwise write "Model Knowledge"), and is_indoor (true/false).
4. Match activities to the travel style ({travel_style}) and budget ({budget}).
5. On rainy days, prefer indoor activities.
6. If travel guide context is provided, prioritize suggesting places mentioned in it. If the context is empty or lacks information, use your general knowledge to suggest the absolute best local attractions and dining spots in {destination}.

Respond with ONLY a valid JSON object in this EXACT format (no markdown, no extra text):
{{
  "destination": "{destination}",
  "duration": {duration},
  "travel_style": "{travel_style}",
  "budget": "{budget}",
  "days": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme title",
      "morning": {{
        "activity_name": "Name of activity",
        "description": "2-3 sentence description",
        "source": "source_filename.pdf",
        "is_indoor": false
      }},
      "afternoon": {{
        "activity_name": "Name of activity",
        "description": "2-3 sentence description",
        "source": "source_filename.pdf",
        "is_indoor": false
      }},
      "evening": {{
        "activity_name": "Name of activity",
        "description": "2-3 sentence description",
        "source": "source_filename.pdf",
        "is_indoor": true
      }}
    }}
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}}
""")

        chain = prompt | self.llm
        response = chain.invoke({
            "destination": destination,
            "duration": duration,
            "travel_style": travel_style,
            "budget": budget,
            "start_date": start_date,
            "weather_summary": weather_summary,
            "rainy_note": rainy_note,
            "context": context_text,
        })

        raw = response.content.strip()
        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}\nRaw: {raw[:500]}")
            raise ValueError(f"LLM returned invalid JSON: {e}")
