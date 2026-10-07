import React, { createContext, useContext, useState, useEffect } from 'react';
/* eslint-disable react-refresh/only-export-components */

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage initially
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  // 🔁 Sync to localStorage whenever cart updates
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.SKU === product.SKU);
    if (exists) {
      return { success: false, message: 'Item already in cart' };
    }
    setCartItems(prev => [...prev, product]);
    return { success: true, message: 'Item added to cart!' };
  };

  const removeFromCart = (sku) => {
    setCartItems(prev => prev.filter(item => item.SKU !== sku));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
