import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, [userProfile]);

  const loadAddresses = () => {
    if (userProfile?.addresses) {
      setAddresses(userProfile.addresses);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await authService.deleteAddress(addressId);
      toast.success("Address deleted successfully");
      await refreshUserProfile(); // reload user profile after delete
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const goToAddAddress = () => {
    navigate("/profile/addresses");
  };

  const goToEditAddress = (addressId) => {
    navigate(`/edit-address/${addressId}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* User Info */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <p><span className="font-semibold">Name:</span> {userProfile?.name}</p>
        <p><span className="font-semibold">Email:</span> {userProfile?.email}</p>
        <p><span className="font-semibold">Phone:</span> {userProfile?.phone || "Not set"}</p>
      </div>

      {/* Addresses */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <button
            onClick={goToAddAddress}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            + Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className="border p-4 rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-semibold capitalize">{addr.type}</p>
                  <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                  {addr.isDefault && <p className="text-green-600 font-semibold">Default</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => goToEditAddress(addr._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
