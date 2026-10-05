import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { fetchCheckoutSummary, createOrder } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { user, token } = useContext(AuthContext);
  const { cart, loadCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [summary, setSummary] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    } else {
      loadSummary();
    }
    // eslint-disable-next-line
  }, [user, cart]);

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
      const orderData = {
        shippingAddress,
        city,
        postalCode,
        country,
        couponCode: summary?.coupon?.code || null
      };
      
      const newOrder = await createOrder(orderData, token);
      
      // Reload the cart to clear it out on the UI
      await loadCart();
      
      // Navigate to order details
      navigate(`/orders/${newOrder.id}`);
      
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) return null;

  return (
    <div className="checkout-container container">
      <h2>Checkout</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h3>Shipping Address</h3>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
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
                required 
              />
            </div>
          </form>

          <div className="coupon-section">
            <h3>Have a Coupon?</h3>
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                Apply
              </button>
            </form>
            {summary?.coupon && (
              <p className="coupon-success">
                Coupon "{summary.coupon.code}" applied successfully!
              </p>
            )}
          </div>
        </div>

        <div className="checkout-summary-section">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.items.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr />

          {summary ? (
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${Number(summary.subtotal).toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${Number(summary.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>${Number(summary.total).toFixed(2)}</span>
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
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
