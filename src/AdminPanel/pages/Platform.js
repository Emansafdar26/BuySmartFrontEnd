import React, { useState, useEffect } from "react";
import MainHeader from "../../Components/MainHeader";
import { apiPost, apiGet } from "../../lib/apiwrapper";

function Platforms() {
  const [platforms, setPlatforms] = useState([]);
  const [newPlatform, setNewPlatform] = useState({
    name: "",
    website_url: "",
    image_selector: "",
    name_selector: "",
    price_selector: "",
    discount_selector: "",
    container_selector: "",
  });
  const [editPlatform, setEditPlatform] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const res = await apiGet("/admin/platforms/");
      if (res?.detail?.code === 1) {
        setPlatforms(res.detail.data);
      } else {
        console.error(res?.detail?.error || "Error fetching platforms");
      }
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  const handleAddPlatform = async () => {
    try {
      if (newPlatform.name.trim() && newPlatform.website_url.trim()) {
        await apiPost("/admin/platform/add", newPlatform);
        fetchPlatforms();
        setNewPlatform({
          name: "",
          website_url: "",
          image_selector: "",
          name_selector: "",
          price_selector: "",
          discount_selector: "",
          container_selector: "",
        });
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding platform:", error);
    }
  };

  const handleDeletePlatform = async (platformId) => {
    try {
      await apiPost(`/admin/platform/delete/${platformId}`);
      fetchPlatforms();
    } catch (error) {
      console.error("Error deleting platform:", error);
    }
  };

  const handleUpdatePlatform = async () => {
    try {
      if (editPlatform?.id) {
        await apiPost(`/admin/platform/update/${editPlatform.id}`, editPlatform);
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
                    <td>
                      <a
                        href={platform.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform.website_url}
                      </a>
                    </td>
                    <td>{platform.image_selector}</td>
                    <td>{platform.name_selector}</td>
                    <td>{platform.price_selector}</td>
                    <td>{platform.discount_selector}</td>
                    <td>{platform.container_selector}</td>
                    <td>
                      <button
                        className="edit-product-btn"
                        onClick={() => {
                          setEditPlatform(platform);
                          setEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="remove-product-btn"
                        onClick={() => handleDeletePlatform(platform.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    No Platforms Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Platform Modal */}
        {modalOpen && (
          <div
            className="modal open"
            onClick={(e) =>
              e.target.className === "modal open" && setModalOpen(false)
            }
          >
            <div className="modal-content">
              <h3>Add Platform</h3>
              {Object.keys(newPlatform).map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={`Enter ${key.replace("_", " ")}`}
                  value={newPlatform[key]}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, [key]: e.target.value })
                  }
                  className="input-field"
                />
              ))}
              <button className="save-btn" onClick={handleAddPlatform}>
                Add
              </button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Platform Modal */}
        {editModalOpen && editPlatform && (
          <div
            className="modal open"
            onClick={(e) =>
              e.target.className === "modal open" && setEditModalOpen(false)
            }
          >
            <div className="modal-content">
              <h3>Edit Platform</h3>
              {Object.keys(editPlatform).map(
                (key) =>
                  key !== "id" && (
                    <input
                      key={key}
                      type="text"
                      value={editPlatform[key] || ""}
                      onChange={(e) =>
                        setEditPlatform({
                          ...editPlatform,
                          [key]: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  )
              )}
              <button className="save-btn" onClick={handleUpdatePlatform}>
                Update
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Platforms;
