import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import MainHeader from "../../Components/MainHeader";
import { apiGet, apiPost } from "../../lib/apiwrapper";

function Categories() {
  const { searchQuery } = useSearch();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategory, setEditCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // For delete confirmation
  const [selectedCategory, setSelectedCategory] = useState(null); // For delete confirmation
  const [errors, setErrors] = useState({});
  const [sortFilter, setSortFilter] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet("/categories/");
        if (response?.detail?.code === 1) {
          setCategories(response.detail.data);
        } else {
          setErrors({ stats: response?.detail?.error || "Unexpected error fetching categories." });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrors({ stats: "Server error fetching categories." });
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (newCategory.name.trim() !== "") {
      try {
        const response = await apiPost("/admin/category/add", {
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
        });
        if (response?.detail?.code === 1) {
          const newCat = response.detail.data;
          setCategories([...categories, newCat]);
          setNewCategory({ name: "", description: "" });
          setModalOpen(false);
          setErrors({});
        } else {
          setErrors({ stats: response?.detail?.error || "Failed to add category." });
        }
      } catch (error) {
        console.error("Error adding category:", error);
        setErrors({ stats: "Server error adding category." });
      }
    }
  };

  const confirmDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await apiPost(`/admin/category/delete/${selectedCategory.id}`);
      if (response?.detail?.code === 1) {
        setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
        setDeleteModalOpen(false);
        setSelectedCategory(null);
        setErrors({});
      } else {
        setErrors({ stats: response?.detail?.error || "Failed to delete category." });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setErrors({ stats: "Server error deleting category." });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory.name.trim()) {
      setErrors({ stats: "Category name cannot be empty." });
      return;
    }
    try {
      const response = await apiPost(`/admin/category/update/${editCategory.id}`, {
        name: editCategory.name.trim(),
        description: editCategory.description?.trim() || "",
      });
      if (response?.detail?.code === 1) {
        const updatedCategory = response.detail.data;
        setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
        setEditCategory(null);
        setEditModalOpen(false);
        setErrors({});
      } else {
        setErrors({ stats: response?.detail?.error || "Failed to update category." });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setErrors({ stats: "Server error updating category." });
    }
  };

  const sortedCategories = () => {
    switch (sortFilter) {
      case "a-z":
        return [...filteredCategories].sort((a, b) => a.name.localeCompare(b.name));
      case "z-a":
        return [...filteredCategories].sort((a, b) => b.name.localeCompare(a.name));
      case "all":
      default:
        return filteredCategories;
    }
  };

  return (
    <>
      <MainHeader />
      <div className="categories-container">
        <h1 className="categories-title"> Categories </h1>
        <div className="user-actions">
          <button className="add-category-btn" onClick={() => setModalOpen(true)}>
            Add Category
          </button>

          {errors.stats && (
            <div className="error-message" style={{ color: "red", marginTop: "10px" }}>
              {errors.stats}
            </div>
          )}

          <div className="user-filter-container">
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>

        <div className="categories-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories().length > 0 ? (
                sortedCategories().map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td> 
                    <td>{category.name}</td>
                    <td>{category.description || "No description"}</td>
                    <td>
                      <button
                        className="edit-product-btn"
                        onClick={() => {
                          setEditCategory(category);
                          setEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="remove-product-btn"
                        onClick={() => confirmDeleteCategory(category)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">No Categories Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Category Modal */}
        {modalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setModalOpen(false)}>
            <div className="modal-box">
              <h3>Add Category</h3>
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={handleAddCategory}>
                  Add
                </button>
                <button className="modal-cancel-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editModalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setEditModalOpen(false)}>
            <div className="modal-box">
              <h3>Edit Category</h3>
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              />
              <input
                type="text"
                value={editCategory.description || ""}
                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
              />
              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={handleUpdateCategory}>
                  Update
                </button>
                <button className="modal-cancel-btn" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setDeleteModalOpen(false)}>
            <div className="modal-box">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to permanently delete the category "{selectedCategory?.name}"? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={handleDeleteCategory}>
                  Confirm
                </button>
                <button className="modal-cancel-btn" onClick={() => setDeleteModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </>
  );
}

export default Categories;
