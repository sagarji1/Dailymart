import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SmartFresh from './SmartFresh';
import AdminLogin from './AdminLogin';
import { API_URL } from '../../config/api';

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon, badge }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 text-base dark:bg-zinc-950">
        {icon}
      </span>
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{value}</span>
      {badge && (
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
          {badge}
        </span>
      )}
    </div>
  </div>
);

/* ─── Risk badge ─── */
const RiskBadge = ({ level }) => {
  const map = {
    High: 'bg-red-500/10 text-red-600 dark:text-red-400',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[level]}`}>
      {level}
    </span>
  );
};

/* ─── Spinner ─── */
const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─── Input helper ─── */
const inputCls =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-emerald-500';

export default function DashboardLayout() {
  const tabs = ['Dashboard', 'Products', 'Add Product', 'Smart AI'];
  const [active, setActive] = useState('Dashboard');
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ── Add-product form state ── */
  const [form, setForm] = useState({
    SKU: '', StoreID: '', stockName: '', stockUrl: '', stockPrice: '',
    StockQty: '', AvgDailySales: '', ExpiryDate: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const stores = [
    { id: 1, name: 'Mumbai Central', skus: 120 },
    { id: 2, name: 'Delhi Bazaar', skus: 85 },
    { id: 3, name: 'Chennai Plaza', skus: 60 },
    { id: 4, name: 'Bangalore Square', skus: 45 },
  ];

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/predict`);
      const data = await res.json();
      const today = new Date();
      const updated = data.map((item, index) => {
        const expiry = new Date(item.ExpiryDate);
        const daysRemaining = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
        let riskLevel = 'Low';
        if (daysRemaining < 3) riskLevel = 'High';
        else if (daysRemaining < 7) riskLevel = 'Medium';
        return {
          id: index + 1,
          sku: item.SKU,
          storeId: item.StoreID,
          name: item.stockName,
          image: item.stockUrl,
          qty: item.StockQty,
          avgDailySales: item.AvgDailySales,
          daysRemaining,
          riskLevel,
        };
      });
      setProducts(updated);
    } catch (err) {
      console.error('API fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg(null);
    try {
      const res = await fetch(`${API_URL}/predict/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stockPrice: Number(form.stockPrice),
          StockQty: Number(form.StockQty),
          AvgDailySales: Number(form.AvgDailySales),
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setFormMsg({ type: 'success', text: `✅ "${form.stockName}" added to inventory!` });
      setForm({ SKU: '', StoreID: '', stockName: '', stockUrl: '', stockPrice: '', StockQty: '', AvgDailySales: '', ExpiryDate: '' });
      await fetchProducts();
    } catch {
      setFormMsg({ type: 'error', text: '❌ Failed to add product. Check the server.' });
    } finally {
      setFormLoading(false);
    }
  };

  /* ─── Filtered list ─── */
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'All' || p.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  /* ─── Products table ─── */
  const renderProductsTable = (list) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
        <thead>
          <tr className="border-b border-zinc-200/80 font-semibold text-zinc-700 dark:border-zinc-800/60 dark:text-zinc-300">
            {['SKU', 'Product', 'Store', 'Qty', 'Avg Sales/day', 'Days Left', 'Risk'].map((h) => (
              <th key={h} className="pb-3 text-[11px] uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/40">
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center italic text-zinc-400">
                No products match the selected criteria.
              </td>
            </tr>
          ) : (
            list.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                <td className="py-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-white">{p.sku}</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-contain bg-zinc-50 p-1 dark:bg-zinc-950/20" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</span>
                  </div>
                </td>
                <td className="py-3.5 text-xs font-semibold">{p.storeId}</td>
                <td className="py-3.5 font-medium text-zinc-900 dark:text-zinc-200">{p.qty}</td>
                <td className="py-3.5 font-medium">{p.avgDailySales}</td>
                <td className="py-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">{p.daysRemaining}d</td>
                <td className="py-3.5"><RiskBadge level={p.riskLevel} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  /* ─── Filters ─── */
  const FilterBar = () => (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search SKU or name…"
        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white"
      />
      <select
        value={filterRisk}
        onChange={(e) => setFilterRisk(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white"
      >
        {['All', 'High', 'Medium', 'Low'].map((r) => (
          <option key={r} value={r}>{r === 'All' ? 'All Risks' : `${r} Risk`}</option>
        ))}
      </select>
    </div>
  );

  /* ─── Dashboard view ─── */
  const renderDashboard = () => {
    const stats = [
      { label: 'Monitored Products', value: products.length, icon: '📦' },
      { label: 'Total Store SKUs', value: stores.reduce((s, st) => s + st.skus, 0), icon: '🏢' },
      { label: 'High Expiry Risk', value: products.filter((p) => p.riskLevel === 'High').length, icon: '⚠️', badge: products.filter((p) => p.riskLevel === 'High').length > 0 ? 'Action Needed' : null },
      { label: 'Medium Risk Items', value: products.filter((p) => p.riskLevel === 'Medium').length, icon: '🔔' },
    ];

    return (
      <div className="space-y-8 animate-[fadeIn_.3s_ease]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Risk Distribution Bar */}
        {products.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <h3 className="mb-4 text-sm font-bold text-zinc-900 dark:text-white">Risk Distribution</h3>
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {[
                { level: 'High', color: 'bg-red-500', count: products.filter((p) => p.riskLevel === 'High').length },
                { level: 'Medium', color: 'bg-amber-400', count: products.filter((p) => p.riskLevel === 'Medium').length },
                { level: 'Low', color: 'bg-emerald-500', count: products.filter((p) => p.riskLevel === 'Low').length },
              ].map(({ level, color, count }) => {
                const pct = products.length ? (count / products.length) * 100 : 0;
                return pct > 0 ? (
                  <div
                    key={level}
                    className={`${color} transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${level}: ${count} products (${pct.toFixed(0)}%)`}
                  />
                ) : null;
              })}
            </div>
            <div className="mt-3 flex items-center gap-6">
              {[
                { label: 'High', color: 'bg-red-500', count: products.filter((p) => p.riskLevel === 'High').length },
                { label: 'Medium', color: 'bg-amber-400', count: products.filter((p) => p.riskLevel === 'Medium').length },
                { label: 'Low', color: 'bg-emerald-500', count: products.filter((p) => p.riskLevel === 'Low').length },
              ].map(({ label, color, count }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
                  {label}: <strong className="text-zinc-900 dark:text-white">{count}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent products preview */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Active Product Monitoring</h3>
            <FilterBar />
          </div>
          {renderProductsTable(filteredProducts)}
        </div>

        {/* Stores overview */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <h3 className="mb-4 text-sm font-bold text-zinc-900 dark:text-white">📍 Store Network</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stores.map((store) => (
              <div key={store.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800/60 dark:bg-zinc-950/40">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">{store.name}</p>
                <p className="mt-1 text-xs text-zinc-400">{store.skus} SKUs tracked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ─── Add Product view ─── */
  const renderAddProduct = () => (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">➕</div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Add New Product</h3>
            <p className="text-xs text-zinc-400">Register a new item to the inventory system</p>
          </div>
        </div>

        {formMsg && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            formMsg.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400'
          }`}>
            {formMsg.text}
          </div>
        )}

        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'SKU', label: 'SKU Code', placeholder: 'e.g. SKU-0042', icon: '🏷️' },
              { name: 'StoreID', label: 'Store ID', placeholder: 'e.g. STORE-01', icon: '🏢' },
              { name: 'stockName', label: 'Product Name', placeholder: 'e.g. Alphonso Mango', icon: '🌿' },
              { name: 'stockPrice', label: 'Price (₹)', placeholder: 'e.g. 149', icon: '₹', type: 'number' },
              { name: 'StockQty', label: 'Stock Quantity', placeholder: 'e.g. 80', icon: '📦', type: 'number' },
              { name: 'AvgDailySales', label: 'Avg Daily Sales', placeholder: 'e.g. 12', icon: '📈', type: 'number' },
            ].map(({ name, label, placeholder, icon, type = 'text' }) => (
              <div key={name}>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {icon} {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleFormChange}
                  placeholder={placeholder}
                  className={inputCls}
                  required
                />
              </div>
            ))}
          </div>

          {/* Full-width fields */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              🖼️ Image URL
            </label>
            <input
              type="url"
              name="stockUrl"
              value={form.stockUrl}
              onChange={handleFormChange}
              placeholder="https://example.com/product.png"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              📅 Expiry Date
            </label>
            <input
              type="date"
              name="ExpiryDate"
              value={form.ExpiryDate}
              onChange={handleFormChange}
              className={inputCls}
              required
            />
          </div>

          <button
            id="add-product-submit-btn"
            type="submit"
            disabled={formLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-60"
          >
            {formLoading ? <><Spinner /> Adding product…</> : '➕ Add to Inventory'}
          </button>
        </form>
      </div>
    </div>
  );

  /* ─── Tab icons ─── */
  const tabIcons = { Dashboard: '📊', Products: '📦', 'Add Product': '➕', 'Smart AI': '🧠' };

  /* ─── Auth gate ─── */
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-[90vh] bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950/20">
      {/* ── Sidebar ── */}
      <aside className="hidden w-64 flex-col justify-between border-r border-zinc-200/80 bg-white p-6 dark:border-zinc-800/60 dark:bg-zinc-950/80 md:flex">
        <div className="space-y-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Manager Console
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`admin-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setActive(tab)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  active === tab
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/15'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-white'
                }`}
              >
                <span className="text-base">{tabIcons[tab]}</span>
                {tab}
                {tab === 'Add Product' && (
                  <span className="ml-auto rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="space-y-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-white"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-900/10 dark:hover:text-red-400"
          >
            <span>🔓</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-200/50 pb-5 dark:border-zinc-800/40">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{active}</h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Inventory dashboard & waste management suite
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(active === 'Dashboard' || active === 'Products') && (
              <button
                id="dashboard-refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                {refreshing ? 'Refreshing…' : 'Refresh Data'}
              </button>
            )}
            {active !== 'Dashboard' && active !== 'Products' && active !== 'Add Product' && active !== 'Smart AI' && null}
          </div>
        </div>

        {/* Content */}
        {active === 'Dashboard' && renderDashboard()}
        {active === 'Products' && (
          <div className="animate-[fadeIn_.3s_ease] rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Active Product Inventory</h3>
                <p className="text-xs text-zinc-400">All connected retail operations</p>
              </div>
              <FilterBar />
            </div>
            {renderProductsTable(filteredProducts)}
          </div>
        )}
        {active === 'Add Product' && renderAddProduct()}
        {active === 'Smart AI' && <SmartFresh />}
      </main>
    </div>
  );
}
