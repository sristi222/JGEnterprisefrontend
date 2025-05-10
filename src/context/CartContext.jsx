"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Cart provider component
export function CartProvider({ children }) {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  // Calculate total items in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
      console.log("Cart updated:", cart) // Debug log
    }
  }, [cart])

  // Add item to cart
  const addToCart = (product) => {
    console.log("Adding to cart:", product) // Debug log

    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity || 1
        return updatedCart
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
