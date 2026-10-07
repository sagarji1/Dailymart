// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import SmartCart from './SmartCart'
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user, token } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutCount, setCheckoutCount] = useState(0);

  useEffect(() => {
  console.log("Cart Page - Cart Items:", cartItems);
}, [cartItems]);


  const subtotal = cartItems.reduce((acc, item) => acc + item.stockPrice, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      toast.info('Please sign in before checking out.');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await fetch(`${API_URL}/purchase/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          products: cartItems.map(({ stockName, SKU }) => ({ name: stockName, sku: SKU, quantity: 1 })),
        }),
      });
      if (!response.ok) throw new Error('Checkout failed');
      clearCart();
      setCheckoutCount((count) => count + 1);
      toast.success('Order saved. SmartCart will use this purchase history.');
    } catch (error) {
      toast.error(error.message || 'Unable to complete checkout.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 transition-colors duration-300 dark:bg-zinc-950 min-h-screen">
      {/* Dynamic AI SmartCart Widget */}
      <div className="mb-12">
        {user && <SmartCart key={checkoutCount} userId={user.id} />}
      </div>

      <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
        🛒 Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        /* Empty State */
        <div className="mt-8 text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/10 max-w-lg mx-auto">
          <span className="text-5xl" role="img" aria-label="Empty">🛒</span>
          <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">Your cart is empty</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Fill your cart with fresh organic produce and markdown deals.</p>
        </div>
      ) : (
        /* Split Layout */
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div 
                key={item.SKU || index} 
                className="flex items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40"
              >
                <img
                  src={item.stockUrl}
                  alt={item.stockName}
                  className="h-24 w-24 object-contain rounded-xl bg-zinc-50 dark:bg-zinc-950/20 p-2"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{item.stockName}</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">SKU: {item.SKU} | Store: {item.StoreID}</p>
                  <p className="text-xs text-emerald-500 mt-1">✓ Instock ({item.StockQty} available)</p>
                </div>
                <div className="text-right flex flex-col justify-between h-20 items-end">
                  <span className="text-xl font-extrabold text-zinc-900 dark:text-white">₹{item.stockPrice}</span>
                  <button
                    onClick={() => removeFromCart(item.SKU)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 h-fit">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Order Summary</h3>
            
            <div className="mt-6 space-y-4 border-b border-zinc-100 pb-4 dark:border-zinc-800/60">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Sales Tax (5%)</span>
                <span className="font-semibold text-zinc-900 dark:text-white">₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Estimated Delivery</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-zinc-900 dark:text-white">Total</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{total}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/30 transition-all active:scale-95"
            >
              {checkingOut ? 'Saving order...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
