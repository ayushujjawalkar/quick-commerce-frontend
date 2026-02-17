import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { deliveryService } from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiTruck, FiFileText, FiCreditCard } from 'react-icons/fi';

const DeliveryPartnerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Vehicle Info
    vehicleType: 'bike',
    vehicleNumber: '',
    
    // Documents
    drivingLicense: '',
    aadharNumber: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        toast.error('Please fill all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    if (step === 2) {
      // Validate step 2
      if (!formData.vehicleNumber) {
        toast.error('Please enter vehicle number');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate step 3
    if (!formData.drivingLicense || !formData.aadharNumber) {
      toast.error('Please fill all document details');
      return;
    }

    if (formData.aadharNumber.length !== 12) {
      toast.error('Aadhar number must be 12 digits');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Step 2: Register delivery partner in backend
      // await deliveryService.register({
      //   firebaseUid: userCredential.user.uid,
      //   name: formData.name,
      //   email: formData.email,
      //   phone: formData.phone,
      //   vehicleType: formData.vehicleType,
      //   vehicleNumber: formData.vehicleNumber,
      //   drivingLicense: formData.drivingLicense,
      //   aadharNumber: formData.aadharNumber,
        
      // });
await deliveryService.register({
  firebaseUid: userCredential.user.uid,
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  vehicleType: formData.vehicleType,
  vehicleNumber: formData.vehicleNumber,
  drivingLicense: formData.drivingLicense,
  aadharNumber: formData.aadharNumber,
  role: "delivery_partner"
});






      toast.success('Registration successful! Waiting for admin verification.');
      
      // Redirect to delivery partner dashboard
      setTimeout(() => {
        navigate('/delivery');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: 'bike', label: '🏍️ Motorcycle', icon: '🏍️' },
    { value: 'scooter', label: '🛵 Scooter', icon: '🛵' },
    { value: 'bicycle', label: '🚲 Bicycle', icon: '🚲' },
    { value: 'car', label: '🚗 Car', icon: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <FiTruck className="text-4xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Become a Delivery Partner</h2>
          <p className="mt-2 text-gray-600">Start earning by delivering orders</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    s === step
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                      : s < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-16 ${
                      s < step ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 px-4">
            <span>Personal Info</span>
            <span>Vehicle Details</span>
            <span>Documents</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      maxLength="10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">10-digit mobile number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      minLength="6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vehicle Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicleTypes.map((vehicle) => (
                      <label
                        key={vehicle.value}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.vehicleType === vehicle.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={vehicle.value}
                          checked={formData.vehicleType === vehicle.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-4xl mb-2">{vehicle.icon}</div>
                        <span className="text-sm font-medium capitalize">
                          {vehicle.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number *
                  </label>
                  <div className="relative">
                    <FiTruck className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="vehicleNumber"
                      required
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                      placeholder="MH12AB1234"
                      pattern="[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: MH12AB1234</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Please ensure you have valid insurance and registration for your vehicle.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Document Verification</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driving License Number *
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="drivingLicense"
                      required
                      value={formData.drivingLicense}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                      placeholder="MH1234567890123"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter your DL number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number *
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="aadharNumber"
                      required
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1234 5678 9012"
                      pattern="[0-9]{12}"
                      maxLength="12"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">12-digit Aadhar number (no spaces)</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Important:</strong> Your documents will be verified by our admin team. You can start accepting orders after verification.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Benefits of being a Delivery Partner:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Flexible working hours</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Earn ₹500-₹1000 per day</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Weekly payouts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">✓</span>
                      <span>Fuel reimbursement</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-600 mt-4">
          By registering, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default DeliveryPartnerSignup;
