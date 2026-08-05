import React, { useState } from 'react';
import axios from 'axios';

const SmartFresh = () => {
  const [product, setProduct] = useState("Banana");
  const [temp, setTemp] = useState(10);
  const [humidity, setHumidity] = useState(50);
  const [days, setDays] = useState(2);
  const [packaging, setPackaging] = useState("Normal");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/predict", {
      product,
      temp,
      humidity,
      days_since_harvest: days,
      packaging,
    });
    setResult(res.data);
  };

  return (
    <div className="smartfresh">
      <h2>SmartFresh AI – Shelf Life Predictor</h2>
      <label>Product:
        <select value={product} onChange={e => setProduct(e.target.value)}>
          <option>Banana</option>
          <option>Lettuce</option>
          <option>Tomatoes</option>
          <option>Spinach</option>
          <option>Mango</option>
          <option>Carrot</option>
        </select>
      </label>
      <label>Temp:
        <input type="number" value={temp} onChange={e => setTemp(e.target.value)} />
      </label>
      <label>Humidity:
        <input type="number" value={humidity} onChange={e => setHumidity(e.target.value)} />
      </label>
      <label>Days Since Harvest:
        <input type="number" value={days} onChange={e => setDays(e.target.value)} />
      </label>
      <label>Packaging:
        <select value={packaging} onChange={e => setPackaging(e.target.value)}>
          <option>Normal</option>
          <option>GreenPod</option>
        </select>
      </label>
      <button onClick={handleSubmit}>Predict</button>

      {result && (
        <div className="result">
          <p>✅ Shelf Life: {result.shelf_life} days</p>
          <p>🍃 Freshness Score: {result.freshness}%</p>
          <p>💬 WasteGPT: {result.gpt_suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default SmartFresh;
