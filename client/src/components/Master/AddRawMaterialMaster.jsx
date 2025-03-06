import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddRawMaterialMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([{ name: "" }]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (location.state?.material) {
      setMaterials([{ name: location.state.material.name }]); // Load material for editing
      setIsEdit(true);
      setEditId(location.state.material._id);
    }
  }, [location.state]);

  const handleAddRow = () => {
    setMaterials([...materials, { name: "" }]);
  };

  const handleDeleteRow = (index) => {
    if (materials.length === 1) return;
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    const newMaterials = [...materials];
    newMaterials[index].name = value;
    setMaterials(newMaterials);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/raw-material-master/${editId}`,
          { name: materials[0].name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Raw material updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/raw-material-master/add",
          { materials },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        alert("Raw materials added successfully!");
      }
      navigate("/dashboard/all-raw-material-master");
    } catch (error) {
      console.error("Error saving raw materials:", error);
      alert("Failed to save raw materials.");
    }
  };

  return (
    <div className="container mt-2 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">{isEdit ? "Edit Raw Material" : "Add Raw Material"}</h2>

      {materials.map((material, index) => (
        <div key={index} className="row mb-2 align-items-center">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Raw Material Name"
              className="form-control input-field"
              value={material.name}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
          <div className="col-auto">
            {materials.length > 1 && !isEdit && (
              <button onClick={() => handleDeleteRow(index)} className="btn btn-danger">❌</button>
            )}
          </div>
        </div>
      ))}

      {/* Hide "+ Add Row" button when editing */}
      {!isEdit && (
        <div className="text-center mt-3">
          <button onClick={handleAddRow} className="btn btn-primary">+ Add Row</button>
        </div>
      )}

      <button onClick={handleSubmit} className="btn btn-success mt-3">
        {isEdit ? "Edit" : "Add"}
      </button>
    </div>
  );
};

export default AddRawMaterialMaster;
