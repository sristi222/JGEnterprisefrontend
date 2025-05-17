"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"
import { useCart } from "../context/CartContext"

function Navbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { cartCount } = useCart()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Example state for login status
  const [userName, setUserName] = useState("User") // Example state for user name
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle search submission
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
    // Implement your logout logic here, e.g., clear tokens, reset state
    setIsLoggedIn(false)
    setUserName("User")
    setShowUserMenu(false)
    navigate("/") // Redirect to home or login page after logout
  }

  // Available categories from your product data
  const availableCategories = [
    { id: "fruits", name: "Fruits" },
    { id: "vegetables", name: "Vegetables" },
    { id: "snacks", name: "Snacks" },
    { id: "dairy", name: "Dairy Products" },
    { id: "bakery", name: "Bakery" },
    { id: "beverages", name: "Beverages" },
    { id: "dry-fruits", name: "Dry Fruits & Nuts" },
    { id: "spices", name: "Spices" },
    { id: "grains", name: "Grains & Cereals" },
    { id: "chocolate", name: "Chocolate" },
    { id: "honey", name: "Honey" },
    { id: "organic", name: "Organic Foods" },
    { id: "frozen", name: "Frozen Foods" },
    { id: "canned", name: "Canned Foods" },
    { id: "personal-care", name: "Personal Care" },
  ]

  return (
    <header className="grocery-navbar">
      {/* Main navbar */}
      <div className="grocery-main-navbar">
        <div className="grocery-container">
          {/* Logo - Link to homepage */}
          <Link to="/" className="grocery-logo" onClick={() => window.scrollTo(0, 0)}>
            <div className="grocery-logo-text">Dinesh Laal's Shop</div>
          </Link>

          {/* Search Bar */}
          <div className="grocery-search-container">
            <form onSubmit={handleSearch} className="grocery-search-bar">
              <div className="grocery-search-icon">
                
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="grocery-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Side - Order, Cart (Login removed) */}
          <div className="grocery-nav-actions">
            <Link to="/contact" className="grocery-nav-link" onClick={() => window.scrollTo(0, 0)}>
              Contact Us
            </Link>

            <div className="grocery-order-section">
              <div className="grocery-phone-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="grocery-order-text">
                <div className="grocery-order-label">ORDER AT</div>
                <div className="grocery-order-number">01-4511000</div>
              </div>
            </div>

            <Link to="/cart" className="grocery-cart-icon" onClick={() => window.scrollTo(0, 0)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="grocery-cart-count">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation - Only showing available categories */}
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
