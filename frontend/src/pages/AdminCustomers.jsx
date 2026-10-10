import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchCustomers } from '../services/api';

const AdminCustomers = () => {
  const { user, token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      const loadCustomers = async () => {
        try {
          const data = await fetchCustomers(token);
          setCustomers(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadCustomers();
    }
  }, [user, token]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading customers...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Manage Customers</h1>
      </div>
      
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Name</th>
              <th style={{ padding: '15px' }}>Email</th>
              <th style={{ padding: '15px' }}>Role</th>
              <th style={{ padding: '15px' }}>Joined</th>
              <th style={{ padding: '15px' }}>Total Orders</th>
              <th style={{ padding: '15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px' }}>{c.id}</td>
                <td style={{ padding: '15px', fontWeight: '500' }}>{c.name}</td>
                <td style={{ padding: '15px' }}>{c.email}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    backgroundColor: c.role === 'ADMIN' ? '#e0e7ff' : '#f1f5f9',
                    color: c.role === 'ADMIN' ? '#4f46e5' : '#475569'
                  }}>
                    {c.role}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '15px' }}>{c._count?.orders || 0}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    backgroundColor: c.isActive ? '#dcfce7' : '#fee2e2',
                    color: c.isActive ? '#166534' : '#991b1b'
                  }}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;

