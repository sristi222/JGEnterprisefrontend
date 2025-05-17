"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./ProductSection.css"

function ProductSection() {
  const { addToCart } = useCart()
  const scrollContainerRef = useRef(null)

  const [products, setProducts] = useState([
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
      color: "#FFA500",
    },
    {
      id: 2,
      name: "Bikano Kashmiri Mixture, 200gm",
      image: "https://m.media-amazon.com/images/I/71+tvmf7XPL._SL1350_.jpg",
      price: 200,
      weight: "200 gm",
      category: "Snacks",
      color: "#C44536",
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
    },
    {
      id: 4,
      name: "Bikano Moong Dal, 260gm",
      image:
        "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 200,
      weight: "260 gm",
      category: "Snacks",
      color: "#C44536",
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
    },
    {
      id: 7,
      name: "Organic Bananas, 6pcs",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 80,
      weight: "6 Pcs",
      category: "Fruits",
      color: "#FFA500",
    },
  ])

  // Handle adding product to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation() // Prevent navigation when clicking the button
    addToCart({
      ...product,
      quantity: 1,
    })
    // Cart sidebar will be shown automatically via the context
  }

  // Handle Buy Now button click
  const handleBuyNow = (productId, e) => {
    e.stopPropagation() // Prevent default navigation
    window.location.href = `/product/${productId}`
  }

  // Navigate to product detail page
  const navigateToProduct = (productId) => {
    window.location.href = `/product/${productId}`
  }

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className="prod-section">
      <div className="prod-container">
        <div className="prod-header">
          <h2 className="prod-title">LATEST PRODUCTS</h2>
          <Link to="/products" className="prod-view-all">
            VIEW ALL
          </Link>
        </div>

        <div className="prod-carousel-container">
          <button className="prod-carousel-arrow prod-carousel-prev" onClick={scrollLeft}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="prod-grid" ref={scrollContainerRef}>
            {products.map((product) => (
              <div className="honey-product-card" key={product.id} onClick={() => navigateToProduct(product.id)}>
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
                      <button className="honey-add-to-cart-btn" onClick={(e) => handleAddToCart(product, e)}>
                        ADD TO CART
                      </button>
                      <button className="honey-buy-now-btn" onClick={(e) => handleBuyNow(product.id, e)}>
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="prod-carousel-arrow prod-carousel-next" onClick={scrollRight}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductSection
