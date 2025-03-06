import React, { useState, useEffect } from "react";
import axios from "axios";

const RawMaterialList = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/raw-material", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRawMaterials(response.data);
    } catch (error) {
      console.error("Error fetching raw materials:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/raw-material/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRawMaterials(rawMaterials.filter((item) => item._id !== deleteId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting raw material:", error);
    }
  };



  return (
    <div className="container mt-4 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">Raw Material List</h2>
      <table className="table table-bordered text-center">
        <thead className="text-brown" style={{ fontSize: "1.5rem", color: "brown" }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-brown" style={{ fontSize: "1.1rem" }}>
          {rawMaterials.map((material, index) => (
            <tr key={material._id}>
              <td>{index + 1}</td>
              <td>{material.name}</td>
              <td>{material.quantity}</td>
              <td>{material.unit}</td>
              <td>{parseFloat(material.cost).toFixed(2)}</td>
              <td>
               
                <button className="btn btn-danger" onClick={() => handleDeleteClick(material._id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this raw material?</p>
            <div className="modal-buttons">
              <button className="btn btn-danger me-2" onClick={confirmDelete}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterialList;
