import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllRawMaterialMaster = () => {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/raw-material-master", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true); // Show modal
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/raw-material-master/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(materials.filter((material) => material._id !== deleteId));
      setShowModal(false); // Close modal after delete
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleEdit = (material) => {
    navigate("/dashboard/add-raw-material-master", { state: { material } });
  };

  return (
    <div className="container mt-4 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">Raw Materials Master</h2>
      <table className="table table-bordered text-center">
        <thead className="text-brown" style={{ fontSize: "1.5rem", color: "brown" }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-brown" style={{ fontSize: "1.1rem" }}>
          {materials.map((material, index) => (
            <tr key={material._id}>
              <td>{index + 1}</td>
              <td>{material.name}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(material)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
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
              <button className="btn btn-danger me-2" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRawMaterialMaster;
