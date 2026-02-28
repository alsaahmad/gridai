from typing import Dict

def calculate_sustainability(solar_generation: float, predicted_load: float) -> Dict:
    """
    Carbon emission estimation using grid emission factor (India average).
    0.727 kg CO2 per kWh.
    """
    # Emission factor (kg CO2 / kWh)
    EMISSION_FACTOR = 0.727

    # Calculate percentage
    if predicted_load <= 0:
        renewable_percentage = 100.0
    else:
        renewable_percentage = (solar_generation / predicted_load) * 100
        renewable_percentage = min(100.0, renewable_percentage)

    # Carbon calculations based on PREDICTED load
    grid_usage = max(0, predicted_load - solar_generation)
    predicted_emission = grid_usage * EMISSION_FACTOR
    
    # Savings compared to 100% grid usage
    co2_saved = solar_generation * EMISSION_FACTOR
    
    # Reduction potential vs baseline (100% fossil fuel)
    baseline = predicted_load * EMISSION_FACTOR
    if baseline > 0:
        reduction_potential = (co2_saved / baseline) * 100
    else:
        reduction_potential = 0.0

    return {
        "renewable_percentage": round(renewable_percentage, 2),
        "predicted_emission": round(predicted_emission, 2),
        "co2_saved": round(co2_saved, 2),
        "reduction_potential": round(reduction_potential, 2)
    }
