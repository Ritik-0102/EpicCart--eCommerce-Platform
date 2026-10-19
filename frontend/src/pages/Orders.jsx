import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
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
        // Backend now excludes PENDING unpaid attempts by default
        const data = await fetchMyOrders(token);
        setOrders(Array.isArray(data) ? data : []);
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

  const confirmedOrders = orders.filter(o => o.status !== 'PENDING');
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  if (orders.length === 0) {
    return (
      <div className="orders-container container empty-state">
        <div className="empty-state-icon">📦</div>
        <h2>No Confirmed Orders Yet</h2>
        <p>You haven't completed any purchases yet. Start exploring our premium catalogue!</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <span className="status-pill status-paid"><CheckCircle2 size={13} /> Paid & Confirmed</span>;
      case 'PROCESSING':
        return <span className="status-pill status-processing"><Clock size={13} /> Processing</span>;
      case 'PACKED':
        return <span className="status-pill status-packed"><Package size={13} /> Packed</span>;
      case 'SHIPPED':
        return <span className="status-pill status-shipped">🚚 Shipped</span>;
      case 'DELIVERED':
        return <span className="status-pill status-delivered">✓ Delivered</span>;
      case 'CANCELLED':
        return <span className="status-pill status-cancelled">✕ Cancelled</span>;
      default:
        return <span className="status-pill status-pending"><AlertTriangle size={13} /> {status}</span>;
    }
  };

  return (
    <div className="orders-container container">
      <div className="orders-header">
        <div>
          <h2>Your Orders</h2>
          <p className="orders-subtitle">Track, manage and review your verified purchases</p>
        </div>
        <span className="orders-verified-badge">
          <ShieldCheck size={16} />
          <span>Verified Orders Only</span>
        </span>
      </div>

      {/* Confirmed Orders List */}
      <div className="orders-list">
        {confirmedOrders.length > 0 ? (
          confirmedOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta-col">
                  <div className="order-id-row">
                    <span className="order-id">Order #{order.id}</span>
                    {order.razorpayPaymentId && (
                      <span className="payment-verified-tag">Razorpay Verified</span>
                    )}
                  </div>
                  <p className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="order-status-badge">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="order-body">
                <div className="order-items-preview">
                  <span className="order-items-count">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}:
                  </span>
                  <div className="order-items-tags">
                    {order.items?.map(it => (
                      <span key={it.id} className="order-item-chip">
                        {it.productName} × {it.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-financials">
                  <div className="financial-col">
                    <span className="financial-label">Total Amount</span>
                    <span className="financial-value">₹{Number(order.total).toFixed(2)}</span>
                  </div>
                  <div className="financial-col">
                    <span className="financial-label">Delivering To</span>
                    <span className="financial-value address-value">
                      {order.city ? `${order.city}, ${order.country || 'India'}` : order.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="order-footer">
                <Link to={`/orders/${order.id}`} className="btn btn-secondary view-details-btn">
                  <span>View Details & Receipt</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-confirmed-notice">
            <p>You have no confirmed orders yet.</p>
          </div>
        )}
      </div>

      {/* Pending / Incomplete Attempts Section (if any returned) */}
      {pendingOrders.length > 0 && (
        <div className="pending-orders-section">
          <div className="pending-header">
            <AlertTriangle size={18} className="pending-icon" />
            <div>
              <h3>Incomplete Checkout Attempts ({pendingOrders.length})</h3>
              <p>These orders were initiated but payment was not finalized. They are not confirmed purchases.</p>
            </div>
          </div>
          <div className="orders-list">
            {pendingOrders.map(order => (
              <div key={order.id} className="order-card card-pending-attempt">
                <div className="order-header">
                  <div>
                    <span className="order-id">Attempt #{order.id}</span>
                    <p className="order-date">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="status-pill status-pending">Payment Incomplete</span>
                </div>
                <div className="order-body">
                  <p><strong>Amount:</strong> ₹{Number(order.total).toFixed(2)}</p>
                </div>
                <div className="order-footer">
                  <Link to={`/orders/${order.id}`} className="btn btn-primary">
                    Complete Payment with Razorpay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
