// src/components/Header/Navbar.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const { cartItems } = useCart();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#370617] text-white shadow">
      <div className="text-3xl font-bold" ><Link to="/">Dailymart</Link></div>
      <div className="flex gap-6 items-center">
        <Link to="/cart" className="relative bg-white text-[#370617] px-4 py-2 rounded-full flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
            alt="Cart"
            className="w-5 h-5 mr-2"
          />
          Cart
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
        <Link to="/admin" className="bg-yellow-400 text-[#370617] px-5 py-2 rounded-full">Admin DashBoard</Link>
        <Link to="/login" className="bg-yellow-400 text-[#370617] px-5 py-2 rounded-full">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
