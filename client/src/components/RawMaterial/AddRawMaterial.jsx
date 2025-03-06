import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "./RawMaterial.css";
import {useNavigate} from "react-router-dom"

const AddRawMaterial = () => {
  const [materials, setMaterials] = useState([
    { name: null, quantity: "", unit: null, cost: "" }
  ]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [rawMaterialNameOptions, setRawMaterialNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const negative=useNavigate()

  useEffect(() => {
    fetchUnits();
    fetchRawMaterialNames();
  }, []);

  // Function to fetch units
  const fetchUnits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/unit");
      const formattedUnits = response.data.map((unit) => ({
        value: unit,
        label: unit
      }));
      setUnitOptions(formattedUnits);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  // Function to fetch raw material names
  const fetchRawMaterialNames = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/raw-material-master", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedNames = response.data.map((item) => ({
        value: item.name, 
        label: item.name
      }));
      setRawMaterialNameOptions(formattedNames);
    } catch (error) {
      console.error("Error fetching raw material names:", error);
    }
  };

  const handleAddRow = () => {
    setMaterials([...materials, { name: null, quantity: "", unit: null, cost: "" }]);
  };

  const handleDeleteRow = (index) => {
    if (materials.length === 1) return; 
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newMaterials = [...materials];

    if (field === "quantity" || field === "cost") {
      value = value === "" ? "" : Number(value); // Ensure it's a number or empty
      if (value < 0) return; // Prevent negative values
    }

    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  // Function to submit raw materials to the database
  const handleSubmit = async () => {
    if (materials.some(item => !item.name || !item.quantity || !item.unit || !item.cost)) {
      alert("Please fill all fields before submitting.");
      return;
    }

    // Convert quantity and cost to numbers
    const formattedMaterials = materials.map(material => ({
      ...material,
      quantity: Number(material.quantity),
      cost: parseFloat(material.cost)
    }));

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/raw-material/add", {
        materials: formattedMaterials
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Raw materials added successfully!");
        setMaterials([{ name: null, quantity: "", unit: null, cost: "" }]); // Reset form
        negative("/dashboard/raw-material") // Refresh raw material list after adding
      }
    } catch (error) {
      console.error("Error adding raw materials:", error);
      alert("Failed to add raw materials.");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-2 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">Add Raw Material Form</h2>

      {materials.map((material, index) => (
        <div key={index} className="row mb-2 align-items-center">
          <div className="col">
            <Select
              options={rawMaterialNameOptions}
              placeholder="Select Raw Material"
              isSearchable
              classNamePrefix="react-select input-field"
              value={rawMaterialNameOptions.find((opt) => opt.value === material.name) || null}
              onChange={(selectedOption) => handleChange(index, "name", selectedOption.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Quantity"
              className="form-control input-field"
              value={material.quantity}
              min="0"
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />
          </div>
          <div className="col">
            <Select
              options={unitOptions}
              placeholder="Select Unit"
              isSearchable
              classNamePrefix="react-select input-field"
              value={unitOptions.find((opt) => opt.value === material.unit) || null}
              onChange={(selectedOption) => handleChange(index, "unit", selectedOption.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Cost"
              className="form-control input-field"
              value={material.cost}
              min="0"
              step="0.01"
              onChange={(e) => handleChange(index, "cost", e.target.value)}
            />
          </div>
          <div className="col-auto">
            {materials.length > 1 && (
              <button onClick={() => handleDeleteRow(index)} className="btn btn-danger">
                ❌
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="text-center mt-3">
        <button onClick={handleAddRow} className="btn btn-primary">+ Add Row</button>
        <button 
          onClick={handleSubmit} 
          className="btn btn-success ms-2"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddRawMaterial;
