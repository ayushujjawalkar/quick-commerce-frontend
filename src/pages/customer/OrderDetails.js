import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../../services/api";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getOrderDetails(orderId);
      setOrder(data.data);
    } catch (error) {
      console.error("Error fetching order:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to fetch order");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading order details...</p>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Order #{order.orderNumber}</h2>
          <p className="text-gray-600">Status: <span className="font-semibold">{order.orderStatus}</span></p>
          <p className="text-gray-600">Payment: <span className="font-semibold">{order.paymentStatus}</span> ({order.paymentMethod})</p>
          <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <p>{order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}</p>
          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
          {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center space-x-4">
                {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.variantName && <p className="text-gray-500 text-sm">{item.variantName}: {item.variantValue}</p>}
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">₹{item.finalPrice}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.pricing.subtotal}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>- ₹{order.pricing.discount}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.pricing.tax}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{order.pricing.deliveryFee}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.pricing.total}</span></div>
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Status History</h2>
            <ul className="space-y-2">
              {order.statusHistory.map((status, idx) => (
                <li key={idx} className="border-b py-1">
                  <p><span className="font-semibold">{status.status}</span> at {new Date(status.timestamp).toLocaleString()}</p>
                  {status.note && <p className="text-gray-500 text-sm">Note: {status.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetails;
