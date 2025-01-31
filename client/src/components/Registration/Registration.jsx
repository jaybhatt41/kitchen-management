import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./Registration.css"

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        formData
      );
      setSuccess(response.data.message);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="main">
    <div className="registration-container">
      <h2 className="registration-title">Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form  className="registration-form " onSubmit={handleSubmit}>
        <input
          className="inputfield"
          type="text"
          name="name"
          placeholder="Enter Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br/>
        <input
          className="inputfield"
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          className="inputfield"
          type="password"
          name="password"
          placeholder="Enter Your Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br/>
        <div className='login-link'>
             <span>Already have an account?</span><Link to={"/login"}>Login</Link><span>Here</span>
             </div>
        <button className="submit-button" type="submit">Register</button>
      </form>
    </div>
    </div>
  );
};

export default Registration;
