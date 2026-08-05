import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const DealofDay = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:8080/predict/high-risk');
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-4xl font-extrabold text-red-600 mb-6 text-center flex items-center justify-center gap-2">
        🔥 Deal of the Day
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Get fresh produce at heavily discounted prices before they run out!
      </p>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading deals...</p>
      ) : deals.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No deals available today. Check back later!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((product, index) => (
            <div key={index} className="relative">
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 animate-pulse">
                50% OFF
              </span>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealofDay;
