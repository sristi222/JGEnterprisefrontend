"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./Navbar.css"

function Navbar() {
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Check login status on component mount and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const storedUserName = localStorage.getItem("userName") || "User"

      setIsLoggedIn(loggedIn)
      setUserName(storedUserName)
    }

    // Check initially
    checkLoginStatus()

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener("storage", checkLoginStatus)

    // Create a custom event listener for login state changes within the same tab
    window.addEventListener("loginStateChanged", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("loginStateChanged", checkLoginStatus)
    }
  }, [])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Handle logout
  const handleLogout = () => {
    // Keep remember me settings if needed
    const rememberMe = localStorage.getItem("rememberMe") === "true"
    const userMobile = localStorage.getItem("userMobile")
    const userPassword = localStorage.getItem("userPassword")

    // Clear localStorage except remember me data if enabled
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")

    if (!rememberMe) {
      localStorage.removeItem("userMobile")
      localStorage.removeItem("userPassword")
      localStorage.removeItem("rememberMe")
    }

    setIsLoggedIn(false)
    setUserName("")
    setShowUserMenu(false)

    // Redirect to home page
    navigate("/")
  }

  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
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
    <header className="navbar">
      {/* Main navbar */}
      <div className="main-navbar">
        <div className="container">
          {/* Logo - Link to homepage */}
          <Link to="/" className="logo" onClick={() => window.scrollTo(0, 0)}>
            <div className="logo-text">Dinesh Laal's Shop</div>
          </Link>

          {/* Search Bar */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-bar">
              <div className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Side - Order, Cart, Login */}
          <div className="nav-actions">
            <Link to="/contact" className="nav-link" onClick={() => window.scrollTo(0, 0)}>
              Contact Us
            </Link>

            <div className="order-section">
              <div className="phone-icon">
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
              <div className="order-text">
                <div className="order-label">ORDER AT</div>
                <div className="order-number">01-4511000</div>
              </div>
            </div>

            <Link to="/cart" className="cart-icon" onClick={() => window.scrollTo(0, 0)}>
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
              <span className="cart-count">{cartCount}</span>
            </Link>

            {isLoggedIn ? (
              <div className="user-menu-container">
                <button className="user-menu-button" onClick={toggleUserMenu}>
                  <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
                  <span className="user-name">{userName}</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-button" onClick={() => window.scrollTo(0, 0)}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Categories Navigation - Only showing available categories */}
      <div className="categories-nav">
        <div className="container">
          <nav className="categories-list">
            <Link to="/products" className="category-item" onClick={() => window.scrollTo(0, 0)}>
              All Categories
            </Link>
            {availableCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-item"
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
