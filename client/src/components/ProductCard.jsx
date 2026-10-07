import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { stockName, stockUrl, SKU, stockPrice } = product;
  const { addToCart } = useCart();
  const navigate = useNavigate();

 const handleAddToCart = () => {
  console.log('Adding to cart:', product);
  const result = addToCart(product);
  result.success ? toast.success(result.message) : toast.error(result.message);
};

  const handleBuyNow = () => {
    const result = addToCart(product);
    if (result.success || result.message === 'Item already in cart') {
      toast.info('Redirecting to checkout...');
      navigate('/cart');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="group max-w-xs w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700/80 flex flex-col justify-between">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-zinc-50 p-4 dark:bg-zinc-950/20">
        <img
          src={stockUrl}
          alt={stockName}
          className="h-48 w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Description */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 line-clamp-2 dark:text-zinc-50">
          {stockName}
        </h3>

        {/* Dynamic Star Ratings */}
        <div className="mt-2 flex items-center gap-0.5 text-xs text-yellow-500">
          {'★'.repeat(5)}
        </div>

        {/* Pricing Info */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{stockPrice}
          </span>
          <span className="text-xs text-zinc-400 line-through">
            ₹{Math.round(stockPrice * 2)}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
