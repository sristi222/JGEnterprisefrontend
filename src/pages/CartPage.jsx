"use client"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CartPage.css"

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>SHOPPING LIST - CHECKOUT</h1>
            <h2>Place your Order</h2>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <p>Your shopping list is empty</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>SHOPPING LIST - CHECKOUT</h1>
          <h2>Place your Order</h2>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-list-header">
              <h3>My List - {formatDate()}</h3>
              <p className="cart-confirmation">
                {cart.length}/{cart.length} confirmed
              </p>
            </div>

            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                    ×
                  </button>
                  <div className="cart-item-image">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">NRs. {item.price}</p>
                    <div className="cart-quantity-selector">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-total">NRs. {item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="cart-notes">
              <p>* Unconfirmed list item not priced.</p>
            </div>

            <div className="cart-actions">
              <Link to="/" className="shop-more-btn">
                Shop More
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>NRs. {cartTotal}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>NRs. {cartTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
