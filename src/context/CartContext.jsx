"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("grocery-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let timer;
    if (showCartSidebar) {
      timer = setTimeout(() => setShowCartSidebar(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showCartSidebar]);

  // ✅ Helper to get ID safely
  const getItemId = (item) => item.id || item._id;

  const addItemToCart = (product, showSidebar = true) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => getItemId(item) === getItemId(product)
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });

    if (showSidebar) {
      setLastAddedItem(product);
      setShowCartSidebar(true);
    }
  };

  const addToCart = (product) => {
    addItemToCart(product, true);
  };

  const addToCartSilently = (product) => {
    addItemToCart(product, false);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        getItemId(item) === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => getItemId(item) !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const closeCartSidebar = () => {
    setShowCartSidebar(false);
  };

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
