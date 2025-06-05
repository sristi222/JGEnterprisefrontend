"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import "./ProductSection.css"

function ProductSection() {
  const { addToCart } = useCart()
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/latest")
        if (res.data.success) {
          setProducts(res.data.products)
        }
      } catch (err) {
        console.error("Failed to fetch latest products", err)
      }
    }
    fetchLatestProducts()
  }, [])

  const handleAddToCart = (product, e) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
  }

  const handleBuyNow = (productId, e) => {
    e.stopPropagation()
    navigate(`/product/${productId}`)
  }

  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  const getImageUrl = (product) => {
    const raw = product.imageUrl || product.image || ""
    if (raw.startsWith("http")) return raw
    if (raw.trim() !== "") return `http://localhost:5000/uploads/${raw.replace(/^.*[\\\/]/, "")}`
    return "/placeholder.svg"
  }

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" })
  }

  return (
    <section className="prod-section">
      <div className="prod-container">
        <div className="prod-header">
          <h2 className="prod-title">LATEST PRODUCTS</h2>
          <Link to="/products" className="prod-view-all">VIEW ALL</Link>
        </div>

        <div className="prod-carousel-container">
          <button className="prod-carousel-arrow prod-carousel-prev" onClick={scrollLeft}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="prod-grid" ref={scrollContainerRef}>
            {products.map((product) => (
              <div
                className="honey-product-card"
                key={product._id}
                onClick={() => navigateToProduct(product._id)}
              >
                {product.onSale && <div className="honey-sale-tag">SALE</div>}

                <div className="honey-image-container">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
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
                    style={{ backgroundColor: product.color || "#ccc" }}
                  >
                    {product.unit || product.weight || ""}
                  </div>
                </div>

                <div className="honey-product-info">
                  <h3 className="honey-product-name">{product.name}</h3>
                  <div className="honey-product-category">
                    {typeof product.category === "object"
                      ? product.category.name
                      : product.category}
                  </div>

                  <div className="honey-product-price">
                    <span className="honey-current-price">NRs.{product.price}</span>
                    {product.salePrice > 0 && (
                      <span className="honey-original-price">NRs.{product.salePrice}</span>
                    )}
                  </div>

                  <div className="honey-product-actions">
                    <div className="honey-button-group">
                      <button
                        className="honey-add-to-cart-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        ADD TO CART
                      </button>
                      <button
                        className="honey-buy-now-btn"
                        onClick={(e) => handleBuyNow(product._id, e)}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="prod-carousel-arrow prod-carousel-next" onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductSection
