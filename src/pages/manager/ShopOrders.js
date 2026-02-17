// import React, { useState, useEffect } from 'react';
// import { shopService, orderService } from '../../services/api';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';

// const ShopOrders = () => {
//   const [shops, setShops] = useState([]);
//   const [selectedShop, setSelectedShop] = useState('');
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   useEffect(() => {
//     if (selectedShop) fetchOrders();
//   }, [selectedShop, statusFilter]);

//   const fetchShops = async () => {
//     try {
//       const { data } = await shopService.getMyShops();
//       const shopsList = data.data || [];
//       setShops(shopsList);
//       if (shopsList.length > 0) setSelectedShop(shopsList[0]._id);
//     } catch (error) {
//       toast.error('Error loading shops');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const params = statusFilter !== 'all' ? { status: statusFilter } : {};
//       const { data } = await orderService.getShopOrders(selectedShop, params);
//       setOrders(data.data || []);
//     } catch (error) {
//       toast.error('Error loading orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await orderService.updateOrderStatus(orderId, { status: newStatus });
//       toast.success('Order status updated');
//       fetchOrders();
//     } catch (error) {
//       toast.error('Error updating order');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       preparing: 'bg-purple-100 text-purple-800',
//       ready_for_pickup: 'bg-indigo-100 text-indigo-800',
//       out_for_delivery: 'bg-cyan-100 text-cyan-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const statuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];

//   if (loading && shops.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Shop Orders</h1>

//       {shops.length === 0 ? (
//         <div className="bg-white rounded-xl p-12 text-center">
//           <p className="text-xl text-gray-600">Create a shop first to manage orders</p>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Select Shop</label>
//               <select
//                 value={selectedShop}
//                 onChange={(e) => setSelectedShop(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg"
//               >
//                 {shops.map((shop) => (
//                   <option key={shop._id} value={shop._id}>
//                     {shop.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Filter by Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg"
//               >
//                 <option value="all">All Orders</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="preparing">Preparing</option>
//                 <option value="delivered">Delivered</option>
//               </select>
//             </div>
//           </div>

//           {orders.length === 0 ? (
//             <div className="bg-white rounded-xl p-12 text-center">
//               <div className="text-6xl mb-4">📦</div>
//               <p className="text-xl text-gray-600">No orders found</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {orders.map((order) => (
//                 <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
//                       <p className="text-sm text-gray-600">
//                         {format(new Date(order.createdAt), 'PPpp')}
//                       </p>
//                     </div>

//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                         order.orderStatus
//                       )}`}
//                     >
//                       {order.orderStatus.replace('_', ' ')}
//                     </span>
//                   </div>

//                   <div className="border-t pt-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Items:</span>
//                       <span className="font-semibold">{order.items.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total:</span>
//                       <span className="font-bold text-lg text-indigo-600">
//                         ₹{order.pricing.total}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Payment:</span>
//                       <span className="font-semibold">
//                         {order.paymentMethod.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>

//                   {order.orderStatus !== 'delivered' &&
//                     order.orderStatus !== 'cancelled' && (
//                       <div className="mt-4 pt-4 border-t">
//                         <label className="block text-sm font-medium mb-2">
//                           Update Status:
//                         </label>
//                         <div className="flex flex-wrap gap-2">
//                           {statuses
//                             .filter(
//                               (s) =>
//                                 statuses.indexOf(s) >
//                                 statuses.indexOf(order.orderStatus)
//                             )
//                             .map((status) => (
//                               <button
//                                 key={status}
//                                 onClick={() =>
//                                   handleStatusUpdate(order._id, status)
//                                 }
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
//                               >
//                                 {status.replace('_', ' ')}
//                               </button>
//                             ))}
//                         </div>
//                       </div>
//                     )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ShopOrders;



import React, { useState, useEffect } from 'react';
import { shopService, orderService, deliveryService } from '../../services/api'; // ✅ Added deliveryService
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ShopOrders = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ New State for Assignment
  const [partners, setPartners] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) fetchOrders();
  }, [selectedShop, statusFilter]);

  const fetchShops = async () => {
    try {
      const { data } = await shopService.getMyShops();
      const shopsList = data.data || [];
      setShops(shopsList);
      if (shopsList.length > 0) setSelectedShop(shopsList[0]._id);
    } catch (error) {
      toast.error('Error loading shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const { data } = await orderService.getShopOrders(selectedShop, params);
      setOrders(data.data || []);
    } catch (error) {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // ✅ New: Fetch available delivery partners
  const fetchPartners = async () => {
    try {
      const { data } = await deliveryService.getAllPartners({ isAvailable: true, isVerified: true });
      setPartners(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load delivery partners');
    }
  };

  // ✅ New: Assign partner to order
  const assignPartner = async (partnerId) => {
    try {
      // Assuming you added an assignOrder method to deliveryService in api.js 
      // or using a direct axios call if strictly following previous steps.
      // Based on controller logic: endpoint is likely /delivery/admin/assign or similar
      // For now, using the structure provided in your prompt:
      await deliveryService.assignOrder({ orderId: selectedOrder._id, partnerId }); 
      
      toast.success('Delivery partner assigned successfully');
      setShowAssignModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders to show updated status
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to assign partner');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready_for_pickup: 'bg-indigo-100 text-indigo-800',
      assigned_to_delivery: 'bg-orange-100 text-orange-800', // Added color
      picked_up: 'bg-teal-100 text-teal-800', // Added color
      out_for_delivery: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];

  if (loading && shops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <h1 className="text-3xl font-bold">Shop Orders</h1>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-xl text-gray-600">Create a shop first to manage orders</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Shop</label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="assigned_to_delivery">Assigned</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), 'PPpp')}
                      </p>
                      {/* Show Delivery Partner info if assigned */}
                      {order.deliveryPartnerName && (
                        <p className="text-sm text-orange-600 font-medium mt-1">
                          🚚 {order.deliveryPartnerName} ({order.deliveryPartnerPhone})
                        </p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-semibold">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        ₹{order.pricing.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-semibold">
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 items-center justify-between">
                    
                    {/* ✅ Assign Delivery Partner Button */}
                    {order.orderStatus === 'ready_for_pickup' && !order.deliveryPartner && (
                      <button 
                        onClick={() => { 
                          setSelectedOrder(order); 
                          setShowAssignModal(true); 
                          fetchPartners(); 
                        }} 
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Assign Delivery Partner
                      </button>
                    )}

                    {/* Standard Status Updates */}
                    {order.orderStatus !== 'delivered' &&
                      order.orderStatus !== 'cancelled' && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Quick Update:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {statuses
                              .filter(
                                (s) =>
                                  statuses.indexOf(s) >
                                  statuses.indexOf(order.orderStatus)
                              )
                              .slice(0, 3) // Show next 3 possible statuses
                              .map((status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusUpdate(order._id, status)
                                  }
                                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                                >
                                  {status.replace(/_/g, ' ')}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ✅ Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Assign Delivery Partner</h3>
            
            {partners.length === 0 ? (
               <p className="text-gray-500 text-center py-4">No available partners found.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {partners.map(partner => (
                  <div key={partner._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{partner.name}</p>
                      <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                        <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">{partner.vehicleType}</span>
                        <span>•</span>
                        <span>⭐ {partner.rating?.average?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => assignPartner(partner._id)} 
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => { setShowAssignModal(false); setSelectedOrder(null); }} 
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOrders;