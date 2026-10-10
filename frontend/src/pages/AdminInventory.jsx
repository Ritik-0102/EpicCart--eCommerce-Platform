import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchInventoryLogs } from '../services/api';

const AdminInventory = () => {
  const { user, token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      const loadLogs = async () => {
        try {
          const data = await fetchInventoryLogs(token);
          setLogs(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadLogs();
    }
  }, [user, token]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading inventory logs...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Inventory Activity Logs</h1>
      </div>
      
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Product</th>
              <th style={{ padding: '15px' }}>SKU</th>
              <th style={{ padding: '15px' }}>Old Qty</th>
              <th style={{ padding: '15px' }}>New Qty</th>
              <th style={{ padding: '15px' }}>Adj.</th>
              <th style={{ padding: '15px' }}>Reason</th>
              <th style={{ padding: '15px' }}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px' }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td style={{ padding: '15px', fontWeight: '500' }}>{log.product.name}</td>
                <td style={{ padding: '15px' }}>{log.product.sku || '-'}</td>
                <td style={{ padding: '15px' }}>{log.prevQuantity}</td>
                <td style={{ padding: '15px' }}>{log.newQuantity}</td>
                <td style={{ padding: '15px', color: log.adjustment > 0 ? 'green' : log.adjustment < 0 ? 'red' : 'gray' }}>
                  {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}
                </td>
                <td style={{ padding: '15px' }}>{log.reason}</td>
                <td style={{ padding: '15px' }}>{log.admin ? log.admin.name : 'System'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No inventory logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;

