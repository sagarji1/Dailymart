import React, { useEffect, useState } from "react";
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

/* ─── Risk pill ─── */
const RiskPill = ({ days }) => {
  const isUrgent = days < 3;
  const isWarning = days < 6;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
        isUrgent
          ? "bg-red-500/10 text-red-600 dark:text-red-400"
          : isWarning
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      }`}
    >
      {isUrgent ? "⚠️" : isWarning ? "⏳" : "✅"} {days} days left
    </span>
  );
};

/* ─── Skeleton card ─── */
const SkeletonCard = () => (
  <div className="min-w-[300px] flex-shrink-0 rounded-2xl border border-zinc-200/60 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/60 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
    <div className="h-20 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 mt-3" />
  </div>
);

function SmartCart({ userId }) {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/smart-cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Could not load SmartCart recommendations');
        const data = await res.json();
        setSuggestions(data.smart_cart || []);
      } catch (err) {
        console.error("AI Smart Cart failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchHistory();
  }, [userId, token]);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 transition-colors duration-300 dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-teal-950/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/10 px-6 py-4 dark:border-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-xl">
            🧠
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              SmartCart AI Recommendations
            </h2>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
              Based on your purchase history & predicted shelf-life
            </p>
          </div>
        </div>

        {!loading && suggestions.length > 0 && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {suggestions.length} alert{suggestions.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex items-center gap-4 py-6">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
              🌿
            </span>
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                All your produce looks fresh!
              </p>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                No items from your purchase history are nearing expiry. Keep shopping to train your AI.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            {suggestions.map((item, index) => (
              <div
                key={index}
                className="group min-w-[300px] max-w-[340px] flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/70"
              >
                {/* Card header */}
                <div
                  className={`flex items-center justify-between px-4 py-3 ${
                    item.shelf_life < 3
                      ? "bg-red-50 dark:bg-red-900/10"
                      : item.shelf_life < 6
                      ? "bg-amber-50 dark:bg-amber-900/10"
                      : "bg-emerald-50 dark:bg-emerald-900/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {item.shelf_life < 3 ? "🚨" : item.shelf_life < 6 ? "⏳" : "🟢"}
                    </span>
                    <h3 className="font-bold text-zinc-900 dark:text-white">
                      {item.product}
                    </h3>
                  </div>
                  <RiskPill days={item.shelf_life} />
                </div>

                {/* Card body */}
                <div className="px-4 py-4">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm">💡</span>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        WasteGPT Insight
                      </p>
                      <p
                        className={`text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 ${
                          expanded[index] ? "" : "line-clamp-2"
                        }`}
                      >
                        {item.recommendation}
                      </p>
                      {item.recommendation?.length > 90 && (
                        <button
                          onClick={() => toggleExpand(index)}
                          className="mt-1.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                        >
                          {expanded[index] ? "Show less ↑" : "Read more ↓"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartCart;
