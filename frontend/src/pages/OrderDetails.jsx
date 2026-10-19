import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { fetchOrderById, initiatePayment, verifyPayment } from '../services/api';
import toast from 'react-hot-toast';
import './OrderDetails.css';

// Dynamically load razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const OrderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isConfirmedJustNow = searchParams.get('confirmed') === 'true';

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
        throw new Error('Razorpay SDK failed to load. Are you offline or using a strict ad blocker?');
      }

      // 1. Initiate payment on backend
      const rzpOrder = await initiatePayment(order.id, token);

      // 2. Open Razorpay Checkout
      const razorpayKey = rzpOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key';

      const options = {
        key: razorpayKey,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'EpicCart',
        description: `Payment for Order #${order.id}`,
        order_id: rzpOrder.id,
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
            toast('Payment cancelled.', { icon: 'ℹ️' });
          }
        },
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
            toast.success('Payment verified! Your order is confirmed.');
          } catch (verifyErr) {
            toast.error('Payment verification failed: ' + verifyErr.message);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user.name || 'EpicCart Customer',
          email: user.email || ''
        },
        theme: {
          color: '#2563EB'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.message || 'Failed to process payment');
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

  const isPaid = order.status !== 'PENDING';

  return (
    <div className="order-details-container container">
      <Link to="/orders" className="breadcrumb">← Back to Orders</Link>

      {/* Confirmation Celebration Banner (after direct checkout) */}
      {isConfirmedJustNow && isPaid && (
        <div className="order-success-banner">
          <CheckCircle2 size={24} className="success-icon" />
          <div>
            <h3>Payment Confirmed & Order Placed!</h3>
            <p>Thank you for shopping with EpicCart. A formal receipt has been dispatched to {user.email}.</p>
          </div>
        </div>
      )}
      
      <div className="order-header-section">
        <div>
          <h2>Order #{order.id}</h2>
          <p className="order-date-text">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </p>
        </div>

        <div className="header-status-wrapper">
          <span className={`status-badge ${order.status.toLowerCase()}`}>
            {order.status === 'PAID' ? '✓ Paid & Confirmed' : order.status}
          </span>
        </div>
      </div>

      {order.status === 'PENDING' && (
        <div className="payment-action-box">
          <div className="action-box-header">
            <AlertTriangle size={20} color="#D97706" />
            <h3>Payment Incomplete</h3>
          </div>
          <p>This order is pending payment. Complete your payment below to confirm your order.</p>
          <button 
            className="btn btn-primary" 
            onClick={handlePayment} 
            disabled={paymentProcessing}
          >
            {paymentProcessing ? 'Processing Gateway...' : `Pay ₹${Number(order.total).toFixed(2)} with Razorpay`}
          </button>
        </div>
      )}

      <div className="order-details-layout">
        <div className="order-items-list">
          <h3>Items in Order ({order.items?.length || 0})</h3>
          {order.items?.map(item => (
            <div key={item.id} className="order-item-card">
              <div className="item-info">
                <Link to={`/products/${item.productId}`} className="item-name">
                  {item.productName}
                </Link>
                <p className="item-meta">Quantity: {item.quantity}</p>
              </div>
              <div className="item-price">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-sidebar">
          {/* Summary Box */}
          <div className="order-summary-box">
            <h3>Price Summary</h3>
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
              <span className="free-tag">Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total Paid</span>
              <span>₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Verification Box */}
          {order.razorpayPaymentId && (
            <div className="payment-receipt-box">
              <div className="receipt-header">
                <ShieldCheck size={18} color="#059669" />
                <h4>Payment Verification</h4>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status</span>
                <span className="receipt-value verified-val">Verified & Paid</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Gateway</span>
                <span className="receipt-value">Razorpay</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Payment ID</span>
                <span className="receipt-value mono">{order.razorpayPaymentId}</span>
              </div>
              {order.razorpayOrderId && (
                <div className="receipt-row">
                  <span className="receipt-label">Order Ref</span>
                  <span className="receipt-value mono">{order.razorpayOrderId}</span>
                </div>
              )}
            </div>
          )}

          {/* Shipping Address Box */}
          <div className="shipping-box">
            <h3>Delivery Address</h3>
            <p className="address-line">{order.shippingAddress}</p>
            <p className="address-line">{order.city}, {order.postalCode}</p>
            <p className="address-line">{order.country || 'India'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;