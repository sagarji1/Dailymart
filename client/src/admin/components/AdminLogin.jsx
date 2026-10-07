// src/admin/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated auth — replace with real API call
    await new Promise((r) => setTimeout(r, 900));

    if (email === 'admin@dailymart.io' && password === 'admin123') {
      if (onLogin) onLogin();
    } else {
      setError('Invalid credentials. Try admin@dailymart.io / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12 transition-colors duration-300 dark:bg-zinc-950">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/8" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl shadow-sm">
            📊
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Manager Console
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access the Dailymart admin dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-zinc-950/30"
        >
          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-900/10">
              <span className="mt-0.5 text-sm">⚠️</span>
              <p className="text-xs font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Admin Email
              </label>
              <input
                id="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dailymart.io"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-zinc-950"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset not yet implemented.')}
                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-600"
                >
                  Forgot?
                </button>
              </div>
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-zinc-950"
                required
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/35 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Demo credentials: <strong className="text-zinc-600 dark:text-zinc-300">admin@dailymart.io</strong> / <strong className="text-zinc-600 dark:text-zinc-300">admin123</strong>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400">
          ← <button onClick={() => navigate('/')} className="font-medium text-emerald-500 hover:text-emerald-600">Return to storefront</button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
