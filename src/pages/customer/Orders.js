import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/api";
import toast from "react-hot-toast";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderService.getUserOrders();
      setOrders(data?.data || []);
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                {/* Order Header */}
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="font-semibold">Order ID</p>
                    <p className="text-sm text-gray-600">{order._id}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{item.finalPrice}</span>
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between mt-4 border-t pt-3">
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-bold text-lg">
                    ₹{order.pricing.total}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-2 text-sm text-gray-500">
                  Payment: {order.paymentMethod} ({order.paymentStatus})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
