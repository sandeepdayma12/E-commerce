import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/instances";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const res = await authAPI.get("/api/user_profile");
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("User profile fetch failed:", err);
      localStorage.removeItem("userToken");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const login = (token) => {
    localStorage.setItem("userToken", token);
    setIsLoggedIn(true);
    setIsAuthLoading(true);
    loadUserProfile();
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setUser(null);
    setIsAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthLoading,
        user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
