

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
//       console.error(error);
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
//         shopId: cart.items[0].shopId._id || cart.items[0].shopId, // ensure string
//         userId: user._id,
//         items: cart.items.map(item => ({
//           productId: item.productId._id || item.productId,
//           name: item.name,
//           image: item.image || "",
//           price: Number(item.price),
//           quantity: Number(item.quantity),
//           variantId: item.variantId ? (item.variantId._id || item.variantId) : null,
//           variantName: item.variantName || "",
//           variantValue: item.variantValue || "",
//           unit: item.unit || "",
//           unitValue: Number(item.unitValue || 1),
//           discount: Number(item.discount || 0),
//           finalPrice: Number(item.finalPrice),
//           subtotal: Number(item.subtotal)
//         })),
//         deliveryAddressId: selectedAddress, // backend expects this ID
//         contactNumber: user?.phone || "9876543210",
//         paymentMethod,
//         pricing: {
//           subtotal: Number(cart?.subtotal || 0),
//           discount: Number(cart?.discount || 0),
//           tax: Number(cart?.tax || 0),
//           deliveryFee: Number(cart?.deliveryFee || 0),
//           platformFee: Number(cart?.platformFee || 0),
//           total: Number(cart?.total || 0)
//         }
//       };

//       const { data } = await orderService.createOrder(orderData);

//       await clearCart();
//       toast.success("Order placed successfully!");
//       navigate(`/orders/${data.data._id}`);
//     } catch (error) {
//       console.error("Order creation error:", error.response?.data || error);
//       const msg = error.response?.data?.message || "Error placing order";
//       toast.error(msg);
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
    // 1. Basic Validation
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
      // Helper function to safely extract ID string from populated objects
      const getId = (entity) => (entity && entity._id ? entity._id : entity);

      // 2. Construct Payload with Snapshot Data
      const orderData = {
        shopId: getId(cart.items[0].shopId),
        
        // Backend now expects the ID, controller will look up the address object
        deliveryAddressId: selectedAddress, 
        
        contactNumber: user?.phone || "9876543210",
        paymentMethod,

        // Map items with full details (Snapshot)
        items: cart.items.map(item => {
          const variantId = getId(item.variantId);
          
          return {
            productId: getId(item.productId),
            name: item.name,
            image: item.image || "",
            price: Number(item.price),
            quantity: Number(item.quantity),
            
            // Only include variantId if it exists (prevents validation errors)
            ...(variantId && { variantId }),
            variantName: item.variantName || "",
            
            unit: item.unit || "",
            unitValue: Number(item.unitValue || 1),
            discount: Number(item.discount || 0),
            
            // Critical Snapshot Fields
            finalPrice: Number(item.finalPrice || item.price),
            subtotal: Number(item.subtotal || (item.price * item.quantity))
          };
        }),

        // Backend requires this specific pricing structure
        pricing: {
          subtotal: Number(cart?.subtotal || 0),
          discount: Number(cart?.discount || 0),
          tax: Number(cart?.tax || 0),
          deliveryFee: Number(cart?.deliveryFee || 0),
          platformFee: Number(cart?.platformFee || 0),
          total: Number(cart?.total || 0)
        }
      };

      // 3. Send Request
      const { data } = await orderService.createOrder(orderData);

      // 4. Success Handling
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data.data._id}`);

    } catch (error) {
      console.error("Order creation error:", error.response?.data || error);
      
      const serverMsg = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
         // If Joi sends an array of errors
         const msg = validationErrors.map(e => e.message).join(', ');
         toast.error(msg);
      } else {
         toast.error(serverMsg || "Error placing order");
      }
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
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-600 ${
                    selectedAddress === address._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
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
                      <p className="font-semibold capitalize">{address.type}</p>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent radio selection when clicking edit
                          navigate(`/edit-address/${address._id}`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-600">{address.addressLine1}, {address.city}</p>
                    <p className="text-gray-600">{address.state} - {address.pincode}</p>
                    {address.landmark && <p className="text-gray-500 text-sm mt-1">Landmark: {address.landmark}</p>}
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
            <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="font-medium">Cash on Delivery</span>
            </label>
            <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer ${
                paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}>
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="font-medium">Online Payment</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 text-gray-700">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cart?.subtotal || 0}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{cart?.tax || 0}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{cart?.deliveryFee || 0}</span></div>
            <div className="flex justify-between"><span>Platform Fee</span><span>₹{cart?.platformFee || 0}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-black">
                <span>Total</span><span>₹{cart?.total || 0}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;