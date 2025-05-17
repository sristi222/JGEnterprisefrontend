"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const navigate = useNavigate()

  // Sample categories for filter
  const categories = [
    "All Categories",
    "Fruits",
    "Vegetables",
    "Bakery",
    "Dairy & Eggs",
    "Meat",
    "Seafood",
    "Beverages",
    "Snacks",
    "Packaged Foods",
  ]

  useEffect(() => {
    // Simulate API call to fetch products
    setTimeout(() => {
      const sampleProducts = [
        {
          id: 1,
          name: "Fresh Apples",
          category: "Fruits",
          subcategory: "Fresh Fruits",
          price: 120,
          unit: "kg",
          stock: 50,
          image:
            "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 2,
          name: "Organic Spinach",
          category: "Vegetables",
          subcategory: "Leafy Greens",
          price: 40,
          unit: "bunch",
          stock: 15,
          image:
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 3,
          name: "Whole Wheat Bread",
          category: "Bakery",
          subcategory: "Breads",
          price: 35,
          unit: "pack",
          stock: 25,
          image:
            "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 4,
          name: "Farm Fresh Eggs",
          category: "Dairy & Eggs",
          subcategory: "Eggs",
          price: 75,
          unit: "dozen",
          stock: 30,
          image:
            "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 5,
          name: "Chicken Breast",
          category: "Meat",
          subcategory: "Poultry",
          price: 250,
          unit: "500g",
          stock: 0,
          image:
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 6,
          name: "Atlantic Salmon",
          category: "Seafood",
          subcategory: "Fish",
          price: 350,
          unit: "500g",
          stock: 10,
          image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 7,
          name: "Organic Milk",
          category: "Dairy & Eggs",
          subcategory: "Milk",
          price: 60,
          unit: "liter",
          stock: 20,
          image:
            "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
        {
          id: 8,
          name: "Coca Cola",
          category: "Beverages",
          subcategory: "Soft Drinks",
          price: 40,
          unit: "bottle",
          stock: 100,
          image:
            "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        },
      ]
      setProducts(sampleProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // In a real app, you would call an API to delete the product
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "" || categoryFilter === "All Categories" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

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
                <option key={category} value={category}>
                  {category}
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
                <tr key={product.id}>
                  <td>
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-thumbnail" />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    {product.category} <span className="subcategory">({product.subcategory})</span>
                  </td>
                  <td>
                    NRs.{product.price}/{product.unit}
                  </td>
                  <td>
                    <span
                      className={`stock-status ${product.stock === 0 ? "out-of-stock" : product.stock < 20 ? "low-stock" : ""}`}
                    >
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
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
