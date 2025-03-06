import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
// import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [products, setProducts] = useState([{ name: null, price: "", quantity: "" }]);
  const [rawMaterials, setRawMaterials] = useState([{ name: null, quantity: "" }]);
  const [productOptions, setProductOptions] = useState([]);
  const [rawMaterialOptions, setRawMaterialOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const productRes = await axios.get("http://localhost:5000/api/product-master",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const rawMaterialRes = await axios.get("http://localhost:5000/api/raw-material/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Product API Response:", productRes.data);
       console.log("Raw Material API Response:", rawMaterialRes.data);
      setProductOptions(productRes.data.map(p => ({ value: p.name, label: p.name })));
      setRawMaterialOptions(rawMaterialRes.data.map(rm => ({ value: rm.name, label: rm.name })));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleRawMaterialChange = (index, field, value) => {
    const updatedRawMaterials = [...rawMaterials];
    updatedRawMaterials[index][field] = value;
    setRawMaterials(updatedRawMaterials);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      // Merge products with the same name
      const mergedProducts = products.reduce((acc, product) => {
        const existingProduct = acc.find(p => p.name === product.name);
        if (existingProduct) {
          existingProduct.quantity = Number(existingProduct.quantity) + Number(product.quantity); // Convert to numbers
        } else {
          acc.push({ ...product, quantity: Number(product.quantity) }); // Ensure quantity is a number
        }
        return acc;
      }, []);
  
      await axios.post("http://localhost:5000/api/product/add",
        { products: mergedProducts, rawMaterials },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Product added successfully!");
      setProducts([{ name: null, price: "", quantity: "" }]);
      setRawMaterials([{ name: null, quantity: "" }]);
      navigate("/dashboard/product");
  
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
    setLoading(false);
  };
  
  

  return (
    <div className="container mt-2 p-4 border rounded shadow">
      <h2 className="text-center mb-4">Add Product</h2>

      {/* Product Section */}
      <h4>Product Details</h4>
      {products.map((product, index) => (
        <div key={index} className="row mb-2 align-items-center">
          <div className="col">
            <Select
              options={productOptions}
              placeholder="Select Product"
              isSearchable
              classNamePrefix="react-select input-field"
              value={productOptions.find(opt => opt.value === product.name) || null}
              onChange={selectedOption => handleProductChange(index, "name", selectedOption.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Price"
              className="form-control"
              value={product.price}
              onChange={e => handleProductChange(index, "price", e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Quantity"
              className="form-control"
              value={product.quantity}
              onChange={e => handleProductChange(index, "quantity", e.target.value)}
            />
          </div>
          <div className="col-auto">
            {products.length > 1 && (
              <button onClick={() => setProducts(products.filter((_, i) => i !== index))} className="btn btn-danger">❌</button>
            )}
          </div>
        </div>
      ))}
      <button onClick={() => setProducts([...products, { name: null, price: "", quantity: "" }])} className="btn btn-primary">+ Add Product</button>
      
      <hr className="my-4" />
      
      {/* Raw Material Section */}
      <h4>Raw Materials Used</h4>
      {rawMaterials.map((material, index) => (
        <div key={index} className="row mb-2 align-items-center">
          <div className="col">
            <Select
              options={rawMaterialOptions}
              placeholder="Select Raw Material"
              isSearchable
              classNamePrefix="react-select input-field"
              value={rawMaterialOptions.find(opt => opt.value === material.name) || null}
              onChange={selectedOption => handleRawMaterialChange(index, "name", selectedOption.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Quantity"
              className="form-control"
              value={material.quantity}
              onChange={e => handleRawMaterialChange(index, "quantity", e.target.value)}
            />
          </div>
          <div className="col-auto">
            {rawMaterials.length > 1 && (
              <button onClick={() => setRawMaterials(rawMaterials.filter((_, i) => i !== index))} className="btn btn-danger">❌</button>
            )}
          </div>
        </div>
      ))}
      <button onClick={() => setRawMaterials([...rawMaterials, { name: null, quantity: "" }])} className="btn btn-primary">+ Add Raw Material</button>
      
      {/* Submit Button */}
      <div className="text-center mt-4">
        <button onClick={handleSubmit} className="btn btn-success" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;