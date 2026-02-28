import random

def predict_next_load(current_load):
    """
    Simple prediction: next load slightly higher or lower
    """
    change = random.randint(-10, 20)
    predicted = current_load + change

    if predicted < 0:
        predicted = 0

    return {
        "current_load": current_load,
        "predicted_load": predicted
    }


# Test function
if __name__ == "__main__":
    result = predict_next_load(120)
    print(result)
