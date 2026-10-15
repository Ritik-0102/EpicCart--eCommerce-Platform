import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Package, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import './Navbar.css';

const CATEGORY_LINKS = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Home & Kitchen', value: 'home & kitchen' },
  { label: 'Food & Groceries', value: 'food & groceries' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Sports & Outdoors', value: 'sports & outdoors' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const { wishlistItemCount } = useContext(WishlistContext);

  // Scroll effect for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products?search=' + encodeURIComponent(searchQuery.trim()));
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  // Determine active category from query params
  const currentParams = new URLSearchParams(location.search);
  const activeCategoryParam = currentParams.get('category')?.toLowerCase();

  return (
    <header className={`navbar-header ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* 1. Centered Free Delivery Announcement Strip */}
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <div className="announcement-message">
            <span className="announcement-pill">Free Delivery</span>
            <span className="announcement-text">
              Free express delivery on all orders over <strong>₹499</strong> nationwide.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar (Three-Region Layout: Left Logo, Center Search, Right Actions) */}
      <div className="navbar-main">
        <div className="container navbar-main-container">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Region 1 (Left): Brand Logo without Marketplace badge */}
          <div className="navbar-logo">
            <Link to="/" aria-label="EpicCart Home">
              <span className="logo-text">EpicCart</span>
              <span className="logo-dot">.</span>
            </Link>
          </div>

          {/* Region 2 (Center): Flexible Search Bar */}
          <form className="navbar-search-form hidden-mobile" onSubmit={handleSearch} role="search">
            <div className="search-input-wrapper">
              <input 
                type="text" 
                placeholder="Search across premium products, brands &amp; categories..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* Region 3 (Right): Account, My Orders, Wishlist, Cart */}
          <div className="navbar-actions">
            {/* Account / Login Shortcut */}
            <Link 
              to={user ? "/account" : "/login"} 
              className="action-item"
              aria-label={user ? `Account: ${user.name}` : 'Sign in to account'}
            >
              <div className="action-icon-wrapper">
                <User size={19} />
              </div>
              <div className="action-text-group hidden-tablet">
                <span className="action-subtext">Hello, {user ? user.name?.split(' ')[0] : 'Sign In'}</span>
                <span className="action-title">Account</span>
              </div>
            </Link>

            {/* MANDATORY: My Orders Shortcut */}
            <Link 
              to="/orders" 
              className={`action-item ${location.pathname === '/orders' ? 'active-action' : ''}`}
              aria-label="View My Orders"
              title="Track and manage your orders"
            >
              <div className="action-icon-wrapper">
                <Package size={19} />
              </div>
              <div className="action-text-group hidden-tablet">
                <span className="action-subtext">Returns &amp;</span>
                <span className="action-title">Orders</span>
              </div>
            </Link>

            {/* Wishlist Shortcut */}
            <Link 
              to="/wishlist" 
              className={`action-item ${location.pathname === '/wishlist' ? 'active-action' : ''}`} 
              aria-label={`Wishlist with ${wishlistItemCount} items`}
            >
              <div className="action-icon-wrapper">
                <Heart size={19} />
                {wishlistItemCount > 0 && (
                  <span className="badge-pill wishlist-badge">{wishlistItemCount}</span>
                )}
              </div>
              <div className="action-text-group hidden-tablet">
                <span className="action-subtext">Saved</span>
                <span className="action-title">Wishlist</span>
              </div>
            </Link>

            {/* Shopping Cart Shortcut */}
            <Link 
              to="/cart" 
              className={`action-item cart-action-item ${location.pathname === '/cart' ? 'active-action' : ''}`} 
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <div className="action-icon-wrapper">
                <ShoppingCart size={19} />
                {cartItemCount > 0 && (
                  <span className="badge-pill cart-badge">{cartItemCount}</span>
                )}
              </div>
              <div className="action-text-group hidden-tablet">
                <span className="action-subtext">Cart</span>
                <span className="action-title">{cartItemCount > 0 ? `(${cartItemCount})` : 'Empty'}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Balanced Category Navigation Row */}
      <nav className="navbar-category-strip hidden-mobile" aria-label="Product categories">
        <div className="container category-strip-container">
          <div className="category-links-group">
            <Link 
              to="/products" 
              className={`category-nav-link ${location.pathname === '/products' && !activeCategoryParam ? 'active' : ''}`}
            >
              <span className="all-icon">☰</span>
              <span>All Products</span>
            </Link>

            <span className="category-nav-divider" aria-hidden="true"></span>

            {CATEGORY_LINKS.map(cat => {
              const isActive = location.pathname === '/products' && activeCategoryParam === cat.value.toLowerCase();
              return (
                <Link 
                  key={cat.value} 
                  to={`/products?category=${encodeURIComponent(cat.value)}`}
                  className={`category-nav-link ${isActive ? 'active' : ''}`}
                >
                  {cat.label}
                </Link>
              );
            })}

            <span className="category-nav-divider" aria-hidden="true"></span>

            <Link 
              to="/products?sort=newest" 
              className="category-promo-pill"
              aria-label="View trending deals"
            >
              <span className="promo-sparkle">★</span>
              <span>Trending Deals</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer & Search */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation drawer">
          <div className="mobile-drawer-header">
            <div className="mobile-brand">
              <span className="logo-text">EpicCart</span>
              <span className="logo-dot">.</span>
            </div>
            <button 
              className="drawer-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mobile-drawer-search">
            <form onSubmit={handleSearch}>
              <div className="mobile-search-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </form>
          </div>

          <div className="mobile-drawer-content">
            <div className="mobile-group-title">Quick Navigation</div>
            <div className="mobile-shortcuts-grid">
              <Link 
                to={user ? "/account" : "/login"} 
                className="mobile-shortcut-card"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>{user ? 'My Account' : 'Sign In'}</span>
              </Link>
              <Link 
                to="/orders" 
                className="mobile-shortcut-card"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package size={18} />
                <span>My Orders</span>
              </Link>
              <Link 
                to="/wishlist" 
                className="mobile-shortcut-card"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart size={18} />
                <span>Wishlist ({wishlistItemCount})</span>
              </Link>
              <Link 
                to="/cart" 
                className="mobile-shortcut-card"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart size={18} />
                <span>Cart ({cartItemCount})</span>
              </Link>
            </div>

            <div className="mobile-group-title">Shop by Category</div>
            <nav className="mobile-category-list">
              <Link 
                to="/products"
                className="mobile-category-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>All Products</span>
                <ChevronRight size={16} />
              </Link>
              {CATEGORY_LINKS.map(cat => (
                <Link 
                  key={cat.value}
                  to={`/products?category=${encodeURIComponent(cat.value)}`}
                  className="mobile-category-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{cat.label}</span>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
