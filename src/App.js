


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import CustomerLayout from './components/layouts/CustomerLayout';
import ManagerLayout from './components/layouts/ManagerLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DeliveryPartnerSignup from './pages/auth/DeliveryPartnerSignup'; // ✅ KEEP THIS ONE

// Customer Pages
import Home from './pages/customer/Home';
import ShopDetails from './pages/customer/ShopDetails';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';
import LiveOrderTracking from './pages/customer/LiveOrderTracking';
import Profile from './pages/customer/Profile';
import AddAddress from "./pages/customer/AddAddress";

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import MyShops from './pages/manager/MyShops';
import ShopForm from './pages/manager/ShopForm';
import Products from './pages/manager/Products';
import ProductForm from './pages/manager/ProductForm';
import ShopOrders from './pages/manager/ShopOrders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AllShops from './pages/admin/AllShops';
import AllOrders from './pages/admin/AllOrders';
import Users from './pages/admin/Users';
import DeliveryPartners from './pages/admin/DeliveryPartners';

// Delivery Pages
import DeliveryPartnerDashboard from './pages/delivery/Dashboard';
// ❌ DELETE LINE 271 - DeliveryPartnerSignup already imported above!

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* ✅ Delivery Partner Signup (Public Route - Outside AuthLayout) */}
            <Route path="/delivery-signup" element={<DeliveryPartnerSignup />} />

            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop/:shopId" element={<ShopDetails />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/track/:orderId" element={<ProtectedRoute><LiveOrderTracking /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            {/* Address Routes */}
            <Route path="/profile/addresses" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />
            <Route path="/edit-address/:addressId" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />

            {/* Manager Routes */}
            <Route path="/manager" element={<ProtectedRoute requiredRole="shop_manager"><ManagerLayout /></ProtectedRoute>}>
              <Route index element={<ManagerDashboard />} />
              <Route path="shops" element={<MyShops />} />
              <Route path="shops/new" element={<ShopForm />} />
              <Route path="shops/edit/:shopId" element={<ShopForm />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:productId" element={<ProductForm />} />
              <Route path="orders" element={<ShopOrders />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="shops" element={<AllShops />} />
              <Route path="orders" element={<AllOrders />} />
              <Route path="users" element={<Users />} />
              <Route path="delivery-partners" element={<DeliveryPartners />} />
            </Route>

            {/* Delivery Partner Routes */}
            <Route path="/delivery" element={<ProtectedRoute requiredRole="delivery_partner"><DeliveryPartnerDashboard /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;