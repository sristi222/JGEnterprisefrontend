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
  const [searchTerm, setSearchTerm] = useState("")

  const API_BASE = import.meta.env.VITE_API_BASE_URL

  const queryParams = new URLSearchParams(location.search)
  const searchParam = queryParams.get("search") || ""
  const categoryParam = queryParams.get("category")
  const subcategoryParam = queryParams.get("subcategory")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error("Expected array but got:", data)
          setCategories([])
        }
      } catch (err) {
        console.error("Error loading categories:", err)
        setCategories([])
      }
    }

    fetchProducts()
    fetchCategories()
  }, [API_BASE])

  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      setSelectedCategory(categoryParam)
      const cat = categories.find((c) => c._id === categoryParam)
      setSubcategories(cat?.subcategories || [])
      setSelectedSubcategory(subcategoryParam || "All")
    } else {
      setSelectedCategory("All")
      setSelectedSubcategory("All")
      setSubcategories([])
    }

    const sortParam = queryParams.get("sort")
    if (sortParam) {
      setSortOption(sortParam)
    }

    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [location.search, categories, categoryParam, subcategoryParam, searchParam])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => {
        const categoryId = typeof p.category === "object" ? p.category._id : p.category
        return categoryId === selectedCategory
      })

      if (selectedSubcategory !== "All") {
        const selectedSubcategoryObj = subcategories.find((sub) => sub.name === selectedSubcategory)
        const selectedSubcategoryId = selectedSubcategoryObj?._id

        filtered = filtered.filter((p) => {
          let productSubcategoryId
          if (typeof p.subcategory === "object" && p.subcategory._id) {
            productSubcategoryId = p.subcategory._id
          } else if (typeof p.subcategory === "string") {
            productSubcategoryId = p.subcategory
          }
          return productSubcategoryId === selectedSubcategoryId
        })
      }
    }

    if (searchTerm || searchParam) {
      const term = (searchTerm || searchParam).toLowerCase()
      filtered = filtered.filter((p) => {
        const name = typeof p.name === "object" ? p.name.name : p.name
        const sub = typeof p.subcategory === "object" ? p.subcategory.name : p.subcategory
        const category = typeof p.category === "object" ? p.category.name : p.category
        return (
          name?.toLowerCase().includes(term) ||
          sub?.toLowerCase().includes(term) ||
          category?.toLowerCase().includes(term)
        )
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
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubcategory, sortOption, searchTerm, searchParam, subcategories])

  const updateUrlWithFilters = (category, subcategory, sort, search) => {
    const params = new URLSearchParams()
    if (category !== "All") params.set("category", category)
    if (subcategory !== "All") params.set("subcategory", subcategory)
    if (sort !== "default") params.set("sort", sort)
    if (search) params.set("search", search)
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
  }

  const handleCategoryChange = (e) => {
    const cat = e.target.value
    setSelectedCategory(cat)
    setSelectedSubcategory("All")

    const selectedCat = categories.find((c) => c._id === cat)
    setSubcategories(selectedCat?.subcategories || [])

    updateUrlWithFilters(cat, "All", sortOption, searchTerm)
  }

  const handleSubcategoryChange = (e) => {
    const sub = e.target.value
    setSelectedSubcategory(sub)
    updateUrlWithFilters(selectedCategory, sub, sortOption, searchTerm)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    updateUrlWithFilters(selectedCategory, selectedSubcategory, e.target.value, searchTerm)
  }

  const handleSearchChange = (e) => {
    const search = e.target.value
    setSearchTerm(search)
    updateUrlWithFilters(selectedCategory, selectedSubcategory, sortOption, search)
  }

  return (
    <div className="products-listing-page">
      <div className="products-listing-container">
        <div className="products-listing-header">
          <h1>Our Products</h1>
          <p className="products-listing-search-results">
            Showing <span>{filteredProducts.length}</span> products
            {(searchParam || searchTerm) && (
              <>
                {" "}
                for "<span>{searchParam || searchTerm}</span>"
              </>
            )}
          </p>
        </div>

        <div className="products-listing-filters">
          <div className="products-listing-filter-row">
            <div className="products-listing-filter-group">
              <label>Category:</label>
              <select
                className="products-listing-filter-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory !== "All" && subcategories.length > 0 && (
              <div className="products-listing-filter-group">
                <label>Subcategory:</label>
                <select
                  className="products-listing-filter-select"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                >
                  <option value="All">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="products-listing-filter-group">
              <label>Sort By:</label>
              <select
                className="products-listing-filter-select"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>

            <div className="products-listing-filter-group">
              <label>Search:</label>
              <input
                type="text"
                className="products-listing-filter-select search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="products-listing-loading">
            <div className="products-listing-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-listing-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="products-listing-no-products">
            <p>No products found. Try changing your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
