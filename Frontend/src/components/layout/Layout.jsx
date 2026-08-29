import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import Navbar from '../navbar/Navbar'
import './Layout.css'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-content">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </>
  )
}
