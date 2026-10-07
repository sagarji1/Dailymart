import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const DealofDay = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${API_URL}/predict/high-risk`);
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
    <div className="mx-auto max-w-7xl px-6 py-12 transition-colors duration-300 dark:bg-zinc-950 min-h-screen">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
          🔥 Limited Time Markdown
        </span>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Deal of the Day
        </h2>
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
          Pre-expiry clearance. Grab fresh groceries and produce at up to 50% discount. Updated live by our automated retail sensors.
        </p>
      </div>

      {loading ? (
        /* Loading Skeleton Grid */
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        /* Empty State */
        <div className="mt-16 text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/10 max-w-lg mx-auto">
          <span className="text-5xl" role="img" aria-label="Fresh">🥗</span>
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">All Clear!</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No high-risk inventory detected today. Everything is safely fresh.</p>
        </div>
      ) : (
        /* Deals Grid */
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {deals.map((product, index) => (
            <div key={index} className="relative w-full flex justify-center">
              <span className="absolute top-3 left-6 z-10 rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase animate-pulse">
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
