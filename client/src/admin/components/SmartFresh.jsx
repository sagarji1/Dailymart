import React, { useState } from "react";
import axios from "axios";

const SmartFresh = () => {
  const [product, setProduct] = useState("Banana");
  const [temp, setTemp] = useState(10);
  const [humidity, setHumidity] = useState(50);
  const [days, setDays] = useState(2);
  const [packaging, setPackaging] = useState("Normal");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", {
        product,
        temp,
        humidity,
        days_since_harvest: days,
        packaging,
      });
      setResult(res.data);
    } catch (err) {
      alert("Error predicting shelf life. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-poppins py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-[#161b22] p-8 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-2xl text-green-400 font-semibold mb-6">
            🍏 SmartFresh AI – Shelf Life Predictor
          </h2>

          <div className="space-y-5">
            {/* Product */}
            <div>
              <label className="block font-semibold mb-1">Product</label>
              <select
                className="w-full p-3 rounded bg-[#0d1117] border border-gray-600"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option>Banana</option>
                <option>Lettuce</option>
                <option>Tomatoes</option>
                <option>Spinach</option>
                <option>Mango</option>
                <option>Carrot</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block font-semibold mb-1">Temperature (°C)</label>
              <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full p-3 rounded bg-[#0d1117] border border-gray-600"
              />
            </div>

            {/* Humidity */}
            <div>
              <label className="block font-semibold mb-1">Humidity (%)</label>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className="w-full p-3 rounded bg-[#0d1117] border border-gray-600"
              />
            </div>

            {/* Days Since Harvest */}
            <div>
              <label className="block font-semibold mb-1">Days Since Harvest</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-3 rounded bg-[#0d1117] border border-gray-600"
              />
            </div>

            {/* Packaging */}
            <div>
              <label className="block font-semibold mb-1">Packaging</label>
              <select
                className="w-full p-3 rounded bg-[#0d1117] border border-gray-600"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              >
                <option>Normal</option>
                <option>GreenPod</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 mt-4 rounded bg-green-400 hover:bg-green-500 text-black font-semibold transition duration-300"
            >
              {loading ? "Predicting..." : "🚀 Predict Shelf Life"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-[#161b22] p-8 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-xl text-green-400 font-semibold mb-4">
              📊 Prediction Result
            </h3>
            <p className="mb-2">
              <strong>✅ Shelf Life:</strong> {result.shelf_life} days
            </p>
            <p className="mb-2">
              <strong>🍃 Freshness Score:</strong> {result.freshness}%
            </p>
            <p>
              <strong>💬 WasteGPT Suggestion:</strong>
              <br />
              {result.gpt_suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFresh;
