// import React from "react";

// const Cart = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Cart</h1>
//     </div>
//   );
// };

// export default Cart;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="mx-auto text-8xl text-gray-400 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to get started with shopping</p>
          <button onClick={() => navigate('/')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition">
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-4xl">📦</span>}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    {item.variantName && <p className="text-sm text-gray-600 mb-2">{item.variantName}: {item.variantValue}</p>}
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-indigo-600">₹{item.finalPrice}</span>
                      {item.discount > 0 && <span className="text-sm text-gray-500 line-through">₹{item.price}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button onClick={() => updateCartItem(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                      <FiMinus />
                    </button>
                    <span className="font-bold text-xl w-12 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item._id, item.quantity + 1)} className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                      <FiPlus />
                    </button>
                  </div>

                  <button onClick={() => removeFromCart(item._id)} className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-semibold">₹{cart.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-semibold">₹{cart.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹{cart.deliveryFee?.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span className="flex items-center space-x-1"><FiTag /> <span>Discount</span></span>
                    <span className="font-semibold">-₹{cart.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 pt-4 flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{cart.total?.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;