"use client"

import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addToCart, addToCartSilently } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
  }

  const navigateToProduct = () => {
    const id = product._id || product.id
    navigate(`/product/${id}`)
  }

  const handleBuyNow = (e) => {
    e.stopPropagation()
    addToCartSilently({ ...product, quantity: 1 })
    navigate("/checkout")
  }

  const getSafeName = () =>
    typeof product.name === "object" ? product.name.name : product.name

  const getSafeWeight = () =>
    typeof product.weight === "object" ? product.weight.label : product.weight

  const getImageUrl = () => {
    const raw = product.image || product.imageUrl || ""
    if (raw.startsWith("http")) return raw
    if (raw.trim() !== "") return `http://localhost:5000/uploads/${raw.replace(/^.*[\\\/]/, "")}`
    return "/placeholder.svg"
  }

  return (
    <div className="honey-product-card" onClick={navigateToProduct}>
      {product.sale && <div className="honey-sale-tag">SALE</div>}

      <div className="honey-image-container">
        <img
          src={getImageUrl()}
          alt={getSafeName()}
          className="honey-product-image"
          loading="lazy"
          width="200"
          height="200"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />
        <div
          className="honey-quantity-badge"
          style={{ backgroundColor: product.color || "#333" }}
        >
          {getSafeWeight()}
        </div>
      </div>

      <div className="honey-product-info">
        <h3 className="honey-product-name">{getSafeName()}</h3>
        <div className="honey-product-category">
          {typeof product.category === "object" ? product.category.name : product.category}
        </div>

        <div className="honey-product-price">
          <span className="honey-current-price">NRs.{product.price}</span>
          {product.originalPrice && (
            <span className="honey-original-price">NRs.{product.originalPrice}</span>
          )}
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
