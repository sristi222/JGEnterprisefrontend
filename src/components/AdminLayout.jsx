"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "./AdminLayout.css"

function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".admin-sidebar")
      const toggle = document.querySelector(".mobile-toggle")

      if (sidebar && toggle && !sidebar.contains(event.target) && !toggle.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span className="icon">📦</span>
            <span>Admin Panel</span>
          </Link>
        </div>
        <div className="admin-sidebar-content">
          <Link to="/admin" className={`admin-nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
            <span className="icon">🏠</span>
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/products"
            className={`admin-nav-item ${location.pathname.includes("/admin/products") ? "active" : ""}`}
          >
            <span className="icon">📦</span>
            <span>Products</span>
          </Link>
          <Link
            to="/admin/categories"
            className={`admin-nav-item ${location.pathname.includes("/admin/categories") ? "active" : ""}`}
          >
            <span className="icon">📁</span>
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/hero-slider"
            className={`admin-nav-item ${location.pathname.includes("/admin/hero-slider") ? "active" : ""}`}
          >
            <span className="icon">🖼️</span>
            <span>Hero Slider</span>
          </Link>
        </div>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-logout-btn">
            <span className="icon">🚪</span>
            <span>Back to Site</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">{children}</div>
    </div>
  )
}

export default AdminLayout
