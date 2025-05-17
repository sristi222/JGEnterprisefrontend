"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ProductForm.css"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    costPrice: "",
    unit: "",
    stock: "",
    image: null,
    imagePreview: null,
    displayInLatest: false,
    displayInBestSelling: false,
    onSale: false,
    salePrice: "",
  })

  // Sample categories and subcategories
  const categories = [
    {
      name: "Fruits",
      subcategories: ["Fresh Fruits", "Seasonal Fruits", "Exotic Fruits", "Dried Fruits"],
    },
    {
      name: "Vegetables",
      subcategories: ["Fresh Vegetables", "Leafy Greens", "Organic Vegetables", "Root Vegetables"],
    },
    {
      name: "Bakery",
      subcategories: ["Breads", "Cakes", "Pastries", "Cookies"],
    },
    {
      name: "Dairy & Eggs",
      subcategories: ["Milk", "Cheese", "Yogurt", "Eggs", "Butter"],
    },
    {
      name: "Meat",
      subcategories: ["Chicken", "Mutton", "Beef", "Pork", "Sausages"],
    },
    {
      name: "Seafood",
      subcategories: ["Fish", "Prawns", "Crabs", "Other Seafood"],
    },
  ]

  const unitOptions = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "pcs", label: "Pieces (pcs)" },
    { value: "dozen", label: "Dozen" },
    { value: "pack", label: "Pack" },
    { value: "box", label: "Box" },
    { value: "bottle", label: "Bottle" },
    { value: "liter", label: "Liter (L)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "bunch", label: "Bunch" },
  ]

  useEffect(() => {
    // Simulate API call to fetch product details
    setTimeout(() => {
      // Sample product data for editing
      const productData = {
        id: Number.parseInt(id),
        name: "Fresh Apples",
        description: "Fresh and juicy apples sourced directly from Himalayan orchards.",
        category: "Fruits",
        subcategory: "Fresh Fruits",
        price: "120",
        costPrice: "90",
        unit: "kg",
        stock: "50",
        imagePreview:
          "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        displayInLatest: true,
        displayInBestSelling: false,
        onSale: true,
        salePrice: "99",
      }
      setFormData(productData)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call to update product
    setTimeout(() => {
      console.log("Product updated:", formData)
      setIsSubmitting(false)
      navigate("/admin/products")
    }, 1500)
  }

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (formData.onSale && formData.price && formData.salePrice) {
      const regularPrice = Number.parseFloat(formData.price)
      const salePrice = Number.parseFloat(formData.salePrice)
      if (regularPrice > 0 && salePrice > 0 && salePrice < regularPrice) {
        const discount = ((regularPrice - salePrice) / regularPrice) * 100
        return discount.toFixed(0)
      }
    }
    return 0
  }

  if (loading) {
    return <div className="loading-container">Loading product details...</div>
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>Edit Product</h2>
        <button className="back-button" onClick={() => navigate("/admin/products")}>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory*</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category &&
                    categories
                      .find((cat) => cat.name === formData.category)
                      ?.subcategories.map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* Display Options */}
            <div className="form-group">
              <div className="form-section-title">Display Options</div>
              <div className="form-divider"></div>
              <div className="checkbox-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="displayInLatest"
                    name="displayInLatest"
                    checked={formData.displayInLatest}
                    onChange={handleChange}
                  />
                  <label htmlFor="displayInLatest">Display in Latest Products section</label>
                </div>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="displayInBestSelling"
                    name="displayInBestSelling"
                    checked={formData.displayInBestSelling}
                    onChange={handleChange}
                  />
                  <label htmlFor="displayInBestSelling">Display in Best Selling Products section</label>
                </div>
              </div>
            </div>

            {/* Pricing Options */}
            <div className="form-group">
              <div className="form-section-title">Pricing Options</div>
              <div className="form-divider"></div>
              <div className="checkbox-container">
                <input type="checkbox" id="onSale" name="onSale" checked={formData.onSale} onChange={handleChange} />
                <label htmlFor="onSale">Mark as On Sale</label>
              </div>

              {formData.onSale && (
                <div className="sale-info">
                  <p>Products marked as "On Sale" will display a sale tag and show both the regular and sale prices.</p>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">{formData.onSale ? "Regular Price*" : "Selling Price*"}</label>
                <div className="price-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {formData.onSale ? (
                <div className="form-group">
                  <label htmlFor="salePrice">Sale Price*</label>
                  <div className="price-input">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  {formData.price &&
                    formData.salePrice &&
                    Number.parseFloat(formData.salePrice) < Number.parseFloat(formData.price) && (
                      <div className="sale-info">
                        <p>Discount: {calculateDiscount()}% off</p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="costPrice">Cost Price</label>
                  <div className="price-input">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      id="costPrice"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unit">Unit*</label>
                <select id="unit" name="unit" value={formData.unit} onChange={handleChange} required>
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity*</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-upload-container">
                <div
                  className="image-preview"
                  style={{
                    backgroundImage: formData.imagePreview ? `url(${formData.imagePreview})` : "none",
                  }}
                >
                  {!formData.imagePreview && <span>No image selected</span>}
                  {formData.onSale && formData.imagePreview && <div className="sale-tag-preview">SALE</div>}
                </div>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
                <label htmlFor="image" className="image-upload-label">
                  Change Image
                </label>
              </div>
            </div>

            {formData.onSale && formData.costPrice && (
              <div className="form-group">
                <label>Cost Price</label>
                <div className="price-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="costPrice"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
