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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(data.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!showEditForm) {
      setEditCategory({ id: null, name: "", description: "", status: "active" })
    }
  }, [showEditForm])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })
      const created = await res.json()
      setCategories([...categories, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCategory({ name: "", description: "" })
      setShowAddForm(false)
    } catch (err) {
      console.error("Error adding category:", err)
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      })
      const updated = await res.json()
      setCategories(categories.map((c) => (c._id === updated._id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name)))
      setShowEditForm(false)
    } catch (err) {
      console.error("Error editing category:", err)
    }
  }

  const handleAddSubcategory = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/categories/${newSubcategory.categoryId}/subcategories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubcategory.name }),
      })
      const updated = await res.json()
      setCategories(categories.map((c) => (c._id === updated._id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name)))
      setNewSubcategory({ name: "", categoryId: null })
      setShowSubcategoryForm(false)
    } catch (err) {
      console.error("Error adding subcategory:", err)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      setCategories(categories.filter((c) => c._id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
    }
  }

  const handleDeleteSubcategory = async (categoryId, subcategoryId, subcategoryName) => {
    if (!window.confirm(`Delete subcategory \"${subcategoryName}\"?`)) return
    try {
      await fetch(`/api/categories/${categoryId}/subcategories/${subcategoryId}`, { method: "DELETE" })
      fetchCategories()
    } catch (err) {
      console.error("Error deleting subcategory:", err)
    }
  }

  const openEditModal = (category) => {
    setEditCategory({
      id: category._id,
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
                setNewSubcategory({ name: "", categoryId: categories[0]._id })
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
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <div className="subcategories-list">
                    {(category.subcategories || []).map((subcategory) => (
                      <div className="subcategory-tag" key={subcategory._id}>
                        {subcategory.name}
                        <button
                          className="delete-subcategory"
                          onClick={() => handleDeleteSubcategory(category._id, subcategory._id, subcategory.name)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-subcategory-inline"
                      onClick={() => {
                        setNewSubcategory({ name: "", categoryId: category._id })
                        setShowSubcategoryForm(true)
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{category.productCount ?? 0}</td>
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
                    <button className="delete-btn" onClick={() => handleDeleteCategory(category._id)}>
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

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Category</h3>
              <button className="close-modal" onClick={() => setShowAddForm(false)}>×</button>
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
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Category</button>
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
              <button className="close-modal" onClick={() => setShowSubcategoryForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddSubcategory}>
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
                <button type="button" className="cancel-btn" onClick={() => setShowSubcategoryForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
