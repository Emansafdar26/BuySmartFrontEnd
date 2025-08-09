import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import MainHeader from "../../Components/MainHeader";
import { apiGet, apiPost } from "../../lib/apiwrapper";

function Users() {
  const { searchQuery } = useSearch();

  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminForm, setAdminForm] = useState({ username: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const normalizedSearchQuery = searchQuery ? searchQuery.toLowerCase() : "";

    const result = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(normalizedSearchQuery) &&
        (filterRole ? user.role === filterRole : true)
    );

    setFilteredUsers(result);
  }, [searchQuery, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await apiGet("/admin/users/");
      if (response?.detail?.code === 1 && response.detail.data) {
        setUsers(response.detail.data);
      } else {
        setErrors({ users: response?.detail?.error || "Unexpected response format." });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType("");
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        const res = await apiPost(`/admin/users/${selectedUser.id}/delete`);
        if (res?.detail?.code === 1) {
          setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
          closeModal();
        } else {
          setErrors({ users: res?.detail?.error || "Error deleting user" });
        }
      } catch (err) {
        setErrors({ users: "Error deleting user" });
      }
    }
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    if (validateAdminForm()) {
      const newAdmin = {
        username: adminForm.username,
        email: adminForm.email,
        role: "Admin"
      };

      try {
        const data = await apiPost("/admin/add", newAdmin);
        if (data?.detail?.code === 1) {
          alert(`Password sent to ${adminForm.email}`);
          fetchUsers();
          setAdminForm({ username: "", email: "" });
          closeModal();
        }
      } catch (error) {
        console.error("Error adding admin:", error);
      }
    }
  };

  const validateAdminForm = () => {
    const errors = {};
    if (!adminForm.username.trim().match(/^[a-zA-Z0-9]{3,}$/)) {
      errors.username = "Username must be at least 3 characters (no special characters)";
    }
    if (!adminForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    } else {
      if (!adminForm.email.startsWith(adminForm.email[0].toLowerCase()) && !adminForm.email.startsWith(adminForm.email[0].toUpperCase())) {
        errors.email = "Email must start with an alphabet";
      }
      if (!/^[a-zA-Z]/.test(adminForm.email)) {
        errors.email = "Email must start with an alphabet";
      }
      if (!adminForm.email.match(/^[^\s@]+@[^\s@]+\.(com)$/)) {
        errors.email = "Only '.com' email addresses are allowed";
      }
    }
  

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      <MainHeader />
      <div className="users-container">
        <h2 className="users-title">Users</h2>

<div className="user-actions">
<button className="add-admin-btn" onClick={() => openModal("add")}>
    Add Admin
  </button>
  <div className="user-filter-container">
    <select onChange={(e) => setFilterRole(e.target.value)} value={filterRole}>
      <option value="">All Roles</option>
      <option value="Admin">Admin</option>
      <option value="User">User</option>
    </select>
  </div>

</div>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => openModal("delete", user)}
                        className="remove-user-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && modalType === "delete" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to permanently remove {selectedUser?.username}? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={handleDeleteUser} className="modal-confirm-btn">
                Confirm
              </button>
              <button onClick={closeModal} className="modal-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && modalType === "add" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Admin</h3>
            <form onSubmit={handleAddAdminSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={adminForm.username}
                onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
              />
              {formErrors.username && <p className="error-text">{formErrors.username}</p>}

              <input
                type="email"
                placeholder="Email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              />
              {formErrors.email && <p className="error-text">{formErrors.email}</p>}

              <div className="modal-actions">
                <button type="submit" className="modal-confirm-btn">
                  Add Admin
                </button>
                <button type="button" onClick={closeModal} className="modal-cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
