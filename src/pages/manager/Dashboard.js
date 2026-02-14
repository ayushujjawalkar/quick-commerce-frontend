// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { shopService, orderService, productService } from '../../services/api';
// import { FiStore, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalShops: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     revenue: 0,
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const shopsRes = await shopService.getMyShops();
//       const shops = shopsRes.data.data;

//       if (shops.length > 0) {
//         // Get products from all shops
//         const productsPromises = shops.map(shop => 
//           productService.getAllProducts({ shopId: shop._id })
//         );
//         const productsResults = await Promise.all(productsPromises);
//         const totalProducts = productsResults.reduce((sum, res) => sum + res.data.data.length, 0);

//         // Get orders from first shop (or aggregate from all)
//         const ordersRes = await orderService.getShopOrders(shops[0]._id, { limit: 5 });
//         const orders = ordersRes.data.data;

//         // Calculate revenue
//         const revenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);

//         setStats({
//           totalShops: shops.length,
//           totalProducts: totalProducts,
//           totalOrders: orders.length,
//           revenue: revenue,
//         });

//         setRecentOrders(orders.slice(0, 5));
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       preparing: 'bg-purple-100 text-purple-800',
//       out_for_delivery: 'bg-indigo-100 text-indigo-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
//         <p className="text-gray-600 mt-2">Welcome back! Here's your business overview</p>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Shops</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalShops}</p>
//             </div>
//             <div className="bg-indigo-100 p-3 rounded-lg">
//               <FiStore className="text-3xl text-indigo-600" />
//             </div>
//           </div>
//           <Link to="/manager/shops" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:underline">
//             View all shops →
//           </Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Products</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <FiShoppingBag className="text-3xl text-purple-600" />
//             </div>
//           </div>
//           <Link to="/manager/products" className="text-purple-600 text-sm font-medium mt-4 inline-block hover:underline">
//             Manage products →
//           </Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Recent Orders</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <FiPackage className="text-3xl text-blue-600" />
//             </div>
//           </div>
//           <Link to="/manager/orders" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
//             View orders →
//           </Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.revenue.toFixed(2)}</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <FiDollarSign className="text-3xl text-green-600" />
//             </div>
//           </div>
//           <div className="flex items-center text-green-600 text-sm font-medium mt-4">
//             <FiTrendingUp className="mr-1" />
//             <span>+12.5% from last month</span>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link
//             to="/manager/shops/new"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
//           >
//             <FiStore className="text-2xl text-indigo-600" />
//             <span className="font-medium">Add New Shop</span>
//           </Link>
//           <Link
//             to="/manager/products/new"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition"
//           >
//             <FiShoppingBag className="text-2xl text-purple-600" />
//             <span className="font-medium">Add New Product</span>
//           </Link>
//           <Link
//             to="/manager/orders"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
//           >
//             <FiPackage className="text-2xl text-blue-600" />
//             <span className="font-medium">View All Orders</span>
//           </Link>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold">Recent Orders</h2>
//           <Link to="/manager/orders" className="text-indigo-600 font-medium hover:underline">
//             View all
//           </Link>
//         </div>

//         {recentOrders.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <FiPackage className="mx-auto text-5xl mb-3 text-gray-400" />
//             <p>No orders yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {recentOrders.map((order) => (
//               <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
//                 <div className="flex-1">
//                   <p className="font-semibold">Order #{order.orderNumber}</p>
//                   <p className="text-sm text-gray-600">{order.items.length} items</p>
//                 </div>
//                 <div className="text-right mr-4">
//                   <p className="font-bold text-indigo-600">₹{order.pricing.total}</p>
//                   <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
//                   {order.orderStatus.replace('_', ' ')}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopService, orderService, productService } from '../../services/api';
import { FiHome, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const shopsRes = await shopService.getMyShops();
      const shops = shopsRes.data.data;

      if (shops.length > 0) {
        const productsPromises = shops.map(shop =>
          productService.getAllProducts({ shopId: shop._id })
        );
        const productsResults = await Promise.all(productsPromises);
        const totalProducts = productsResults.reduce((sum, res) => sum + res.data.data.length, 0);

        const ordersRes = await orderService.getShopOrders(shops[0]._id, { limit: 5 });
        const orders = ordersRes.data.data;

        const revenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);

        setStats({
          totalShops: shops.length,
          totalProducts,
          totalOrders: orders.length,
          revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your business overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Shops</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalShops}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FiHome className="text-3xl text-indigo-600" />
            </div>
          </div>
          <Link to="/manager/shops" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:underline">
            View all shops →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiShoppingBag className="text-3xl text-purple-600" />
            </div>
          </div>
          <Link to="/manager/products" className="text-purple-600 text-sm font-medium mt-4 inline-block hover:underline">
            Manage products →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Recent Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiPackage className="text-3xl text-blue-600" />
            </div>
          </div>
          <Link to="/manager/orders" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
            View orders →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.revenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiDollarSign className="text-3xl text-green-600" />
            </div>
          </div>
          <div className="flex items-center text-green-600 text-sm font-medium mt-4">
            <FiTrendingUp className="mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/manager/shops/new" className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition">
            <FiHome className="text-2xl text-indigo-600" />
            <span className="font-medium">Add New Shop</span>
          </Link>
          <Link to="/manager/products/new" className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition">
            <FiShoppingBag className="text-2xl text-purple-600" />
            <span className="font-medium">Add New Product</span>
          </Link>
          <Link to="/manager/orders" className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition">
            <FiPackage className="text-2xl text-blue-600" />
            <span className="font-medium">View All Orders</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/manager/orders" className="text-indigo-600 font-medium hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="mx-auto text-5xl mb-3 text-gray-400" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                <div className="flex-1">
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.items.length} items</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-indigo-600">₹{order.pricing.total}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
