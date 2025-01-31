import React, { useState } from "react";
import axios from 'axios' // Import your API service
import { useLocation, useNavigate } from "react-router-dom";
import "./OtpVerification.css"

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(""); // For success messages
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email; // Get email from location state

  if (!email) {
    alert("No email found! Please register first.");
    navigate("/"); // Redirect to the registration page
    return null; // Prevent further rendering
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    setSuccess(""); // Clear any previous success message

    try {
      const response = await axios.post("http://localhost:5000/api/user/verify", { email, otp });
      setSuccess(response.data.message); // Display success message
      setTimeout(() => {
        navigate("/login"); // Redirect to dashboard or home
      }, 2000); // Delay navigation to let the user see the message
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display error message from backend
      } else {
        setError("Something went wrong. Please try again."); // Generic error
      }
    }
  };

  return (
    <div className="main">
    <div className="otp-verification-container">
      <h2 className="otp-title">Verify OTP</h2>
      <h3 className="otp-sent-email">OTP is sent on {email}</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="otp-form">
        <input
          className="inputfield"
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <br />
        <button className="submit-button" type="submit">Verify</button>
      </form>
    </div>
    </div>
  );
};

export default OtpVerification;
