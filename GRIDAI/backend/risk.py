def calculate_risk(load, capacity=200):
    """
    Risk based on percentage of capacity used
    """
    usage_ratio = load / capacity

    if usage_ratio > 0.9:
        level = "HIGH"
    elif usage_ratio > 0.7:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "load": load,
        "capacity": capacity,
        "risk_level": level,
        "risk_score": round(usage_ratio * 100, 2)
    }


# Test
if __name__ == "__main__":
    result = calculate_risk(180)
    print(result)
