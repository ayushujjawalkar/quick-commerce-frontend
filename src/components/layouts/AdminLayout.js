// import React from "react";
// import { Outlet, Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { FiHome, FiShoppingBag, FiPackage, FiLogOut, FiStore } from "react-icons/fi";

// const AdminLayout = () => {
//   const { logout, userProfile } = useAuth();
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <Link to="/admin" className="text-xl font-bold text-indigo-600">
//               Admin Panel
//             </Link>
//             <div className="flex space-x-4">
//               <Link to="/admin">Dashboard</Link>
//               <Link to="/admin/shops">Shops</Link>
//               <Link to="/admin/orders">Orders</Link>
//               <Link to="/">Store</Link>
//               <button onClick={handleLogout} className="text-red-600">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;


import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// ✅ Fixed imports: Removed FiStore, added FiGrid and FiExternalLink
import { 
  FiHome, 
  FiShoppingBag, 
  FiPackage, 
  FiLogOut, 
  FiTruck, 
  FiGrid, 
  FiExternalLink 
} from "react-icons/fi";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                {/* Replaced FiStore with FiGrid */}
                <FiGrid /> Admin Panel
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4 items-center">
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <FiHome /> Dashboard
              </Link>
              
              <Link 
                to="/admin/shops" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <FiShoppingBag /> Shops
              </Link>
              
              <Link 
                to="/admin/orders" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <FiPackage /> Orders
              </Link>

              {/* Delivery Partners Link */}
              <Link 
                to="/admin/delivery-partners" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <FiTruck /> Delivery Partners
              </Link>

              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                {/* Replaced FiStore with FiExternalLink */}
                <FiExternalLink /> Storefront
              </Link>
            </div>

            {/* Logout Button */}
            <div className="flex items-center">
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;