import stream
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Enable CORS — allow all origins so the frontend (on a different Railway domain) can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API Routes ────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"message": "GridAI Backend Running 🚀", "status": "online"}

@app.get("/")
def home():
    # If static files exist, serve the frontend; otherwise return API info
    static_index = os.path.join(os.path.dirname(__file__), "static", "index.html")
    if os.path.exists(static_index):
        return FileResponse(static_index)
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
    result = calculate_sustainability(data["solar_generation"], data["grid_load"])
    return result

@app.get("/weather")
def weather():
    return get_weather()

@app.get("/map")
def map_data():
    return get_map_data()

@app.get("/theft")
def theft_data():
    data = stream.latest_data
    if not data or data.get("zone") == "Initializing...":
        return {"theft_risk": "LOW"}
    grid_load = data.get("grid_load", 100)
    prev_load = data.get("grid_load_avg", grid_load)
    return detect_theft(grid_load, prev_load)

# ── Serve React Frontend Static Files ─────────────────────────────────────────
# The Vite build outputs to backend/static (see vite.config.ts outDir)
_static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(_static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(_static_dir, "assets")), name="assets")

    # Catch-all: serve index.html for all unknown routes (React Router SPA support)
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        index_path = os.path.join(_static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not built yet"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8005"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
