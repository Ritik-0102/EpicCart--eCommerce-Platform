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

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg text-gray-500 mb-2">Total Products</h2>
          <p className="text-4xl font-bold">{summary?.totalProducts || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg text-gray-500 mb-2">Total Orders</h2>
          <p className="text-4xl font-bold">{summary?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg text-gray-500 mb-2">Total Users</h2>
          <p className="text-4xl font-bold">{summary?.totalUsers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="/admin/products" className="text-indigo-600 hover:underline">Manage Products & Inventory</a>
            </li>
            <li>
              <a href="/admin/orders" className="text-indigo-600 hover:underline">Manage Orders</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
