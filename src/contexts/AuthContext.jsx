import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authApi.getStoredToken();
    if (token && authApi.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser({ email: "test@tentwenty.com", name: "Hello" });
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const response = await authApi.login(email, password);

    if (response.success) {
      setIsAuthenticated(true);
      setUser(response.user);
    }

    return response;
  };

  const logout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
