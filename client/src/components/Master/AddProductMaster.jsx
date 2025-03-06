import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([{ name: "" }]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      setProducts([{ name: location.state.product.name }]);
      setIsEdit(true);
      setEditId(location.state.product._id);
    }
  }, [location.state]);

  const handleAddRow = () => {
    setProducts([...products, { name: "" }]);
  };

  const handleDeleteRow = (index) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].name = value;
    setProducts(newProducts);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/product-master/${editId}`,
          { name: products[0].name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/product-master/add",
          { products },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );
        alert("Products added successfully!");
      }
      navigate("/dashboard/all-product-master");
    } catch (error) {
      console.error("Error saving products:", error);
      alert("Failed to save products.");
    }
  };

  return (
    <div className="container mt-2 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">{isEdit ? "Edit Product" : "Add Product"}</h2>

      {products.map((product, index) => (
        <div key={index} className="row mb-2 align-items-center">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Product Name"
              className="form-control input-field"
              value={product.name}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
          <div className="col-auto">
            {products.length > 1 && (
              <button onClick={() => handleDeleteRow(index)} className="btn btn-danger">❌</button>
            )}
          </div>
        </div>
      ))}

      {/* Single Add Row Button Centered Below */}
      {!isEdit && (
        <div className="text-center mt-3">
        <button onClick={handleAddRow} className="btn btn-primary">+ Add Row</button>
      </div>
      )
      }

      <button onClick={handleSubmit} className="btn btn-success mt-3">
        {isEdit ? "Edit" : "Add"}
      </button>
    </div>
  );
};

export default AddProductMaster;
