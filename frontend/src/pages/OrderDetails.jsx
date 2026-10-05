import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchOrderById } from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id, token);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, user, token, navigate]);

  if (loading) {
    return <div className="container status-message loading">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="container status-message error">
        <h2>Order Not Found</h2>
        <p>{error || "We couldn't find this order."}</p>
        <Link to="/orders" className="back-link">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="order-details-container container">
      <Link to="/orders" className="breadcrumb">← Back to Orders</Link>
      
      <div className="order-header-section">
        <h2>Order #{order.id}</h2>
        <span className={`status-badge ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      
      <p className="order-date-text">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      <div className="order-details-layout">
        <div className="order-items-list">
          <h3>Items ({order.items.length})</h3>
          {order.items.map(item => (
            <div key={item.id} className="order-item-card">
              <div className="item-info">
                <Link to={`/products/${item.productId}`} className="item-name">
                  {item.productName}
                </Link>
                <p className="item-meta">Qty: {item.quantity}</p>
              </div>
              <div className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-sidebar">
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount {order.coupon ? `(${order.coupon.code})` : ''}</span>
                <span>-${Number(order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="shipping-box">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress}</p>
            <p>{order.city}, {order.postalCode}</p>
            <p>{order.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
