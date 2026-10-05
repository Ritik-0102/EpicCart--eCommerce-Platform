import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, loading, error, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-container empty-state">
        <h2>Your Cart</h2>
        <p>Please log in to view your cart.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
      </div>
    );
  }

  if (loading && (!cart || !cart.items)) {
    return <div className="cart-container loading">Loading your cart...</div>;
  }

  if (error) {
    return <div className="cart-container error">{error}</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container empty-state">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container container">
      <h2>Your Cart</h2>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.product.imageUrl || 'https://via.placeholder.com/100'} 
                alt={item.product.name} 
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <Link to={`/products/${item.product.id}`}>
                  <h3>{item.product.name}</h3>
                </Link>
                <p className="cart-item-price">${Number(item.product.price).toFixed(2)}</p>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                    >+</button>
                  </div>
                  
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
                <p>${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${Number(cart.totalAmount).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>${Number(cart.totalAmount || cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0)).toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-primary btn-checkout" 
            disabled={loading}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
