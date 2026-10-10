import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAdminSummary } from '../services/api';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      const loadSummary = async () => {
        try {
          const data = await fetchAdminSummary(token);
          setSummary(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadSummary();
    }
  }, [user, token]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px' }}>Total Products</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary?.totalProducts || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px' }}>Total Orders</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary?.totalOrders || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px' }}>Total Users</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{summary?.totalUsers || 0}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', color: '#666', marginBottom: '10px' }}>Total Revenue</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            ${(summary?.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>Quick Links</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="/admin/products" style={{ color: '#2563eb', textDecoration: 'none' }}>Manage Products & Inventory</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="/admin/orders" style={{ color: '#2563eb', textDecoration: 'none' }}>Manage Orders</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="/admin/customers" style={{ color: '#2563eb', textDecoration: 'none' }}>Manage Customers</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
