// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user, userProfile, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole) {
//     if (requiredRole === 'shop_manager' && userProfile?.role !== 'shop_manager' && userProfile?.role !== 'admin') {
//       return <Navigate to="/" replace />;
//     }
//     if (requiredRole === 'admin' && userProfile?.role !== 'admin') {
//       return <Navigate to="/" replace />;
//     }
//   }

//   return children;
// };

// export default ProtectedRoute;



import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && userProfile?.role !== requiredRole) {
    if (userProfile?.role === "admin") return <Navigate to="/admin" replace />;
    if (userProfile?.role === "shop_manager") return <Navigate to="/manager" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
