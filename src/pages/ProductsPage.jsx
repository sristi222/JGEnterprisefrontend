"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import "./ProductsPage.css"

function ProductsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [sortOption, setSortOption] = useState("default")

  const queryParams = new URLSearchParams(location.search)
  const searchParam = queryParams.get("search") || ""
  const categoryParam = queryParams.get("category")
  const subcategoryParam = queryParams.get("subcategory")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        if (data.success) {
          const normalized = data.products.map(p => ({
            ...p,
            subcategory: typeof p.subcategory === "object" ? p.subcategory.name : p.subcategory
          }))
          setProducts(normalized)
        }
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Error loading categories:", err)
      }
    }

    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      const cat = categories.find(c => c._id === categoryParam)
      setSubcategories(cat?.subcategories || [])
      setSelectedSubcategory(subcategoryParam?.toLowerCase().trim() || "All")
    } else {
      setSelectedCategory("All")
      setSelectedSubcategory("All")
      setSubcategories([])
    }

    const sortParam = queryParams.get("sort")
    if (sortParam) {
      setSortOption(sortParam)
    }
  }, [location.search, categories])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category?._id === selectedCategory)
      if (selectedSubcategory !== "All") {
        filtered = filtered.filter(
          p => (p.subcategory || "").toLowerCase().trim() === selectedSubcategory
        )
      }
    }

    if (searchParam) {
      const term = searchParam.toLowerCase()
      filtered = filtered.filter(p => {
        const name = typeof p.name === "object" ? p.name.name : p.name
        const sub = typeof p.subcategory === "object" ? p.subcategory.name : p.subcategory
        return name?.toLowerCase().includes(term) || sub?.toLowerCase().includes(term)
      })
    }

    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name-a-z":
        filtered.sort((a, b) => {
          const nameA = typeof a.name === "object" ? a.name.name : a.name
          const nameB = typeof b.name === "object" ? b.name.name : b.name
          return nameA?.localeCompare(nameB)
        })
        break
      case "name-z-a":
        filtered.sort((a, b) => {
          const nameA = typeof a.name === "object" ? a.name.name : a.name
          const nameB = typeof b.name === "object" ? b.name.name : b.name
          return nameB?.localeCompare(nameA)
        })
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubcategory, sortOption, searchParam])

  const updateUrlWithFilters = (category, subcategory, sort) => {
    const params = new URLSearchParams()
    if (category !== "All") params.set("category", category)
    if (subcategory !== "All") params.set("subcategory", subcategory.toLowerCase().trim())
    if (sort !== "default") params.set("sort", sort)
    if (searchParam) params.set("search", searchParam)
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>Our Products</h1>
          {searchParam && (
            <p className="search-results">
              Search results for: <span>"{searchParam}"</span>
            </p>
          )}
        </div>

        <div className="products-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const cat = e.target.value
                  setSelectedCategory(cat)
                  setSelectedSubcategory("All")
                  const selectedCat = categories.find(c => c._id === cat)
                  setSubcategories(selectedCat?.subcategories || [])
                  updateUrlWithFilters(cat, "All", sortOption)
                }}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {selectedCategory !== "All" && (
              <div className="filter-group">
                <label>Subcategory:</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    const sub = e.target.value.toLowerCase().trim()
                    setSelectedSubcategory(sub)
                    updateUrlWithFilters(selectedCategory, sub, sortOption)
                  }}
                >
                  <option value="All">All Subcategories</option>
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub.name.toLowerCase().trim()}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value)
                  updateUrlWithFilters(selectedCategory, selectedSubcategory, e.target.value)
                }}
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="products-loading">
            <div className="products-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
