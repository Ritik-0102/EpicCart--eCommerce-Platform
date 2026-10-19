import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { fetchCheckoutSummary, createOrder, initiatePayment, verifyPayment } from '../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

// Dynamically load Razorpay SDK script
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

const Checkout = () => {
  const { user, token } = useContext(AuthContext);
  const { cart, loadCart, loading: cartLoading } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  
  const [couponCode, setCouponCode] = useState('');
  const [summary, setSummary] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartLoading) return; // Wait for cart to finish loading

    if (!user) {
      navigate('/login');
    } else if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    } else {
      loadSummary();
    }
    // eslint-disable-next-line
  }, [user, cart, cartLoading]);

  const loadSummary = async (code = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCheckoutSummary(code, token);
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Failed to load checkout summary');
      if (code) {
        setCouponCode(''); // Clear invalid coupon
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      loadSummary(couponCode);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !city || !postalCode || !country) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your network or ad blocker.');
      }

      // 2. Authoritatively create order on backend (in PENDING state)
      // Note: cart is preserved until payment is cryptographically verified
      const orderData = {
        shippingAddress,
        city,
        postalCode,
        country,
        couponCode: summary?.coupon?.code || null
      };
      
      const newOrder = await createOrder(orderData, token);

      // 3. Initiate payment with Razorpay on backend
      const rzpOrder = await initiatePayment(newOrder.id, token);

      // 4. Configure and launch the Razorpay Checkout modal directly
      const razorpayKey = rzpOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key';

      const options = {
        key: razorpayKey,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'EpicCart',
        description: `Payment for Order #${newOrder.id}`,
        order_id: rzpOrder.id,
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast('Payment cancelled. Your cart items remain saved.', {
              icon: 'ℹ️'
            });
          }
        },
        handler: async function (response) {
          try {
            setLoading(true);
            // 5. Verify cryptographic signature on the backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: newOrder.id
            }, token);

            // 6. Reload cart context (which the backend cleared atomically upon verification)
            await loadCart();
            toast.success('Payment verified! Order confirmed.');
            navigate(`/orders/${newOrder.id}?confirmed=true`);
          } catch (verifyErr) {
            setLoading(false);
            setError('Payment verification failed: ' + (verifyErr.message || 'Please contact support.'));
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || ''
        },
        theme: {
          color: '#2563EB'
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (resp) {
        setLoading(false);
        const failMsg = resp.error?.description || 'Transaction declined by issuer';
        setError(`Payment failed: ${failMsg}`);
        toast.error('Payment failed. Please try again.');
      });

      paymentObject.open();

    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) return null;

  return (
    <div className="checkout-container container">
      <div className="checkout-header-bar">
        <h2>Checkout</h2>
        <span className="checkout-security-badge">
          <ShieldCheck size={16} />
          <span>Secure 256-Bit SSL Checkout</span>
        </span>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h3>1. Delivery Address</h3>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                value={shippingAddress}
                placeholder="Flat / House No., Apartment, Street"
                onChange={(e) => setShippingAddress(e.target.value)}
                disabled={loading}
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  value={city}
                  placeholder="City"
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Postal Code (PIN)</label>
                <input 
                  type="text" 
                  value={postalCode}
                  placeholder="6-digit PIN code"
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input 
                type="text" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading}
                required 
              />
            </div>
          </form>

          <div className="coupon-section">
            <h3>2. Promotional Coupons</h3>
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                Apply
              </button>
            </form>
            {summary?.coupon && (
              <p className="coupon-success">
                ✓ Coupon "{summary.coupon.code}" applied successfully!
              </p>
            )}
          </div>
        </div>

        <div className="checkout-summary-section">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.items.map(item => (
              <div key={item.id} className="summary-item">
                <span className="summary-item-name">{item.product.name} (x{item.quantity})</span>
                <span className="summary-item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr />

          {summary ? (
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{Number(summary.subtotal).toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{Number(summary.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping-tag">FREE</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{Number(summary.total).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="loading-summary">Calculating totals...</div>
          )}

          <button 
            type="submit" 
            form="checkout-form"
            className="btn btn-primary place-order-btn" 
            disabled={loading || !summary}
          >
            {loading ? (
              'Securing Payment...'
            ) : summary ? (
              `Pay ₹${Number(summary.total).toFixed(2)} with Razorpay`
            ) : (
              'Proceed to Payment'
            )}
          </button>

          <div className="checkout-trust-footer">
            <Lock size={13} />
            <span>Encrypted payment processed securely by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
