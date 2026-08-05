# model.py

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from transformers import pipeline  # ✅ Add this


def train_model():
    data = pd.read_csv("produce_data.csv")
    data["packaging"] = data["packaging"].map({"Normal": 0, "GreenPod": 1})

    all_products = ["Lettuce", "Tomatoes", "Spinach", "Mango", "Banana", "Carrot"]

    label_encoder = LabelEncoder()
    label_encoder.fit(all_products)

    data["product"] = label_encoder.transform(data["product"])

    X = data[["temp", "humidity", "days_since_harvest", "product", "packaging"]]
    y = data["shelf_life"]

    model = RandomForestRegressor()
    model.fit(X, y)

    return model, label_encoder

# Cache generator globally to avoid loading it on every function call
_generator = None

def get_ai_recommendation(product, temp, humidity, days_since_harvest, packaging):
    global _generator
    prompt = f"""
    I am  WasteGPT, an AI assistant for reducing food waste in retail stores.

    Product: {product}
    Temperature: {temp}°C
    Humidity: {humidity}%
    Days Since Harvest: {days_since_harvest}
    Packaging: {packaging}

    Suggest 1-2 actions to reduce waste. Example actions: apply discount, move to fast-sell zone, donate to food bank.
    """

    if _generator is None:
        _generator = pipeline("text2text-generation", model="google/flan-t5-small")  # Lightweight model
    result = _generator(prompt, max_length=100, do_sample=True)
    return result[0]["generated_text"]
