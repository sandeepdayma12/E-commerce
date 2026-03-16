import React, { createContext, useState, useEffect, useCallback } from 'react'
import { adminAPI } from "../api/instances";

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const token = localStorage.getItem('adminToken')
    return !!token
  })
  const [admin, setAdmin] = useState(null)
  const [isAdminAuthLoading, setIsAdminAuthLoading] = useState(true)

  const refreshAdminToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("adminToken");
      const res = await adminAPI.post("/token/refresh", {
        refresh_token: refreshToken,
      });
      const newToken = res.data?.access_token;
      if (!newToken) return null;
      localStorage.setItem("adminToken", newToken);
      return newToken;
    } catch (err) {
      console.error("Admin token refresh failed:", err);
      return null;
    }
  }, []);

  const loadAdminProfile = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setIsAdminLoggedIn(false)
      setAdmin(null)
      setIsAdminAuthLoading(false)
      return
    }

    try {
      const res = await adminAPI.get("/api/admin_profile")
      setAdmin(res.data)
      setIsAdminLoggedIn(true)
    } catch (err) {
      console.error("Admin profile fetch failed:", err)
      const refreshed = await refreshAdminToken()
      if (refreshed) {
        try {
          const res = await adminAPI.get("/api/admin_profile")
          setAdmin(res.data)
          setIsAdminLoggedIn(true)
        } catch (retryErr) {
          console.error("Admin profile retry failed:", retryErr)
          localStorage.removeItem('adminToken')
          setAdmin(null)
          setIsAdminLoggedIn(false)
        }
      } else {
        localStorage.removeItem('adminToken')
        setAdmin(null)
        setIsAdminLoggedIn(false)
      }
    } finally {
      setIsAdminAuthLoading(false)
    }
  }, [refreshAdminToken])

  useEffect(() => {
    loadAdminProfile()
  }, [loadAdminProfile])

  const login = (token) => {
    localStorage.setItem('adminToken', token)
    setIsAdminLoggedIn(true)
    setIsAdminAuthLoading(true)
    loadAdminProfile()
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAdminLoggedIn(false)
    setAdmin(null)
    setIsAdminAuthLoading(false)
  }

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, isAdminAuthLoading, login, logout, admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}
