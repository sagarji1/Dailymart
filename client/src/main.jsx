// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CartProvider} from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
        <BrowserRouter>
          <App />
          <ToastContainer position="top-right" autoClose={2000} />
        </BrowserRouter>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
