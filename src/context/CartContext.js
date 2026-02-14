import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartService.getCart();
      setCart(data.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, variantId = null) => {
    try {
      const { data } = await cartService.addToCart({
        productId,
        quantity,
        variantId,
      });
      setCart(data.data);
      toast.success('Added to cart!');
      return data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error adding to cart';
      toast.error(message);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await cartService.updateCartItem(itemId, { quantity });
      setCart(data.data);
      toast.success('Cart updated!');
      return data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating cart';
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await cartService.removeFromCart(itemId);
      setCart(data.data);
      toast.success('Item removed from cart');
      return data.data;
    } catch (error) {
      toast.error('Error removing item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Error clearing cart');
      throw error;
    }
  };

  const applyCoupon = async (code) => {
    try {
      const { data } = await cartService.applyCoupon(code);
      setCart(data.data);
      toast.success('Coupon applied!');
      return data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid coupon code';
      toast.error(message);
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      const { data } = await cartService.removeCoupon();
      setCart(data.data);
      toast.success('Coupon removed');
      return data.data;
    } catch (error) {
      toast.error('Error removing coupon');
      throw error;
    }
  };

  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
