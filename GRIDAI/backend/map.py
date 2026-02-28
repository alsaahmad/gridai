import random
import stream  # use live streaming data


zones = [
    {"name": "North Delhi", "lat": 28.7041, "lon": 77.1025},
    {"name": "South Delhi", "lat": 28.5245, "lon": 77.1855},
    {"name": "East Delhi", "lat": 28.6280, "lon": 77.2785},
    {"name": "West Delhi", "lat": 28.6692, "lon": 77.0950},
]


def calculate_risk(load, capacity=200):
    ratio = load / capacity

    if ratio > 0.9:
        return "HIGH"
    elif ratio > 0.7:
        return "MEDIUM"
    return "LOW"


def get_color(risk):
    if risk == "HIGH":
        return "red"
    elif risk == "MEDIUM":
        return "orange"
    return "green"


def get_map_data():
    data = []

    live = stream.latest_data

    for zone in zones:
        # simulate different load for each zone
        base_load = live.get("grid_load", random.randint(80, 150))
        load = base_load + random.randint(-30, 30)

        solar = live.get("solar_generation", random.randint(20, 60))

        renewable_percent = (solar / load) * 100 if load > 0 else 0

        risk = calculate_risk(load)
        color = get_color(risk)

        theft_risk = random.choice(["LOW", "LOW", "MEDIUM"])

        data.append({
            "zone": zone["name"],
            "lat": zone["lat"],
            "lon": zone["lon"],
            "load": load,
            "solar": solar,
            "renewable_percentage": round(renewable_percent, 2),
            "risk": risk,
            "theft_risk": theft_risk,
            "color": color
        })

    return data


if __name__ == "__main__":
    print(get_map_data())
