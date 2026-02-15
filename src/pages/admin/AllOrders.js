// import React, { useState, useEffect } from 'react';
// import { orderService } from '../../services/api';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';
// import { FiPackage, FiFilter, FiSearch } from 'react-icons/fi';

// const AllOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//   });
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     fetchOrders();
//   }, [page, filters]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const params = { page, limit: 20 };
//       if (filters.status !== 'all') params.status = filters.status;

//       // TODO: replace with backend API later
//       // const { data } = await orderService.getAllOrders(params);
//       // setOrders(data.data || []);

//       setOrders([]); // placeholder
//     } catch (error) {
//       toast.error('Error loading orders');
//       console.error(error);
//     } finally {
//       setLoading(false);
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
//       cancelled: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const statusOptions = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

//   if (loading && orders.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
//           <p className="text-gray-600 mt-2">Monitor all platform orders</p>
//         </div>
//         <div className="text-right">
//           <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
//           <p className="text-sm text-gray-600">Total Orders</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center space-x-2 mb-4">
//           <FiFilter className="text-gray-600" />
//           <h2 className="text-lg font-semibold">Filters</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by order number..."
//                 value={filters.search}
//                 onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//             >
//               {statusOptions.map(status => (
//                 <option key={status} value={status}>
//                   {status === 'all' ? 'All Status' : status.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Orders List */}
//       {orders.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-md p-12 text-center">
//           <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
//           <p className="text-gray-600">Orders will appear here once customers start placing them</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
//                       {order.orderStatus.replace('_', ' ')}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">
//                     {format(new Date(order.createdAt), 'PPpp')}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Shop: <span className="font-medium">{order.shop?.name}</span>
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-indigo-600">₹{order.pricing.total}</p>
//                   <p className="text-sm text-gray-600">{order.items.length} items</p>
//                 </div>
//               </div>

//               <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-600 mb-1">Customer</p>
//                   <p className="font-medium">{order.customer?.name}</p>
//                   <p className="text-xs text-gray-500">{order.customer?.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 mb-1">Payment Method</p>
//                   <p className="font-medium uppercase">{order.paymentMethod}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 mb-1">Delivery Address</p>
//                   <p className="font-medium text-xs">{order.deliveryAddress?.city}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllOrders;




import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FiPackage, FiFilter, FiSearch } from 'react-icons/fi';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = { page, limit: 20 };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const { data } = await orderService.getAllOrders(params);
      setOrders(data.data || []);
    } catch (error) {
      toast.error('Error loading orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => ({
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');

  if (loading && orders.length === 0) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Orders</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 p-2 border rounded"
            placeholder="Search order number"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="p-2 border rounded"
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3>#{order.orderNumber}</h3>
                <span className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </span>
              </div>
              <div>₹{order.pricing.total}</div>
            </div>

            <p>{format(new Date(order.createdAt), 'PPpp')}</p>
            <p>Shop: {order.shopId?.name}</p>
            <p>Customer: {order.userId?.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllOrders;
