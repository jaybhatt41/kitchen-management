import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDistribution = () => {
  const [assignTo, setAssignTo] = useState(""); // Assign To (Mess, Canteen, Other)
  const [products, setProducts] = useState([]); // Available Products
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: "", price: 0 }, // Default row
  ]); 
  const token = localStorage.getItem("token"); // Token from localStorage
  const navigate=useNavigate()

  // 📌 Fetch User-Specific Products from Backend
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/product/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [token]);

  // 📌 Add New Product Row
  const addProductRow = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: "", price: 0 }]);
  };

  

  // 📌 Handle Product Selection
  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    // ❌ Prevent Duplicate Product Selection
    if (selectedProducts.some((p) => p.productId === productId)) {
      alert("This product is already selected!");
      return;
    }

    let updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      productId,
      quantity: "",
      price: product.price,
    };
    setSelectedProducts(updatedProducts);
  };

  // 📌 Handle Quantity Input
  const handleQuantityChange = (index, quantity) => {
    let updatedProducts = [...selectedProducts];
    const product = products.find((p) => p._id === updatedProducts[index].productId);

    if (product && quantity > product.quantity) {
      alert(`Insufficient stock! Available: ${product.quantity}`);
      return;
    }

    updatedProducts[index].quantity = quantity;
    setSelectedProducts(updatedProducts);
  };

  // 📌 Handle Distribution Submission
  const handleSubmit = async () => {
    if (!assignTo) {
      alert("Please select Assign To");
      return;
    }

    if (selectedProducts.some((p) => !p.productId || !p.quantity)) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    if (!token) {
      alert("Unauthorized! Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/distribution/add",
        { assignTo, products: selectedProducts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Products Distributed Successfully!");
      setAssignTo("");
      setSelectedProducts([{ productId: "", quantity: "", price: 0 }]);
      navigate("/dashboard/bill") // Reset with one default row
    } catch (error) {
      console.error("Error in distribution:", error);
      alert("Distribution failed! Check console for details.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Product Distribution</h2>

      {/* 📌 Assign To Dropdown */}
      <div className="mb-3">
        <label className="form-label">Assign To:</label>
        <select
          className="form-select"
          value={assignTo}
          onChange={(e) => setAssignTo(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Mess">Mess</option>
          <option value="Canteen">Canteen</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* 📌 Product Selection Table */}
      <table className="table table-bordered">
        <thead>
          <tr className="table-dark">
            <th>Product Name</th>
            <th>Available Stock</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((row, index) => (
            <tr key={index}>
              {/* Product Dropdown */}
              <td>
                <select
                  className="form-select"
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  value={row.productId}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Available Stock */}
              <td>{products.find((p) => p._id === row.productId)?.quantity || "--"}</td>

              {/* Quantity Input */}
              <td>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Enter quantity"
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                />
              </td>

              {/* Price */}
              <td>{row.price}</td>

              {/* Remove Button */}
              <td>
  {selectedProducts.length > 1 && (
    <button
      className="btn btn-danger"
      onClick={() => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
      }}
    >
      Remove
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Add More Product Button */}
      <button className="btn btn-primary me-2" onClick={addProductRow}>
        Add Product
      </button>

      {/* 📌 Submit Button */}
      <button className="btn btn-success" onClick={handleSubmit}>
        Distribute
      </button>
    </div>
  );
};

export default AddDistribution;
