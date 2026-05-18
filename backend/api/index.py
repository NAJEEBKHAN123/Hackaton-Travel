import sys
import os

# Add parent directory to path so local imports (weather_service, rag_pipeline) work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
