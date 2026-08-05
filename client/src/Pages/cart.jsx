// src/pages/Cart.jsx
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import SmartCart from './SmartCart'

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  useEffect(() => {
  console.log("Cart Page - Cart Items:", cartItems);
}, [cartItems]);


  return (
    <div className="p-6">
      <SmartCart/>
      <h2 className="text-3xl font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cartItems.map((item, index) => (
            <div key={item.SKU || index} className="bg-white p-4 shadow rounded">
              <img
                src={item.stockUrl}
                alt={item.stockName}
                className="h-48 w-full object-contain mb-2"
              />
              <h3 className="font-semibold">{item.stockName}</h3>
              <p className="text-gray-600 text-sm">Store: {item.StoreID}</p>
              <p className="text-green-600 font-semibold">₹{item.stockPrice}</p>
              <p className="text-sm text-gray-500">Qty: {item.StockQty}</p>
           

              <button
                onClick={() => removeFromCart(item.SKU)}
                className="mt-2 bg-red-500 text-white py-2 px-4 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
