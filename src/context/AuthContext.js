


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged
// } from 'firebase/auth';
// import { auth } from '../firebase';
// import { authService } from '../services/api';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         try {
//           const { data } = await authService.getProfile();
//           setUserProfile(data.data);
//           localStorage.setItem("userProfile", JSON.stringify(data.data));
//         } catch (error) {
//           if (error.response?.status === 404) {
//             await authService.register({
//               firebaseUid: firebaseUser.uid,
//               email: firebaseUser.email,
//               name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//               phone: firebaseUser.phoneNumber || '',
//             });
//             const { data } = await authService.getProfile();
//             setUserProfile(data.data);
//             localStorage.setItem("userProfile", JSON.stringify(data.data));
//           }
//         }
//       } else {
//         setUser(null);
//         setUserProfile(null);
//         localStorage.removeItem("userProfile");
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const login = async (email, password) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     toast.success("Login successful");
//     return userCredential;
//   };

//   const signup = async (email, password, name, phone) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     await authService.register({
//       firebaseUid: userCredential.user.uid,
//       email,
//       name,
//       phone: phone || ''
//     });
//     toast.success("Account created");
//     return userCredential;
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setUserProfile(null);
//     localStorage.removeItem("userProfile");
//     toast.success("Logged out");
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       userProfile,
//       loading,
//       login,
//       signup,
//       logout,
//       isCustomer: userProfile?.role === "customer",
//       isShopManager: userProfile?.role === "shop_manager",
//       isAdmin: userProfile?.role === "admin"
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const { data } = await authService.getProfile(); // backend: /auth/me
          setUserProfile(data.data);
          localStorage.setItem("userProfile", JSON.stringify(data.data));
        } catch (error) {
          console.error("Profile fetch error:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem("userProfile");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 LOGIN
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch DB profile after login
    const { data } = await authService.getProfile();
    setUserProfile(data.data);
    localStorage.setItem("userProfile", JSON.stringify(data.data));

    toast.success("Login successful");
    return userCredential;
  };

  // 🔹 SIGNUP
  const signup = async (email, password, name, phone, role = "customer") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await authService.register({
      firebaseUid: userCredential.user.uid,
      email,
      name,
      phone: phone || '',
      role // 👈 IMPORTANT (delivery_partner / customer / etc)
    });

    const { data } = await authService.getProfile();
    setUserProfile(data.data);
    localStorage.setItem("userProfile", JSON.stringify(data.data));

    toast.success("Account created");
    return userCredential;
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem("userProfile");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      signup,
      logout,
      isCustomer: userProfile?.role === "customer",
      isShopManager: userProfile?.role === "shop_manager",
      isAdmin: userProfile?.role === "admin",
      isDeliveryPartner: userProfile?.role === "delivery_partner"
    }}>
      {children}
    </AuthContext.Provider>
  );
};
