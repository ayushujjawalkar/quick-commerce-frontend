import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiStar, FiClock } from 'react-icons/fi';

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data } = await shopService.getMyShops();
      setShops(data.data || []);
    } catch (error) {
      toast.error('Error loading shops');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm('Are you sure you want to delete this shop?')) {
      return;
    }

    try {
      await shopService.deleteShop(shopId);
      toast.success('Shop deleted successfully');
      fetchShops();
    } catch (error) {
      toast.error('Error deleting shop');
      console.error(error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Shops</h1>
          <p className="text-gray-600 mt-2">Manage all your shops in one place</p>
        </div>
        <Link
          to="/manager/shops/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-xl transition"
        >
          <FiPlus className="text-xl" />
          <span className="font-semibold">Add New Shop</span>
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops yet</h3>
          <p className="text-gray-600 mb-6">Create your first shop to start selling</p>
          <Link
            to="/manager/shops/new"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            <FiPlus />
            <span>Create Your First Shop</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {/* Shop Header */}
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-6xl">🏪</div>
                {shop.isVerified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Verified
                  </div>
                )}
                {!shop.isActive && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Inactive
                  </div>
                )}
              </div>

              {/* Shop Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <FiStar className="text-yellow-400" />
                      <span>Rating</span>
                    </span>
                    <span className="font-semibold">{shop.rating?.average?.toFixed(1) || 'New'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <FiClock />
                      <span>Delivery</span>
                    </span>
                    <span className="font-semibold">{shop.estimatedDeliveryTime} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <FiMapPin />
                      <span>Radius</span>
                    </span>
                    <span className="font-semibold">{shop.deliveryRadius} km</span>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4 text-xs text-gray-500">
                  <p>{shop.address.city}, {shop.address.state}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/manager/shops/edit/${shop._id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteShop(shop._id)}
                    className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyShops;
