"use client"

import { useState, useEffect, useRef } from "react"
import "./HeroSection.css"

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef(null)

  const categories = [
    {
      id: 1,
      name: "Fresh Fruits",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      name: "Vegetables",
      image:
        "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      name: "Bakery & Dairy",
      image:
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      name: "Meat & Seafood",
      image:
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      name: "Packaged Foods",
      image:
        "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      name: "Beverages",
      image:
        "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
  ]

  // Auto slide functionality
  useEffect(() => {
    const startSlideShow = () => {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % categories.length)
      }, 4000)
    }

    startSlideShow()

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [categories.length])

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index)
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % categories.length)
      }, 4000)
    }
  }

  return (
    <section className="grocery-hero-section">
      <div className="grocery-hero-slider">
        <div className="grocery-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {categories.map((category) => (
            <div className="grocery-slide" key={category.id}>
              <img src={category.image || "/placeholder.svg"} alt={category.name} className="grocery-slide-image" />
              <div className="grocery-slide-overlay"></div>
              <div className="grocery-slide-content">
                <h2 className="grocery-slide-title">{category.name}</h2>
                <div className="grocery-store-name">Dinesh Laal's Shop</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grocery-slider-dots">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`grocery-slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
