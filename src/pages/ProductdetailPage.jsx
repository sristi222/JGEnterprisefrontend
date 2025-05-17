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
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantities, setQuantities] = useState({})

  // Fetch product data
  useEffect(() => {
    // Simulating API call to get product data
    const fetchProduct = () => {
      setLoading(true)

      // This would be replaced with an actual API call in a real app
      const products = [
        {
          id: 1,
          name: "Alphonso Mango, 2pcs",
          image:
            "https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 540,
          originalPrice: 600,
          weight: "2 Pcs",
          sale: true,
          category: "Fruits",
          color: "#8B7D39",
          description:
            "Sweet and juicy Alphonso mangoes, known for their rich flavor and aroma. Perfect for desserts or enjoying fresh.",
          brand: "Fresh Harvest",
          images: [
            "https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
        {
          id: 2,
          name: "Bikano Kashmiri Mixture, 200gm",
          image: "https://m.media-amazon.com/images/I/71+tvmf7XPL._SL1350_.jpg",
          price: 200,
          weight: "200 gm",
          category: "Snacks",
          color: "#9C2759",
          description:
            "A delicious blend of Kashmiri spices, nuts, and savory ingredients. Perfect for tea time snacking.",
          brand: "Bikano",
          images: ["https://m.media-amazon.com/images/I/71+tvmf7XPL._SL1350_.jpg"],
        },
        {
          id: 3,
          name: "Bikano Lajawab Mixture Bhujia, 200gm",
          image:
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 150,
          weight: "200 gm",
          category: "Snacks",
          color: "#C44536",
          description:
            "Crunchy Spicy Mixture of Noodles, Lentils, Peanuts and Corn Flakes. A perfect tea-time snack with a blend of flavors.",
          brand: "Bikano",
          images: [
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
        {
          id: 4,
          name: "Bikano Moong Dal, 260gm",
          image:
            "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 200,
          weight: "260 gm",
          category: "Snacks",
          color: "#1D5B9C",
          description:
            "Crispy and flavorful moong dal snack, perfect for munching. Made with high-quality ingredients and traditional recipes.",
          brand: "Bikano",
          images: [
            "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
        {
          id: 5,
          name: "Organic Fresh Vegetables Pack",
          image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 350,
          weight: "1 kg",
          category: "Vegetables",
          color: "#2E8B57",
          description:
            "Assorted fresh organic vegetables, hand-picked from local farms. Contains seasonal vegetables perfect for daily cooking.",
          brand: "Organic Farms",
          images: [
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
        {
          id: 6,
          name: "Fresh Strawberries, 250gm",
          image:
            "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 180,
          originalPrice: 220,
          weight: "250 gm",
          sale: true,
          category: "Fruits",
          color: "#C22126",
          description:
            "Juicy and sweet strawberries, freshly harvested. Rich in antioxidants and perfect for desserts or eating fresh.",
          brand: "Fresh Harvest",
          images: [
            "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
        {
          id: 7,
          name: "Organic Bananas, 6pcs",
          image:
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 80,
          weight: "6 Pcs",
          category: "Fruits",
          color: "#FFD700",
          description:
            "Organically grown bananas, rich in potassium and natural sweetness. Perfect for breakfast or as a healthy snack.",
          brand: "Organic Farms",
          images: [
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          ],
        },
      ]

      const foundProduct = products.find((p) => p.id === Number.parseInt(productId))

      if (foundProduct) {
        setProduct(foundProduct)

        // Find similar products (same category but different ID)
        const similar = products
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4) // Limit to 4 similar products

        setSimilarProducts(similar)
      }

      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity,
      })
      alert(`${product.name} added to cart!`)
    }
  }

  // Updated Buy Now function to use addToCartSilently
  const handleBuyNow = () => {
    if (product) {
      // Add the product to cart silently (without showing sidebar)
      addToCartSilently({
        ...product,
        quantity,
      })

      // Navigate directly to checkout page
      navigate("/checkout")
    }
  }

  // Check if product is in cart
  const isInCart = () => {
    return cart.some((item) => item.id === Number.parseInt(productId))
  }

  // Get quantity in cart
  const getCartQuantity = () => {
    const cartItem = cart.find((item) => item.id === Number.parseInt(productId))
    return cartItem ? cartItem.quantity : 0
  }

  // Get quantity for a product (default to 1 if not set)
  const getQuantity = (productId) => {
    return quantities[productId] || 1
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

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{product.name}</span>
        </div>

        <div className="pd-content">
          {/* Left - Product Images */}
          <div className="pd-images">
            <div className="pd-main-image">
              <img src={product.images[selectedImage] || "/placeholder.svg"} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`pd-thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image || "/placeholder.svg"} alt={`${product.name} - view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center - Product Info */}
          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-price-container">
              <span className="pd-price">NRs. {product.price}</span>
              {product.originalPrice && <span className="pd-original-price">NRs. {product.originalPrice}</span>}
            </div>

            <div className="pd-quantity">
              <button className="pd-qty-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>
                -
              </button>
              <input type="text" value={quantity} readOnly className="pd-qty-input" />
              <button className="pd-qty-btn" onClick={increaseQuantity}>
                +
              </button>
            </div>

            {/* Updated button group with Buy Now button */}
            <div className="pd-button-group">
              <button className="pd-add-cart-btn" onClick={handleAddToCart}>
                Add to Shopping list
              </button>
              <button className="pd-buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            {isInCart() && (
              <div className="pd-in-cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Already in cart ({getCartQuantity()} items)</span>
              </div>
            )}

            <div className="pd-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="pd-details">
              <div className="pd-detail-item">
                <span className="pd-detail-label">Brand:</span>
                <span className="pd-detail-value">{product.brand}</span>
              </div>
              <div className="pd-detail-item">
                <span className="pd-detail-label">Category:</span>
                <span className="pd-detail-value">{product.category}</span>
              </div>
              <div className="pd-detail-item">
                <span className="pd-detail-label">Weight:</span>
                <span className="pd-detail-value">{product.weight}</span>
              </div>
            </div>
          </div>

          {/* Right - Only Weight Badge (removed vertical badge) */}
          <div className="pd-badges">
            <div
              className="pd-weight-badge"
              style={{ backgroundColor: product.color === "#C44536" ? "#8B4513" : product.color }}
            >
              <span>{product.weight}</span>
            </div>
          </div>
        </div>

        {/* Shopping List Panel */}
        <div className="pd-shopping-list">
          <div className="pd-list-header">
            <h3>SHOPPING LISTS</h3>
            <button className="pd-collapse-btn">COLLAPSE ↑</button>
          </div>

          <div className="pd-list-content">
            <div className="pd-list-title">
              <h4>
                My List -{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </h4>
              <p>
                {cart.length}/{cart.length} items confirmed
              </p>
            </div>

            <div className="pd-list-actions">
              <button className="pd-clear-btn">Clear list</button>
              <div className="pd-search">
                <input type="text" placeholder="Search list" />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </div>

            <button className="pd-add-item-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add new item
            </button>

            {cart.length > 0 ? (
              <div className="pd-cart-items">
                {cart.map((item) => (
                  <div className="pd-cart-item" key={item.id}>
                    <button className="pd-remove-btn">×</button>
                    <div className="pd-item-price">NRs. {item.price * item.quantity}</div>
                    <div className="pd-item-details">
                      <div className="pd-item-image">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="pd-item-info">
                        <h5>{item.name}</h5>
                        <p>NRs. {item.price}</p>
                        <div className="pd-item-quantity">
                          <button>-</button>
                          <span>{item.quantity}</span>
                          <button>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pd-empty-list">Your shopping list is empty</p>
            )}

            <p className="pd-list-note">* Unconfirmed list item not priced.</p>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="pd-similar">
          <h2>Similar Products</h2>
          <div className="pd-similar-products">
            {similarProducts.map((product) => (
              <div
                className="honey-product-card"
                key={product.id}
                onClick={() => (window.location.href = `/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                {product.sale && <div className="honey-sale-tag">SALE</div>}
                <div className="honey-image-container">
                  <img src={product.image || "/placeholder.svg"} alt={product.name} className="honey-product-image" />
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
                    <div className="honey-button-group">
                      <button
                        className="honey-add-to-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          const quantity = getQuantity(product.id)
                          addToCart({
                            ...product,
                            quantity,
                          })
                          setQuantities({
                            ...quantities,
                            [product.id]: 1,
                          })
                          alert(`${product.name} added to cart!`)
                        }}
                      >
                        ADD TO CART
                      </button>
                      <button
                        className="honey-buy-now-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          const quantity = getQuantity(product.id)
                          // Add this product to cart silently
                          addToCartSilently({
                            ...product,
                            quantity,
                          })
                          // Then navigate to checkout
                          navigate("/checkout")
                        }}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
