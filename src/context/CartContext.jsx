"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("grocery-cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // State for cart sidebar
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate total number of items (quantities)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(cart))
  }, [cart])

  // Auto-hide cart sidebar after 5 seconds
  useEffect(() => {
    let timer
    if (showCartSidebar) {
      timer = setTimeout(() => {
        setShowCartSidebar(false)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [showCartSidebar])

  // Add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity
        return updatedCart
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, product]
      }
    })

    // Set last added item and show sidebar
    setLastAddedItem(product)
    setShowCartSidebar(true)
  }

  // Add item to cart silently (without showing sidebar) - for Buy Now functionality
  const addToCartSilently = (product) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity
        return updatedCart
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, product]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Close cart sidebar
  const closeCartSidebar = () => {
    setShowCartSidebar(false)
  }

  // Context value
  const value = {
    cart,
    cartTotal,
    cartCount,
    addToCart,
    addToCartSilently,
    updateQuantity,
    removeFromCart,
    clearCart,
    showCartSidebar,
    setShowCartSidebar,
    lastAddedItem,
    closeCartSidebar,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
