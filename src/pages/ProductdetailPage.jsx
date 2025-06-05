"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./ProductDetailPage.css"

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, addToCartSilently } = useCart()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`)
        const data = await res.json()
        if (res.ok) {
          setProduct(data)
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http")) return path
    if (path.startsWith("/uploads/")) return `http://localhost:5000${path}`
    return `http://localhost:5000/uploads/${path.replace(/^.*[\\/]/, "")}`
  }

  const getSafe = (value, field = "name") => {
    return typeof value === "object" ? value?.[field] : value
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity })
      alert(`${getSafe(product.name)} added to cart!`)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCartSilently({ ...product, quantity })
      navigate("/checkout")
    }
  }

  const isInCart = () =>
    cart.some((item) => item._id?.toString() === productId || item.id?.toString() === productId)

  const getCartQuantity = () => {
    const item = cart.find((item) => item._id?.toString() === productId || item.id?.toString() === productId)
    return item ? item.quantity : 0
  }

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you are looking for does not exist.</p>
        <Link to="/" className="pd-back-home">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="pd-page">
      <div className="pd-container">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt;{" "}
          <span>{getSafe(product.name)}</span>
        </div>

        <div className="pd-content">
          <div className="pd-images">
            <div className="pd-main-image">
              <img
                key={selectedImage}
                src={getImageUrl(product.images?.[selectedImage] || product.imageUrl || product.image)}
                alt={getSafe(product.name)}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg"
                }}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>

            {product.images?.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`pd-thumbnail ${selectedImage === i ? "active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`view ${i + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <h1 className="pd-title">{getSafe(product.name)}</h1>
            <div className="pd-price-container">
              <span className="pd-price">NRs. {product.price}</span>
              {product.originalPrice && (
                <span className="pd-original-price">NRs. {product.originalPrice}</span>
              )}
            </div>

            <div className="pd-quantity">
              <button className="pd-qty-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
              <input type="text" value={quantity} readOnly className="pd-qty-input" />
              <button className="pd-qty-btn" onClick={increaseQuantity}>+</button>
            </div>

            <div className="pd-button-group">
              <button className="pd-add-cart-btn" onClick={handleAddToCart}>Add to Shopping list</button>
              <button className="pd-buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>

            {isInCart() && (
              <div className="pd-in-cart">
                <span>✔ Already in cart ({getCartQuantity()} items)</span>
              </div>
            )}

            <div className="pd-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="pd-details">
              <div className="pd-detail-item">
                <span className="pd-detail-label">Brand:</span> {getSafe(product.brand) || "N/A"}
              </div>
              <div className="pd-detail-item">
                <span className="pd-detail-label">Category:</span> {getSafe(product.category) || "N/A"}
              </div>
              <div className="pd-detail-item">
                <span className="pd-detail-label">Weight:</span> {getSafe(product.weight) || "N/A"}
              </div>
            </div>
          </div>

          <div className="pd-badges">
            <div className="pd-weight-badge" style={{ backgroundColor: product.color || "#ccc" }}>
              <span>{getSafe(product.weight)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
