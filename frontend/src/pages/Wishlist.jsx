import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="wishlist-container empty-state">
        <h2>Your Wishlist</h2>
        <p>Please log in to view your wishlist.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
      </div>
    );
  }

  if (loading && (!wishlist || !wishlist.items)) {
    return <div className="wishlist-container loading">Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="wishlist-container error">{error}</div>;
  }

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="wishlist-container empty-state">
        <h2>Your Wishlist is Empty</h2>
        <p>You haven't saved any items yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const handleAddToCart = async (productId, wishlistItemId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      removeFromWishlist(wishlistItemId);
    }
  };

  return (
    <div className="wishlist-container container">
      <h2>Your Wishlist</h2>
      
      <div className="wishlist-grid">
        {wishlist.items.map(item => (
          <div key={item.id} className="wishlist-card">
            <Link to={`/products/${item.product.id}`}>
              <img 
                src={item.product.imageUrl || 'https://via.placeholder.com/200'} 
                alt={item.product.name} 
                className="wishlist-image"
              />
            </Link>
            <div className="wishlist-details">
              <Link to={`/products/${item.product.id}`}>
                <h3>{item.product.name}</h3>
              </Link>
              <p className="price">${Number(item.product.price).toFixed(2)}</p>
              
              <div className="wishlist-actions">
                <button 
                  onClick={() => handleAddToCart(item.product.id, item.id)}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
