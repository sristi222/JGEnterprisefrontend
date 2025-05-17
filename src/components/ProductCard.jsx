"use client"

import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addToCart, addToCartSilently } = useCart()
  const navigate = useNavigate()

  // Handle adding product to cart
  const handleAddToCart = (e) => {
    e.stopPropagation() // Prevent navigation when clicking the button
    addToCart({
      ...product,
      quantity: 1,
    })
  }

  // Navigate to product detail page
  const navigateToProduct = () => {
    window.location.href = `/product/${product.id}`
  }

  // Handle Buy Now button click
  const handleBuyNow = (e) => {
    e.stopPropagation() // Prevent default navigation

    // Add the product to cart silently
    addToCartSilently({
      ...product,
      quantity: 1,
    })

    // Navigate to checkout
    navigate("/checkout")
  }

  return (
    <div className="honey-product-card" onClick={navigateToProduct}>
      {product.sale && <div className="honey-sale-tag">SALE</div>}
      <div className="honey-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="honey-product-image" />
        <div className="honey-quantity-badge" style={{ backgroundColor: product.color || "#333" }}>
          {product.weight}
        </div>
      </div>

      <div className="honey-product-info">
        <h3 className="honey-product-name">{product.name}</h3>
        <div className="honey-product-category">{product.category}</div>

        <div className="honey-product-price">
          <span className="honey-current-price">NRs.{product.price}</span>
          {product.originalPrice && <span className="honey-original-price">NRs.{product.originalPrice}</span>}
        </div>

        <div className="honey-product-actions">
          <div className="honey-button-group">
            <button className="honey-add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button className="honey-buy-now-btn" onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
