// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-12 transition-colors duration-300 dark:border-zinc-800/60 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Daily</span>mart
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Leading the future of retail inventory intelligence and sustainable fresh supply chains.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Platform</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Home</Link></li>
              <li><Link to="/Deals" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Deals</Link></li>
              <li><Link to="/cart" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Shopping Cart</Link></li>
              <li><Link to="/login" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Customer login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Support</h3>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">API Reference</a></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Developer Guide</a></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Status Page</a></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Headquarters</h3>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              📍 500 Innovation Way, Suite 100<br />
              New Delhi, India
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              support@dailymart.io
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200/60 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800/60 dark:text-zinc-500">
          © {new Date().getFullYear()} Dailymart SaaS. All rights reserved. Built for modern retail efficiency.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
