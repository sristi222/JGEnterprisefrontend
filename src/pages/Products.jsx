"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        } else {
          console.error("Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(["All Categories", ...data.map((cat) => ({ id: cat._id, name: cat.name }))])
        }
      } catch (err) {
        console.error("Error loading categories:", err)
      }
    }

    fetchProducts()
    fetchCategories()
  }, [])

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
        const result = await res.json()
        if (result.success) {
          setProducts(products.filter((product) => product._id !== id))
        } else {
          alert("Failed to delete product")
        }
      } catch (err) {
        console.error("Error deleting product:", err)
        alert("Error deleting product")
      }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "All Categories" ||
      product.category?._id === categoryFilter ||
      product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // ✅ Cloudinary-safe image rendering
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.svg"
    return url
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Link to="/admin/products/add" className="add-product-btn">
          Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="loading-container">Loading products...</div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={getImageUrl(product.imageUrl || product.image)}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    {typeof product.category === "object"
                      ? product.category.name
                      : "Unknown Category"}{" "}
                    <span className="subcategory">({product.subcategory})</span>
                  </td>
                  <td>
                    NRs.{product.price}/{product.unit}
                  </td>
                  <td>
                    <span
                      className={`stock-status ${
                        product.stock === 0
                          ? "out-of-stock"
                          : product.stock < 20
                          ? "low-stock"
                          : ""
                      }`}
                    >
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Products
