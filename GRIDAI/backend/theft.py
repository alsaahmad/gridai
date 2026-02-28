def detect_theft(current_load, previous_load):
    """
    Detect abnormal drop in usage
    """
    if previous_load == 0:
        return {"theft_risk": "LOW"}

    change = (previous_load - current_load) / previous_load

    if change > 0.5:
        risk = "HIGH"
    elif change > 0.3:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "current_load": current_load,
        "previous_load": previous_load,
        "theft_risk": risk
    }


# Test
if __name__ == "__main__":
    result = detect_theft(40, 120)
    print(result)
