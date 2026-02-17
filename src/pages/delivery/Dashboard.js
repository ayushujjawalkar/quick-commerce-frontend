

// import React, { useState, useEffect } from 'react';
// import { deliveryService } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import { FiPackage, FiMapPin, FiNavigation, FiCheckCircle } from 'react-icons/fi';

// const DeliveryPartnerDashboard = () => {
//   const { userProfile } = useAuth();
//   const [activeTab, setActiveTab] = useState('available'); // available, active, history
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     todayEarnings: 0,
//     completedToday: 0
//   });

//   // ✅ HELPER FUNCTION: Fixes the "Objects are not valid as a React child" error
//   const formatAddress = (address) => {
//     if (!address) return "Address not available";
    
//     // If it's already a string, return it
//     if (typeof address === 'string') return address;

//     // If it's an object, format it nicely
//     const parts = [
//       address.addressLine1,
//       address.addressLine2,
//       address.city,
//       address.state,
//       address.pincode
//     ].filter(Boolean); // Remove empty values

//     return parts.length > 0 ? parts.join(', ') : "Address details missing";
//   };

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       let response;
//       if (activeTab === 'available') {
//         response = await deliveryService.getAvailableOrders();
//       } else if (activeTab === 'active') {
//         response = await deliveryService.getMyDeliveries('active');
//       } else {
//         response = await deliveryService.getMyDeliveries('completed');
//       }
//       setOrders(response.data.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       const { data } = await deliveryService.getProfile();
//       if (data.success) {
//         setStats({
//           todayEarnings: data.data.earnings?.today || 0,
//           completedToday: 0 
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchProfile();
//   }, [activeTab]);

//   const handleAcceptOrder = async (orderId) => {
//     try {
//       await deliveryService.acceptOrder(orderId);
//       toast.success('Order accepted successfully!');
//       setActiveTab('active');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to accept order');
//     }
//   };

//   const handleStatusUpdate = async (orderId, status) => {
//     try {
//       if (status === 'picked_up') {
//         await deliveryService.pickupOrder(orderId);
//         toast.success('Order marked as picked up');
//       } else if (status === 'out_for_delivery') {
//          await deliveryService.startDelivery(orderId);
//          toast.success('Delivery started');
//       } else if (status === 'delivered') {
//         await deliveryService.completeDelivery(orderId);
//         toast.success('Order delivered successfully!');
//         fetchProfile(); 
//       }
//       fetchOrders(); 
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Update failed');
//     }
//   };

//   const toggleAvailability = async () => {
//     try {
//         await deliveryService.toggleAvailability();
//         toast.success("Availability updated");
//         window.location.reload(); 
//     } catch (error) {
//         console.error(error);
//     }
//   };

//   if (loading && orders.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Header Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <p className="text-gray-500 text-xs uppercase font-semibold">Today's Earnings</p>
//             <p className="text-2xl font-bold text-green-600">₹{stats.todayEarnings}</p>
//         </div>
//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
//             <div className="flex items-center gap-2 mt-1">
//                 <span className={`h-3 w-3 rounded-full ${userProfile?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
//                 <span className="font-medium">{userProfile?.isAvailable ? 'Online' : 'Offline'}</span>
//             </div>
//             <button onClick={toggleAvailability} className="text-xs text-indigo-600 font-semibold mt-1">Change</button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
//         {['available', 'active', 'history'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
//               activeTab === tab
//                 ? 'bg-white text-indigo-600 shadow-sm'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Orders List */}
//       <div className="space-y-4">
//         {orders.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//                 <FiPackage className="mx-auto h-12 w-12 mb-3 opacity-20" />
//                 <p>No orders found in this category</p>
//             </div>
//         ) : (
//             orders.map((order) => (
//             <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
//                 <div className="p-5">
//                 <div className="flex justify-between items-start mb-4">
//                     <div>
//                         <h3 className="font-bold text-gray-900 text-lg">
//                             {order.shopId?.name || "Unknown Shop"}
//                         </h3>
//                         {/* ✅ FIXED: Use formatAddress() instead of rendering object directly */}
//                         <p className="text-gray-500 text-sm flex items-center mt-1">
//                             <FiMapPin className="mr-1 flex-shrink-0" /> 
//                             <span className="truncate max-w-xs">
//                                 {formatAddress(order.shopId?.address)}
//                             </span>
//                         </p>
//                     </div>
//                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
//                         {order.orderStatus.replace(/_/g, ' ')}
//                     </span>
//                 </div>

//                 <div className="border-t border-b border-gray-50 py-3 my-3 space-y-2">
//                     <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Customer:</span>
//                         <span className="font-medium">{order.userId?.name || "Guest User"}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Order ID:</span>
//                         <span className="font-mono text-gray-700">#{order._id.slice(-6)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Total Amount:</span>
//                         <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-4 flex gap-3">
//                     {activeTab === 'available' && (
//                         <button 
//                             onClick={() => handleAcceptOrder(order._id)}
//                             className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
//                         >
//                             <FiCheckCircle /> Accept Order
//                         </button>
//                     )}

//                     {activeTab === 'active' && (
//                         <>
//                             {order.orderStatus === 'assigned_to_delivery' && (
//                                 <button 
//                                     onClick={() => handleStatusUpdate(order._id, 'picked_up')}
//                                     className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition"
//                                 >
//                                     Confirm Pickup
//                                 </button>
//                             )}
//                             {order.orderStatus === 'picked_up' && (
//                                 <button 
//                                     onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
//                                     className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
//                                 >
//                                     Start Delivery
//                                 </button>
//                             )}
//                             {order.orderStatus === 'out_for_delivery' && (
//                                 <button 
//                                     onClick={() => handleStatusUpdate(order._id, 'delivered')}
//                                     className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
//                                 >
//                                     <FiCheckCircle /> Complete Delivery
//                                 </button>
//                             )}
//                              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
//                                 <FiNavigation className="w-5 h-5" />
//                             </button>
//                         </>
//                     )}
//                 </div>
//                 </div>
//             </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default DeliveryPartnerDashboard;


import React, { useState, useEffect, useCallback } from 'react'; // ✅ Import useCallback
import { deliveryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPackage, FiMapPin, FiNavigation, FiCheckCircle } from 'react-icons/fi';

const DeliveryPartnerDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('available'); // available, active, history
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    completedToday: 0
  });

  // Helper function for address formatting
  const formatAddress = (address) => {
    if (!address) return "Address not available";
    if (typeof address === 'string') return address;
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "Address details missing";
  };

  // ✅ FIX: Wrap fetchOrders in useCallback
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'available') {
        response = await deliveryService.getAvailableOrders();
      } else if (activeTab === 'active') {
        response = await deliveryService.getMyDeliveries('active');
      } else {
        response = await deliveryService.getMyDeliveries('completed');
      }
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // ✅ Dependency added here

  // ✅ FIX: Wrap fetchProfile in useCallback (good practice)
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await deliveryService.getProfile();
      if (data.success) {
        setStats({
          todayEarnings: data.data.earnings?.today || 0,
          completedToday: 0 
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ✅ FIX: Add functions to dependency array
  useEffect(() => {
    fetchOrders();
    fetchProfile();
  }, [fetchOrders, fetchProfile]); 

  const handleAcceptOrder = async (orderId) => {
    try {
      await deliveryService.acceptOrder(orderId);
      toast.success('Order accepted successfully!');
      setActiveTab('active');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      if (status === 'picked_up') {
        await deliveryService.pickupOrder(orderId);
        toast.success('Order marked as picked up');
      } else if (status === 'out_for_delivery') {
         await deliveryService.startDelivery(orderId);
         toast.success('Delivery started');
      } else if (status === 'delivered') {
        await deliveryService.completeDelivery(orderId);
        toast.success('Order delivered successfully!');
        fetchProfile(); 
      }
      fetchOrders(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const toggleAvailability = async () => {
    try {
        await deliveryService.toggleAvailability();
        toast.success("Availability updated");
        window.location.reload(); 
    } catch (error) {
        console.error(error);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase font-semibold">Today's Earnings</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.todayEarnings}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
            <div className="flex items-center gap-2 mt-1">
                <span className={`h-3 w-3 rounded-full ${userProfile?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="font-medium">{userProfile?.isAvailable ? 'Online' : 'Offline'}</span>
            </div>
            <button onClick={toggleAvailability} className="text-xs text-indigo-600 font-semibold mt-1">Change</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
        {['available', 'active', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
                <FiPackage className="mx-auto h-12 w-12 mb-3 opacity-20" />
                <p>No orders found in this category</p>
            </div>
        ) : (
            orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                            {order.shopId?.name || "Unknown Shop"}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                            <FiMapPin className="mr-1 flex-shrink-0" /> 
                            <span className="truncate max-w-xs">
                                {formatAddress(order.shopId?.address)}
                            </span>
                        </p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                </div>

                <div className="border-t border-b border-gray-50 py-3 my-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium">{order.userId?.name || "Guest User"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Order ID:</span>
                        <span className="font-mono text-gray-700">#{order._id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                    {activeTab === 'available' && (
                        <button 
                            onClick={() => handleAcceptOrder(order._id)}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                        >
                            <FiCheckCircle /> Accept Order
                        </button>
                    )}

                    {activeTab === 'active' && (
                        <>
                            {order.orderStatus === 'assigned_to_delivery' && (
                                <button 
                                    onClick={() => handleStatusUpdate(order._id, 'picked_up')}
                                    className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                                >
                                    Confirm Pickup
                                </button>
                            )}
                            {order.orderStatus === 'picked_up' && (
                                <button 
                                    onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                                >
                                    Start Delivery
                                </button>
                            )}
                            {order.orderStatus === 'out_for_delivery' && (
                                <button 
                                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                                >
                                    <FiCheckCircle /> Complete Delivery
                                </button>
                            )}
                             <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                <FiNavigation className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;