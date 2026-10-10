import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAuditLogs } from '../services/api';

const AdminAuditLogs = () => {
  const { user, token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      loadLogs();
    }
  }, [user, token]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAuditLogs(token);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading audit logs...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>System Audit Logs</h1>
        <button onClick={loadLogs} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>Timestamp</th>
              <th style={{ padding: '15px' }}>Admin User</th>
              <th style={{ padding: '15px' }}>Action</th>
              <th style={{ padding: '15px' }}>Target Entity</th>
              <th style={{ padding: '15px' }}>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', whiteSpace: 'nowrap', color: '#64748b' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '15px', fontWeight: '500' }}>
                  {log.admin?.name || `Admin ID: ${log.adminId}`}
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{log.admin?.email}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    background: log.action.includes('UPDATE') || log.action.includes('EDIT') ? '#dbeafe' : log.action.includes('DELETE') ? '#fee2e2' : '#f1f5f9',
                    color: log.action.includes('UPDATE') || log.action.includes('EDIT') ? '#1e40af' : log.action.includes('DELETE') ? '#991b1b' : '#334155',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' 
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {log.targetType} {log.targetId ? `(ID: ${log.targetId})` : ''}
                </td>
                <td style={{ padding: '15px', fontSize: '0.9rem', color: '#64748b' }}>
                  <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                    {log.metadata || '-'}
                  </pre>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;

