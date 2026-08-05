import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { stockName, stockUrl, SKU, storeId, stockPrice } = product;
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
    <div className="max-w-xs w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between">
      <img
        src={stockUrl}
        alt={stockName}
        className="p-4 h-52 w-full object-contain"
      />

      <div className="px-4 flex flex-col flex-grow">
        <h2 className="text-md font-medium text-gray-800 line-clamp-2">{stockName}</h2>

        <div className="flex items-center mt-2 space-x-1 text-yellow-500 text-sm">
          {'⭐'.repeat(4)}
        </div>

        <p className="text-lg font-bold text-green-600 mt-1">₹{stockPrice}</p>

        {/* Buttons */}
        <div className="mt-auto mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-yellow-400 hover:bg-yellow-500 text-[#111] font-semibold py-2 rounded"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
