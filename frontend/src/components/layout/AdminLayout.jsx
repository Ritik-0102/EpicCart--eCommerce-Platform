import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/account" replace />;
  }

  const navLinkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 15px',
    color: isActive ? '#fff' : '#cbd5e1',
    backgroundColor: isActive ? '#334155' : 'transparent',
    textDecoration: 'none',
    borderRadius: '4px',
    marginBottom: '5px'
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
          Admin Portal
        </h2>
        <nav>
          <NavLink to="/admin" end style={navLinkStyle}>Dashboard</NavLink>
          <NavLink to="/admin/products" style={navLinkStyle}>Products</NavLink>
          <NavLink to="/admin/inventory" style={navLinkStyle}>Inventory</NavLink>
          <NavLink to="/admin/orders" style={navLinkStyle}>Orders</NavLink>
          <NavLink to="/admin/customers" style={navLinkStyle}>Customers</NavLink>
          <NavLink to="/admin/categories" style={navLinkStyle}>Categories</NavLink>
          <NavLink to="/admin/coupons" style={navLinkStyle}>Coupons</NavLink>
          <NavLink to="/admin/reviews" style={navLinkStyle}>Reviews</NavLink>
          <NavLink to="/admin/settings" style={navLinkStyle}>Settings</NavLink>
          <NavLink to="/admin/audit-logs" style={navLinkStyle}>Audit Logs</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

