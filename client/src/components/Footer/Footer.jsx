// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Dailymart */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Dailymart</h2>
          <p className="text-sm">
            Your one-stop shop for groceries, daily essentials, and amazing deals.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
            <li><a href="/deals" className="hover:text-white">Deals</a></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/help" className="hover:text-white">Help Center</a></li>
            <li><a href="/returns" className="hover:text-white">Returns</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Get in Touch</h3>
          <p className="text-sm">📍 New Delhi, India</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">✉️ support@dailymart.com</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Dailymart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
