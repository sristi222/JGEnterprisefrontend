"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available, with SSR check
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("grocery-cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  // State for cart sidebar
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  // Calculate cart total using sale prices when available
  const cartTotal = cart.reduce((total, item) => {
    const itemPrice = (item.onSale || item.sale) && item.salePrice ? item.salePrice : item.price
    return total + itemPrice * item.quantity
  }, 0)

  // Calculate total number of items (quantities)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Save cart to localStorage whenever it change
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

  // Helper to get ID safely (handles both id and _id properties)
  const getItemId = (item) => item.id || item._id

  // Helper function to add item to cart with option to show sidebar
  const addItemToCart = (product, showSidebar = true) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => getItemId(item) === getItemId(product))

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

    if (showSidebar) {
      // Set last added item and show sidebar
      setLastAddedItem(product)
      setShowCartSidebar(true)
    }
  }

  // Add item to cart and show sidebar
  const addToCart = (product) => {
    addItemToCart(product, true)
  }

  // Add item to cart silently (without showing sidebar) - for Buy Now functionality
  const addToCartSilently = (product) => {
    addItemToCart(product, false)
  }

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (getItemId(item) === id ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => getItemId(item) !== id))
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
