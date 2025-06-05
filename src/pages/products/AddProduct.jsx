"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductForm.css";

function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
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
  });

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
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value) {
        formDataToSend.append("image", value);
      } else {
        formDataToSend.append(key, value);
      }
    });
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formDataToSend,
      });
      if (res.ok) {
        const result = await res.json();
        console.log("✅ Product added:", result);
        navigate("/admin/products");
      } else {
        const err = await res.json();
        console.error("❌ Failed to add product:", err);
        alert("Error: " + (err.error || "Failed to add product."));
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>Add New Product</h2>
        <button className="back-button" onClick={() => navigate("/admin/products")}>Back to Products</button>
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
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
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
                    categories.find((cat) => cat._id === formData.category)?.subcategories.map((subcat) => (
                      <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price*</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="costPrice">Cost Price</label>
                <input type="number" id="costPrice" name="costPrice" value={formData.costPrice} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unit">Unit*</label>
                <select id="unit" name="unit" value={formData.unit} onChange={handleChange} required>
                  {unitOptions.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock*</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="displayInLatest">
                <input type="checkbox" id="displayInLatest" name="displayInLatest" checked={formData.displayInLatest} onChange={handleChange} /> Display in Latest
              </label>
              <label htmlFor="displayInBestSelling">
                <input type="checkbox" id="displayInBestSelling" name="displayInBestSelling" checked={formData.displayInBestSelling} onChange={handleChange} /> Display in Best Selling
              </label>
              <label htmlFor="onSale">
                <input type="checkbox" id="onSale" name="onSale" checked={formData.onSale} onChange={handleChange} /> On Sale
              </label>
              {formData.onSale && (
                <div className="form-group">
                  <label htmlFor="salePrice">Sale Price*</label>
                  <input type="number" id="salePrice" name="salePrice" value={formData.salePrice} onChange={handleChange} required />
                </div>
              )}
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
              {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" style={{ maxWidth: "100%", marginTop: "10px" }} />}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>Cancel</button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
