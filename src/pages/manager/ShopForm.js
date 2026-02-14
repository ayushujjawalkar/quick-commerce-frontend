// // import React from "react";
// // const ShopForm = () => <div className="p-8"><h1>ShopForm</h1></div>;
// // export default ShopForm;




// import React, { useState } from "react";
// import axios from "axios";

// export default function ShopForm() {
//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     category: ""
//   });

//   const handleChange = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async e => {
//     e.preventDefault();
//     await axios.post(
//       "http://localhost:5000/api/shops",
//       form,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       }
//     );
//     alert("Shop Added");
//   };

//   return (
//     <div className="p-6">
//       <h2>Add Shop</h2>
//       <form onSubmit={submit}>
//         <input name="name" placeholder="Shop Name" onChange={handleChange} />
//         <input name="address" placeholder="Address" onChange={handleChange} />
//         <input name="category" placeholder="Category" onChange={handleChange} />
//         <button>Add Shop</button>
//       </form>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shopService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';

const ShopForm = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    contactNumber: '',
    email: '',
    categories: [],
    deliveryRadius: 5,
    minimumOrderAmount: 0,
    deliveryFee: 0,
    estimatedDeliveryTime: 30,
  });

  const categoryOptions = ['grocery', 'pharmacy', 'electronics', 'fashion', 'food', 'books', 'home', 'beauty', 'sports', 'other'];

  useEffect(() => {
    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  const fetchShop = async () => {
    try {
      const { data } = await shopService.getShopDetails(shopId);
      const shop = data.data;
      setFormData({
        name: shop.name,
        description: shop.description || '',
        addressLine1: shop.address.addressLine1,
        addressLine2: shop.address.addressLine2 || '',
        city: shop.address.city,
        state: shop.address.state,
        pincode: shop.address.pincode,
        landmark: shop.address.landmark || '',
        latitude: shop.location.coordinates[1],
        longitude: shop.location.coordinates[0],
        contactNumber: shop.contactNumber,
        email: shop.email,
        categories: shop.categories || [],
        deliveryRadius: shop.deliveryRadius,
        minimumOrderAmount: shop.minimumOrderAmount,
        deliveryFee: shop.deliveryFee,
        estimatedDeliveryTime: shop.estimatedDeliveryTime,
      });
    } catch (error) {
      toast.error('Error loading shop');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast.success('Location captured successfully');
        },
        (error) => {
          toast.error('Unable to get location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setLoading(true);
    try {
      const shopData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      if (shopId) {
        await shopService.updateShop(shopId, shopData);
        toast.success('Shop updated successfully');
      } else {
        await shopService.createShop(shopData);
        toast.success('Shop created successfully');
      }
      navigate('/manager/shops');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving shop');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {shopId ? 'Edit Shop' : 'Create New Shop'}
        </h1>
        <p className="text-gray-600 mt-2">Fill in the details below to {shopId ? 'update' : 'create'} your shop</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="QuickMart Downtown"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="shop@example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe your shop..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories *</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  formData.categories.includes(category)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
              <input
                type="text"
                name="addressLine1"
                required
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Near City Mall"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Near Railway Station"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  required
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  required
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="text-indigo-600 font-medium hover:underline"
            >
              📍 Use Current Location
            </button>
          </div>
        </div>

        {/* Delivery Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
              <input
                type="number"
                name="deliveryRadius"
                value={formData.deliveryRadius}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (₹)</label>
              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
              <input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery Time (mins)</label>
              <input
                type="number"
                name="estimatedDeliveryTime"
                value={formData.estimatedDeliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-xl transition disabled:opacity-50"
          >
            <FiSave />
            <span>{loading ? 'Saving...' : shopId ? 'Update Shop' : 'Create Shop'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/manager/shops')}
            className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <FiX />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopForm;
