


// import React, { useState, useEffect, useCallback } from 'react'; // ✅ Import useCallback
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

//   // Helper function for address formatting
//   const formatAddress = (address) => {
//     if (!address) return "Address not available";
//     if (typeof address === 'string') return address;
//     const parts = [
//       address.addressLine1,
//       address.addressLine2,
//       address.city,
//       address.state,
//       address.pincode
//     ].filter(Boolean);
//     return parts.length > 0 ? parts.join(', ') : "Address details missing";
//   };

//   // ✅ FIX: Wrap fetchOrders in useCallback
//   const fetchOrders = useCallback(async () => {
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
//   }, [activeTab]); // ✅ Dependency added here

//   // ✅ FIX: Wrap fetchProfile in useCallback (good practice)
//   const fetchProfile = useCallback(async () => {
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
//   }, []);

//   // ✅ FIX: Add functions to dependency array
//   useEffect(() => {
//     fetchOrders();
//     fetchProfile();
//   }, [fetchOrders, fetchProfile]); 

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







import React, { useState, useEffect, useCallback, useRef } from 'react';
import { deliveryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiPackage, FiMapPin, FiNavigation,
  FiCheckCircle, FiWifiOff, FiPhone
} from 'react-icons/fi';

const DeliveryPartnerDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab,   setActiveTab]   = useState('available');
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [partnerData, setPartnerData] = useState(null);
  const [stats,       setStats]       = useState({ todayEarnings: 0 });

  // ── Location tracking state ──────────────────────────────────────────────────
  const [myLocation,  setMyLocation]  = useState(null);
  const [locError,    setLocError]    = useState(null);
  const [sendCount,   setSendCount]   = useState(0);
  
  const watchRef = useRef(null);
  const lastLocationUpdate = useRef(0); // ✅ Track last update time for throttling

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    if (typeof address === 'string') return address;
    return [address.addressLine1, address.addressLine2, address.city, address.state, address.pincode]
      .filter(Boolean)
      .join(', ') || 'Address details missing';
  };

  // ── Fetch orders ─────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'available') {
        response = await deliveryService.getAvailableOrders();
      } else if (activeTab === 'active') {
        // ✅ FIX: Pass string 'active', NOT object { status: 'active' }
        response = await deliveryService.getMyDeliveries('active');
      } else {
        // ✅ FIX: Pass string 'completed', NOT object { status: 'completed' }
        response = await deliveryService.getMyDeliveries('completed');
      }
      setOrders(response.data.data ?? []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // ── Fetch profile ─────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await deliveryService.getProfile();
      if (data.success) {
        setPartnerData(data.data);
        setStats({ todayEarnings: data.data.earnings?.today || 0 });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchProfile();
  }, [fetchOrders, fetchProfile]);

  // ── GPS Location tracking ─────────────────────────────────────────────────────
  const startLocationTracking = useCallback(() => {
    if (watchRef.current) return; // already running
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by this browser');
      return;
    }

    setLocError(null);
    console.log('📍 Starting GPS tracking...');

    watchRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lng: longitude });

        // ✅ THROTTLE: Only send to backend every 10 seconds (10,000ms)
        const now = Date.now();
        if (now - lastLocationUpdate.current > 10000) { 
            lastLocationUpdate.current = now;
            
            try {
                await deliveryService.updateLocation({ latitude, longitude });
                setSendCount(c => c + 1);
                console.log(`✅ Location sent: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`);
            } catch (err) {
                console.error('❌ Location send failed:', err.response?.data ?? err.message);
            }
        }
      },
      (err) => {
        const msgs = {
          1: 'Location permission denied. Please allow location in browser settings.',
          2: 'Location signal unavailable. Try moving to open area.',
          3: 'Location request timed out.',
        };
        setLocError(msgs[err.code] ?? 'Unknown location error');
        console.error('GPS error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }, []);

  const stopLocationTracking = useCallback(() => {
    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setMyLocation(null);
    setSendCount(0);
  }, []);

  // Auto-start tracking if partner is already online when dashboard loads
  useEffect(() => {
    if (partnerData?.isAvailable && !watchRef.current) {
      startLocationTracking();
    }
    return () => stopLocationTracking();
  }, [partnerData?.isAvailable]);

  // ── Toggle availability ────────────────────────────────────────────────────────
  const toggleAvailability = async () => {
    try {
      await deliveryService.toggleAvailability();
      
      // Optimistic update logic
      const goingOnline = !partnerData?.isAvailable;
      
      // Update local state immediately for UI responsiveness
      setPartnerData(prev => ({ ...prev, isAvailable: goingOnline }));

      if (goingOnline) {
        startLocationTracking();
        toast.success('✅ You are Online! Location sharing started.');
      } else {
        stopLocationTracking();
        toast('⏸️ You are Offline');
      }

      await fetchProfile(); // verify with backend
    } catch (error) {
      toast.error('Failed to update availability');
      console.error(error);
    }
  };

  // ── Order actions ─────────────────────────────────────────────────────────────
  const handleAcceptOrder = async (orderId) => {
    try {
      await deliveryService.acceptOrder(orderId);
      // Start tracking immediately when order is accepted
      if (!watchRef.current) startLocationTracking();
      toast.success('🎉 Order accepted!');
      setActiveTab('active');
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleStatusUpdate = async (orderId, action) => {
    try {
      if (action === 'picked_up') {
        await deliveryService.pickupOrder(orderId);
        toast.success('📦 Order marked as picked up');
      } else if (action === 'out_for_delivery') {
        await deliveryService.startDelivery(orderId);
        toast.success('🚗 Delivery started');
      } else if (action === 'delivered') {
        await deliveryService.completeDelivery(orderId);
        stopLocationTracking(); // stop GPS after delivery complete
        toast.success('🎉 Order delivered!');
        await fetchProfile();
      }
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🚴</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        </div>
      </div>
    );
  }

  const isOnline = partnerData?.isAvailable ?? userProfile?.isAvailable ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Stats Header ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase font-semibold">Today's Earnings</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.todayEarnings}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button
            onClick={toggleAvailability}
            className="text-xs text-indigo-600 font-semibold mt-1 hover:underline"
          >
            Go {isOnline ? 'Offline' : 'Online'}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase font-semibold">Completed</p>
          <p className="text-2xl font-bold text-indigo-600">
            {partnerData?.completedDeliveries ?? 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase font-semibold">Rating</p>
          <p className="text-2xl font-bold text-yellow-500">
            {partnerData?.rating?.average?.toFixed(1) ?? '5.0'} ⭐
          </p>
        </div>
      </div>

      {/* ── Location Status Bar ── */}
      <div className={`mb-6 rounded-xl p-4 flex items-center justify-between ${
        myLocation
          ? 'bg-green-50 border border-green-200'
          : locError
          ? 'bg-red-50 border border-red-200'
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          {myLocation ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  📡 Location sharing active ({sendCount} updates sent)
                </p>
                <p className="text-xs text-green-600">
                  {myLocation.lat.toFixed(5)}, {myLocation.lng.toFixed(5)}
                </p>
              </div>
            </>
          ) : locError ? (
            <>
              <FiWifiOff className="text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">Location error</p>
                <p className="text-xs text-red-600">{locError}</p>
              </div>
            </>
          ) : (
            <>
              <FiWifiOff className="text-gray-400" />
              <p className="text-sm text-gray-600">
                Location sharing off — go Online to start sharing
              </p>
            </>
          )}
        </div>

        {/* Manual retry / start button */}
        {(!myLocation || locError) && isOnline && (
          <button
            onClick={startLocationTracking}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            Start GPS
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
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

      {/* ── Orders List ── */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <FiPackage className="mx-auto h-14 w-14 mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No orders in this category</p>
            {activeTab === 'available' && !isOnline && (
              <p className="text-sm text-gray-400 mt-2">Go Online to receive orders</p>
            )}
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Order header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {order.shop?.name || order.shopId?.name || 'Unknown Shop'}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <FiMapPin className="mr-1 flex-shrink-0" />
                      <span className="truncate max-w-xs">
                        {formatAddress(order.shop?.address || order.shopId?.address)}
                      </span>
                    </p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Order details */}
                <div className="border-t border-b border-gray-50 py-3 my-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Customer</span>
                    <span className="font-medium">
                      {order.customer?.name || order.userId?.name || 'Guest'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order #</span>
                    <span className="font-mono text-gray-700">
                      {order.orderNumber || order._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deliver to</span>
                    <span className="font-medium text-right text-xs max-w-[55%]">
                      {formatAddress(order.deliveryAddress)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-gray-900">
                      ₹{order.pricing?.total || order.totalAmount || 0}
                    </span>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="mt-4 flex gap-3">
                  {activeTab === 'available' && (
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold
                        hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle /> Accept Order
                    </button>
                  )}

                  {activeTab === 'active' && (
                    <>
                      {order.orderStatus === 'assigned_to_delivery' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'picked_up')}
                          className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-medium
                            hover:bg-amber-600 transition"
                        >
                          📦 Confirm Pickup
                        </button>
                      )}
                      {order.orderStatus === 'picked_up' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')}
                          className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-medium
                            hover:bg-blue-600 transition"
                        >
                          🚗 Start Delivery
                        </button>
                      )}
                      {order.orderStatus === 'out_for_delivery' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium
                            hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle /> Mark Delivered
                        </button>
                      )}

                      {/* GPS warning if location is off during active delivery */}
                      {!myLocation && (
                        <button
                          onClick={startLocationTracking}
                          className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200
                            transition flex items-center justify-center"
                          title="Customer cannot see you! Start location sharing."
                        >
                          <FiNavigation className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  )}

                  {/* Call customer button for active deliveries */}
                  {activeTab === 'active' && order.customer?.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                    >
                      <FiPhone className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Location not sharing warning on active orders */}
                {activeTab === 'active' && !myLocation && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <p className="text-xs font-semibold text-amber-800">
                      ⚠️ Customer cannot see your location — click the 📍 button above!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;