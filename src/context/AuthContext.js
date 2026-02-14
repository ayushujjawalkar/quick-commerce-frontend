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

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         try {
//           // Fetch user profile from backend
//           const { data } = await authService.getProfile();
//           setUserProfile(data.data);
//         } catch (error) {
//           console.error('Error fetching profile:', error);
//           // If user not in backend, register them
//           if (error.response?.status === 404) {
//             try {
//               await authService.register({
//                 firebaseUid: firebaseUser.uid,
//                 email: firebaseUser.email,
//                 name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
//                 phone: firebaseUser.phoneNumber || '',
//               });
//               const { data } = await authService.getProfile();
//               setUserProfile(data.data);
//             } catch (regError) {
//               console.error('Error registering user:', regError);
//             }
//           }
//         }
//       } else {
//         setUser(null);
//         setUserProfile(null);
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       toast.success('Login successful!');
//       return userCredential;
//     } catch (error) {
//       const errorMessage = getErrorMessage(error.code);
//       toast.error(errorMessage);
//       throw error;
//     }
//   };

//   const signup = async (email, password, name, phone) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Register in backend
//       await authService.register({
//         firebaseUid: userCredential.user.uid,
//         email: email,
//         name: name,
//         phone: phone || '',
//       });

//       toast.success('Account created successfully!');
//       return userCredential;
//     } catch (error) {
//       const errorMessage = getErrorMessage(error.code);
//       toast.error(errorMessage);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setUserProfile(null);
//       toast.success('Logged out successfully');
//     } catch (error) {
//       toast.error('Error logging out');
//       throw error;
//     }
//   };

//   const refreshProfile = async () => {
//     try {
//       const { data } = await authService.getProfile();
//       setUserProfile(data.data);
//     } catch (error) {
//       console.error('Error refreshing profile:', error);
//     }
//   };

//   const getErrorMessage = (code) => {
//     const messages = {
//       'auth/invalid-email': 'Invalid email address',
//       'auth/user-disabled': 'This account has been disabled',
//       'auth/user-not-found': 'No account found with this email',
//       'auth/wrong-password': 'Incorrect password',
//       'auth/email-already-in-use': 'Email already in use',
//       'auth/weak-password': 'Password should be at least 6 characters',
//       'auth/invalid-credential': 'Invalid email or password',
//     };
//     return messages[code] || 'An error occurred';
//   };

//   const value = {
//     user,
//     userProfile,
//     loading,
//     login,
//     signup,
//     logout,
//     refreshProfile,
//     isCustomer: userProfile?.role === 'customer',
//     isShopManager: userProfile?.role === 'shop_manager',
//     isAdmin: userProfile?.role === 'admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const { data } = await authService.getProfile();
          setUserProfile(data.data);
          localStorage.setItem("userProfile", JSON.stringify(data.data));
        } catch (error) {
          if (error.response?.status === 404) {
            await authService.register({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              phone: firebaseUser.phoneNumber || '',
            });
            const { data } = await authService.getProfile();
            setUserProfile(data.data);
            localStorage.setItem("userProfile", JSON.stringify(data.data));
          }
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

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful");
    return userCredential;
  };

  const signup = async (email, password, name, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await authService.register({
      firebaseUid: userCredential.user.uid,
      email,
      name,
      phone: phone || ''
    });
    toast.success("Account created");
    return userCredential;
  };

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
      isAdmin: userProfile?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
};
