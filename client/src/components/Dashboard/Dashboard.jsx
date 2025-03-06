import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="header2">
        <p>Kitchen Management For Mess and Canteen</p>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <ul>
            {/* Overview link */}
            <li className="sidebar-section">
              <div className="section-title">Master</div>
              <ul className="submenu">
                <li>
                  <NavLink
                    to="add-raw-material-master"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Raw Materials Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="add-product-master"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                   Add Product Master
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    to="all-raw-material-master"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                   All Raw Material Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="all-product-master"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                   All Product Master
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Raw Material Management section with hover effect to show submenu */}
            <li className="sidebar-section">
              <div className="section-title">Raw Material Management</div>
              <ul className="submenu">
                <li>
                  <NavLink
                    to="raw-material"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    View Raw Materials
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="add-raw-material"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Raw Material
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Purchase Management */}
            <li>
              <NavLink
                to="purchases"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Purchase
              </NavLink>
            </li>

            {/* Other Sections */}
            <li className="sidebar-section">
              <div className="section-title">Products</div>
              <ul className="submenu">
                <li>
                  <NavLink
                    to="product"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Manage Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="add-product"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Product
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Distribution */}
            <li>
              <NavLink
                to="add-distribution"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Add Distribution
              </NavLink>
            </li>

            {/* Bills */}
            <li>
              <NavLink
                to="bill"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Bills
              </NavLink>
            </li>

            {/* Invoices */}
            <li className="sidebar-section">
              <div className="section-title">Invoices</div>
              <ul className="submenu">
                <li>
                  <NavLink
                    to="credit-invoice"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Credit Invoice
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="debit-invoice"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Debit Invoice
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
