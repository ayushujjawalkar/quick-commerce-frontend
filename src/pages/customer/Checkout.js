

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { orderService, authService } from '../../services/api';
// import toast from 'react-hot-toast';

// const Checkout = () => {
//   const { cart, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('cod');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   const fetchAddresses = async () => {
//     try {
//       const { data } = await authService.getProfile();
//       const addrList = data?.data?.addresses || [];
//       setAddresses(addrList);

//       if (addrList.length > 0) {
//         const defaultAddr = addrList.find(a => a.isDefault);
//         setSelectedAddress(defaultAddr?._id || addrList[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       toast.error('Please select a delivery address');
//       return;
//     }

//     if (!cart?.items || cart.items.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setLoading(true);
//     try {
//       const orderData = {
//         shopId: String(cart.items[0].shopId),
//         userId: String(user._id),
//         items: cart.items.map(item => ({
//           productId: String(item.productId),
//           variantId: item.variantId ? String(item.variantId) : null,
//           quantity: Number(item.quantity)
//         })),
//         deliveryAddressId: String(selectedAddress),
//         contactNumber: user?.phone || "9876543210",
//         paymentMethod: paymentMethod
//       };

//       const { data } = await orderService.createOrder(orderData);

//       await clearCart();
//       toast.success("Order placed successfully!");
//       navigate(`/orders/${data.data._id}`);
//     } catch (error) {
//       console.error("Order creation error:", error.response?.data);

//       if (error.response?.data?.errors) {
//         const messages = error.response.data.errors.map(err => {
//           if (typeof err === 'string') return err;
//           if (err.message) return err.message;
//           return JSON.stringify(err);
//         }).join(', ');
//         toast.error(messages);
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Error placing order");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//         {/* Delivery Address */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

//           {addresses.length === 0 ? (
//             <div className="text-center">
//               <p className="text-gray-500 mb-4">No address found. Please add one.</p>
//               <button
//                 onClick={() => navigate('/profile/addresses')}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
//               >
//                 Add Address
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {addresses.map((address) => (
//                 <label
//                   key={address._id}
//                   className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-600"
//                 >
//                   <input
//                     type="radio"
//                     name="address"
//                     value={address._id}
//                     checked={selectedAddress === address._id}
//                     onChange={(e) => setSelectedAddress(e.target.value)}
//                     className="mt-1"
//                   />
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <p className="font-semibold">{address.type}</p>
//                       <button
//                         type="button"
//                         className="text-sm text-indigo-600 hover:underline"
//                         onClick={() => navigate(`/edit-address/${address._id}`)}
//                       >
//                         Edit
//                       </button>
//                     </div>
//                     <p className="text-gray-600">{address.addressLine1}, {address.city}</p>
//                     <p className="text-gray-600">{address.state} - {address.pincode}</p>
//                     {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
//                   </div>
//                 </label>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Payment Method */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//           <div className="space-y-3">
//             <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="cod"
//                 checked={paymentMethod === 'cod'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//               />
//               <span>Cash on Delivery</span>
//             </label>
//             <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
//               <input
//                 type="radio"
//                 name="payment"
//                 value="online"
//                 checked={paymentMethod === 'online'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//               />
//               <span>Online Payment</span>
//             </label>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//           <div className="space-y-2 mb-4">
//             <div className="flex justify-between"><span>Subtotal</span><span>₹{cart?.subtotal || 0}</span></div>
//             <div className="flex justify-between"><span>Tax</span><span>₹{cart?.tax || 0}</span></div>
//             <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{cart?.total || 0}</span></div>
//           </div>

//           <button
//             onClick={handlePlaceOrder}
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//           >
//             {loading ? 'Placing Order...' : 'Place Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService, authService } from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await authService.getProfile();
      const addrList = data?.data?.addresses || [];
      setAddresses(addrList);

      if (addrList.length > 0) {
        const defaultAddr = addrList.find(a => a.isDefault);
        setSelectedAddress(defaultAddr?._id || addrList[0]._id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shopId: cart.items[0].shopId._id || cart.items[0].shopId, // ensure string
        userId: user._id,
        items: cart.items.map(item => ({
          productId: item.productId._id || item.productId,
          name: item.name,
          image: item.image || "",
          price: Number(item.price),
          quantity: Number(item.quantity),
          variantId: item.variantId ? (item.variantId._id || item.variantId) : null,
          variantName: item.variantName || "",
          variantValue: item.variantValue || "",
          unit: item.unit || "",
          unitValue: Number(item.unitValue || 1),
          discount: Number(item.discount || 0),
          finalPrice: Number(item.finalPrice),
          subtotal: Number(item.subtotal)
        })),
        deliveryAddressId: selectedAddress, // backend expects this ID
        contactNumber: user?.phone || "9876543210",
        paymentMethod,
        pricing: {
          subtotal: Number(cart?.subtotal || 0),
          discount: Number(cart?.discount || 0),
          tax: Number(cart?.tax || 0),
          deliveryFee: Number(cart?.deliveryFee || 0),
          platformFee: Number(cart?.platformFee || 0),
          total: Number(cart?.total || 0)
        }
      };

      const { data } = await orderService.createOrder(orderData);

      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data.data._id}`);
    } catch (error) {
      console.error("Order creation error:", error.response?.data || error);
      const msg = error.response?.data?.message || "Error placing order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

          {addresses.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500 mb-4">No address found. Please add one.</p>
              <button
                onClick={() => navigate('/profile/addresses')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-600"
                >
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{address.type}</p>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:underline"
                        onClick={() => navigate(`/edit-address/${address._id}`)}
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-600">{address.addressLine1}, {address.city}</p>
                    <p className="text-gray-600">{address.state} - {address.pincode}</p>
                    {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Online Payment</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cart?.subtotal || 0}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{cart?.tax || 0}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{cart?.total || 0}</span></div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
