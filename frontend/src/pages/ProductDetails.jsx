import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    setAdding(true);
    const success = await addToCart(product.id, quantity);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error('Could not add to cart. Please try again.');
    }
    setAdding(false);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to save to wishlist.');
      navigate('/login');
      return;
    }
    // Check if already in wishlist via context
    if (isInWishlist(product.id)) {
      // Find the item ID to remove
      const wishlistItem = wishlist?.items?.find(item => item.productId === product.id);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
        toast.success('Removed from wishlist.');
      }
    } else {
      const success = await addToWishlist(product.id);
      if (success) {
        toast.success('Added to wishlist!');
      } else {
        toast.error('Item already in wishlist or an error occurred.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container status-message loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container status-message error" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>⚠️ Product Not Found</h2>
        <p>We couldn't find the product you're looking for.</p>
        {error && <p className="error-details">{error}</p>}
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>← Back to Products</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <main className="product-details-page container">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/products">Products</Link>
        <span className="breadcrumb-sep">›</span>
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.name.toLowerCase()}`}>{product.category.name}</Link>
            <span className="breadcrumb-sep">›</span>
          </>
        )}
        <span className="breadcrumb-current">{product.name}</span>
      </nav>
      
      <div className="product-details-grid">
        {/* Product Image */}
        <div className="product-details-image">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} 
            alt={product.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }}
          />
        </div>

        {/* Product Info */}
        <div className="product-details-info">
          {product.category && (
            <Link to={`/products?category=${product.category.name.toLowerCase()}`} className="product-category-link">
              {product.category.name}
            </Link>
          )}
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">₹{parseFloat(product.price).toFixed(2)}</p>
          
          <div className="product-stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >−</button>
                <input 
                  id="quantity"
                  type="number" 
                  value={quantity} 
                  min="1" 
                  max={product.stock}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                />
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button 
              className="btn btn-primary add-to-cart-btn-large"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || adding}
              aria-label={product.stock > 0 ? 'Add to cart' : 'Out of stock'}
            >
              {adding ? 'Adding...' : product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              className={`btn btn-wishlist ${inWishlist ? 'in-wishlist' : ''}`}
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {inWishlist ? '❤️ Saved' : '♡ Wishlist'}
            </button>
          </div>

          <div className="product-meta">
            <p><span className="meta-label">Category:</span> {product.category?.name || 'General'}</p>
            <p><span className="meta-label">SKU:</span> EPIC-{product.id}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
