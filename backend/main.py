import stream
from fastapi import FastAPI
from contextlib import asynccontextmanager
from weather import get_weather
from prediction import predict_next_load
from risk import calculate_risk
from theft import detect_theft
from sustainability import calculate_sustainability
from map import get_map_data

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the mock stream
    print("🚀 Starting Data stream...")
    stream.start_stream()
    yield
    # Shutdown
    print("🛑 Shutting down backend...")

app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "GridAI Backend Running 🚀", "status": "online"}

@app.get("/live-data")
def get_live_data():
    return stream.latest_data

@app.get("/predictions")
def get_predictions():
    data = stream.latest_data
    if not data or data.get("zone") == "Initializing...":
        return {"error": "Stream initializing"}
    return {
        "current_load": data["grid_load"],
        "predicted_load": data.get("predicted_load", 0),
    }

@app.get("/risk")
def get_risk():
    data = stream.latest_data
    if not data or data.get("zone") == "Initializing...":
        return {"error": "Stream initializing"}
    risk_score = data.get("risk_score_pw", 0)
    risk_level = "HIGH" if risk_score > 0.9 else "MEDIUM" if risk_score > 0.7 else "LOW"
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
    }

@app.get("/alerts")
def get_alerts():
    data = stream.latest_data
    if not data or data.get("zone") == "Initializing...":
        return {"alerts": ["Initializing system..."]}
    risk = calculate_risk(data["grid_load"])
    alerts = []
    if risk["risk_level"] == "HIGH":
        alerts.append("🚨 High overload risk detected")
    elif risk["risk_level"] == "MEDIUM":
        alerts.append("⚠️ Moderate load risk")
    return {"alerts": alerts}

@app.get("/sustainability")
def get_sustainability():
    data = stream.latest_data
    if not data or data.get("zone") == "Initializing...":
        return {"error": "Stream initializing"}
    # Use the helper to get both renewable_percentage and co2_saved
    result = calculate_sustainability(data["solar_generation"], data["grid_load"])
    return result

@app.get("/weather")
def weather():
    return get_weather()

@app.get("/map")
def map_data():
    return get_map_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8005, reload=False)
