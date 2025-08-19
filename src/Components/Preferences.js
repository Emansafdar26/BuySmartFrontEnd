import React, { useState, useEffect } from "react";
import Header from "./MainHeader";
import { apiGet } from "../lib/apiwrapper";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const addPreference = () => {
    setPreferences([
      ...preferences,
      { categoryId: "", subCategoryId: "", min_price: "", max_price: "" },
    ]);
  };
  const getCategories = () => {
    apiGet("/categories").then((res) => {
      if (res.detail.code === 1) {
        setCategories(res.detail.data);
      }
    });
  };

  const getPrefereces = () => {
    // call api to get user preferences and set in preferences State variable
  }

  useEffect(() => {
    getCategories();
    getPrefereces();
  }, []);

  const handleSearch = () => {
    navigate("/products");
  };

  const updatePreference = (index, field, value) => {
    const updated = [...preferences];
    updated[index][field] = value;
    // Reset subcategory if category changes
    if (field === "categoryId") {
      updated[index].subCategoryId = "";
    }
    setPreferences(updated);
  };

  const removePreference = (index) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log("User Preferences:", preferences);
    alert("Preferences saved! Check console for data.");
    // call api to save/update user preferences
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <div style={styles.container}>
        <h2>My Preferences</h2>

        {!preferences.length ? <p>Start adding your preferences to see better results</p> : ''}

        {preferences.map((pref, index) => {
          const selectedCategory = categories.find(
            (cat) => cat.id.toString() === pref.categoryId
          );

          return (
            <div key={index} style={styles.preferenceBox}>
              <select
                value={pref.categoryId}
                onChange={(e) =>
                  updatePreference(index, "categoryId", e.target.value)
                }
                style={styles.input}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={pref.subCategoryId}
                onChange={(e) =>
                  updatePreference(index, "subCategoryId", e.target.value)
                }
                disabled={!selectedCategory}
                style={styles.input}
              >
                <option value="">Select Subcategory</option>
                {selectedCategory &&
                  selectedCategory.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>

              {/* Price Range */}
              <input
                type="number"
                placeholder="Min Price"
                value={pref.min_price}
                onChange={(e) =>
                  updatePreference(index, "min_price", e.target.value)
                }
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={pref.max_price}
                onChange={(e) =>
                  updatePreference(index, "max_price", e.target.value)
                }
                style={styles.input}
              />

              {/* Remove button */}
              <button
                onClick={() => removePreference(index)}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          );
        })}

        <button onClick={addPreference} style={styles.addBtn}>
          + Add Preference
        </button>

        {preferences.length > 0 && (
          <button onClick={handleSave} style={styles.saveBtn}>
            Save Preferences
          </button>
        )}
      </div>
    </>
  );
};

// Simple inline styles
const styles = {
  container: {
    maxWidth: "750px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  preferenceBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minWidth: "120px",
  },
  addBtn: {
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 15px",
    marginTop: "10px",
    marginLeft: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2196f3",
    color: "#fff",
    cursor: "pointer",
  },
  removeBtn: {
    border: "none",
    background: "red",
    color: "white",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
};

export default Preferences;
