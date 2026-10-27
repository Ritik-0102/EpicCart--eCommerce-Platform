// AuthContext: global authentication state management for logged-in users and admins
import React, { createContext, useState, useEffect } from 'react';

// Create the Context object used by consumer components via useContext(AuthContext)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronously initialize user state from localStorage so the session persists across page reloads
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Synchronously initialize the JWT token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Function called upon successful login or registration
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    
    // Save to browser localStorage so user stays logged in if they refresh or reopen the tab
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  };

  // Function called when the user signs out
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear credentials from browser storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Broadcast authentication state and helper functions to all child components
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
