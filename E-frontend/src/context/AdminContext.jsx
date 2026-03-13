import React, { createContext, useState, useEffect } from 'react'

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsAdminLoggedIn(!!token)
  }, [])

  const login = (token) => {
    localStorage.setItem('adminToken', token)
    setIsAdminLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAdminLoggedIn(false)
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, login, logout, admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}
