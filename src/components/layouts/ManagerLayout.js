import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiHome, FiShoppingBag, FiPackage, FiLogOut, FiStore } from "react-icons/fi";

const ManagerLayout = () => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/manager" className="text-xl font-bold text-indigo-600">
              Manager Panel
            </Link>
            <div className="flex space-x-4">
              <Link to="/manager">Dashboard</Link>
              <Link to="/manager/shops">Shops</Link>
              <Link to="/manager/products">Products</Link>
              <Link to="/manager/orders">Orders</Link>
              <Link to="/">Store</Link>
              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
