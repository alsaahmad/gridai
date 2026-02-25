import threading
import time
import random
import queue
from datetime import datetime

# Global variable to store latest data safely
latest_data = {
    "timestamp": datetime.now().isoformat(),
    "zone": "Initializing...",
    "household_load": 0,
    "solar_generation": 0,
    "grid_load": 0,
    "temperature": 0,

    # Processed fields
    "grid_load_avg": 0,
    "risk_score_pw": 0,
    "predicted_load": 0,
    "renewable_percent": 0,

    "pathway_status": "Disabled"
}

data_lock = threading.Lock()

ZONES = ["Zone A", "Zone B", "Zone C"]

# Stores generated energy data records
data_queue = queue.Queue(maxsize=500)

# Queue for latest_data updates
latest_update_queue = queue.Queue(maxsize=1)


# ===============================
# STREAM STARTER
# ===============================

def start_stream():
    """Starts background generator, updater, and pathway worker."""
    if getattr(start_stream, "_started", False):
        return
    start_stream._started = True

    gen_thread = threading.Thread(target=run_generator_loop, daemon=True)
    gen_thread.start()

    latest_thread = threading.Thread(target=run_latest_data_updater_loop, daemon=True)
    latest_thread.start()

    pw_thread = threading.Thread(target=pathway_worker, daemon=True)
    pw_thread.start()

    print("✅ Background streaming system launched.")


# ===============================
# MOCK DATA GENERATOR
# ===============================

def run_generator_loop():
    print("⚡ Raw data generator started.")

    while True:
        data = {
            "timestamp": datetime.now().isoformat(),
            "zone": random.choice(ZONES),
            "household_load": random.randint(50, 150),
            "solar_generation": random.randint(20, 80),
            "grid_load": random.randint(80, 200),
            "temperature": random.randint(25, 40),
        }

        try:
            data_queue.put(data, block=False)
        except queue.Full:
            try:
                data_queue.get_nowait()
                data_queue.put(data, block=False)
            except:
                pass

        try:
            latest_update_queue.put(data, block=False)
        except queue.Full:
            try:
                latest_update_queue.get_nowait()
                latest_update_queue.put(data, block=False)
            except:
                pass

        time.sleep(1)


# ===============================
# PATHWAY WORKER
# ===============================

def pathway_worker():
    global latest_data

    print("⚙️ Pathway worker initializing...")

    import os
    os.environ["PATHWAY_DASHBOARD_ENABLED"] = "false"

    import pathway as pw
    from pathway.io.python import ConnectorSubject
    
    class EnergySchema(pw.Schema):
        timestamp: str
        zone: str
        household_load: int
        solar_generation: int
        grid_load: int
        temperature: int

    class QueueConnector(ConnectorSubject):
        def run(self):
            print("QUEUE CONNECTOR STARTED")
            while True:
                record = data_queue.get()
                self.next(**record)

    table = pw.io.python.read(
        QueueConnector(),
        schema=EnergySchema,
    )

    # Simple processing for now
    processed = table.select(
        grid_load=pw.this.grid_load,
        predicted_load=pw.this.grid_load,
        renewable_percent=50,
        risk_score_pw=0.5,
    )

    def on_update(key, row, time, is_addition):
        global latest_data

        with data_lock:
            next_latest = dict(latest_data)

            next_latest["grid_load"] = row["grid_load"]
            next_latest["predicted_load"] = row["predicted_load"]
            next_latest["renewable_percent"] = row["renewable_percent"]
            next_latest["risk_score_pw"] = row["risk_score_pw"]
            next_latest["pathway_status"] = "Running"

            latest_data = next_latest

    pw.io.subscribe(processed, on_update)

    print("STARTING ENGINE")
    pw.run()
# ===============================
# LATEST DATA UPDATER
# ===============================

def run_latest_data_updater_loop():
    """Updates latest_data snapshot."""
    global latest_data

    print("🧠 Latest-data updater started.")

    while True:
        record = latest_update_queue.get()

        with data_lock:
            next_latest = dict(latest_data)
            next_latest.update(record)

            next_latest.setdefault("grid_load_avg", 0)
            next_latest.setdefault("risk_score_pw", 0)
            next_latest.setdefault("predicted_load", 0)
            next_latest.setdefault("renewable_percent", 0)

            next_latest.setdefault("pathway_status", "Starting...")

            latest_data = next_latest