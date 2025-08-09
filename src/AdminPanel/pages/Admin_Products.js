import React, { useState, useEffect } from "react";
import MainHeader from "../../Components/MainHeader";
import { useSearch } from "../context/SearchContext";
import { apiGet, apiPost, apiPut } from "../../lib/apiwrapper"; // <-- added apiPut
// Make sure you have apiPut function. If not, I can give you the code.

const Products = () => {
  const { searchQuery } = useSearch();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", category: "" });
  const [formError, setFormError] = useState("");
  const [sortOption, setSortOption] = useState("all-products");
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await apiGet("/admin/available-products");
      if (response?.detail?.code === 1 && response.detail.data) {
        setProducts(response.detail.data);
      } else {
        setErrors({ stats: response?.detail?.error || "Unexpected response." });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrors({ stats: "Failed to fetch products." });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiGet("/categories");
      if (response?.detail?.code === 1 && response.detail.data) {
        setCategories(response.detail.data);
      } else {
        setErrors({ stats: response?.detail?.error || "Unexpected response." });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrors({ stats: "Failed to fetch categories." });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let sortedProducts = [...products];

    if (sortOption === "name-asc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(
      sortedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products, sortOption]);

  const handleAddProduct = async () => {
    if (newProduct.name.trim() === "" || newProduct.category.trim() === "") {
      setFormError("All fields are required.");
      return;
    }

    try {
      const response = await apiPost("/admin/addavailable-products", {
        name: newProduct.name.trim(),
        category_name: newProduct.category.trim().toLowerCase(),
      });

      if (response?.detail?.code === 1) {
        await fetchProducts(); // Reload products from backend
        setShowAddModal(false);
        setNewProduct({ name: "", category: "" });
        setFormError("");
      } else {
        setFormError(response?.detail?.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setFormError("Error while adding product.");
    }
  };

  const handleEditClick = (product) => {
    const categoryObj = categories.find(cat => cat.name.toLowerCase() === product.category_name.toLowerCase());
    setSelectedProduct({
      ...product,
      category: categoryObj ? categoryObj.name : "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (selectedProduct.name.trim() === "" || selectedProduct.category.trim() === "") {
      setFormError("All fields are required.");
      return;
    }

    try {
      const response = await apiPost(`/admin/available-products/${selectedProduct.id}`, {
        name: selectedProduct.name.trim(),
        category_name: selectedProduct.category.trim().toLowerCase(),
      });

      if (response?.detail?.code === 1) {
        await fetchProducts();
        setShowEditModal(false);
        setSelectedProduct(null);
        setFormError("");
      } else {
        setFormError(response?.detail?.error || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setFormError("Error while updating product.");
    }
  };

  const handleRemoveClick = (product) => {
    setSelectedProduct(product);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    try {
      const response = await apiPost(`/admin/available-products/del/${selectedProduct.id}`);
      if (response?.detail?.code === 1) {
        await fetchProducts();
        setShowRemoveModal(false);
        setSelectedProduct(null);
      } else {
        console.error(response.detail.error || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <MainHeader />
      <div className="products-container">
        <h2>Products</h2>

        <div className="user-actions">
          <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
            Add Product
          </button>

          <div className="filter-container">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="all-products">All Products</option>
              <option value="name-asc">From A to Z</option>
              <option value="name-desc">From Z to A</option>
            </select>
          </div>
        </div>

        <table className="products-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>
                    <button className="edit-product-btn" onClick={() => handleEditClick(product)}>Edit</button>
                    <button className="remove-product-btn" onClick={() => handleRemoveClick(product)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">No Products Found...</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Add Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </option>
                ))}
              </select>
              {formError && <p className="form-error">{formError}</p>}

              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={handleAddProduct}>Add</button>
                <button className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Edit Product</h3>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              />
              <select
                value={selectedProduct.category}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </option>
                ))}
              </select>
              {formError && <p className="form-error">{formError}</p>}

              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={handleEditSubmit}>Update</button>
                <button className="modal-cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Modal */}
        {showRemoveModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Confirm Removal</h3>
              <p>Are you sure you want to delete <strong>{selectedProduct.name}</strong>?</p>

              <div className="modal-actions">
                <button className="modal-confirm-btn" onClick={confirmRemove}>Yes, Remove</button>
                <button className="modal-cancel-btn" onClick={() => setShowRemoveModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
