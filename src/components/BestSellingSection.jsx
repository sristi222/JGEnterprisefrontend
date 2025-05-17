"use client"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./BestSellingSection.css"

function BestSellingSection() {
  const { addToCart } = useCart()
  const scrollContainerRef = useRef(null)

  const [bestSellers, setBestSellers] = useState([
    {
      id: 8,
      name: "Premium Cashew Nuts, 250gm",
      image: "https://images.unsplash.com/photo-1563292769-4e05b7efd5fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 450,
      originalPrice: 500,
      weight: "250 gm",
      sale: true,
      category: "Dry Fruits",
      color: "#8B4513",
    },
    {
      id: 9,
      name: "Organic Honey, 500gm",
      image:
        "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 350,
      weight: "500 gm",
      category: "Honey",
      color: "#FFD700",
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
      id: 10,
      name: "Fresh Avocados, 2pcs",
      image:
        "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 220,
      weight: "2 Pcs",
      category: "Fruits",
      color: "#2E8B57",
    },
    {
      id: 11,
      name: "Organic Brown Rice, 1kg",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 180,
      weight: "1 kg",
      category: "Grains",
      color: "#CD853F",
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
      id: 12,
      name: "Dark Chocolate Bar, 100gm",
      image:
        "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      price: 120,
      weight: "100 gm",
      category: "Chocolate",
      color: "#4B3621",
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

  // Navigate to product detail page
  const navigateToProduct = (productId) => {
    window.location.href = `/product/${productId}`
  }

  // Handle Buy Now button click
  const handleBuyNow = (productId, e) => {
    e.stopPropagation() // Prevent default navigation
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
          <h2 className="prod-title">BEST SELLING PRODUCTS</h2>
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
            {bestSellers.map((product) => (
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

export default BestSellingSection
