// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { shopService, orderService } from '../../services/api';
// import { FiStore, FiPackage, FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalShops: 0,
//     verifiedShops: 0,
//     pendingShops: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//   });
//   const [recentShops, setRecentShops] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all shops
//       const shopsRes = await shopService.getAllShops({ page: 1, limit: 100 });
//       const shops = shopsRes.data.data || [];
      
//       const verifiedCount = shops.filter(s => s.isVerified).length;
//       const pendingCount = shops.filter(s => !s.isVerified).length;

//       setStats({
//         totalShops: shops.length,
//         verifiedShops: verifiedCount,
//         pendingShops: pendingCount,
//         totalOrders: 0, // You can implement this
//         totalRevenue: 0, // You can implement this
//       });

//       setRecentShops(shops.slice(0, 5));
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
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
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         <p className="text-gray-600 mt-2">System overview and management</p>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Total Shops */}
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Shops</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalShops}</p>
//               <p className="text-xs text-gray-500 mt-1">All registered shops</p>
//             </div>
//             <div className="bg-indigo-100 p-3 rounded-lg">
//               <FiStore className="text-3xl text-indigo-600" />
//             </div>
//           </div>
//           <Link to="/admin/shops" className="text-indigo-600 text-sm font-medium mt-4 inline-block hover:underline">
//             Manage shops →
//           </Link>
//         </div>

//         {/* Verified Shops */}
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Verified Shops</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.verifiedShops}</p>
//               <p className="text-xs text-gray-500 mt-1">Active & verified</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <FiActivity className="text-3xl text-green-600" />
//             </div>
//           </div>
//           <div className="text-green-600 text-sm font-medium mt-4 flex items-center">
//             <FiTrendingUp className="mr-1" />
//             <span>{Math.round((stats.verifiedShops / stats.totalShops) * 100) || 0}% of total</span>
//           </div>
//         </div>

//         {/* Pending Verification */}
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Pending Verification</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingShops}</p>
//               <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
//             </div>
//             <div className="bg-yellow-100 p-3 rounded-lg">
//               <FiPackage className="text-3xl text-yellow-600" />
//             </div>
//           </div>
//           <Link to="/admin/shops?filter=unverified" className="text-yellow-600 text-sm font-medium mt-4 inline-block hover:underline">
//             Review now →
//           </Link>
//         </div>

//         {/* Total Orders */}
//         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Platform Revenue</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
//               <p className="text-xs text-gray-500 mt-1">Total earnings</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <FiDollarSign className="text-3xl text-blue-600" />
//             </div>
//           </div>
//           <Link to="/admin/orders" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
//             View orders →
//           </Link>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link
//             to="/admin/shops?filter=unverified"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition"
//           >
//             <FiStore className="text-2xl text-indigo-600" />
//             <div>
//               <p className="font-medium">Verify Shops</p>
//               <p className="text-xs text-gray-600">{stats.pendingShops} pending</p>
//             </div>
//           </Link>
//           <Link
//             to="/admin/orders"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition"
//           >
//             <FiPackage className="text-2xl text-purple-600" />
//             <div>
//               <p className="font-medium">Monitor Orders</p>
//               <p className="text-xs text-gray-600">All platform orders</p>
//             </div>
//           </Link>
//           <Link
//             to="/admin/users"
//             className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
//           >
//             <FiUsers className="text-2xl text-blue-600" />
//             <div>
//               <p className="font-medium">Manage Users</p>
//               <p className="text-xs text-gray-600">View all users</p>
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Recent Shops */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold">Recently Added Shops</h2>
//           <Link to="/admin/shops" className="text-indigo-600 font-medium hover:underline">
//             View all
//           </Link>
//         </div>

//         {recentShops.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <FiStore className="mx-auto text-5xl mb-3 text-gray-400" />
//             <p>No shops yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {recentShops.map((shop) => (
//               <div key={shop._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
//                     🏪
//                   </div>
//                   <div>
//                     <p className="font-semibold">{shop.name}</p>
//                     <p className="text-sm text-gray-600">{shop.address.city}, {shop.address.state}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   {shop.isVerified ? (
//                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                       ✓ Verified
//                     </span>
//                   ) : (
//                     <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
//                       Pending
//                     </span>
//                   )}
//                   <Link
//                     to={`/admin/shops`}
//                     className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
//                   >
//                     View →
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* System Status */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h3 className="text-lg font-bold mb-4">Shop Categories Distribution</h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Grocery</span>
//               <div className="flex items-center space-x-2">
//                 <div className="w-32 bg-gray-200 rounded-full h-2">
//                   <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
//                 </div>
//                 <span className="text-sm font-medium">70%</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Food</span>
//               <div className="flex items-center space-x-2">
//                 <div className="w-32 bg-gray-200 rounded-full h-2">
//                   <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
//                 </div>
//                 <span className="text-sm font-medium">50%</span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Electronics</span>
//               <div className="flex items-center space-x-2">
//                 <div className="w-32 bg-gray-200 rounded-full h-2">
//                   <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
//                 </div>
//                 <span className="text-sm font-medium">30%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h3 className="text-lg font-bold mb-4">Platform Activity</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between pb-3 border-b">
//               <span className="text-gray-600">Active Shops</span>
//               <span className="text-2xl font-bold text-green-600">{stats.verifiedShops}</span>
//             </div>
//             <div className="flex items-center justify-between pb-3 border-b">
//               <span className="text-gray-600">Inactive Shops</span>
//               <span className="text-2xl font-bold text-gray-400">{stats.totalShops - stats.verifiedShops}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Success Rate</span>
//               <span className="text-2xl font-bold text-indigo-600">
//                 {Math.round((stats.verifiedShops / stats.totalShops) * 100) || 0}%
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopService } from '../../services/api';
import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    verifiedShops: 0,
    pendingShops: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentShops, setRecentShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const shopsRes = await shopService.getAllShops({ page: 1, limit: 100 });
      const shops = shopsRes.data?.data || [];

      const verifiedCount = shops.filter(s => s.isVerified).length;
      const pendingCount = shops.filter(s => !s.isVerified).length;

      setStats({
        totalShops: shops.length,
        verifiedShops: verifiedCount,
        pendingShops: pendingCount,
        totalOrders: 0,
        totalRevenue: 0,
      });

      setRecentShops(shops.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shops</p>
              <p className="text-3xl font-bold">{stats.totalShops}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FiShoppingBag className="text-3xl text-indigo-600" />
            </div>
          </div>
          <Link to="/admin/shops" className="text-indigo-600 text-sm mt-4 inline-block">Manage shops →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified Shops</p>
              <p className="text-3xl font-bold">{stats.verifiedShops}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiActivity className="text-3xl text-green-600" />
            </div>
          </div>
          <div className="text-green-600 text-sm mt-4 flex items-center">
            <FiTrendingUp className="mr-1" />
            {Math.round((stats.verifiedShops / stats.totalShops) * 100) || 0}% active
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Shops</p>
              <p className="text-3xl font-bold">{stats.pendingShops}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiPackage className="text-3xl text-yellow-600" />
            </div>
          </div>
          <Link to="/admin/shops?filter=unverified" className="text-yellow-600 text-sm mt-4 inline-block">Review →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiDollarSign className="text-3xl text-blue-600" />
            </div>
          </div>
          <Link to="/admin/orders" className="text-blue-600 text-sm mt-4 inline-block">View orders →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/shops?filter=unverified" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-indigo-50">
            <FiShoppingBag className="text-2xl text-indigo-600" />
            <div>
              <p className="font-medium">Verify Shops</p>
              <p className="text-xs text-gray-600">{stats.pendingShops} pending</p>
            </div>
          </Link>

          <Link to="/admin/orders" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-purple-50">
            <FiPackage className="text-2xl text-purple-600" />
            <div>
              <p className="font-medium">Monitor Orders</p>
              <p className="text-xs text-gray-600">All orders</p>
            </div>
          </Link>

          <Link to="/admin/users" className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50">
            <FiUsers className="text-2xl text-blue-600" />
            <div>
              <p className="font-medium">Manage Users</p>
              <p className="text-xs text-gray-600">All users</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Shops */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Shops</h2>
          <Link to="/admin/shops" className="text-indigo-600">View all</Link>
        </div>

        {recentShops.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <FiShoppingBag className="mx-auto text-5xl mb-2 text-gray-400" />
            No shops yet
          </div>
        ) : (
          recentShops.map(shop => (
            <div key={shop._id} className="flex justify-between p-3 border rounded-lg mb-2">
              <div>
                <p className="font-semibold">{shop.name}</p>
                <p className="text-sm text-gray-600">{shop.address?.city}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${shop.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {shop.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
