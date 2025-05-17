"use client"

import { useState, useEffect } from "react"
import "./HeroSlider.css"

function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image: null,
    imagePreview: null,
    link: "",
    active: true,
  })
  const [editingSlide, setEditingSlide] = useState(null)

  useEffect(() => {
    // Simulate API call to fetch hero slides
    setTimeout(() => {
      const sampleSlides = [
        {
          id: 1,
          title: "Fresh Fruits & Vegetables",
          subtitle: "Delivered to your doorstep",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          link: "/products/fruits-vegetables",
          active: true,
          order: 1,
        },
        {
          id: 2,
          title: "Pantry Essentials",
          subtitle: "Stock up your kitchen",
          image:
            "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          link: "/products/pantry",
          active: true,
          order: 2,
        },
        {
          id: 3,
          title: "Fresh Bakery",
          subtitle: "Baked daily with love",
          image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          link: "/products/bakery",
          active: false,
          order: 3,
        },
      ]
      setSlides(sampleSlides)
      setLoading(false)
    }, 1000)
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const updatedSlide = editingSlide
        ? { ...editingSlide, image: file, imagePreview: URL.createObjectURL(file) }
        : { ...newSlide, image: file, imagePreview: URL.createObjectURL(file) }

      if (editingSlide) {
        setEditingSlide(updatedSlide)
      } else {
        setNewSlide(updatedSlide)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value

    if (editingSlide) {
      setEditingSlide({ ...editingSlide, [name]: inputValue })
    } else {
      setNewSlide({ ...newSlide, [name]: inputValue })
    }
  }

  const handleAddSlide = (e) => {
    e.preventDefault()
    // Simulate API call to add slide
    const newSlideObj = {
      id: slides.length + 1,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      image: newSlide.imagePreview, // In a real app, you would upload the image and get a URL
      link: newSlide.link,
      active: newSlide.active,
      order: slides.length + 1,
    }
    setSlides([...slides, newSlideObj])
    setNewSlide({
      title: "",
      subtitle: "",
      image: null,
      imagePreview: null,
      link: "",
      active: true,
    })
    setShowAddForm(false)
  }

  const handleUpdateSlide = (e) => {
    e.preventDefault()
    // Simulate API call to update slide
    const updatedSlides = slides.map((slide) =>
      slide.id === editingSlide.id
        ? {
            ...editingSlide,
            image: editingSlide.imagePreview || editingSlide.image, // Use existing image if no new one
          }
        : slide,
    )
    setSlides(updatedSlides)
    setEditingSlide(null)
  }

  const handleDeleteSlide = (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      // In a real app, you would call an API to delete the slide
      setSlides(slides.filter((slide) => slide.id !== id))
    }
  }

  const handleToggleActive = (id) => {
    // Simulate API call to toggle slide active status
    const updatedSlides = slides.map((slide) => (slide.id === id ? { ...slide, active: !slide.active } : slide))
    setSlides(updatedSlides)
  }

  const handleReorder = (id, direction) => {
    // Find the slide to move and its current index
    const slideIndex = slides.findIndex((slide) => slide.id === id)
    if ((direction === "up" && slideIndex === 0) || (direction === "down" && slideIndex === slides.length - 1)) {
      return // Can't move further in this direction
    }

    // Create a copy of the slides array
    const newSlides = [...slides]

    // Swap the slide with the adjacent one
    const targetIndex = direction === "up" ? slideIndex - 1 : slideIndex + 1
    const temp = newSlides[slideIndex]
    newSlides[slideIndex] = newSlides[targetIndex]
    newSlides[targetIndex] = temp

    // Update the order property
    newSlides.forEach((slide, index) => {
      slide.order = index + 1
    })

    setSlides(newSlides)
  }

  if (loading) {
    return <div className="loading-container">Loading hero slides...</div>
  }

  return (
    <div className="hero-slider-page">
      <div className="hero-slider-header">
        <h2>Hero Slider Management</h2>
        <button className="add-slide-btn" onClick={() => setShowAddForm(true)}>
          Add New Slide
        </button>
      </div>

      {(showAddForm || editingSlide) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSlide ? "Edit Slide" : "Add New Slide"}</h3>
              <button
                className="close-modal"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingSlide(null)
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={editingSlide ? handleUpdateSlide : handleAddSlide}>
              <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingSlide ? editingSlide.title : newSlide.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subtitle">Subtitle</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={editingSlide ? editingSlide.subtitle : newSlide.subtitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="link">Link URL</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={editingSlide ? editingSlide.link : newSlide.link}
                  onChange={handleInputChange}
                  placeholder="e.g., /products/category"
                />
              </div>
              <div className="form-group">
                <label>Slide Image*</label>
                <div className="image-upload-container">
                  <div
                    className="image-preview"
                    style={{
                      backgroundImage:
                        (editingSlide && (editingSlide.imagePreview || editingSlide.image)) ||
                        (newSlide.imagePreview && `url(${newSlide.imagePreview})`) ||
                        "none",
                    }}
                  >
                    {!(
                      (editingSlide && (editingSlide.imagePreview || editingSlide.image)) ||
                      newSlide.imagePreview
                    ) && <span>No image selected</span>}
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload-input"
                    required={!editingSlide}
                  />
                  <label htmlFor="image" className="image-upload-label">
                    {editingSlide ? "Change Image" : "Choose Image"}
                  </label>
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label htmlFor="active" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={editingSlide ? editingSlide.active : newSlide.active}
                    onChange={handleInputChange}
                  />
                  <span>Active (visible on website)</span>
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSlide(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingSlide ? "Update Slide" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="slides-container">
        {slides.map((slide) => (
          <div className={`slide-card ${!slide.active ? "inactive" : ""}`} key={slide.id}>
            <div className="slide-image">
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} />
              {!slide.active && <div className="inactive-overlay">Inactive</div>}
            </div>
            <div className="slide-details">
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
              {slide.link && (
                <div className="slide-link">
                  <strong>Link:</strong> {slide.link}
                </div>
              )}
              <div className="slide-order">
                <strong>Order:</strong> {slide.order}
              </div>
            </div>
            <div className="slide-actions">
              <button
                className="edit-btn"
                onClick={() =>
                  setEditingSlide({
                    ...slide,
                    imagePreview: null,
                  })
                }
              >
                Edit
              </button>
              <button
                className={`toggle-btn ${slide.active ? "active" : "inactive"}`}
                onClick={() => handleToggleActive(slide.id)}
              >
                {slide.active ? "Deactivate" : "Activate"}
              </button>
              <button className="delete-btn" onClick={() => handleDeleteSlide(slide.id)}>
                Delete
              </button>
            </div>
            <div className="reorder-actions">
              <button
                className="reorder-btn up"
                onClick={() => handleReorder(slide.id, "up")}
                disabled={slide.order === 1}
              >
                ↑
              </button>
              <button
                className="reorder-btn down"
                onClick={() => handleReorder(slide.id, "down")}
                disabled={slide.order === slides.length}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="no-slides">
            <p>No slides found. Add your first slide to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroSlider
