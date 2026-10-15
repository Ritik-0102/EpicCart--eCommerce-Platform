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
  Sparkles, 
  ArrowRight,
  ShieldCheck,
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
      {/* 1. Announcement Strip */}
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <div className="announcement-message">
            <span className="announcement-pill">Free Delivery</span>
            <span className="announcement-text">
              Free express delivery on all orders over <strong>₹499</strong> nationwide.
            </span>
          </div>
          <div className="announcement-links hidden-mobile">
            <Link to="/products?category=electronics" className="announcement-promo">
              <Sparkles size={13} className="promo-sparkle" />
              <span>New Flagship Tech Just Landed</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="navbar-main">
        <div className="container navbar-main-container">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo / Wordmark */}
          <div className="navbar-logo">
            <Link to="/" aria-label="EpicCart - Premium Marketplace">
              <span className="logo-text">EpicCart</span>
              <span className="logo-dot">.</span>
            </Link>
            <span className="logo-badge hidden-mobile">Marketplace</span>
          </div>

          {/* Prominent Search Bar (Desktop) */}
          <form className="navbar-search-form hidden-mobile" onSubmit={handleSearch} role="search">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input 
                type="search" 
                placeholder="Search across 700+ premium products, brands & categories..." 
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

          {/* Right Action Shortcuts */}
          <div className="navbar-actions">
            {/* Account / Login Shortcut */}
            <Link 
              to={user ? "/account" : "/login"} 
              className="action-item"
              aria-label={user ? `Account: ${user.name}` : 'Sign in to account'}
            >
              <div className="action-icon-wrapper">
                <User size={20} />
              </div>
              <div className="action-text-group hidden-mobile">
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
                <Package size={20} />
              </div>
              <div className="action-text-group hidden-mobile">
                <span className="action-subtext">Returns &</span>
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
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="badge-pill wishlist-badge">{wishlistItemCount}</span>
                )}
              </div>
              <div className="action-text-group hidden-mobile">
                <span className="action-subtext">Favorites</span>
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
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="badge-pill cart-badge">{cartItemCount}</span>
                )}
              </div>
              <div className="action-text-group hidden-mobile">
                <span className="action-subtext">Shopping</span>
                <span className="action-title">Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Row (Desktop) */}
      <nav className="navbar-category-strip hidden-mobile" aria-label="Product categories">
        <div className="container category-strip-container">
          <Link 
            to="/products" 
            className={`category-nav-link ${location.pathname === '/products' && !activeCategoryParam ? 'active' : ''}`}
          >
            <span className="all-icon">☰</span>
            <span>All Products</span>
          </Link>

          <div className="category-nav-divider"></div>

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

          <div className="category-strip-spacer"></div>

          <Link to="/products?sort=newest" className="category-promo-pill">
            <span className="promo-sparkle">★</span>
            <span>Trending Deals</span>
          </Link>
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
            <div className="mobile-group-title">Quick Shortcuts</div>
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
