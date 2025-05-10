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
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortOption, setSortOption] = useState("default")

  // Get query parameters
  const queryParams = new URLSearchParams(location.search)
  const categoryParam = queryParams.get("category")
  const searchParam = queryParams.get("search")

  useEffect(() => {
    // Fetch products (simulated)
    const fetchProducts = () => {
      setLoading(true)

      // This would be replaced with an actual API call in a real app
      const allProducts = [
        {
          id: 1,
          name: "Alphonso Mango, 2pcs",
          image:
            "https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 540,
          originalPrice: 600,
          weight: "2 Pcs",
          sale: true,
          category: "fruits",
          color: "#8B7D39",
        },
        {
          id: 2,
          name: "Bikano Kashmiri Mixture, 200gm",
          image: "https://m.media-amazon.com/images/I/71+tvmf7XPL._SL1350_.jpg",
          price: 200,
          weight: "200 gm",
          category: "snacks",
          color: "#9C2759",
        },
        {
          id: 3,
          name: "Bikano Lajawab Mixture Bhujia, 200gm",
          image:
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 150,
          weight: "200 gm",
          category: "snacks",
          color: "#C44536",
        },
        {
          id: 4,
          name: "Bikano Moong Dal, 260gm",
          image:
            "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 200,
          weight: "260 gm",
          category: "snacks",
          color: "#1D5B9C",
        },
        {
          id: 5,
          name: "Organic Fresh Vegetables Pack",
          image:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 350,
          weight: "1 kg",
          category: "vegetables",
          color: "#2E8B57",
        },
        {
          id: 6,
          name: "Fresh Strawberries, 250gm",
          image:
            "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 180,
          originalPrice: 220,
          weight: "250 gm",
          sale: true,
          category: "fruits",
          color: "#C22126",
        },
        {
          id: 7,
          name: "Organic Bananas, 6pcs",
          image:
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 80,
          weight: "6 Pcs",
          category: "fruits",
          color: "#FFD700",
        },
        {
          id: 8,
          name: "Premium Cashew Nuts, 250gm",
          image:
            "https://images.unsplash.com/photo-1563292769-4e05b7efd5fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 450,
          originalPrice: 500,
          weight: "250 gm",
          sale: true,
          category: "dry-fruits",
          color: "#8B4513",
        },
        {
          id: 9,
          name: "Organic Honey, 500gm",
          image:
            "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 350,
          weight: "500 gm",
          category: "honey",
          color: "#FFD700",
        },
        {
          id: 10,
          name: "Fresh Avocados, 2pcs",
          image:
            "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 220,
          weight: "2 Pcs",
          category: "fruits",
          color: "#2E8B57",
        },
        {
          id: 11,
          name: "Organic Brown Rice, 1kg",
          image:
            "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 180,
          weight: "1 kg",
          category: "grains",
          color: "#CD853F",
        },
        {
          id: 12,
          name: "Dark Chocolate Bar, 100gm",
          image:
            "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 120,
          weight: "100 gm",
          category: "chocolate",
          color: "#4B3621",
        },
        {
          id: 13,
          name: "Fresh Milk, 1L",
          image:
            "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 90,
          weight: "1 L",
          category: "dairy",
          color: "#F5F5F5",
        },
        {
          id: 14,
          name: "Whole Wheat Bread, 400gm",
          image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 60,
          weight: "400 gm",
          category: "bakery",
          color: "#D2691E",
        },
        {
          id: 15,
          name: "Organic Green Tea, 25 bags",
          image:
            "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 150,
          weight: "25 bags",
          category: "beverages",
          color: "#2E8B57",
        },
        {
          id: 16,
          name: "Turmeric Powder, 100gm",
          image:
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          price: 80,
          weight: "100 gm",
          category: "spices",
          color: "#FFA500",
        },
      ]

      setProducts(allProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products]

      // Apply category filter from URL parameter if present
      if (categoryParam) {
        setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1))
        filtered = filtered.filter((product) => product.category.toLowerCase() === categoryParam.toLowerCase())
      }

      // Apply search filter if present
      if (searchParam) {
        const searchTerm = searchParam.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm),
        )
      }

      // Apply category filter from dropdown if not "All"
      if (selectedCategory !== "All" && !categoryParam) {
        filtered = filtered.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase())
      }

      // Apply sorting
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
          // Default sorting (newest first or featured)
          break
      }

      setFilteredProducts(filtered)
    }
  }, [products, selectedCategory, sortOption, categoryParam, searchParam])

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)

    // Update URL when category changes
    if (category === "All") {
      // Remove category parameter but keep search if it exists
      if (searchParam) {
        navigate(`/products?search=${searchParam}`)
      } else {
        navigate("/products")
      }
    } else {
      // Add category parameter and keep search if it exists
      if (searchParam) {
        navigate(`/products?category=${category.toLowerCase()}&search=${searchParam}`)
      } else {
        navigate(`/products?category=${category.toLowerCase()}`)
      }
    }
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  if (loading) {
    return (
      <div className="products-loading">
        <div className="products-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
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
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="filter-select"
              >
                <option value="All">All Categories</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Snacks">Snacks</option>
                <option value="Dairy">Dairy Products</option>
                <option value="Bakery">Bakery</option>
                <option value="Beverages">Beverages</option>
                <option value="Dry-fruits">Dry Fruits & Nuts</option>
                <option value="Spices">Spices</option>
                <option value="Grains">Grains & Cereals</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Honey">Honey</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Sort By:</label>
              <select id="sort-filter" value={sortOption} onChange={handleSortChange} className="filter-select">
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
