import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/purchase", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPurchases(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setLoading(false);
    }
  };

  const downloadPDF = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/purchase/gen-pdf/${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });

      // Create a Blob URL for download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Purchases_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="container mt-4 p-4 border rounded shadow bg-light">
      <h2 className="mb-4 text-center text-brown">Purchase List</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : Object.keys(purchases).length === 0 ? (
        <p className="text-center">No purchases found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center purchase-table">
            <thead className="table-header">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Cost ($)</th>
                <th>Download PDF</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(purchases).map(([date, items], dateIndex) =>
                items.map((purchase, index) => (
                  <tr key={purchase._id} className="table-row">
                    {index === 0 && <td rowSpan={items.length}>{dateIndex + 1}</td>}
                    {index === 0 && <td rowSpan={items.length}>{date}</td>}
                    <td>{purchase.name}</td>
                    <td>{purchase.quantity}</td>
                    <td>{purchase.unit}</td>
                    <td>${purchase.cost.toFixed(2)}</td>
                    {index === 0 && (
                      <td rowSpan={items.length}>
                        <button className="btn btn-primary btn-sm" onClick={() => downloadPDF(date)}>
                          <i className="fa-solid fa-file-pdf"></i> Download
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
