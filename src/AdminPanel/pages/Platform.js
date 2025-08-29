import React, { useState, useEffect } from "react";
import MainHeader from "../../Components/MainHeader";
import { apiPost,apiGet } from "../../lib/apiwrapper";

function Platforms() {
  const [platforms, setPlatforms] = useState([]);
  const [newPlatform, setNewPlatform] = useState({ name: "", website_url: "", imageSelector: "", nameSelector: "", priceSelector: "", discountSelector: "", containerSelector: "" });
  const [editPlatform, setEditPlatform] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch platforms on page load
  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const res = await apiGet("/admin/platforms/");
      if (res.detail.code === 1) {
        setPlatforms(res.detail.data);
      } else {
        console.error(res.detail.error);
      }
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  const handleAddPlatform = async () => {
    try {
      if (newPlatform.name.trim() !== "" && newPlatform.website_url.trim() !== "") {
        await apiPost("/admin/platform/add", {
          name: newPlatform.name,
          website_url: newPlatform.website_url,
          image_selector: newPlatform.imageSelector,
          name_selector: newPlatform.nameSelector,
          price_selector: newPlatform.priceSelector,
          discount_selector: newPlatform.discountSelector,
          container_selector: newPlatform.containerSelector,
        });
        fetchPlatforms(); // Refresh list after adding
        setNewPlatform({ name: "", website_url: "", imageSelector: "", nameSelector: "", priceSelector: "", discountSelector: "", containerSelector: "" });
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding platform:", error);
    }
  };

  const handleDeletePlatform = async (platformId) => {
    try {
      await apiPost(`/admin/platform/delete/${platformId}`);
      fetchPlatforms(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting platform:", error);
    }
  };

  const handleUpdatePlatform = async () => {
    try {
      if (editPlatform && editPlatform.id) {
        await apiPost(`/admin/platform/update/${editPlatform.id}`, {
          name: editPlatform.name,
          website_url: editPlatform.website_url,
          image_selector: editPlatform.image_selector,
          name_selector: editPlatform.name_selector,
          price_selector: editPlatform.price_selector,
          discount_selector: editPlatform.discount_selector,
          container_selector: editPlatform.container_selector,
        });
        fetchPlatforms(); 
        setEditPlatform(null);
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating platform:", error);
    }
  };
  
  return (
    <>
      <MainHeader />
      <div className="categories-container">
        <h1 className="categories-title">Platforms</h1>
        <button className="add-category-btn" onClick={() => setModalOpen(true)}>
          Add Platform
        </button>

        <div className="categories-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Platform Name</th>
                <th>URL</th>
                <th>Image Selector</th>
                <th>Name Selector</th>
                <th>Price Selector</th>
                <th>Discount Selector</th>
                <th>Container Selector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {platforms.length > 0 ? (
                platforms.map((platform, index) => (
                  <tr key={platform.id}>
                    <td>{index + 1}</td>
                    <td>{platform.name}</td>
                    <td><a href={platform.website_url} target="_blank" rel="noopener noreferrer">{platform.website_url}</a></td>
                    <td>{platform.image_selector}</td>
                    <td>{platform.name_selector}</td>
                    <td>{platform.price_selector}</td>
                    <td>{platform.discount_selector}</td>
                    <td>{platform.container_selector}</td>
                    <td>
                      <button className="edit-product-btn" onClick={() => { setEditPlatform(platform); setEditModalOpen(true); }}>
                        Edit
                      </button>
                      <button className="remove-product-btn" onClick={() => handleDeletePlatform(platform.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">No Platforms Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Platform Modal */}
        {modalOpen && (
          <div className="modal open" onClick={(e) => e.target.className === "modal open" && setModalOpen(false)}>
            <div className="modal-content">
              <h3>Add Platform</h3>
              <input
                type="text"
                placeholder="Enter platform name"
                value={newPlatform.name}
                onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter platform URL"
                value={newPlatform.website_url}
                onChange={(e) => setNewPlatform({ ...newPlatform, website_url: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter image selector"
                value={newPlatform.imageSelector}
                onChange={(e) => setNewPlatform({ ...newPlatform, imageSelector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter name selector"
                value={newPlatform.nameSelector}
                onChange={(e) => setNewPlatform({ ...newPlatform, nameSelector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter price selector"
                value={newPlatform.priceSelector}
                onChange={(e) => setNewPlatform({ ...newPlatform, priceSelector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter discount selector"
                value={newPlatform.discountSelector}
                onChange={(e) => setNewPlatform({ ...newPlatform, discountSelector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Enter container selector"
                value={newPlatform.containerSelector}
                onChange={(e) => setNewPlatform({ ...newPlatform, containerSelector: e.target.value })}
                className="input-field"
              />
              <button className="save-btn" onClick={handleAddPlatform}>Add</button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Platform Modal */}
        {editModalOpen && editPlatform && (
          <div className="modal open" onClick={(e) => e.target.className === "modal open" && setEditModalOpen(false)}>
            <div className="modal-content">
              <h3>Edit Platform</h3>
              <input
                type="text"
                value={editPlatform.name}
                onChange={(e) => setEditPlatform({ ...editPlatform, name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.website_url}
                onChange={(e) => setEditPlatform({ ...editPlatform, website_url: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.image_selector}
                onChange={(e) => setEditPlatform({ ...editPlatform, image_selector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.name_selector}
                onChange={(e) => setEditPlatform({ ...editPlatform, name_selector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.price_selector}
                onChange={(e) => setEditPlatform({ ...editPlatform, price_selector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.discount_selector}
                onChange={(e) => setEditPlatform({ ...editPlatform, discount_selector: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={editPlatform.container_selector}
                onChange={(e) => setEditPlatform({ ...editPlatform, container_selector: e.target.value })}
                className="input-field"
              />
              <button className="save-btn" onClick={handleUpdatePlatform}>Update</button>
              <button className="cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Platforms;
