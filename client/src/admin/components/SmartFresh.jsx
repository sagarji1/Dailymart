import React, { useState } from "react";
import axios from "axios";
import { AI_API_URL } from '../../config/api';

/* ─── Freshness gauge ring (SVG arc) ─── */
const FreshnessGauge = ({ value }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const progress = ((100 - value) / 100) * circ;

  const color =
    value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="mx-auto">
      {/* Track */}
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-zinc-200 dark:text-zinc-800"
      />
      {/* Progress */}
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={progress}
        transform="rotate(-90 55 55)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      {/* Label */}
      <text
        x="55"
        y="50"
        textAnchor="middle"
        className="fill-zinc-900 dark:fill-white"
        style={{
          fontSize: "20px",
          fontWeight: 800,
          fill: color,
        }}
      >
        {value}%
      </text>
      <text
        x="55"
        y="68"
        textAnchor="middle"
        style={{ fontSize: "9px", fill: "#71717a" }}
      >
        FRESHNESS
      </text>
    </svg>
  );
};

/* ─── Animated spinner ─── */
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-emerald-400"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

/* ─── Field wrapper ─── */
const Field = ({ label, icon, children }) => (
  <div>
    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      <span>{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-zinc-900";

const SmartFresh = () => {
  const [product, setProduct] = useState("Banana");
  const [temp, setTemp] = useState(10);
  const [humidity, setHumidity] = useState(50);
  const [days, setDays] = useState(2);
  const [packaging, setPackaging] = useState("Normal");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res = await axios.post(`${AI_API_URL}/predict`, {
        product,
        temp: Number(temp),
        humidity: Number(humidity),
        days_since_harvest: Number(days),
        packaging,
      });
      setResult(res.data);
    } catch {
      setError("Could not reach the AI server. Make sure the Flask server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const riskLabel =
    result?.shelf_life >= 7
      ? { text: "Excellent", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" }
      : result?.shelf_life >= 4
      ? { text: "Moderate", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" }
      : { text: "Critical", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" };

  return (
    <div className="min-h-[60vh] animate-[fadeIn_.3s_ease]">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
          🍏
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            SmartFresh AI
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Shelf-life prediction powered by Random Forest + WasteGPT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ── Input Form ── */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <h3 className="mb-5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            📋 Produce Conditions
          </h3>

          <div className="space-y-4">
            <Field label="Product" icon="🌿">
              <select
                className={inputCls}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                {["Banana", "Lettuce", "Tomatoes", "Spinach", "Mango", "Carrot"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="Temperature (°C)" icon="🌡️">
              <div className="relative">
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className={inputCls}
                  min={-10}
                  max={50}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  °C
                </span>
              </div>
            </Field>

            <Field label="Humidity (%)" icon="💧">
              <div className="relative">
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className={inputCls}
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  %
                </span>
              </div>
            </Field>

            <Field label="Days Since Harvest" icon="📅">
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className={inputCls}
                min={0}
              />
            </Field>

            <Field label="Packaging Type" icon="📦">
              <select
                className={inputCls}
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="GreenPod">GreenPod (Eco)</option>
              </select>
            </Field>

            <button
              id="smartfresh-predict-btn"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing produce...
                </>
              ) : (
                <>🚀 Run Prediction</>
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div className="lg:col-span-3 space-y-5">
          {!result && !loading && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/20">
              <div className="text-center">
                <p className="text-4xl">🔬</p>
                <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Fill the form and run a prediction
                </p>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  Results will appear here
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <Spinner />
                </div>
                <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Running ML model...
                </p>
                <p className="mt-1 text-xs text-zinc-400">This may take a few seconds</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Top metric cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Shelf Life Card */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Shelf Life
                  </p>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    {result.shelf_life}
                    <span className="ml-1 text-lg font-semibold text-zinc-400">days</span>
                  </p>
                  <span className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${riskLabel.bg} ${riskLabel.color}`}>
                    {riskLabel.text} Condition
                  </span>
                </div>

                {/* Freshness Gauge */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Freshness Score
                  </p>
                  <FreshnessGauge value={result.freshness} />
                </div>
              </div>

              {/* WasteGPT Suggestion */}
              <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-6 shadow-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-base">🧠</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">WasteGPT Recommendation</p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">AI-generated waste reduction strategy</p>
                  </div>
                </div>
                <blockquote className="border-l-2 border-emerald-400 pl-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {result.gpt_suggestion}
                </blockquote>
              </div>

              {/* Input Summary */}
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/30">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Prediction Inputs
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: product, icon: "🌿" },
                    { label: `${temp}°C`, icon: "🌡️" },
                    { label: `${humidity}% RH`, icon: "💧" },
                    { label: `Day ${days}`, icon: "📅" },
                    { label: packaging, icon: "📦" },
                  ].map(({ label, icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {icon} {label}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartFresh;
