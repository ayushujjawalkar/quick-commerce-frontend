import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiFilter, FiShield } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setUsers([]); // placeholder
    } catch (error) {
      toast.error('Error loading users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      customer: 'bg-blue-100 text-blue-700',
      shop_manager: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700',
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  if (loading && users.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform users</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{users.length}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="shop_manager">Shop Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiUsers className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Users will appear here once they register</p>
        </div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-md">
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`px-2 py-1 rounded ${getRoleBadge(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
