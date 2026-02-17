import React, { useState, useEffect } from 'react';
import { deliveryService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiSearch, FiFilter, FiTruck, FiPhone, FiMail, FiStar } from 'react-icons/fi';

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isVerified: 'all',
    isAvailable: 'all',
  });

  useEffect(() => {
    fetchPartners();
  }, [filters]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
      };

      if (filters.search) params.search = filters.search;
      if (filters.isVerified !== 'all') params.isVerified = filters.isVerified;
      if (filters.isAvailable !== 'all') params.isAvailable = filters.isAvailable;

      const { data } = await deliveryService.getAllPartners(params);
      setPartners(data.data || []);
    } catch (error) {
      toast.error('Error loading delivery partners');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (partnerId, currentStatus) => {
    try {
      await deliveryService.verifyPartner(partnerId);
      toast.success(`Partner ${currentStatus ? 'unverified' : 'verified'} successfully`);
      fetchPartners();
    } catch (error) {
      toast.error('Error updating partner verification');
      console.error(error);
    }
  };

  const vehicleIcons = {
    bike: '🏍️',
    scooter: '🛵',
    bicycle: '🚲',
    car: '🚗',
  };

  if (loading && partners.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Delivery Partners</h1>
          <p className="text-gray-600 mt-2">Manage and verify delivery partners</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{partners.length}</p>
          <p className="text-sm text-gray-600">Total Partners</p>
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
                placeholder="Search by name, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
            <select
              value={filters.isVerified}
              onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Partners</option>
              <option value="true">Verified Only</option>
              <option value="false">Pending Verification</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={filters.isAvailable}
              onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="true">Available</option>
              <option value="false">Busy</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              Verified: <span className="font-semibold">{partners.filter(p => p.isVerified).length}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">
              Pending: <span className="font-semibold">{partners.filter(p => !p.isVerified).length}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              Online: <span className="font-semibold">{partners.filter(p => p.isOnline).length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiTruck className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No delivery partners found</h3>
          <p className="text-gray-600">Partners will appear here once they register</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div key={partner._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {/* Partner Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <FiTruck className="text-3xl text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{partner.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <FiStar className="text-yellow-300 fill-current" />
                        <span className="text-sm">{partner.rating.average?.toFixed(1) || '5.0'}</span>
                      </div>
                    </div>
                  </div>
                  {partner.isOnline && (
                    <span className="px-2 py-1 bg-green-400 text-white text-xs rounded-full font-medium">
                      Online
                    </span>
                  )}
                </div>
              </div>

              {/* Partner Details */}
              <div className="p-5">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {partner.isVerified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      ⏳ Pending
                    </span>
                  )}
                  {partner.isAvailable ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Busy
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiMail className="text-indigo-600" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiPhone className="text-indigo-600" />
                    <span>{partner.phone}</span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Vehicle</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{vehicleIcons[partner.vehicleType] || '🚗'}</span>
                        <div>
                          <p className="font-semibold text-sm capitalize">{partner.vehicleType}</p>
                          <p className="text-xs text-gray-600">{partner.vehicleNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-indigo-50 rounded-lg">
                    <p className="text-xl font-bold text-indigo-600">{partner.completedDeliveries}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-xl font-bold text-purple-600">{partner.totalDeliveries}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">₹{partner.earnings.total}</p>
                    <p className="text-xs text-gray-600">Earned</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Documents</p>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p>DL: {partner.drivingLicense}</p>
                    <p>Aadhar: {partner.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {partner.isVerified ? (
                    <button
                      onClick={() => handleVerify(partner._id, true)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      <FiX />
                      <span>Unverify</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerify(partner._id, false)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition font-medium"
                    >
                      <FiCheck />
                      <span>Verify</span>
                    </button>
                  )}
                </div>

                {/* Registration Date */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  Joined {new Date(partner.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPartners;
