from typing import Dict

def calculate_risk(predicted_load: float, capacity: float = 200) -> Dict:
    """
    Risk based on predicted percentage of capacity used.
    """
    if capacity <= 0:
        capacity = 1

    usage_ratio = predicted_load / capacity

    if usage_ratio > 0.9:
        level = "HIGH"
    elif usage_ratio > 0.7:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "load": round(predicted_load, 2),
        "capacity": capacity,
        "risk_level": level,
        "risk_score": round(usage_ratio * 100, 2),
    }

def calculate_blackout_probability(predicted_load: float, capacity: float = 200) -> Dict:
    """
    Estimate blackout probability based on predicted load vs capacity ratio.
    """
    ratio = predicted_load / capacity

    if ratio > 0.95:
        probability = 85 + (random.uniform(0, 10)) # Very high
        level = "HIGH"
    elif ratio > 0.85:
        probability = 45 + (random.uniform(0, 20))
        level = "MEDIUM"
    else:
        probability = 5 + (random.uniform(0, 10))
        level = "LOW"

    return {
        "probability": round(probability, 1),
        "level": level,
    }

import random
