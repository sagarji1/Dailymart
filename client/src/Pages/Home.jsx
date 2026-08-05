import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [deal, setDeal] = useState([]); // ✅ Initialize as an array

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch('http://localhost:8080/predict/high-risk');
        const data = await response.json();
        console.log(data);
        setDeal(data); // ✅ Must be an array
      } catch (error) {
        console.error('Failed to fetch deal of the day:', error);
      }
    };

    fetchDeal();
  }, []);

  return (
    <div>
      <Carousel />

      {/* Deal of the Day Button */}
      <div className="flex justify-center mt-8">
        <a
          href="/Deals"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out text-lg"
        >
          🔥 Deal of the Day
        </a>
      </div>

      {/* Product Grid */}
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deal.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
