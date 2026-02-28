import threading
import time
import random
import queue
import os
from datetime import datetime

# Suppress Pathway's web dashboard (not needed in production)
os.environ["PATHWAY_DASHBOARD_ENABLED"] = "false"

# Global variable to store latest data safely
latest_data = {
    "timestamp": datetime.now().isoformat(),
    "zone": "Initializing...",
    "household_load": 0,
    "solar_generation": 0,
    "grid_load": 0,
    "temperature": 0,

    # Processed fields (populated by Pathway pipeline)
    "grid_load_avg": 0,
    "risk_score_pw": 0,
    "predicted_load": 0,
    "renewable_percent": 0,

    "pathway_status": "Starting..."
}

data_lock = threading.Lock()

ZONES = ["Zone A", "Zone B", "Zone C"]

# Queue: raw generator → Pathway connector
data_queue = queue.Queue(maxsize=500)

# Queue: raw generator → latest_data snapshot (so the API always has fresh raw data)
latest_update_queue = queue.Queue(maxsize=1)


# ===============================
# STREAM STARTER
# ===============================

def start_stream():
    """Starts: raw data generator, raw snapshot updater, and Pathway pipeline."""
    if getattr(start_stream, "_started", False):
        return
    start_stream._started = True

    # 1. Raw data generator — produces mock energy readings every second
    gen_thread = threading.Thread(target=run_generator_loop, daemon=True)
    gen_thread.start()

    # 2. Latest-data snapshot updater — keeps latest_data fresh from raw data
    latest_thread = threading.Thread(target=run_latest_data_updater_loop, daemon=True)
    latest_thread.start()

    # 3. Pathway pipeline — processes data_queue and enriches latest_data
    pw_thread = threading.Thread(target=pathway_worker, daemon=True)
    pw_thread.start()

    print("✅ Background streaming system launched.")


# ===============================
# MOCK DATA GENERATOR
# ===============================

def run_generator_loop():
    """Generates mock energy readings every second and pushes to both queues."""
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

        # Push to Pathway connector queue
        try:
            data_queue.put(data, block=False)
        except queue.Full:
            try:
                data_queue.get_nowait()
                data_queue.put(data, block=False)
            except Exception:
                pass

        # Push to snapshot updater queue
        try:
            latest_update_queue.put(data, block=False)
        except queue.Full:
            try:
                latest_update_queue.get_nowait()
                latest_update_queue.put(data, block=False)
            except Exception:
                pass

        time.sleep(1)


# ===============================
# PATHWAY PIPELINE WORKER
# ===============================

def pathway_worker():
    """
    Full Pathway pipeline — same as the WSL setup.
    Reads from data_queue via a ConnectorSubject, processes the stream,
    and updates latest_data via pw.io.subscribe.
    Railway runs on Linux, same as WSL, so Pathway runs natively here.
    """
    global latest_data

    print("⚙️ Starting Pathway pipeline worker...")

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
            print("🔌 Pathway QueueConnector started — feeding data_queue into pipeline.")
            while True:
                record = data_queue.get()   # blocks until data arrives
                self.next(**record)

    # Build the Pathway table from the queue connector
    table = pw.io.python.read(
        QueueConnector(),
        schema=EnergySchema,
    )

    # ── Pathway transformations ───────────────────────────────────────
    # Compute a running windowed average of grid_load
    windowed = table.windowby(
        pw.this.timestamp,
        window=pw.temporal.sliding(duration=10, hop=1),
        instance=pw.this.zone,
    ).reduce(
        zone=pw.reducers.any(pw.this.zone),
        grid_load_avg=pw.reducers.avg(pw.this.grid_load),
    )

    # Main processed output — enriched fields Pathway calculates per row
    processed = table.select(
        zone=pw.this.zone,
        grid_load=pw.this.grid_load,
        solar_generation=pw.this.solar_generation,
        # Predicted next load: current + small simulated delta
        predicted_load=pw.this.grid_load + pw.apply(lambda _: random.randint(-10, 20), pw.this.grid_load),
        # Risk score: ratio of load to 200 MW capacity
        risk_score_pw=pw.apply(lambda v: round(min(v / 200.0, 1.0), 3), pw.this.grid_load),
        # Renewable percentage from solar vs total load
        renewable_percent=pw.apply(
            lambda s, g: round((s / g) * 100, 2) if g > 0 else 0,
            pw.this.solar_generation,
            pw.this.grid_load,
        ),
    )

    def on_update(key, row, time, is_addition):
        """Called by Pathway for every processed row — updates global latest_data."""
        global latest_data

        with data_lock:
            next_latest = dict(latest_data)

            next_latest["grid_load"]       = row["grid_load"]
            next_latest["solar_generation"]= row["solar_generation"]
            next_latest["predicted_load"]  = row["predicted_load"]
            next_latest["risk_score_pw"]   = row["risk_score_pw"]
            next_latest["renewable_percent"]= row["renewable_percent"]
            next_latest["pathway_status"]  = "Running"

            latest_data = next_latest

    pw.io.subscribe(processed, on_update)

    print("🚀 STARTING PATHWAY ENGINE (pw.run)")
    pw.run()   # blocking — runs the full Pathway event loop


# ===============================
# LATEST DATA UPDATER
# ===============================

def run_latest_data_updater_loop():
    """
    Keeps latest_data populated with raw fields (zone, timestamp, temperature, etc.)
    from the generator. Pathway handles the enriched fields (predicted_load, risk, etc.).
    """
    global latest_data

    print("🧠 Latest-data snapshot updater started.")

    while True:
        record = latest_update_queue.get()

        with data_lock:
            next_latest = dict(latest_data)
            # Only update raw generator fields — do NOT touch Pathway-computed fields
            next_latest["timestamp"]      = record["timestamp"]
            next_latest["zone"]           = record["zone"]
            next_latest["household_load"] = record["household_load"]
            next_latest["solar_generation"] = record["solar_generation"]
            next_latest["grid_load"]      = record["grid_load"]
            next_latest["temperature"]    = record["temperature"]

            latest_data = next_latest