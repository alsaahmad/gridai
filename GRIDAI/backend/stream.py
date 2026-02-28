import random
import time
import threading
from datetime import datetime

zones = ["Zone A", "Zone B", "Zone C"]

# Global variable to store latest data
latest_data = {}


def generate_data():
    return {
        "timestamp": datetime.now().isoformat(),
        "zone": random.choice(zones),
        "household_load": random.randint(50, 150),
        "solar_generation": random.randint(20, 80),
        "grid_load": random.randint(80, 200),
        "temperature": random.randint(25, 40),
    }


def stream_loop():
    global latest_data
    while True:
        latest_data = generate_data()
        # print("Streaming:", latest_data) # Commented out to keep console clean
        time.sleep(1)


def start_stream():
    thread = threading.Thread(target=stream_loop, daemon=True)
    thread.start()
