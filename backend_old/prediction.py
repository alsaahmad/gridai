import random
from typing import Dict

# Global memory for previous load
_previous_load: float | None = None

def predict_grid(current_load: float, temperature: float, hour: int) -> Dict:
    """
    Smarter grid load prediction following the SYSTEM APPROACH:
    - Spike detection
    - Temperature sensitivity
    - Time-of-day peak modeling
    """
    global _previous_load

    # 1. Spike detection logic
    spike_detected = False
    spike_percent = 0.0
    if _previous_load is not None and _previous_load > 0:
        spike_percent = (current_load - _previous_load) / _previous_load
        if spike_percent > 0.2:
            spike_detected = True

    # 2. Base forecasting logic (stochastic base)
    # Start with current load plus some natural fluctuation
    predicted = current_load + random.uniform(-5, 10)

    # 3. Temperature impact (if > 35C, increase load significantly for AC)
    if temperature > 35:
        predicted += 15 + random.uniform(5, 10)
    elif temperature > 30:
        predicted += 5 + random.uniform(0, 5)

    # 4. Evening peak effect (18:00 - 22:00)
    peak_expected = False
    if 18 <= hour <= 22:
        predicted += 20 + random.uniform(10, 20)
        peak_expected = True

    # 5. Spike boost (if a spike is already happening, it often continues/escalates)
    if spike_detected:
        predicted += (current_load * 0.15) 

    # Ensure no negative load
    predicted = max(0, predicted)

    # Store for next iteration
    _previous_load = current_load

    return {
        "current_load": round(float(current_load), 2),
        "predicted_load": round(float(predicted), 2),
        "spike_detected": spike_detected,
        "spike_percent": round(spike_percent * 100, 2),
        "peak_expected": peak_expected,
    }

def reset_prediction_state() -> None:
    global _previous_load
    _previous_load = None
