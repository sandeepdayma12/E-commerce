import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/instances";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    try {
      const res = await authAPI.get("/api/user_profile");
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("User profile fetch failed:", err);
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    loadUserProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
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
