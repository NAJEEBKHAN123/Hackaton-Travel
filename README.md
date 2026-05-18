# 🌍 AI Itinerary Builder

A full-stack AI travel planner that generates personalized day-by-day itineraries grounded in real travel guides, with live weather forecasts.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI + Python |
| AI / RAG | LangChain + Google Gemini |
| Vector DB | ChromaDB |
| Weather | Open-Meteo API (free, no key needed) |

---

## 🚀 Quick Start

### 1. Add your Google API Key

Open `backend/.env` and replace the placeholder:
```
GOOGLE_API_KEY=your_actual_key_here
```

---

### 2. Start the Backend

```bash
cd backend
source venv/bin/activate          # activate virtual environment
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

---

### 3. Start the Frontend

Open a **new terminal tab**:

```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:5173

---

### 4. (Optional but recommended) Ingest Travel Guides

Download Wikivoyage PDF guides for your destinations from:
👉 https://en.wikivoyage.org → print/export → Download as PDF

Then ingest them:

```bash
cd backend
source venv/bin/activate

# Single file
python ingest_guides.py --file /path/to/paris-guide.pdf --city "Paris" --category cultural

# All PDFs in a folder
python ingest_guides.py --folder ./guides --city "Tokyo" --category food
```

> **Note:** Without PDFs, the AI will still generate itineraries using its built-in knowledge — just without document citations.

---

## 📁 Project Structure

```
Hackathon/
├── backend/
│   ├── main.py              # FastAPI app + API endpoints
│   ├── rag_pipeline.py      # LangChain RAG + Gemini LLM
│   ├── weather_service.py   # Open-Meteo weather fetching
│   ├── ingest_guides.py     # CLI script to ingest PDFs
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Your Google API key (keep secret!)
│   └── chroma_db/           # Vector store (auto-created)
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main React application
    │   ├── index.css        # Tailwind + custom styles
    │   └── main.jsx         # Entry point
    ├── tailwind.config.js
    ├── index.html
    └── package.json
```

---

## 🎯 Features

- **Preference Form** — destination, dates, travel style (cultural/adventure/relaxation/food), budget
- **Day-by-day Itinerary** — morning, afternoon, evening slots per day
- **Source Citations** — every activity traces back to the ingested travel guide
- **Live Weather** — Open-Meteo 7-day forecast displayed alongside itinerary
- **Weather-aware** — rainy days get flagged and indoor alternatives are suggested
- **Premium UI** — glassmorphic dark design with smooth animations

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |
| POST | `/api/itinerary` | Generate itinerary |
| POST | `/api/ingest` | Ingest a PDF (via HTTP) |
| GET | `/api/destinations` | List indexed cities |
# Hackaton-Travel
