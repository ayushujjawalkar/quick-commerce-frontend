
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { authService } from "../../services/api";
// import toast from "react-hot-toast";

// const AddAddress = () => {
//   const navigate = useNavigate();
//   const { addressId } = useParams(); // 👈 if exists → update mode

//   const [formData, setFormData] = useState({
//     type: "home",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//     latitude: "",
//     longitude: "",
//     isDefault: true
//   });

//   const [loadingLocation, setLoadingLocation] = useState(false);
//   const isEditMode = Boolean(addressId);

//   // Load existing address if editing
//   useEffect(() => {
//     if (isEditMode) {
//       loadExistingAddress();
//     } else {
//       getCurrentLocation();
//     }
//   }, []);

//   const loadExistingAddress = async () => {
//     try {
//       const { data } = await authService.getProfile();
//       const addr = data.data.addresses.find(a => a._id === addressId);

//       if (!addr) {
//         toast.error("Address not found");
//         navigate("/checkout");
//         return;
//       }

//       setFormData({
//         type: addr.type,
//         addressLine1: addr.addressLine1,
//         addressLine2: addr.addressLine2 || "",
//         city: addr.city,
//         state: addr.state,
//         pincode: addr.pincode,
//         landmark: addr.landmark || "",
//         latitude: addr.location.coordinates[1],
//         longitude: addr.location.coordinates[0],
//         isDefault: addr.isDefault
//       });
//     } catch (err) {
//       toast.error("Failed to load address");
//     }
//   };

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation not supported");
//       return;
//     }

//     setLoadingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setFormData((prev) => ({
//           ...prev,
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude
//         }));
//         setLoadingLocation(false);
//       },
//       () => {
//         toast.error("Location permission denied");
//         setLoadingLocation(false);
//       }
//     );
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.latitude || !formData.longitude) {
//       toast.error("Location not detected. Please allow GPS.");
//       return;
//     }

//     try {
//       console.log("Sending address:", formData);

//       if (isEditMode) {
//         await authService.updateAddress(addressId, formData);
//         toast.success("Address updated successfully");
//       } else {
//         await authService.addAddress(formData);
//         toast.success("Address added successfully");
//       }

//       navigate("/checkout");
//     } catch (error) {
//       console.error(error.response?.data);
//       toast.error(error.response?.data?.message || "Validation failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-center">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6">
//           {isEditMode ? "Update Address" : "Add Address"}
//         </h2>

//         <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           className="w-full p-3 border rounded mb-3"
//           required
//         >
//           <option value="home">Home</option>
//           <option value="work">Work</option>
//           <option value="other">Other</option>
//         </select>

//         <input
//           name="addressLine1"
//           value={formData.addressLine1}
//           onChange={handleChange}
//           placeholder="Address Line 1"
//           className="w-full p-3 border rounded mb-3"
//           required
//         />

//         <input
//           name="addressLine2"
//           value={formData.addressLine2}
//           onChange={handleChange}
//           placeholder="Address Line 2"
//           className="w-full p-3 border rounded mb-3"
//         />

//         <input
//           name="city"
//           value={formData.city}
//           onChange={handleChange}
//           placeholder="City"
//           className="w-full p-3 border rounded mb-3"
//           required
//         />

//         <input
//           name="state"
//           value={formData.state}
//           onChange={handleChange}
//           placeholder="State"
//           className="w-full p-3 border rounded mb-3"
//           required
//         />

//         <input
//           name="pincode"
//           value={formData.pincode}
//           onChange={handleChange}
//           placeholder="Pincode"
//           className="w-full p-3 border rounded mb-3"
//           required
//         />

//         <input
//           name="landmark"
//           value={formData.landmark}
//           onChange={handleChange}
//           placeholder="Landmark"
//           className="w-full p-3 border rounded mb-3"
//         />

//         <button
//           type="button"
//           onClick={getCurrentLocation}
//           className="w-full bg-gray-200 py-2 rounded mb-3"
//         >
//           {loadingLocation ? "Detecting location..." : "Use My Location 📍"}
//         </button>

//         {formData.latitude && (
//           <p className="text-sm text-green-600 mb-3">
//             Location detected ✔
//           </p>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
//         >
//           {isEditMode ? "Update Address" : "Save Address"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddAddress;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/api";
import toast from "react-hot-toast";
import axios from "axios";

const AddAddress = () => {
  const navigate = useNavigate();
  const { addressId } = useParams(); // edit mode
  const isEditMode = Boolean(addressId);

  const [formData, setFormData] = useState({
    type: "home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    latitude: "",
    longitude: "",
    isDefault: true
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadExistingAddress();
    } else {
      getCurrentLocation();
    }
  }, []);

  // 🔹 Load address for edit
  const loadExistingAddress = async () => {
    try {
      const { data } = await authService.getProfile();
      const addr = data.data.addresses.find(a => a._id === addressId);

      if (!addr) {
        toast.error("Address not found");
        navigate("/checkout");
        return;
      }

      setFormData({
        type: addr.type,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        landmark: addr.landmark || "",
        latitude: addr.location.coordinates[1],
        longitude: addr.location.coordinates[0],
        isDefault: addr.isDefault
      });
    } catch {
      toast.error("Failed to load address");
    }
  };

  // 🔹 GPS Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        await fetchAddressFromCoords(lat, lng);
        setLoadingLocation(false);
      },
      () => {
        toast.error("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  // 🔹 Reverse Geocoding (Lat/Lng → Address)
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const addr = res.data.address;

      setFormData((prev) => ({
        ...prev,
        addressLine1: addr.road || "",
        city: addr.city || addr.town || addr.village || "",
        state: addr.state || "",
        pincode: addr.postcode || "",
        landmark: addr.suburb || ""
      }));
    } catch {
      toast.error("Failed to fetch address from location");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      toast.error("Location not detected. Please allow GPS.");
      return;
    }

    try {
      if (isEditMode) {
        await authService.updateAddress(addressId, formData);
        toast.success("Address updated successfully");
      } else {
        await authService.addAddress(formData);
        toast.success("Address added successfully");
      }

      navigate("/checkout");
    } catch (error) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Validation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? "Update Address" : "Add Address"}
        </h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-3"
          required
        >
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>

        <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="w-full p-3 border rounded mb-3" required />
        <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" className="w-full p-3 border rounded mb-3" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-3 border rounded mb-3" required />
        <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full p-3 border rounded mb-3" required />
        <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full p-3 border rounded mb-3" required />
        <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark" className="w-full p-3 border rounded mb-3" />

        <button type="button" onClick={getCurrentLocation} className="w-full bg-gray-200 py-2 rounded mb-3">
          {loadingLocation ? "Detecting location..." : "Use My Location 📍"}
        </button>

        {formData.latitude && (
          <p className="text-sm text-green-600 mb-3">Location detected ✔</p>
        )}

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
          {isEditMode ? "Update Address" : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
