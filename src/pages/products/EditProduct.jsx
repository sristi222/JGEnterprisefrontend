"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ProductForm.css"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    costPrice: "",
    unit: "kg",
    stock: "",
    image: null,
    imagePreview: null,
    displayInLatest: false,
    displayInBestSelling: false,
    onSale: false,
    salePrice: "",
  })

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

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Error loading categories", err)
      }
    }
    fetchCategories()
  }, [])

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`)
        const data = await res.json()
        if (res.ok) {
          setFormData({
            ...data,
            image: null,
            imagePreview: data.imageUrl ? `http://localhost:5000${data.imageUrl}` : null,
          })
        } else {
          alert("Failed to fetch product")
          navigate("/admin/products")
        }
      } catch (err) {
        console.error("Error loading product:", err)
        alert("Server error")
        navigate("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formDataToSend = new FormData()
    for (const [key, value] of Object.entries(formData)) {
      if (key === "image" && value) {
        formDataToSend.append("image", value)
      } else {
        formDataToSend.append(key, value)
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })
      const data = await res.json()
      if (res.ok) {
        alert("✅ Product updated")
        navigate("/admin/products")
      } else {
        alert(data.error || "Failed to update product")
      }
    } catch (err) {
      console.error("Update error:", err)
      alert("Server error while updating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDiscount = () => {
    if (formData.onSale && formData.price && formData.salePrice) {
      const regular = parseFloat(formData.price)
      const sale = parseFloat(formData.salePrice)
      return regular > 0 && sale > 0 && sale < regular
        ? (((regular - sale) / regular) * 100).toFixed(0)
        : 0
    }
    return 0
  }

  if (loading) return <div className="loading-container">Loading product details...</div>

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
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory*</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleChange} required disabled={!formData.category}>
                  <option value="">Select Subcategory</option>
                  {formData.category &&
                    categories.find((cat) => cat._id === formData.category)?.subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label><input type="checkbox" name="displayInLatest" checked={formData.displayInLatest} onChange={handleChange} /> Display in Latest</label>
              <label><input type="checkbox" name="displayInBestSelling" checked={formData.displayInBestSelling} onChange={handleChange} /> Display in Best Selling</label>
              <label><input type="checkbox" name="onSale" checked={formData.onSale} onChange={handleChange} /> On Sale</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{formData.onSale ? "Regular Price*" : "Price*"}</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              {formData.onSale ? (
                <div className="form-group">
                  <label>Sale Price*</label>
                  <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} required />
                  {calculateDiscount() > 0 && <div className="sale-info">Discount: {calculateDiscount()}%</div>}
                </div>
              ) : (
                <div className="form-group">
                  <label>Cost Price</label>
                  <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Unit*</label>
                <select name="unit" value={formData.unit} onChange={handleChange} required>
                  {unitOptions.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stock Quantity*</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-upload-container">
                <div className="image-preview" style={{ backgroundImage: formData.imagePreview ? `url(${formData.imagePreview})` : "none" }}>
                  {!formData.imagePreview && <span>No image selected</span>}
                  {formData.imagePreview && formData.onSale && <div className="sale-tag-preview">SALE</div>}
                </div>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="image" className="image-upload-label">Change Image</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>Cancel</button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
