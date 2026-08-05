import React, { useEffect, useState } from "react";

function SmartCart({ userId }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(`http://localhost:8080/purchase/user123`);
      const historyData = await res.json();
      const allItems = historyData.flatMap(p => p.products);

      const flaskRes = await fetch("http://localhost:5000/smart-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: allItems }),
      });

      const data = await flaskRes.json();
      setSuggestions(data.smart_cart);
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 font-sans mt-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="Smart">🧠</span> Smart Cart Recommendations
      </h2>
      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-4">No suggestions yet.</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-100 to-white shadow-md rounded-xl px-6 py-4 flex items-center border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{item.product}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SmartCart;