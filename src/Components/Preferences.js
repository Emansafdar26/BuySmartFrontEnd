import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../lib/apiwrapper";
import { useNavigate } from "react-router-dom";
import "../Styles/Preferences.css";

const Preferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const addPreference = () => {
    setPreferences([
      ...preferences,
      { categoryId: "", subCategoryId: "", min_price: "", max_price: "", id: null },
    ]);
  };

  const getCategories = () => {
    apiGet("/categories").then((res) => {
      if (res.detail?.code === 1) setCategories(res.detail.data);
    });
  };

  const getPreferences = () => {
    apiGet("/getPreferences").then((res) => {
      if (res.detail?.code === 1 && res.detail.data) {
        const mapped = res.detail.data.map((p) => ({
          id: p.id,
          categoryId: p.category.id,
          subCategoryId: p.subcategory?.id || "",
          min_price: p.price_range.min_price || "",
          max_price: p.price_range.max_price || "",
        }));
        setPreferences(mapped);
      }
    });
  };

  useEffect(() => {
    getCategories();
    getPreferences();
  }, []);

  const updatePreference = (index, field, value) => {
    const updated = [...preferences];
    updated[index][field] = value;
    if (field === "categoryId") updated[index].subCategoryId = "";
    setPreferences(updated);
  };

  const removePreferenceLocal = (index) => {
    const pref = preferences[index];
    if (pref.id) {
      apiPost("/removePreference", { preference_id: pref.id }).then((res) => {
        if (res.detail?.code === 1) {
          setPreferences(preferences.filter((_, i) => i !== index));
          showSuccess(res.detail.message);
        } else {
          setErrors([res.detail?.error || "Error removing preference"]);
        }
      });
    } else {
      setPreferences(preferences.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    let validationErrors = [];
    preferences.forEach((p, index) => {
      if (p.min_price && parseInt(p.min_price) < 5000) {
        validationErrors.push(`Preference #${index + 1}: Min price must be ≥ 5000`);
      }
      if (p.max_price && parseInt(p.max_price) > 3000000) {
        validationErrors.push(`Preference #${index + 1}: Max price must be ≤ 3,000,000`);
      }
      if (p.min_price && p.max_price && parseInt(p.min_price) > parseInt(p.max_price)) {
        validationErrors.push(`Preference #${index + 1}: Min price cannot be greater than Max price`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]); 

    const payload = {
      preferences: preferences.map((p) => ({
        id: p.id,
        category_id: p.categoryId,
        subcategory_id: p.subCategoryId || null,
        min_price: p.min_price || null,
        max_price: p.max_price || null,
      })),
    };

    apiPost("/updatePreferences", payload)
      .then((res) => {
        if (res.detail?.code === 1) {
          showSuccess("Preferences saved successfully!");
          getPreferences();
        } else {
          setErrors([res.detail?.error || "Error saving preferences"]);
        }
      })
      .catch(() => setErrors(["Something went wrong!"]));
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };



  return (
    <>
 
      <div className="preferences-container">
        <h2>My Preferences</h2>
        {errors.length > 0 && (
          <div className="errorBox">
            <strong>⚠ Please fix the following:</strong>
            <ul>
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {!preferences.length && <p>Start adding your preferences to see better results</p>}

        {preferences.map((pref, index) => {
          const selectedCategory = categories.find(
            (cat) => cat.id.toString() === pref.categoryId?.toString()
          );
          return (
            <div key={index} className="preferenceBox">
              <select
                value={pref.categoryId}
                onChange={(e) => updatePreference(index, "categoryId", e.target.value)}
                className="input"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={pref.subCategoryId}
                onChange={(e) => updatePreference(index, "subCategoryId", e.target.value)}
                disabled={!selectedCategory}
                className="input"
              >
                <option value="">Select Subcategory</option>
                {selectedCategory?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={pref.min_price}
                onChange={(e) => updatePreference(index, "min_price", e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={pref.max_price}
                onChange={(e) => updatePreference(index, "max_price", e.target.value)}
                className="input"
              />

              <button onClick={() => removePreferenceLocal(index)} className="removeBtn">✕</button>
            </div>
          );
        })}

        <button onClick={addPreference} className="addBtn">+ Add Preference</button>
        {preferences.length > 0 && (
          <button onClick={handleSave} className="saveBtn">Save Preferences</button>
        )}
      </div>

      {showSuccessModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="checkmarkCircle">
              <svg className="checkmark" viewBox="0 0 52 52">
                <path fill="none" stroke="#4CAF50" strokeWidth="5" d="M14 27l7 7 17-17" />
              </svg>
            </div>
            <h3>{successMessage}</h3>
          </div>
        </div>
      )}
    
    </>
  );
};

export default Preferences;
