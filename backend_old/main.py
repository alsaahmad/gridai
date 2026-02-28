import os
import stream
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from weather import get_weather
from prediction import predict_grid
from risk import calculate_risk, calculate_blackout_probability
from theft import detect_theft
from sustainability import calculate_sustainability
from map import get_map_data
from renewable_optimizer import optimize_energy_source
from seasonal_forecast import get_seasonal_forecast
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    users_db, 
    UserInDB,
    decode_token
)
from pydantic import BaseModel
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

@app.post("/auth/signup")
def signup(request: SignupRequest):
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(request.password)
    users_db[request.email] = {
        "email": request.email,
        "name": request.name,
        "hashed_password": hashed_password
    }
    
    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": request.email, "name": request.name}}

@app.post("/auth/login")
def login(request: LoginRequest):
    user = users_db.get(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": user["email"], "name": user["name"]}}

@app.get("/auth/me")
def get_me(token: str = Depends(oauth2_scheme)):
    token_data = decode_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = users_db.get(token_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {"email": user["email"], "name": user["name"]}


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

    current_load = data["grid_load"]
    solar = data["solar_generation"]
    temperature = data["temperature"]
    timestamp = data["timestamp"]

    # Derive calendar info
    try:
        from datetime import datetime
        dt = datetime.fromisoformat(timestamp)
        hour = dt.hour
        month = dt.month
    except Exception:
        hour = 12
        month = 6

    # 1. Prediction Engineering
    prediction = predict_grid(current_load=current_load, temperature=temperature, hour=hour)
    pred_load = prediction["predicted_load"]

    # 2. Risk & Criticality Math
    risk = calculate_risk(pred_load)
    blackout = calculate_blackout_probability(pred_load)

    # 3. Optimization & Sustainability Algorithms
    renewable = optimize_energy_source(
        solar_generation=solar,
        predicted_load=pred_load,
        hour=hour,
        temperature=temperature
    )
    sustainability = calculate_sustainability(
        solar_generation=solar,
        predicted_load=pred_load
    )

    # 4. Seasonal Long-term context
    seasonal = get_seasonal_forecast(month)

    # 5. Live Snapshot for UI Binding
    live_snapshot = {
        "timestamp": timestamp,
        "zone": data["zone"],
        "household_load": data["household_load"],
        "solar_generation": solar,
        "grid_load": current_load,
        "temperature": temperature,
    }

    # Spike Alert Logic
    alert_if_spike = None
    if prediction.get("spike_detected"):
        alert_if_spike = {
            "message": "⚠ Demand Spike Detected",
            "spike_percent": prediction.get("spike_percent", 0),
        }

    return {
        "prediction": prediction,
        "risk": risk,
        "blackout": blackout,
        "renewable": renewable,
        "sustainability": sustainability,
        "seasonal": seasonal,
        "live": live_snapshot,
        "alert_if_spike": alert_if_spike,
    }


@app.get("/risk")
def get_risk():
    data = stream.latest_data

    if not data:
        return {"error": "No data yet"}

    load = data["grid_load"]
    prediction = predict_grid(load, data["temperature"], 12)
    return calculate_risk(prediction["predicted_load"])


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
    prediction = predict_grid(load, data["temperature"], 12)
    return calculate_sustainability(solar, prediction["predicted_load"])


@app.get("/theft")
def get_theft_analysis():
    data = stream.latest_data
    if not data:
        return {"error": "No data yet"}
    
    # Simulate previous load for detection
    current_load = data["grid_load"]
    import random
    previous_load = current_load + random.randint(-10, 80)
    
    analysis = detect_theft(current_load, previous_load)
    return analysis

# Mount static files
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    # Use plain ASCII here to avoid Windows console encoding issues.
    print("GridAI Backend is starting...")
    print("URL: http://127.0.0.1:8000")
    print("Map Data: http://127.0.0.1:8000/map")
    print("Weather: http://127.0.0.1:8000/weather")
    uvicorn.run(app, host="127.0.0.1", port=8000)
