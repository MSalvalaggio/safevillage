
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Admin.css';

function Admin() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link to="/admin/products" className="admin-link">
          Manage Products
        </Link>
        {/* Add more admin links here as needed */}
      </div>
    </div>
  );
}

export default Admin;