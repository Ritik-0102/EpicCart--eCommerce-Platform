import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({}); // track per-product loading

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        const arr = Array.isArray(data) ? data : (data?.data || []);
        setFeaturedProducts(arr.slice(0, 4)); // Get first 4 products
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (e, product) => {
    // Stop the click from navigating to product details
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to add items to the cart.');
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    const success = await addToCart(product.id, 1);
    setAddingToCart(prev => ({ ...prev, [product.id]: false }));

    if (success) {
      toast.success(`"${product.name}" added to cart!`);
    } else {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to manage your wishlist.');
      navigate('/login');
      return;
    }

    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      // Retrieve the wishlist item's row ID (not the product ID)
      const itemId = getWishlistItemId(product.id);
      if (itemId) {
        await removeFromWishlist(itemId);
        toast.success(`"${product.name}" removed from wishlist.`);
      }
    } else {
      const success = await addToWishlist(product.id);
      if (success) {
        toast.success(`"${product.name}" added to wishlist!`);
      } else {
        toast.error('Failed to update wishlist.');
      }
    }
  };

  if (isLoading) return <div className="container status-message">Loading featured products...</div>;
  if (error) return <div className="container status-message error">{error}</div>;

  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">Featured Products</h2>
        <Link to="/products" className="view-all">View All</Link>
      </div>
      
      <div className="products-grid">
        {featuredProducts.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'}
                alt={product.name}
                className="product-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }}
              />
              {/* Wishlist button — stops link navigation */}
              <button
                className={`wishlist-btn${isInWishlist(product.id) ? ' in-wishlist' : ''}`}
                onClick={(e) => handleWishlistToggle(e, product)}
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist(product.id) ? '♥' : '♡'}
              </button>
            </div>
            
            <div className="product-info">
              <p className="product-category-label">{product.category?.name || 'General'}</p>
              <h3 className="product-name">{product.name}</h3>
              
              <div className="product-price-row">
                <div className="price-container">
                  <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                </div>
                {/* Add to cart button — stops link navigation */}
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={addingToCart[product.id]}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {addingToCart[product.id] ? '...' : 'Add +'}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
