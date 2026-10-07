from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import train_model, get_ai_recommendation
from datetime import datetime
import pandas as pd

# Train model
model, label_encoder = train_model()

app = Flask(__name__)
CORS(app)  # allow all origins
 # CORS for frontend

# Health check Endpoint
@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "Smartfresh AI Server is running smoothly!"})

# 🧠 Prediction Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    product = data.get("product")
    if not product:
        return jsonify({"error": "Missing product"}), 400
        
    try:
        temp = float(data["temp"])
        humidity = float(data["humidity"])
        days = float(data["days_since_harvest"])
    except (KeyError, ValueError, TypeError):
        return jsonify({"error": "Invalid temp, humidity, or days_since_harvest"}), 400

    packaging = data.get("packaging", "Normal")

    # Normalize product name case-insensitively
    known_products = {p.lower(): p for p in label_encoder.classes_}
    product_lower = product.lower()
    
    if product_lower in known_products:
        product_standard = known_products[product_lower]
    else:
        return jsonify({"error": f"Product '{product}' is not supported. Supported products: {list(label_encoder.classes_)}"}), 400

    # Encode
    product_encoded = label_encoder.transform([product_standard])[0]
    packaging_encoded = 1 if packaging == "GreenPod" else 0

    X = [[temp, humidity, days, product_encoded, packaging_encoded]]
    prediction = model.predict(X)[0]
    freshness = min(100, round((prediction / 7) * 100))

    # GPT suggestion
    ai_text = get_ai_recommendation(product_standard, temp, humidity, days, packaging)

    return jsonify({
        "shelf_life": round(prediction, 2),
        "freshness": freshness,
        "gpt_suggestion": ai_text
    })


@app.route("/smart-cart", methods=["POST"])
def smart_cart():
    data = request.json
    if not data or "history" not in data:
        return jsonify({"smart_cart": []})
        
    purchase_history = data["history"]  # From Node/React backend
    smart_cart = []
    
    # Map known products case-insensitively
    known_products = {p.lower(): p for p in label_encoder.classes_}

    for item in purchase_history:
        product = item.get("name")
        if not product:
            continue
            
        # Standardize product or skip if it's not a fresh produce item the model knows
        product_lower = product.lower()
        
        # Handle cases like "tomatoes" -> "Tomatoes", "tomato" -> "Tomatoes" (approximate match)
        product_matched = None
        if product_lower in known_products:
            product_matched = known_products[product_lower]
        elif product_lower + "s" in known_products:
            product_matched = known_products[product_lower + "s"]
        elif product_lower.rstrip("es") in known_products:
            product_matched = known_products[product_lower.rstrip("es")]
        elif product_lower.rstrip("s") in known_products:
            product_matched = known_products[product_lower.rstrip("s")]
            
        if not product_matched:
            # Skip items we can't analyze (like Milk, Bread) to prevent crashes
            continue

        date = item.get("date") or datetime.now().strftime("%Y-%m-%d")

        # 🛠️ Parse ISO format safely (e.g., 2024-07-13T15:31:22.323Z)
        try:
            parsed_date = datetime.fromisoformat(date.rstrip("Z"))
        except ValueError:
            parsed_date = datetime.strptime(date.split("T")[0], "%Y-%m-%d")

        days_since = max(0, (datetime.now() - parsed_date).days)

        temp = 25.0
        humidity = 70.0
        packaging = "Normal"

        # Encode
        product_encoded = label_encoder.transform([product_matched])[0]
        packaging_encoded = 1 if packaging == "GreenPod" else 0
        X = [[temp, humidity, days_since, product_encoded, packaging_encoded]]
        prediction = model.predict(X)[0]

        if prediction < 4:
            ai_text = get_ai_recommendation(product_matched, temp, humidity, days_since, packaging)
            smart_cart.append({
                "product": product_matched,
                "shelf_life": round(prediction, 2),
                "recommendation": ai_text
            })

    return jsonify({"smart_cart": smart_cart})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
