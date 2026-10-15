import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80';

const ProductCard = ({ product, addingToCart = false, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      const success = await addToCart(product.id, 1);
      if (success) {
        toast.success(`Added "${product.name}" to cart!`);
      } else {
        toast.error('Failed to add item to cart. Please try again.');
      }
    }
  };

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

  const formattedPrice = parseFloat(product.price).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="product-card"
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
          <span className="stock-badge badge-low-stock">Only {product.stock} left!</span>
        ) : (
          <span className="stock-badge badge-in-stock">In Stock</span>
        )}

        {/* Wishlist Button */}
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

      {/* Product Information */}
      <div className="product-body">
        {/* Category & Star Rating */}
        <div className="product-meta-row">
          <span className="product-category-tag">
            {product.category?.name || 'Curated'}
          </span>
          <div className="product-rating">
            <Star size={12} className="star-filled" fill="#F59E0B" color="#F59E0B" />
            <span>4.8</span>
          </div>
        </div>

        {/* Product Title */}
        <h4 className="product-title" title={product.name}>
          {product.name}
        </h4>

        {/* Price & Action Row */}
        <div className="product-footer">
          <div className="price-stack">
            <span className="price-currency">₹</span>
            <span className="price-amount">{formattedPrice}</span>
          </div>

          <button 
            type="button"
            className="product-cart-btn"
            onClick={handleAddToCartClick}
            disabled={addingToCart || isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {addingToCart ? (
              <span className="btn-spinner"></span>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
