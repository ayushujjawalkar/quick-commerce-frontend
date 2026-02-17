// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { FiMail, FiLock, FiUser, FiPhone, FiLoader } from 'react-icons/fi';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     try {
//       await signup(formData.email, formData.password, formData.name, formData.phone);
//       navigate('/');
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Create Account
//             </h2>
//             <p className="mt-2 text-gray-600">Join QuickCommerce today</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//               <div className="relative">
//                 <FiUser className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//               <div className="relative">
//                 <FiMail className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//               <div className="relative">
//                 <FiPhone className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="9876543210"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//               <div className="relative">
//                 <FiLock className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="••••••••"
//                   minLength="6"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
//               <div className="relative">
//                 <FiLock className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-6"
//             >
//               {loading ? (
//                 <>
//                   <FiLoader className="animate-spin mr-2" />
//                   Creating Account...
//                 </>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/api';
import { FiUser, FiMail, FiLock, FiPhone, FiTruck, FiArrowRight } from 'react-icons/fi';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ========================================== */}
      {/* LEFT SIDE: CUSTOMER SIGNUP FORM            */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="John Doe"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="you@example.com"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="9876543210"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="••••••••"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating account...' : 'Sign up'}
                  </button>
                </div>
              </form>

              {/* Mobile Only Link for Delivery (Visible only on small screens) */}
              <div className="mt-6 lg:hidden text-center border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Want to earn extra money?</p>
                <Link to="/delivery-signup" className="text-indigo-600 font-semibold hover:text-indigo-500">
                  Become a Delivery Partner &rarr;
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE: DELIVERY PARTNER PROMO         */}
      {/* ========================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 relative overflow-hidden">
        {/* Background Pattern/Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
              <FiTruck className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              Drive with us &<br />Start Earning!
            </h2>
            
            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Join our fleet of delivery partners. Set your own hours, earn competitive rates, and be your own boss.
            </p>

            <ul className="space-y-4 mb-10 text-indigo-50">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full" />
                <span>Weekly Payouts</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full" />
                <span>Flexible Schedule</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full" />
                <span>Joining Bonus</span>
              </li>
            </ul>

            <Link 
              to="/delivery-signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Become a Partner <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;