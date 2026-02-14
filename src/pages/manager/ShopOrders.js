import React, { useState, useEffect } from 'react';
import { shopService, orderService } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ShopOrders = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) fetchOrders();
  }, [selectedShop, statusFilter]);

  const fetchShops = async () => {
    try {
      const { data } = await shopService.getMyShops();
      const shopsList = data.data || [];
      setShops(shopsList);
      if (shopsList.length > 0) setSelectedShop(shopsList[0]._id);
    } catch (error) {
      toast.error('Error loading shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const { data } = await orderService.getShopOrders(selectedShop, params);
      setOrders(data.data || []);
    } catch (error) {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready_for_pickup: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];

  if (loading && shops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shop Orders</h1>

      {shops.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-xl text-gray-600">Create a shop first to manage orders</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Shop</label>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), 'PPpp')}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-semibold">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        ₹{order.pricing.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-semibold">
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {order.orderStatus !== 'delivered' &&
                    order.orderStatus !== 'cancelled' && (
                      <div className="mt-4 pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">
                          Update Status:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {statuses
                            .filter(
                              (s) =>
                                statuses.indexOf(s) >
                                statuses.indexOf(order.orderStatus)
                            )
                            .map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusUpdate(order._id, status)
                                }
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                              >
                                {status.replace('_', ' ')}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopOrders;
