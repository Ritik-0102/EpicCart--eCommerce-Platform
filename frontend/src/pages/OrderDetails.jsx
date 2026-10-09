import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchOrderById, initiatePayment, verifyPayment } from '../services/api';
import './OrderDetails.css';

// Dynamically load razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const OrderDetails = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [id, user, token, navigate]);

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you offline?');
      }

      // 1. Initiate payment on backend
      const rzpOrder = await initiatePayment(order.id, token);

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Ensure this is available in Vite env
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'EpicCart',
        description: `Payment for Order #${order.id}`,
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id
            }, token);
            
            // Reload order to show PAID status
            await loadOrder();
            alert('Payment successful!');
          } catch (verifyErr) {
            alert('Payment verification failed: ' + verifyErr.message);
          }
        },
        prefill: {
          name: user.name || 'EpicCart User',
          email: user.email || ''
        },
        theme: {
          color: '#2874f0'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      alert(err.message || 'Failed to process payment');
    } finally {
      setPaymentProcessing(false);
    }
  };

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
      <Link to="/orders" className="breadcrumb">? Back to Orders</Link>
      
      <div className="order-header-section">
        <h2>Order #{order.id}</h2>
        <span className={`status-badge ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      {order.status === 'PENDING' && (
        <div className="payment-action-box">
          <p>This order is pending payment.</p>
          <button 
            className="btn btn-primary" 
            onClick={handlePayment} 
            disabled={paymentProcessing}
          >
            {paymentProcessing ? 'Processing...' : 'Pay Now with Razorpay'}
          </button>
        </div>
      )}

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
              <span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount {order.coupon ? `(${order.coupon.code})` : ''}</span>
                <span>-₹{Number(order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{Number(order.total).toFixed(2)}</span>
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