from typing import Dict

def optimize_energy_source(solar_generation: float, predicted_load: float, hour: int, temperature: float) -> Dict:
    """
    Renewable optimization heuristics:
    - renewable_ratio calculation
    - determine best source based on ratio and time
    """
    if predicted_load <= 0:
        renewable_ratio = 1.0
    else:
        renewable_ratio = solar_generation / predicted_load

    # Threshold-based source selection
    if renewable_ratio > 0.6:
        best_source = "Solar"
        availability_level = "OPTIMAL"
    elif renewable_ratio > 0.3:
        best_source = "Hybrid"
        availability_level = "MODERATE"
    elif hour >= 18 or hour < 6:
        best_source = "Battery"
        availability_level = "STORAGE_ONLY"
    else:
        best_source = "Grid"
        availability_level = "LOW"

    return {
        "renewable_ratio": round(renewable_ratio * 100, 2),
        "availability_level": availability_level,
        "best_source": best_source
    }
