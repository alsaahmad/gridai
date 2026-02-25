def calculate_sustainability(solar_generation, total_load):
    """
    Renewable percentage and CO2 savings
    """
    if total_load == 0:
        renewable_percent = 0
    else:
        renewable_percent = (solar_generation / total_load) * 100

    co2_saved = solar_generation * 0.5  # simple factor

    return {
        "renewable_percentage": round(renewable_percent, 2),
        "co2_saved": round(co2_saved, 2)
    }


# Test
if __name__ == "__main__":
    result = calculate_sustainability(50, 150)
    print(result)
