// src/App.jsx
import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home';
import DealofDay from './Pages/DealofDay';
import Cart from './Pages/cart';
import AdminDasboard from '../src/admin/components/DashboardLayout'

function App() {
  return (
    <div>
      <Navbar />
        
   
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Deals" element={<DealofDay />} />
        <Route path="/admin" element={<AdminDasboard />} />
      </Routes>

    <Footer />
    </div>
  );
}

export default App;
