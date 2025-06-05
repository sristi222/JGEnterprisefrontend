"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"
import { useCart } from "../context/CartContext"

function Navbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { cartCount } = useCart()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("User")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [availableCategories, setAvailableCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        const formatted = data.map((cat) => ({ id: cat._id, name: cat.name }))
        setAvailableCategories(formatted)
      } catch (err) {
        console.error("Failed to load categories", err)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName("User")
    setShowUserMenu(false)
    navigate("/")
  }

  return (
    <header className="grocery-navbar">
      <div className="grocery-main-navbar">
        <div className="grocery-container">
          <Link to="/" className="grocery-logo" onClick={() => window.scrollTo(0, 0)}>
            <div className="grocery-logo-text">Dinesh Laal's Shop</div>
          </Link>

          <div className="grocery-search-container">
            <form onSubmit={handleSearch} className="grocery-search-bar">
              <div className="grocery-search-icon"></div>
              <input
                type="text"
                placeholder="Search products..."
                className="grocery-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="grocery-nav-actions">
            <Link to="/contact" className="grocery-nav-link" onClick={() => window.scrollTo(0, 0)}>
              Contact Us
            </Link>

            <div className="grocery-order-section">
              <div className="grocery-phone-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="grocery-order-text">
                <div className="grocery-order-label">ORDER AT</div>
                <div className="grocery-order-number">01-4511000</div>
              </div>
            </div>

            <Link to="/cart" className="grocery-cart-icon" onClick={() => window.scrollTo(0, 0)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="grocery-cart-count">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grocery-categories-nav">
        <div className="grocery-container">
          <nav className="grocery-categories-list">
            <Link to="/products" className="grocery-category-item" onClick={() => window.scrollTo(0, 0)}>
              All Categories
            </Link>
            {availableCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="grocery-category-item"
                onClick={() => window.scrollTo(0, 0)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
