// src/components/Header/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
          ? 'border-zinc-200/60 bg-white/80 shadow-sm shadow-zinc-900/5 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80 dark:shadow-zinc-950/20'
          : 'border-transparent bg-white/60 backdrop-blur-md dark:bg-zinc-950/60'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-zinc-900 transition-opacity hover:opacity-85 dark:text-white"
        >
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Daily
          </span>
          mart

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 sm:flex">
          {[
            { to: '/', label: 'Home' },
            { to: '/Deals', label: '🔥 Deals' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive(to)
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
            >
              {label}
              {isActive(to) && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-emerald-500" />
              )}
            </Link>
          ))}

          <div className="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="transition-transform duration-300" style={{ display: 'inline-block', transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Cart Link */}
          <Link
            id="cart-nav-btn"
            to="/cart"
            className="relative flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <span className="text-base leading-none">🛒</span>
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Admin Dashboard */}
          <Link
            id="admin-nav-btn"
            to="/admin"
            className="rounded-lg border border-emerald-600/20 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95"
          >
            Admin
          </Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={() => {
                signOut();
                toast.info('Logged out successfully');
              }}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:shadow dark:border-red-900/40 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-zinc-800"
            >
              Logout
            </button>
          ) : (
            <Link
              id="login-nav-btn"
              to="/login"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile: right-side actions */}
        <div className="flex items-center gap-2 sm:hidden">
          {/* Mobile Cart */}
          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-base dark:border-zinc-800 dark:bg-zinc-900"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            aria-label="Toggle Menu"
          >
            <span className="flex flex-col gap-1.5 items-center justify-center w-4">
              <span className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${menuOpen ? 'max-h-80 border-t border-zinc-100 dark:border-zinc-800/60' : 'max-h-0'
          }`}
      >
        <div className="flex flex-col gap-1 bg-white/95 px-4 py-3 backdrop-blur-xl dark:bg-zinc-950/95">
          {[
            { to: '/', label: 'Home' },
            { to: '/Deals', label: '🔥 Deals' },
            { to: '/admin', label: '📊 Admin Dashboard' },
            user ? { to: '#', label: '→ Logout', isLogout: true } : { to: '/login', label: '→ Login' },
          ].map(({ to, label, isLogout }, index) => {
            if (isLogout) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    signOut();
                    toast.info('Logged out successfully');
                    setMenuOpen(false);
                  }}
                  className="text-left rounded-xl px-4 py-3 text-sm font-medium transition-all text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-zinc-900"
                >
                  {label}
                </button>
              );
            }
            return (
              <Link
                key={index}
                to={to}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive(to)
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                  }`}
              >
                {label}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
