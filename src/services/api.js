import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error codes
      if (error.response.status === 401) {
        // Token expired or invalid
        console.error('Authentication error');
        // You can redirect to login here if needed
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (addressId, data) => api.put(`/auth/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`),

};

// Shop Services
export const shopService = {
  getNearbyShops: (params) => api.get('/shops/nearby', { params }),
  getShopDetails: (shopId) => api.get(`/shops/${shopId}`),
  createShop: (data) => api.post('/shops', data),
  updateShop: (shopId, data) => api.put(`/shops/${shopId}`, data),
  deleteShop: (shopId) => api.delete(`/shops/${shopId}`),
  getMyShops: () => api.get('/shops/my-shops/list'),
  getAllShops: (params) => api.get('/shops/admin/all', { params }),
  updateTimings: (shopId, data) => api.put(`/shops/${shopId}/timings`, data),
  toggleVerification: (shopId) => api.patch(`/shops/${shopId}/verify`),
};

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getFeaturedProducts: (params) => api.get('/products/featured', { params }),
  getProductDetails: (productId) => api.get(`/products/${productId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (productId, data) => api.put(`/products/${productId}`, data),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  updateStock: (productId, stock) => api.patch(`/products/${productId}/stock`, { stock }),
  toggleAvailability: (productId) => api.patch(`/products/${productId}/availability`),
  bulkUpdate: (data) => api.patch('/products/bulk-update', data),
};

// Cart Services
export const cartService = {
  getCart: () => api.get('/cart'),
  getCartByShop: () => api.get('/cart/by-shop'),
  addToCart: (data) => api.post('/cart/items', data),
  updateCartItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { couponCode: code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// Order Services
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders', { params }),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
  getShopOrders: (shopId, params) => api.get(`/orders/shop/${shopId}`, { params }),
  updateOrderStatus: (orderId, data) => api.patch(`/orders/${orderId}/status`, data),
  cancelOrder: (orderId, reason) => api.patch(`/orders/${orderId}/cancel`, { reason }),
};

export default api;
