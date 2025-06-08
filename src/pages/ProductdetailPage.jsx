"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import "./ProductDetailPage.css"

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, addToCartSilently } = useCart()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [similarProducts, setSimilarProducts] = useState([])

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

    const fetchSimilarProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/similar/${productId}`)
        const data = await res.json()
        if (res.ok) {
          setSimilarProducts(data)
        } else {
          setSimilarProducts([])
        }
      } catch (err) {
        console.error("Fetch similar products error:", err)
        setSimilarProducts([])
      }
    }

    if (productId) {
      fetchProduct()
      fetchSimilarProducts()
    }
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

  const getQuantityBadgeContent = () => {
    if (!product) return "-"
    if (product.unit && typeof product.unit === "string" && product.unit.trim() !== "") {
      return product.unit
    }
    if (typeof product.weight === "object" && product.weight !== null && product.weight.label) {
      return product.weight.label
    }
    if (typeof product.weight === "string" && product.weight.trim() !== "") {
      return product.weight
    }
    return "-" // Default value if neither unit nor weight is available
  }

  // Calculate the display price and original price based on sale status
  const getPriceDisplay = (productItem) => {
    if (!productItem) return { currentPrice: 0, originalPrice: null, isOnSale: false }

    if ((productItem.onSale || productItem.sale) && productItem.salePrice) {
      return {
        currentPrice: productItem.salePrice,
        originalPrice: productItem.price,
        isOnSale: true,
      }
    }
    return {
      currentPrice: productItem.price,
      originalPrice: productItem.originalPrice,
      isOnSale: false,
    }
  }

  // Calculate discount percentage
  const getDiscountPercentage = (productItem) => {
    const { currentPrice, originalPrice, isOnSale } = getPriceDisplay(productItem)
    if (isOnSale && originalPrice && currentPrice) {
      const discount = ((originalPrice - currentPrice) / originalPrice) * 100
      return Math.round(discount)
    }
    return 0
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCartSilently({ ...product, quantity })
      navigate("/checkout")
    }
  }

  const isInCart = () => cart.some((item) => item._id?.toString() === productId || item.id?.toString() === productId)

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
        <Link to="/" className="pd-back-home">
          Back to Home
        </Link>
      </div>
    )
  }

  const { currentPrice, originalPrice, isOnSale } = getPriceDisplay(product)
  const discountPercentage = getDiscountPercentage(product)

  return (
    <div className="pd-page">
      <div className="pd-container">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{getSafe(product.name)}</span>
        </div>

        {/* Main product content wrapper - Improved mobile layout */}
        <div className="pd-main-content-wrapper">
          <div className="pd-content">
            {/* Product Images Section */}
            <div className="pd-images">
              <div className="pd-main-image">
                {isOnSale && (
                  <div className="pd-sale-badge">
                    <span>SALE</span>
                    {discountPercentage > 0 && (
  <span className="pd-discount-percent">{discountPercentage}% OFF</span>
)}

                  </div>
                )}
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
                        src={getImageUrl(img) || "/placeholder.svg"}
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

              {/* Mobile-only weight badge */}
              <div className="pd-mobile-badge">
                <div className="pd-weight-badge-mobile" style={{ backgroundColor: product.color || "#6b7280" }}>
                  <span>{getQuantityBadgeContent()}</span>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="pd-info">
              <h1 className="pd-title">{getSafe(product.name)}</h1>

              <div className="pd-price-container">
                <span className="pd-price">NRs. {currentPrice}</span>
                {originalPrice && <span className="pd-original-price">NRs. {originalPrice}</span>}
                {isOnSale && discountPercentage > 0 && (
                  <span className="pd-savings">You save {discountPercentage}%!</span>
                )}
              </div>

              <div className="pd-action-container">
                <div className="pd-quantity">
                  <button className="pd-qty-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    -
                  </button>
                  <input type="text" value={quantity} readOnly className="pd-qty-input" />
                  <button className="pd-qty-btn" onClick={increaseQuantity}>
                    +
                  </button>
                </div>

                <div className="pd-button-group">
                  <button className="pd-add-cart-btn" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                  <button className="pd-buy-now-btn" onClick={handleBuyNow}>
                    Buy Now
                  </button>
                </div>
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
                  <span className="pd-detail-label">Category:</span> {getSafe(product.category) || "N/A"}
                </div>
              </div>
            </div>

            {/* Desktop-only badges */}
            <div className="pd-badges">
              <div className="pd-weight-badge" style={{ backgroundColor: product.color || "#6b7280" }}>
                <span>{getQuantityBadgeContent()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Panel - Improved scrolling */}
        <div className="pd-similar-products-section">
          <h3>Similar Products</h3>
          <div className="pd-similar-products-grid">
            {similarProducts.length > 0 ? (
              similarProducts.map((similarProduct) => <ProductCard key={similarProduct._id} product={similarProduct} />)
            ) : (
              <p className="pd-no-similar-products">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
