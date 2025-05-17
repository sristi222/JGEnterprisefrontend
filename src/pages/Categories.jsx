"use client"

import { useState, useEffect } from "react"
import "./Categories.css"

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: null })
  const [editCategory, setEditCategory] = useState({ id: null, name: "", description: "", status: "active" })

  useEffect(() => {
    // Simulate API call to fetch categories
    setTimeout(() => {
      const sampleCategories = [
        {
          id: 1,
          name: "Fruits",
          description: "Fresh and seasonal fruits",
          subcategories: [
            { id: 1, name: "Fresh Fruits" },
            { id: 2, name: "Seasonal Fruits" },
            { id: 3, name: "Exotic Fruits" },
            { id: 4, name: "Dried Fruits" },
          ],
          productCount: 45,
          status: "active",
        },
        {
          id: 2,
          name: "Vegetables",
          description: "Farm-fresh vegetables",
          subcategories: [
            { id: 5, name: "Fresh Vegetables" },
            { id: 6, name: "Leafy Greens" },
            { id: 7, name: "Organic Vegetables" },
            { id: 8, name: "Root Vegetables" },
          ],
          productCount: 38,
          status: "active",
        },
        {
          id: 3,
          name: "Bakery",
          description: "Freshly baked goods",
          subcategories: [
            { id: 9, name: "Breads" },
            { id: 10, name: "Cakes" },
            { id: 11, name: "Pastries" },
            { id: 12, name: "Cookies" },
          ],
          productCount: 18,
          status: "active",
        },
        {
          id: 4,
          name: "Dairy & Eggs",
          description: "Fresh dairy products and eggs",
          subcategories: [
            { id: 13, name: "Milk" },
            { id: 14, name: "Cheese" },
            { id: 15, name: "Yogurt" },
            { id: 16, name: "Eggs" },
            { id: 17, name: "Butter" },
          ],
          productCount: 22,
          status: "active",
        },
        {
          id: 5,
          name: "Meat",
          description: "Fresh and frozen meat products",
          subcategories: [
            { id: 18, name: "Chicken" },
            { id: 19, name: "Mutton" },
            { id: 20, name: "Beef" },
            { id: 21, name: "Pork" },
            { id: 22, name: "Sausages" },
          ],
          productCount: 28,
          status: "active",
        },
        {
          id: 6,
          name: "Seafood",
          description: "Fresh seafood options",
          subcategories: [
            { id: 23, name: "Fish" },
            { id: 24, name: "Prawns" },
            { id: 25, name: "Crabs" },
            { id: 26, name: "Other Seafood" },
          ],
          productCount: 15,
          status: "active",
        },
      ]
      setCategories(sampleCategories)
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddCategory = (e) => {
    e.preventDefault()
    // Simulate API call to add category
    const newCategoryObj = {
      id: categories.length + 1,
      name: newCategory.name,
      description: newCategory.description,
      subcategories: [],
      productCount: 0,
      status: "active",
    }
    setCategories([...categories, newCategoryObj])
    setNewCategory({ name: "", description: "" })
    setShowAddForm(false)
  }

  const handleEditCategory = (e) => {
    e.preventDefault()
    // Simulate API call to update category
    const updatedCategories = categories.map((cat) => {
      if (cat.id === editCategory.id) {
        return {
          ...cat,
          name: editCategory.name,
          description: editCategory.description,
          status: editCategory.status,
        }
      }
      return cat
    })
    setCategories(updatedCategories)
    setShowEditForm(false)
  }

  const handleAddSubcategory = (e) => {
    e.preventDefault()
    // Simulate API call to add subcategory
    const updatedCategories = categories.map((cat) => {
      if (cat.id === newSubcategory.categoryId) {
        return {
          ...cat,
          subcategories: [
            ...cat.subcategories,
            {
              id: Math.max(...cat.subcategories.map((s) => s.id), 0) + 1,
              name: newSubcategory.name,
            },
          ],
        }
      }
      return cat
    })
    setCategories(updatedCategories)
    setNewSubcategory({ name: "", categoryId: null })
    setShowSubcategoryForm(false)
  }

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category? All subcategories will also be deleted.")) {
      // In a real app, you would call an API to delete the category
      setCategories(categories.filter((category) => category.id !== id))
    }
  }

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      // In a real app, you would call an API to delete the subcategory
      const updatedCategories = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((subcat) => subcat.id !== subcategoryId),
          }
        }
        return cat
      })
      setCategories(updatedCategories)
    }
  }

  const openEditModal = (category) => {
    setEditCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status,
    })
    setShowEditForm(true)
  }

  if (loading) {
    return <div className="loading-container">Loading categories...</div>
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>Category Management</h2>
        <div className="category-actions">
          <button className="add-category-btn" onClick={() => setShowAddForm(true)}>
            Add Category
          </button>
          <button
            className="add-subcategory-btn"
            onClick={() => {
              if (categories.length > 0) {
                setNewSubcategory({ ...newSubcategory, categoryId: categories[0].id })
                setShowSubcategoryForm(true)
              } else {
                alert("Please add a category first")
              }
            }}
          >
            Add Subcategory
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Subcategories</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <div className="subcategories-list">
                    {category.subcategories.map((subcategory) => (
                      <div className="subcategory-tag" key={subcategory.id}>
                        {subcategory.name}
                        <button
                          className="delete-subcategory"
                          onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-subcategory-inline"
                      onClick={() => {
                        setNewSubcategory({ name: "", categoryId: category.id })
                        setShowSubcategoryForm(true)
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{category.productCount}</td>
                <td>
                  <span className={`status-badge ${category.status}`}>
                    {category.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => openEditModal(category)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="no-categories">
            <p>No categories found. Add your first category to get started.</p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Category</h3>
              <button className="close-modal" onClick={() => setShowAddForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label htmlFor="categoryName">Category Name*</label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryDescription">Description</label>
                <textarea
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Category</h3>
              <button className="close-modal" onClick={() => setShowEditForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleEditCategory}>
              <div className="form-group">
                <label htmlFor="editCategoryName">Category Name*</label>
                <input
                  type="text"
                  id="editCategoryName"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editCategoryDescription">Description</label>
                <textarea
                  id="editCategoryDescription"
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <div className="status-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={editCategory.status === "active"}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          status: e.target.checked ? "active" : "inactive",
                        })
                      }
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">{editCategory.status === "active" ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showSubcategoryForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Subcategory</h3>
              <button className="close-modal" onClick={() => setShowSubcategoryForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddSubcategory}>
              <div className="form-group">
                <label htmlFor="parentCategory">Parent Category*</label>
                <select
                  id="parentCategory"
                  value={newSubcategory.categoryId || ""}
                  onChange={(e) =>
                    setNewSubcategory({ ...newSubcategory, categoryId: Number.parseInt(e.target.value) })
                  }
                  required
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subcategoryName">Subcategory Name*</label>
                <input
                  type="text"
                  id="subcategoryName"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowSubcategoryForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
