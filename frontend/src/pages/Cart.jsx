// Cart page: displays items currently in the user's shopping bag, subtotal, and checkout CTA
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, loading, error, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Guard: if user is not logged in, ask them to sign in to access their cart
  if (!user) {
    return (
      <div className="cart-container empty-state">
        <h2>Your Cart</h2>
        <p>Please log in to view your cart.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
      </div>
    );
  }

  // Display loading state while cart data is fetching from the backend
  if (loading && (!cart || !cart.items)) {
    return <div className="cart-container loading">Loading your cart...</div>;
  }

  // Display error message if the API call failed
  if (error) {
    return <div className="cart-container error">{error}</div>;
  }

  // Empty state when cart contains zero items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container empty-state">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container container">
      <h2>Your Cart</h2>
      
      <div className="cart-layout">
        {/* Cart Item List */}
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.product.imageUrl || 'https://via.placeholder.com/100'} 
                alt={item.product.name} 
                className="cart-item-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
              />
              <div className="cart-item-details">
                <Link to={`/products/${item.product.id}`}>
                  <h3>{item.product.name}</h3>
                </Link>
                <p className="cart-item-price">₹{Number(item.product.price).toFixed(2)}</p>
                
                {/* Quantity increment / decrement buttons */}
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  
                  {/* Remove item from cart button */}
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="btn-remove"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                <p>₹{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary & Proceed to Checkout Sidebar */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Number(cart.totalPrice || cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0)).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Number(cart.totalPrice || cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0)).toFixed(2)}</span>
          </div>
          {/* Navigate to checkout screen */}
          <button 
            className="btn btn-primary btn-checkout" 
            disabled={loading}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-shopping-link">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
