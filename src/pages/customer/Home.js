// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const [shops, setShops] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setShops([]);
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Nearby Shops</h1>
//       <div className="grid grid-cols-3 gap-6">
//         {shops.map((shop) => (
//           <div
//             key={shop._id}
//             onClick={() => navigate(`/shop/${shop._id}`)}
//             className="bg-white p-6 shadow rounded cursor-pointer"
//           >
//             {shop.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiSearch, FiStar, FiClock } from 'react-icons/fi';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ latitude: 19.0760, longitude: 72.8777 });
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Grocery', 'Pharmacy', 'Electronics', 'Fashion', 'Food', 'Books'];

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchNearbyShops();
    }
  }, [location, searchRadius, selectedCategory]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Using default location (Mumbai)');
          fetchNearbyShops();
        }
      );
    } else {
      fetchNearbyShops();
    }
  };

  const fetchNearbyShops = async () => {
    try {
      setLoading(true);
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        maxDistance: searchRadius,
      };
      
      if (selectedCategory && selectedCategory !== 'All') {
        params.categories = selectedCategory.toLowerCase();
      }

      const { data } = await shopService.getNearbyShops(params);
      setShops(data.data || []);
    } catch (error) {
      toast.error('Error loading shops');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading nearby shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Quick Delivery to Your Doorstep
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Find nearby shops and order in minutes
          </p>
          
          {/* Location Display */}
          <div className="bg-white text-gray-800 rounded-lg p-4 inline-flex items-center space-x-3 shadow-lg">
            <FiMapPin className="text-indigo-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-600">Delivering to</p>
              <p className="font-semibold">Your current location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    (category === 'All' && !selectedCategory) || selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Distance Filter */}
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="15">Within 15 km</option>
              <option value="20">Within 20 km</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory} Shops` : 'Nearby Shops'} ({shops.length})
          </h2>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-20">
            <FiSearch className="mx-auto text-7xl text-gray-400 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600 mb-6">
              Try increasing the search radius or changing the category
            </p>
            <button
              onClick={() => {
                setSearchRadius(20);
                setSelectedCategory('');
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                onClick={() => navigate(`/shop/${shop._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {/* Shop Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                  <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    🏪
                  </div>
                  {shop.isVerified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Shop Details */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition">
                    {shop.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {shop.description || 'Quality products delivered fast to your doorstep'}
                  </p>

                  {/* Rating and Distance */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {shop.rating?.average ? shop.rating.average.toFixed(1) : 'New'}
                      </span>
                      {shop.rating?.count > 0 && (
                        <span className="text-gray-500 text-sm">({shop.rating.count})</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <FiMapPin className="text-sm" />
                      <span className="text-sm font-medium">{shop.distance} km</span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <span className="text-gray-600">Min order: </span>
                      <span className="font-semibold text-gray-900">₹{shop.minimumOrderAmount}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-indigo-600">
                      <FiClock />
                      <span className="text-sm font-semibold">{shop.estimatedDeliveryTime} mins</span>
                    </div>
                  </div>

                  {/* Delivery Fee */}
                  {shop.deliveryFee > 0 ? (
                    <p className="text-xs text-gray-500 mt-2">Delivery fee: ₹{shop.deliveryFee}</p>
                  ) : (
                    <p className="text-xs text-green-600 mt-2 font-medium">Free delivery</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
