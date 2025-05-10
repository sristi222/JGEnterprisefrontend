import "./HeroSection.css"
import groceryImage from "../assets/grocery.png"

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {/* Grocery Delivery Badge */}
            <div className="delivery-badge">
              <span className="badge-icon">
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
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </span>
              <span>Grocery Deliver Service</span>
            </div>

            {/* Main Heading */}
            <div className="hero-heading">
              <h1>
                Fastest <span className="highlight">Delivery</span>
                <br />& Easy <span className="bold">Pickup.</span>
              </h1>
            </div>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              <a href="/shop" className="shop-now-btn">
                Shop Now
              </a>
              <button className="watch-video-btn">
                <span className="play-icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </span>
                Watch Video
              </button>
            </div>

            {/* Customer Reviews */}
            <div className="customer-reviews">
              <div className="review-header">
                <div className="customer-avatars">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="avatar"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="avatar"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="avatar"
                  />
                </div>
                <div className="review-info">
                  <p className="review-title">Our Happy Customer</p>
                  <div className="rating">
                    <span className="star-icon">⭐</span>
                    <span className="rating-value">4.5</span>
                    <span className="review-count">(12.5k Review)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* App Download */}
            <div className="app-download">
              
              
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <img
              src={groceryImage || "/placeholder.svg"}
              alt="Fresh groceries and vegetables"
              className="hero-image-content"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection