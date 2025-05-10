"use client"

import { useState } from "react"
import { useCart } from "../context/CartContext"
import "./CartPage.css"

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  })
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.address.trim()) errors.address = "Address is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleCheckoutViaWhatsApp = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Format the order message for WhatsApp
    const orderDate = formatDate()
    let message = `*New Order - ${orderDate}*\n\n`

    // Customer details
    message += `*Customer Details:*\n`
    message += `Name: ${formData.firstName} ${formData.lastName}\n`
    message += `Phone: ${formData.phone}\n`
    message += `Email: ${formData.email || "Not provided"}\n`
    message += `Address: ${formData.address}, ${formData.city || ""}\n\n`

    // Order items
    message += `*Order Items:*\n`
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.weight || ""}) - ${item.quantity} x NRs.${item.price} = NRs.${item.price * item.quantity}\n`
    })

    // Order total
    message += `\n*Total: NRs.${cartTotal}*\n\n`

    // Additional notes
    if (formData.notes) {
      message += `*Notes:* ${formData.notes}\n\n`
    }

    

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)

    // Replace with your WhatsApp number
    const whatsappNumber = "9779843621988" 

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Clear cart after successful checkout
    clearCart()

    // Reset checkout form
    setIsCheckingOut(false)
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
            <a href="/" className="continue-shopping-btn">
              Continue Shopping
            </a>
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
            {!isCheckingOut && (
              <>
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
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
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
                  <p>
                    ** For deliveries outside Ring Road, Rs. 50 is added as delivery charge if the total value of the
                    order is less than Rs 1500.
                  </p>
                </div>

                <div className="cart-actions">
                  <a href="/" className="shop-more-btn">
                    Shop More
                  </a>
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </>
            )}

            {isCheckingOut && (
              <div className="checkout-form">
                <h3>Delivery Information</h3>
                <p className="checkout-instruction">
                  Please fill up the following information so that we can call you for your delivery information.
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={formErrors.firstName ? "error" : ""}
                    />
                    {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={formErrors.lastName ? "error" : ""}
                    />
                    {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={formErrors.phone ? "error" : ""}
                    />
                    {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="address">Delivery Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={formErrors.address ? "error" : ""}
                    />
                    {formErrors.address && <div className="error-message">{formErrors.address}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button className="back-to-cart-btn" onClick={() => setIsCheckingOut(false)}>
                    Back to Cart
                  </button>
                  <button className="whatsapp-checkout-btn" onClick={handleCheckoutViaWhatsApp}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Checkout via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isCheckingOut && (
            <div className="cart-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
              </div>
              <div className="summary-content">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>NRs. {cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>NRs. {cartTotal < 1500 ? 50 : 0}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>NRs. {cartTotal < 1500 ? cartTotal + 50 : cartTotal}</span>
                </div>
                <button className="checkout-btn" onClick={() => setIsCheckingOut(true)}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
