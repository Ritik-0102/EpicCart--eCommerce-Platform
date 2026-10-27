// Reusable storefront ProductCard component displayed in catalog grids and carousels
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

// Fallback placeholder image used if product imageUrl fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80';

const ProductCard = ({ product, addingToCart = false, onAddToCart }) => {
  // Global shopping contexts
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local state for add-to-cart spinner animation
  const [localAdding, setLocalAdding] = useState(false);
  const isAdding = addingToCart || localAdding;

  // Determine inventory and wishlist flags
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  // Handle adding an item to the shopping cart
  const handleAddToCartClick = async (e) => {
    // Prevent navigating to the product details page when clicking the button
    e.preventDefault();
    e.stopPropagation();

    // Prompt user to log in if they are a guest
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    // Call custom handler if provided (e.g. from parent), otherwise use default context
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      setLocalAdding(true);
      const success = await addToCart(product.id, 1);
      setLocalAdding(false);
      if (success) {
        toast.success(`Added "${product.name}" to cart!`);
      } else {
        toast.error('Failed to add item to cart. Please try again.');
      }
    }
  };

  // Toggle item in and out of the user's wishlist
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to save items to your wishlist.');
      navigate('/login');
      return;
    }

    if (inWishlist) {
      const itemId = getWishlistItemId(product.id);
      if (itemId) {
        await removeFromWishlist(itemId);
        toast.success(`Removed "${product.name}" from wishlist.`);
      }
    } else {
      const success = await addToWishlist(product.id);
      if (success) {
        toast.success(`Saved "${product.name}" to wishlist!`);
      } else {
        toast.error('Failed to update wishlist.');
      }
    }
  };

  // Format currency in Indian Rupees (INR) with two decimal places
  const formattedPrice = parseFloat(product.price).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Calculate discount percentage if original price is greater than selling price
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const formattedOriginalPrice = hasDiscount
    ? parseFloat(product.originalPrice).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : null;

  return (
    // Wrap entire card in React Router Link to navigate to single product details page
    <Link 
      to={`/products/${product.id}`} 
      className={`product-card ${isOutOfStock ? 'card-out-of-stock' : ''}`}
      aria-label={`View details for ${product.name}`}
    >
      {/* Product Image & Badges */}
      <div className="product-media">
        <img 
          src={product.imageUrl || FALLBACK_IMAGE} 
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="stock-badge badge-out-of-stock">Out of Stock</span>
        ) : isLowStock ? (
          <span className="stock-badge badge-low-stock">Only {product.stock} left</span>
        ) : (
          <span className="stock-badge badge-in-stock">In Stock</span>
        )}

        {/* Wishlist Toggle Button */}
        <button 
          type="button"
          className={`product-wishlist-btn ${inWishlist ? 'is-active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={inWishlist ? '#DC2626' : 'none'} color={inWishlist ? '#DC2626' : '#64748B'} />
        </button>
      </div>

      {/* Product Information Body */}
      <div className="product-body">
        {/* Category & Rating */}
        <div className="product-meta-row">
          <span className="product-category-tag">
            {product.category?.name || 'Curated'}
          </span>
          {(product.rating || product.avgRating) ? (
            <div className="product-rating">
              <Star size={12} className="star-filled" fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating || product.avgRating}</span>
            </div>
          ) : null}
        </div>

        {/* Product Title */}
        <h4 className="product-title" title={product.name}>
          {product.name}
        </h4>

        {/* Price & Add to Cart Footer */}
        <div className="product-footer">
          <div className="price-stack">
            <div className="price-current-line">
              <span className="price-currency">₹</span>
              <span className="price-amount">{formattedPrice}</span>
            </div>
            {hasDiscount && (
              <div className="price-discount-line">
                <span className="price-original">₹{formattedOriginalPrice}</span>
                <span className="price-discount-badge">{discountPercent}% off</span>
              </div>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <button 
            type="button"
            className={`product-cart-btn ${isOutOfStock ? 'btn-out-of-stock' : ''}`}
            onClick={handleAddToCartClick}
            disabled={isAdding || isOutOfStock}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            {isAdding ? (
              <span className="btn-spinner" aria-label="Adding to cart..."></span>
            ) : isOutOfStock ? (
              <span className="btn-text">Sold Out</span>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="btn-text">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
