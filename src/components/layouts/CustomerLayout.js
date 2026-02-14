import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiSettings } from 'react-icons/fi';

const CustomerLayout = () => {
  const { user, userProfile, logout, isShopManager, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartCount = getCartItemCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiShoppingCart className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QuickCommerce
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Home
              </Link>

              {user && (
                <>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition flex items-center space-x-1"
                  >
                    <FiPackage />
                    <span>Orders</span>
                  </Link>

                  <Link 
                    to="/cart" 
                    className="relative text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    <FiShoppingCart className="text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {(isShopManager || isAdmin) && (
                    <Link 
                      to={isAdmin ? "/admin" : "/manager"} 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition flex items-center space-x-1"
                    >
                      <FiSettings />
                      <span>{isAdmin ? 'Admin Panel' : 'Manager Panel'}</span>
                    </Link>
                  )}

                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">
                      <FiUser />
                      <span>{userProfile?.name || 'Account'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!user && (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600"
              >
                {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/orders" 
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/cart" 
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {(isShopManager || isAdmin) && (
                    <Link 
                      to={isAdmin ? "/admin" : "/manager"} 
                      className="block text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isAdmin ? 'Admin Panel' : 'Manager Panel'}
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left block text-red-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QuickCommerce</h3>
              <p className="text-gray-400">Your neighborhood delivery platform</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/orders" className="text-gray-400 hover:text-white">Orders</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: support@quickcommerce.com</p>
              <p className="text-gray-400">Phone: +91 98765 43210</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 QuickCommerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
