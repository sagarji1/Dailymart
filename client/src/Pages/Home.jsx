import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from './Carousel';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const Home = () => {
  const [deal, setDeal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`${API_URL}/predict/high-risk`);
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error('Failed to fetch deal of the day:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, []);

  return (
    <div className="pb-16 transition-colors duration-300 dark:bg-zinc-950">
      {/* SaaS Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 text-center lg:px-8 lg:pt-24">
        {/* Soft Background Gradients */}
        <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />

        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
            ✨ Powered by WasteGPT & Shelf-Life AI
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Smart Grocery Shopping,{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Zero Waste
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-500 dark:text-zinc-400">
            Dailymart matches inventory intelligence with real-time freshness analytics. Save up to 50% on items close to expiry and shop smarter.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/Deals"
              className="rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 transition-all active:scale-95 hover:shadow-emerald-500/35"
            >
              🔥 Deal of the Day
            </Link>
            <Link
              to="/admin"
              className="group text-sm font-semibold leading-6 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Open Manager Console <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Carousel Section */}
      {/* Carousel Removed */}

      {/* Feature Grid / Trust Badges */}
      <section className="mx-auto max-w-7xl px-6 mt-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <div className="text-xl font-bold text-zinc-900 dark:text-white">📊 Predictive Pricing</div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Prices dynamic drop as produce nears its predicted expiry, giving you the best bargain.</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <div className="text-xl font-bold text-zinc-900 dark:text-white">🍃 WasteGPT suggestions</div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">AI automatically provides recipe transformations and preservation tips for every single purchase.</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40">
            <div className="text-xl font-bold text-zinc-900 dark:text-white">🛒 Smart Cart Analytics</div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Predictive cart checks flag items that might spoil before you get to eat them.</p>
          </div>
        </div>
      </section>

      {/* Deals / Product Grid */}
      <section className="mx-auto max-w-7xl px-6 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800/60">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">🔥 Hot Markdown Deals</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">High-risk products marked down before expiry. Shop immediately to capture value!</p>
          </div>
          <Link to="/Deals" className="mt-4 text-sm font-semibold text-emerald-500 hover:text-emerald-600 sm:mt-0">
            View all deals &rarr;
          </Link>
        </div>

        {loading ? (
          /* Premium Loading Skeleton */
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : deal.length === 0 ? (
          /* Empty State */
          <div className="mt-12 text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10">
            <span className="text-4xl" role="img" aria-label="Inbox">📦</span>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">No active markdowns</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">All current inventory is fresh. Check back later tonight!</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {deal.map((product, index) => (
              <div key={index} className="relative w-full flex justify-center">
                <span className="absolute top-3 left-6 z-10 rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase animate-pulse">
                  50% OFF
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
