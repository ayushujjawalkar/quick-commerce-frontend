import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin, FiUser, FiPhone, FiPackage, FiClock } from 'react-icons/fi';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom delivery partner icon
const deliveryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iIzQ2NjVGRiIvPjxwYXRoIGQ9Ik0xNiA4YTIgMiAwIDAgMC0yIDJ2NmEyIDIgMCAwIDAgMiAyaDJhMiAyIDAgMCAwIDItMnYtNmEyIDIgMCAwIDAtMi0yaC0yem0wIDE0YTIgMiAwIDEgMCAwIDQgMiAyIDAgMCAwIDAtNHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LiveOrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await orderService.getOrderDetails(orderId);
      setOrder(data.data);
      
      if (data.data.deliveryPartnerLocation && data.data.deliveryPartnerLocation.coordinates) {
        setDeliveryLocation({
          lat: data.data.deliveryPartnerLocation.coordinates[1],
          lng: data.data.deliveryPartnerLocation.coordinates[0],
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', icon: '✓' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'ready_for_pickup', label: 'Ready', icon: '📦' },
      { key: 'assigned_to_delivery', label: 'Assigned', icon: '🚴' },
      { key: 'picked_up', label: 'Picked Up', icon: '📦' },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚗' },
      { key: 'delivered', label: 'Delivered', icon: '✓' },
    ];

    const currentIndex = steps.findIndex(s => s.key === order?.orderStatus);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600">Unable to track this order</p>
        </div>
      </div>
    );
  }

  const shopLocation = order.shop?.location?.coordinates 
    ? { lat: order.shop.location.coordinates[1], lng: order.shop.location.coordinates[0] }
    : null;

  const customerLocation = order.deliveryAddress?.latitude && order.deliveryAddress?.longitude
    ? { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
    : null;

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Track Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-600">Real-time tracking</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-6">Order Status</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-6">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="relative flex items-center">
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                    step.completed ? 'bg-green-500 border-green-500' : 
                    step.active ? 'bg-indigo-600 border-indigo-600 animate-pulse' : 
                    'bg-gray-200 border-gray-300'
                  }`}>
                    <span className="text-white text-xl">{step.icon}</span>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${step.active ? 'text-indigo-600' : step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.active && (
                      <p className="text-sm text-gray-600">In progress...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Map */}
        {(deliveryLocation || shopLocation || customerLocation) && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">Live Location</h2>
              <p className="text-sm text-gray-600">Track your delivery in real-time</p>
            </div>
            <div className="h-96">
              <MapContainer
                center={deliveryLocation || shopLocation || customerLocation || [19.0760, 72.8777]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {/* Shop Location */}
                {shopLocation && (
                  <Marker position={[shopLocation.lat, shopLocation.lng]}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold">Shop Location</p>
                        <p className="text-sm">{order.shop.name}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Delivery Partner Location */}
                {deliveryLocation && (
                  <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold">Delivery Partner</p>
                        <p className="text-sm">{order.deliveryPartnerName}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Customer Location */}
                {customerLocation && (
                  <Marker position={[customerLocation.lat, customerLocation.lng]}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold">Delivery Address</p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Route line */}
                {deliveryLocation && customerLocation && (
                  <Polyline 
                    positions={[
                      [deliveryLocation.lat, deliveryLocation.lng],
                      [customerLocation.lat, customerLocation.lng]
                    ]} 
                    color="blue"
                    weight={3}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Delivery Partner Info */}
        {order.deliveryPartner && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Delivery Partner</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <FiUser className="text-3xl text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{order.deliveryPartnerName}</p>
                <a href={`tel:${order.deliveryPartnerPhone}`} className="flex items-center space-x-2 text-indigo-600 mt-1">
                  <FiPhone />
                  <span>{order.deliveryPartnerPhone}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Items</span>
              <span className="font-semibold">{order.items.length} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-xl text-indigo-600">₹{order.pricing.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <FiMapPin className="text-indigo-600" />
            <span>Delivery Address</span>
          </h2>
          <p className="text-gray-700">
            {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}
          </p>
          <p className="text-gray-700">
            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </p>
          {order.deliveryAddress.landmark && (
            <p className="text-sm text-gray-600 mt-2">
              Landmark: {order.deliveryAddress.landmark}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveOrderTracking;


