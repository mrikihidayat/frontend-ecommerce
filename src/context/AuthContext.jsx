// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));

//   const login = (token) => {
//     sessionStorage.setItem('token', token);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     sessionStorage.removeItem('token');
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);