import os
import requests
import logging

logger = logging.getLogger(__name__)

# Open-Meteo Geocoding API to get lat/lon from city name
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

WEATHER_CODE_MAP = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Foggy", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    55: ("Dense drizzle", "🌧️"),
    61: ("Slight rain", "🌧️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "🌧️"),
    71: ("Slight snow", "❄️"),
    73: ("Moderate snow", "❄️"),
    75: ("Heavy snow", "❄️"),
    80: ("Slight showers", "🌦️"),
    81: ("Moderate showers", "🌧️"),
    82: ("Violent showers", "⛈️"),
    95: ("Thunderstorm", "⛈️"),
    96: ("Thunderstorm with hail", "⛈️"),
    99: ("Thunderstorm with heavy hail", "⛈️"),
}


def get_coordinates(destination: str):
    """Fetch lat/lon for a city name via Open-Meteo geocoding."""
    try:
        resp = requests.get(GEOCODING_URL, params={"name": destination, "count": 1, "language": "en", "format": "json"}, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("results"):
            return None, None, None
        result = data["results"][0]
        return result["latitude"], result["longitude"], result.get("country", "")
    except Exception as e:
        logger.error(f"Geocoding error: {e}")
        return None, None, None


def get_weather_forecast(destination: str, num_days: int = 7):
    """
    Fetch a weather forecast for a destination.
    Returns a list of dicts: [{date, temp_max, temp_min, description, emoji, is_rainy}]
    """
    lat, lon, country = get_coordinates(destination)
    if lat is None:
        return None, f"Could not find coordinates for '{destination}'."

    days = min(num_days, 7)  # Open-Meteo free tier supports up to 16 days
    try:
        resp = requests.get(WEATHER_URL, params={
            "latitude": lat,
            "longitude": lon,
            "daily": ["temperature_2m_max", "temperature_2m_min", "weathercode", "precipitation_sum"],
            "timezone": "auto",
            "forecast_days": days,
        }, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        daily = data["daily"]
        forecast = []
        for i in range(len(daily["time"])):
            code = daily["weathercode"][i]
            desc, emoji = WEATHER_CODE_MAP.get(code, ("Unknown", "🌡️"))
            precip = daily.get("precipitation_sum", [0]*days)[i] or 0
            is_rainy = code in [51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99]
            forecast.append({
                "date": daily["time"][i],
                "temp_max": round(daily["temperature_2m_max"][i], 1),
                "temp_min": round(daily["temperature_2m_min"][i], 1),
                "description": desc,
                "emoji": emoji,
                "is_rainy": is_rainy,
                "precipitation_mm": round(precip, 1),
            })

        return forecast, None
    except Exception as e:
        logger.error(f"Weather fetch error: {e}")
        return None, str(e)
