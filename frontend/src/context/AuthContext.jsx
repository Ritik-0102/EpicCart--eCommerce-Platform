import React, { createContext, useState, useEffect } from 'react';

// Create a Context object. This will be used by other components to access auth state.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // When the app starts, check if there's a saved token in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // Function to call when user logs in or registers
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    
    // Save to localStorage so they stay logged in if they refresh the page
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  };

  // Function to call when user logs out
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear from storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

