import React, { useState, useEffect } from 'react';
import { shopService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiSearch, FiFilter, FiMapPin, FiStar } from 'react-icons/fi';

const AllShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    verified: 'all',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchShops();
  }, [page, filters]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;

      const { data } = await shopService.getAllShops(params);
      let shopsData = data.data || [];

      // Filter by verification status
      if (filters.verified === 'verified') {
        shopsData = shopsData.filter(s => s.isVerified);
      } else if (filters.verified === 'unverified') {
        shopsData = shopsData.filter(s => !s.isVerified);
      }

      setShops(shopsData);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Error loading shops');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyShop = async (shopId, currentStatus) => {
    try {
      await shopService.toggleVerification(shopId);
      toast.success(`Shop ${currentStatus ? 'unverified' : 'verified'} successfully`);
      fetchShops();
    } catch (error) {
      toast.error('Error updating shop verification');
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPage(1);
  };

  if (loading && shops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Shops</h1>
          <p className="text-gray-600 mt-2">Manage and verify all registered shops</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{shops.length}</p>
          <p className="text-sm text-gray-600">Total Shops</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
            <select
              value={filters.verified}
              onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Shops</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              Verified: <span className="font-semibold">{shops.filter(s => s.isVerified).length}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">
              Pending: <span className="font-semibold">{shops.filter(s => !s.isVerified).length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      {shops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {/* Shop Header */}
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-6xl">🏪</div>
                {shop.isVerified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Verified
                  </div>
                )}
                {!shop.isActive && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Inactive
                  </div>
                )}
              </div>

              {/* Shop Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {shop.description || 'No description provided'}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <FiMapPin className="text-xs" />
                      <span>Location</span>
                    </span>
                    <span className="font-medium text-gray-900">{shop.address.city}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <FiStar className="text-yellow-400" />
                      <span>Rating</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {shop.rating?.average?.toFixed(1) || 'New'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Radius</span>
                    <span className="font-medium text-gray-900">{shop.deliveryRadius} km</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Owner</p>
                  <p className="font-medium text-sm">{shop.owner?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{shop.owner?.email}</p>
                </div>

                {/* Address */}
                <div className="mb-4 text-xs text-gray-500">
                  <p>{shop.address.addressLine1}</p>
                  <p>{shop.address.city}, {shop.address.state} - {shop.address.pincode}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {shop.isVerified ? (
                    <button
                      onClick={() => handleVerifyShop(shop._id, true)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      <FiX />
                      <span>Unverify</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyShop(shop._id, false)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition font-medium"
                    >
                      <FiCheck />
                      <span>Verify</span>
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {shop.categories?.slice(0, 3).map((cat, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllShops;
