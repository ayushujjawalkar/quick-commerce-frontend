
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login, userProfile } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(email, password);

//       // small delay to ensure profile is loaded
//       setTimeout(() => {
//         const profile = JSON.parse(localStorage.getItem("userProfile"));

//         if (profile?.role === "admin") {
//           navigate("/admin");
//         } else if (profile?.role === "shop_manager") {
//           navigate("/manager");
//         } else {
//           navigate("/");
//         }
//       }, 500);

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
//               Welcome Back
//             </h2>
//             <p className="mt-2 text-gray-600">Sign in to your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//               <div className="relative">
//                 <FiMail className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 w-full px-4 py-2 border rounded-lg"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//               <div className="relative">
//                 <FiLock className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 w-full px-4 py-2 border rounded-lg"
//                 />
//               </div>
//             </div>

//             <button type="submit" disabled={loading}
//               className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 text-white">
//               {loading ? <FiLoader className="animate-spin mr-2" /> : "Sign In"}
//             </button>
//           </form>

//           <p className="mt-4 text-center text-sm">
//             No account? <Link to="/signup" className="text-indigo-600">Signup</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);

      const profile = JSON.parse(localStorage.getItem("userProfile"));

      if (profile?.role === "admin") {
        navigate("/admin");
      } 
      else if (profile?.role === "shop_manager") {
        navigate("/manager");
      } 
      else if (profile?.role === "delivery_partner") {
        navigate("/delivery");
      } 
      else if (profile?.role === "customer") {
        navigate("/");
      } 
      else {
        navigate("/"); // fallback
      }

    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 text-white"
            >
              {loading ? <FiLoader className="animate-spin mr-2" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            No account? <Link to="/signup" className="text-indigo-600">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
