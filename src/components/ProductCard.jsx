"use client"

import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import "./ProductCard.css"

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const decreaseQuantity = (e) => {
    e.stopPropagation()
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = (e) => {
    e.stopPropagation()
    setQuantity(quantity + 1)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    console.log("Adding product to cart:", product) // Debug log
    addToCart({
      ...product,
      quantity,
    })
    // Reset quantity after adding to cart
    setQuantity(1)
    // Optional: Show a success message
    alert(`${product.name} added to cart!`)
  }

  const navigateToProduct = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="honey-product-card" onClick={navigateToProduct} style={{ cursor: "pointer" }}>
      {product.sale && <div className="honey-sale-tag">SALE</div>}
      <div className="honey-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="honey-product-image" />
        <div className="honey-badge" style={{ backgroundColor: product.color }}>
          <div className="honey-vertical-text">QUALITY</div>
          <div className="honey-vertical-text">PREMIUM</div>
        </div>
        <div className="honey-quantity-badge" style={{ backgroundColor: product.color }}>
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
          <div className="honey-quantity-selector">
            <span className="honey-qty-label">Qty</span>
            <button className="honey-qty-btn honey-decrease" onClick={decreaseQuantity} disabled={quantity <= 1}>
              -
            </button>
            <input type="text" className="honey-qty-input" value={quantity} readOnly />
            <button className="honey-qty-btn honey-increase" onClick={increaseQuantity}>
              +
            </button>
          </div>

          <button className="honey-add-to-cart-btn" onClick={handleAddToCart}>
            ADD TO SHOPPING LIST
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
