"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CartSidebar.css"

function CartSidebar() {
  const { cart, cartTotal, showCartSidebar, closeCartSidebar, lastAddedItem } = useCart()
  const sidebarRef = useRef(null)

  // ✅ Normalize image path
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg"
    if (image.startsWith("http")) return image
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`
    return `http://localhost:5000/uploads/${image.replace(/^.*[\\/]/, "")}`
  }

  // ✅ Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeCartSidebar()
      }
    }

    if (showCartSidebar) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCartSidebar, closeCartSidebar])

  if (!showCartSidebar || !lastAddedItem) {
    return null
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="cart-sidebar-overlay">
      <div className="cart-sidebar" ref={sidebarRef}>
        <div className="cart-sidebar-content">
          <div className="cart-sidebar-item">
            <div className="cart-sidebar-item-image">
              <img
                src={getImageUrl(lastAddedItem.image || lastAddedItem.imageUrl)}
                alt={lastAddedItem.name}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg"
                }}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="cart-sidebar-item-details">
              <h4>{lastAddedItem.name}</h4>
              <p>NRs. {lastAddedItem.price}</p>
              <p>Quantity: {lastAddedItem.quantity}</p>
            </div>
          </div>

          <div className="cart-sidebar-summary">
            <div className="cart-sidebar-count">
              Cart Items: <span>{totalItems}</span>
            </div>
            <div className="cart-sidebar-total">
              Total: <span>NRs. {cartTotal}</span>
            </div>
          </div>

          <div className="cart-sidebar-actions">
            <button className="continue-shopping-btn" onClick={closeCartSidebar}>
              Continue Shopping
            </button>
            <Link to="/cart" className="view-cart-btn" onClick={closeCartSidebar}>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSidebar
