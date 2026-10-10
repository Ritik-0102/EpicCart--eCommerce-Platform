import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '../services/api';

const AdminOrders = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState({});

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      const loadOrders = async () => {
        try {
          const data = await fetchAllOrders(token);
          setOrders(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    }
  }, [user, token]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleStatusUpdate = async (orderId) => {
    const statusVal = newStatus[orderId];
    if (!statusVal) return;
    
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, statusVal, token);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: statusVal } : o));
      alert('Order status updated successfully!');
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = (orderId, val) => {
    setNewStatus({ ...newStatus, [orderId]: val });
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <a href="/admin" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</a>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">User ID</th>
              <th className="p-4 font-semibold">Total Amount</th>
              <th className="p-4 font-semibold">Payment Status</th>
              <th className="p-4 font-semibold">Order Status</th>
              <th className="p-4 font-semibold">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.userId}</td>
                <td className="p-4">${parseFloat(order.totalAmount).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4 font-medium">{order.status}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <select 
                      className="border rounded p-1"
                      defaultValue={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button 
                      onClick={() => handleStatusUpdate(order.id)}
                      disabled={updatingId === order.id}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updatingId === order.id ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
