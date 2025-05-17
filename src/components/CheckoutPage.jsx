"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CheckoutPage.css"

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [showViberPopup, setShowViberPopup] = useState(false)
  const [orderMessage, setOrderMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      navigate("/cart")
    }
  }, [cart, navigate])

  useEffect(() => {
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

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

  const prepareOrderMessage = () => {
    // Format the order message
    const orderDate = formatDate()
    let message = `*New Order - ${orderDate}*\n\n`

    // Customer details
    message += `*Customer Details:*\n`
    message += `Name: ${formData.firstName} ${formData.lastName}\n`
    message += `Phone: ${formData.phone}\n`
    message += `Address: ${formData.address}, ${formData.city || ""}\n\n`

    // Order items
    message += `*Order Items:*\n`
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.weight || ""}) - ${item.quantity} x NRs.${item.price} = NRs.${
        item.price * item.quantity
      }\n`
    })

    // Order total
    message += `\n*Subtotal: NRs.${cartTotal}*`
    message += `\n*Total: NRs.${cartTotal}*\n\n`

    return message
  }

  const handleCheckoutViaWhatsApp = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const message = prepareOrderMessage()
    const encodedMessage = encodeURIComponent(message)

    // Replace with your WhatsApp number
    const whatsappNumber = "9779843621988"

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Clear cart after successful checkout
    clearCart()

    // Redirect to success page
    navigate("/checkout/success")
  }

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    // Try to use the modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => {
          // Fallback to the older execCommand method
          const textArea = document.createElement("textarea")
          textArea.value = text
          textArea.style.position = "fixed" // Avoid scrolling to bottom
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          try {
            const successful = document.execCommand("copy")
            document.body.removeChild(textArea)
            return successful
          } catch (err) {
            document.body.removeChild(textArea)
            return false
          }
        })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed" // Avoid scrolling to bottom
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        return Promise.resolve(successful)
      } catch (err) {
        document.body.removeChild(textArea)
        return Promise.resolve(false)
      }
    }
  }

  const initiateViberCheckout = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const message = prepareOrderMessage()
    setOrderMessage(message)
    setShowViberPopup(true)
  }

  const handleCheckoutViaViber = () => {
    // Copy the message to clipboard
    copyToClipboard(orderMessage).then((success) => {
      // Replace with your Viber number - without any plus sign or special characters
      const viberNumber = "9779841216208"

      // Open Viber with just the number (no text parameter)
      window.open(`viber://chat?number=${viberNumber}`, "_blank")

      // Clear cart after successful checkout
      clearCart()

      // Close the popup
      setShowViberPopup(false)

      // Redirect to success page
      navigate("/checkout/success")
    })
  }

  // Show loading state or empty div if redirecting
  if (isLoading || cart.length === 0) {
    return <div className="checkout-loading">Loading...</div>
  }

  return (
    <div className="checkout-page">
      {showViberPopup && (
        <div className="viber-popup-overlay">
          <div className="viber-popup">
            <div className="viber-popup-header">
              <h3>Checkout via Viber</h3>
              <button className="close-popup" onClick={() => setShowViberPopup(false)}>
                ×
              </button>
            </div>
            <div className="viber-popup-content">
              <div className="viber-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#7360f2">
                  <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.122 8.946 5.5 10.565v2.421s-.038.97.602.582c.79-.484 2.106-1.892 2.867-2.592 3.145.263 5.562-.341 5.837-.432.636-.215 4.224-.668 4.813-5.443.614-4.953-.297-8.09-1.921-9.52l-.003-.003c-.5-.434-1.1-.832-1.793-1.157-1.033-.5-2.293-.869-3.942-.934a30.12 30.12 0 00-1.185-.036zM11.5 1.99c.98.005 1.97.05 2.931.143 1.58.052 2.798.392 3.72.842a6.31 6.31 0 011.609 1.04c1.359 1.187 2.146 3.979 1.617 8.23-.494 3.994-3.343 4.358-3.92 4.548-.233.078-2.489.622-5.369.415l-.073-.004-.071.042s-1.771 2.153-2.32 2.703c-.09.09-.18.125-.248.114-.093-.016-.131-.127-.129-.18l.027-.41.025-4.237-.077-.018c-4.994-1.394-4.681-6.587-4.632-9.33.06-2.756.576-4.984 2.084-6.487 2.539-2.358 7.41-2.378 7.41-2.378a28.22 28.22 0 011.386-.04zm.05 2.012c-3.371-.084-3.992.344-4.143.439-1.478 1.011-1.572 3.06-1.572 3.06 0 1.684-.156 4.368 2.694 5.188.392.11.846.25 1.429.25h.014c.816 0 1.403-.233 1.403-.233s-.011 1.404-.011 2.118c0 .11.073.233.19.233.155 0 .312-.123.312-.123.542-.558 1.704-1.75 1.704-1.75s2.679.233 2.679-2.007c0 0 .067-3.995-3.699-6.925zm.378 1.273c.252-.003.503.05.73.155 1.06.483 1.727 1.306 1.962 2.322.13.57.155 1.297.155 1.722 0 .425-.252.425-.252.425-.336 0-.336-.336-.336-.336-.067-2.082-1.095-3.082-2.19-3.418-.336-.101-.336-.437-.336-.437s0-.425.267-.433zm-3.09.336s.84-.101.84.335c0 .437-.504.437-.504.437-1.68.101-2.94 1.01-2.94 3.283 0 .437-.403.437-.403.437-.437.034-.437-.403-.437-.403-.168-2.222 1.095-3.72 3.444-4.09zm3.024 1.01c.193-.002.385.053.56.155.756.425 1.06 1.06 1.06 1.92 0 .336-.269.336-.269.336-.37 0-.336-.37-.336-.37-.067-1.011-.728-1.346-1.01-1.478-.336-.168-.336-.437-.336-.437s.138-.123.33-.126zm-1.755.488s.672-.067.672.336c0 .37-.37.403-.37.403 0 .034-1.011.269-1.011 1.616 0 .37-.37.37-.37.37-.403 0-.403-.37-.403-.37 0-1.75 1.482-2.355 1.482-2.355zm4.2 2.02c.297 0 .54.242.54.54v.336a.545.545 0 01-.54.54h-1.212l.54.54c.212.212.212.54 0 .752a.53.53 0 01-.752 0l-.54-.54v1.212a.545.545 0 01-.54.54h-.336a.545.545 0 01-.54-.54v-1.212l-.54.54a.53.53 0 01-.752 0 .53.53 0 010-.752l.54-.54H7.517a.545.545 0 01-.54-.54V9.11c0-.297.242-.54.54-.54h1.212l-.54-.54a.53.53 0 010-.752.53.53 0 01.752 0l.54.54V6.606c0-.297.242-.54.54-.54h.336c.297 0 .54.242.54.54v1.212l.54-.54a.53.53 0 01.752 0c.212.212.212.54 0 .752l-.54.54h1.212z" />
                </svg>
              </div>
              <p className="viber-instructions">
                <strong>Quick steps to complete your order:</strong>
              </p>
              <ol className="viber-steps">
                <li>Your order details have been copied to clipboard</li>
                <li>Click "Continue to Viber" below to open Viber</li>
                <li>Paste the order details in the Viber chat (tap and hold, then select "Paste")</li>
                <li>Send the message to complete your order</li>
              </ol>
              <div className="viber-message-preview">
                <h4>Order Details (already copied):</h4>
                <div className="message-preview-content">
                  {orderMessage.split("\n").map((line, index) => (
                    <p key={index}>{line || " "}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="viber-popup-actions">
              <button className="cancel-viber-btn" onClick={() => setShowViberPopup(false)}>
                Cancel
              </button>
              <button className="continue-viber-btn" onClick={handleCheckoutViaViber}>
                Continue to Viber
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-header">
          <h1>CHECKOUT</h1>
          <h2>Complete Your Order</h2>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
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
                <div className="form-group full-width">
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
                <div className="form-group full-width">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
              </div>

              <div className="checkout-messaging-options">
                <h3>Payment Options</h3>
                <p>Complete your order via messaging apps:</p>
                <div className="messaging-checkout-buttons">
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
                  <button className="viber-checkout-btn" onClick={initiateViberCheckout}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.122 8.946 5.5 10.565v2.421s-.038.97.602.582c.79-.484 2.106-1.892 2.867-2.592 3.145.263 5.562-.341 5.837-.432.636-.215 4.224-.668 4.813-5.443.614-4.953-.297-8.09-1.921-9.52l-.003-.003c-.5-.434-1.1-.832-1.793-1.157-1.033-.5-2.293-.869-3.942-.934a30.12 30.12 0 00-1.185-.036zM11.5 1.99c.98.005 1.97.05 2.931.143 1.58.052 2.798.392 3.72.842a6.31 6.31 0 011.609 1.04c1.359 1.187 2.146 3.979 1.617 8.23-.494 3.994-3.343 4.358-3.92 4.548-.233.078-2.489.622-5.369.415l-.073-.004-.071.042s-1.771 2.153-2.32 2.703c-.09.09-.18.125-.248.114-.093-.016-.131-.127-.129-.18l.027-.41.025-4.237-.077-.018c-4.994-1.394-4.681-6.587-4.632-9.33.06-2.756.576-4.984 2.084-6.487 2.539-2.358 7.41-2.378 7.41-2.378a28.22 28.22 0 011.386-.04zm.05 2.012c-3.371-.084-3.992.344-4.143.439-1.478 1.011-1.572 3.06-1.572 3.06 0 1.684-.156 4.368 2.694 5.188.392.11.846.25 1.429.25h.014c.816 0 1.403-.233 1.403-.233s-.011 1.404-.011 2.118c0 .11.073.233.19.233.155 0 .312-.123.312-.123.542-.558 1.704-1.75 1.704-1.75s2.679.233 2.679-2.007c0 0 .067-3.995-3.699-6.925zm.378 1.273c.252-.003.503.05.73.155 1.06.483 1.727 1.306 1.962 2.322.13.57.155 1.297.155 1.722 0 .425-.252.425-.252.425-.336 0-.336-.336-.336-.336-.067-2.082-1.095-3.082-2.19-3.418-.336-.101-.336-.437-.336-.437s0-.425.267-.433zm-3.09.336s.84-.101.84.335c0 .437-.504.437-.504.437-1.68.101-2.94 1.01-2.94 3.283 0 .437-.403.437-.403.437-.437.034-.437-.403-.437-.403-.168-2.222 1.095-3.72 3.444-4.09zm3.024 1.01c.193-.002.385.053.56.155.756.425 1.06 1.06 1.06 1.92 0 .336-.269.336-.269.336-.37 0-.336-.37-.336-.37-.067-1.011-.728-1.346-1.01-1.478-.336-.168-.336-.437-.336-.437s.138-.123.33-.126zm-1.755.488s.672-.067.672.336c0 .37-.37.403-.37.403 0 .034-1.011.269-1.011 1.616 0 .37-.37.37-.37.37-.403 0-.403-.37-.403-.37 0-1.75 1.482-2.355 1.482-2.355zm4.2 2.02c.297 0 .54.242.54.54v.336a.545.545 0 01-.54.54h-1.212l.54.54c.212.212.212.54 0 .752a.53.53 0 01-.752 0l-.54-.54v1.212a.545.545 0 01-.54.54h-.336a.545.545 0 01-.54-.54v-1.212l-.54.54a.53.53 0 01-.752 0 .53.53 0 010-.752l.54-.54H7.517a.545.545 0 01-.54-.54V9.11c0-.297.242-.54.54-.54h1.212l-.54-.54a.53.53 0 010-.752.53.53 0 01.752 0l.54.54V6.606c0-.297.242-.54.54-.54h.336c.297 0 .54.242.54.54v1.212l.54-.54a.53.53 0 01.752 0c.212.212.212.54 0 .752l-.54.54h1.212z" />
                    </svg>
                    Checkout via Viber
                  </button>
                </div>
              </div>

              <div className="checkout-actions">
                <Link to="/cart" className="back-to-cart-btn">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>

          <div className="checkout-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            <div className="summary-content">
              <div className="summary-items">
                <h4>Items ({cart.length})</h4>
                {cart.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="summary-item-price">NRs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>NRs. {cartTotal}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>NRs. {cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
