import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime, timedelta
from dotenv import load_dotenv

from weather_service import get_weather_forecast
from rag_pipeline import TravelRAGPipeline

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Travel Itinerary Builder", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline at startup
pipeline: Optional[TravelRAGPipeline] = None

@app.on_event("startup")
async def startup_event():
    global pipeline
    try:
        pipeline = TravelRAGPipeline()
        logger.info("RAG Pipeline initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize RAG pipeline: {e}")


class ItineraryRequest(BaseModel):
    destination: str
    start_date: str           # YYYY-MM-DD
    duration: int             # number of days (1–7)
    travel_style: str         # adventure, cultural, relaxation, food
    budget: str               # budget, moderate, luxury


class IngestRequest(BaseModel):
    file_path: str
    city: str
    category: str = "general"


@app.get("/")
def root():
    return {"message": "AI Travel Itinerary Builder API is running."}


@app.get("/api/health")
def health():
    return {"status": "ok", "pipeline_ready": pipeline is not None}


@app.post("/api/ingest")
def ingest_pdf(request: IngestRequest):
    """Ingest a travel guide PDF into the vector store."""
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized.")
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {request.file_path}")
    try:
        count = pipeline.ingest_pdf(request.file_path, request.city, request.category)
        return {"message": f"Successfully ingested {count} chunks for '{request.city}'.", "chunks": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/itinerary")
def generate_itinerary(request: ItineraryRequest):
    """Generate a day-by-day travel itinerary."""
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized.")

    duration = max(1, min(7, request.duration))

    # 1. Fetch weather forecast
    logger.info(f"Fetching weather for {request.destination}, {duration} days")
    forecast, weather_error = get_weather_forecast(request.destination, duration)

    weather_data = []
    weather_summary = ""
    rainy_days = []

    if forecast:
        # Filter forecast to only the trip days starting from start_date
        try:
            start = datetime.strptime(request.start_date, "%Y-%m-%d").date()
        except ValueError:
            start = date.today()

        for i, day_fc in enumerate(forecast[:duration]):
            weather_data.append(day_fc)
            line = f"Day {i+1} ({day_fc['date']}): {day_fc['description']}, High {day_fc['temp_max']}°C / Low {day_fc['temp_min']}°C, Precipitation: {day_fc['precipitation_mm']}mm"
            weather_summary += line + "\n"
            if day_fc["is_rainy"]:
                rainy_days.append(f"Day {i+1} ({day_fc['date']})")
    else:
        weather_summary = f"Weather data unavailable ({weather_error}). Assume pleasant weather."

    # 2. Retrieve travel guide context from vector store
    logger.info(f"Retrieving context for {request.destination}, style={request.travel_style}")
    context_docs = pipeline.retrieve_context(request.destination, request.travel_style, k=12)
    has_docs = pipeline.has_documents_for(request.destination)

    # 3. Generate itinerary via LLM
    logger.info(f"Generating {duration}-day itinerary...")
    try:
        itinerary = pipeline.generate_itinerary(
            destination=request.destination,
            duration=duration,
            travel_style=request.travel_style,
            budget=request.budget,
            weather_summary=weather_summary,
            rainy_days=rainy_days,
            context_docs=context_docs,
            start_date=request.start_date,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "itinerary": itinerary,
        "weather": weather_data,
        "has_indexed_docs": has_docs,
        "context_sources": list({doc.metadata.get("source", "Unknown") for doc in context_docs}),
    }


@app.get("/api/destinations")
def list_destinations():
    """List all cities that have indexed travel guides."""
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not initialized.")
    try:
        collection = pipeline.vector_store._collection
        items = collection.get(include=["metadatas"])
        cities = set()
        for meta in items.get("metadatas", []):
            if meta and "city" in meta:
                cities.add(meta["city"].title())
        return {"destinations": sorted(list(cities))}
    except Exception as e:
        return {"destinations": [], "error": str(e)}
