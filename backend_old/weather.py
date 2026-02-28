import requests

API_KEY = "e8ae528d2c1c2f9d6fd57988b2e26099"


def get_weather(city="Delhi"):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    try:
        response = requests.get(url)
        data = response.json()

        # If API returns error
        if "main" not in data:
            return {
                "error": data.get("message", "Weather API error"),
                "raw": data
            }

        return {
            "city": city,
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "weather": data["weather"][0]["description"]
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    print(get_weather())