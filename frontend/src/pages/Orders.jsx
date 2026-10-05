import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';
import './Orders.css';

const Orders = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, token, navigate]);

  if (loading) {
    return <div className="container status-message loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="container status-message error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container container empty-state">
        <h2>Order History</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container container">
      <h2>Your Order History</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-status-badge">
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="order-body">
              <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
              <p><strong>Items:</strong> {order.items.length}</p>
              <p><strong>Delivering to:</strong> {order.shippingAddress}, {order.city}</p>
            </div>
            
            <div className="order-footer">
              <Link to={`/orders/${order.id}`} className="btn btn-secondary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
