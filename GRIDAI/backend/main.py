import os
import stream
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from weather import get_weather
from prediction import predict_next_load
from risk import calculate_risk
from theft import detect_theft
from sustainability import calculate_sustainability
from map import get_map_data

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/map")
def map_data():
    return get_map_data()


# Start streaming
stream.start_stream()


@app.get("/")
def home():
    return {"message": "GridAI Backend Running 🚀"}


@app.get("/weather")
def weather():
    return get_weather()


@app.get("/live-data")
def get_live_data():
    return stream.latest_data


@app.get("/predictions")
def get_predictions():
    data = stream.latest_data

    if not data:
        return {"error": "No data yet"}

    load = data["grid_load"]

    prediction = predict_next_load(load)

    return prediction


@app.get("/risk")
def get_risk():
    data = stream.latest_data

    if not data:
        return {"error": "No data yet"}

    load = data["grid_load"]

    risk = calculate_risk(load)

    return risk


@app.get("/alerts")
def get_alerts():
    data = stream.latest_data

    if not data:
        return {"error": "No data yet"}

    load = data["grid_load"]

    risk = calculate_risk(load)

    alerts = []

    if risk["risk_level"] == "HIGH":
        alerts.append("🚨 High overload risk detected")

    elif risk["risk_level"] == "MEDIUM":
        alerts.append("⚠️ Moderate load risk")

    return {"alerts": alerts}


@app.get("/sustainability")
def get_sustainability():
    data = stream.latest_data

    if not data:
        return {"error": "No data yet"}

    solar = data["solar_generation"]
    load = data["grid_load"]

    sustainability = calculate_sustainability(solar, load)

    return sustainability

# Mount static files
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    print("🚀 GridAI Backend is starting...")
    print("📍 URL: http://127.0.0.1:8000")
    print("🗺️ Map Data: http://127.0.0.1:8000/map")
    print("🌤️ Weather: http://127.0.0.1:8000/weather")
    uvicorn.run(app, host="127.0.0.1", port=8000)
