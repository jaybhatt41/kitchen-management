import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

const BillManagement = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.get("http://localhost:5000/api/bill/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching user-specific bills:", error);
    }
  };

  const downloadPDF = async (billId) => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.get(`http://localhost:5000/api/bill/pdf/${billId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Treat response as a file
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bill_${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Bills</h2>
      <Table striped bordered hover responsive className="text-center">
        <thead className="bg-primary text-white">
          <tr>
            <th>Bill ID</th>
            <th>Assigned To</th>
            <th>Grand Total</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill._id}</td>
                <td>{bill.assignTo}</td>
                <td>${bill.grandTotal.toFixed(2)}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => downloadPDF(bill._id)}
                  >
                    Download PDF
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No bills available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default BillManagement;
