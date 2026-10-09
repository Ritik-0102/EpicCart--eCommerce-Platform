import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const { wishlistItemCount } = useContext(WishlistContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products?search=' + encodeURIComponent(searchQuery));
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  // Category links use names that exactly match the database (case-insensitive match in Shop.jsx)
  const categoryLinks = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Home & Kitchen', value: 'home & kitchen' },
    { label: 'Sports', value: 'sports & outdoors' },
  ];

  return (
    <header className="navbar-header">
      {/* Announcement Bar */}
      <div className="top-banner">
        <p>&#x1F69A; Free shipping on orders over $50! <Link to="/products" className="banner-link">Shop Now →</Link></p>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main container">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" aria-label="EpicCart Home">
            EpicCart<span>.</span>
          </Link>
        </div>

        {/* Search Bar (desktop) */}
        <form className="navbar-search hidden-mobile" onSubmit={handleSearch} role="search">
          <input 
            type="search" 
            placeholder="Search for products..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="search-btn" aria-label="Submit search">
            &#x1F50D;
          </button>
        </form>

        {/* Icons (desktop) */}
        <div className="navbar-icons">
          <Link 
            to={user ? "/account" : "/login"} 
            className="icon-link hidden-mobile"
            aria-label={user ? `Account: ${user.name}` : 'Login'}
          >
            <span className="icon-symbol">&#x1F464;</span>
            <span className="icon-text">{user ? user.name?.split(' ')[0] : 'Login'}</span>
          </Link>

          <Link to="/wishlist" className="icon-link hidden-mobile" aria-label={`Wishlist (${wishlistItemCount} items)`}>
            <span className="icon-symbol">&#x2665;</span>
            <span className="icon-text">Wishlist</span>
            {wishlistItemCount > 0 && <span className="cart-badge">{wishlistItemCount}</span>}
          </Link>

          <Link to="/cart" className="icon-link cart-link" aria-label={`Cart (${cartItemCount} items)`}>
            <span className="icon-symbol">&#x1F6D2;</span>
            <span className="icon-text">Cart</span>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Category Navigation (desktop) */}
      <nav className="navbar-categories hidden-mobile" aria-label="Product categories">
        <div className="container category-links">
          {categoryLinks.map(cat => (
            <Link 
              key={cat.value} 
              to={`/products?category=${encodeURIComponent(cat.value)}`}
            >
              {cat.label}
            </Link>
          ))}
          <Link to="/products" className="highlight-link">Shop All</Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <form className="mobile-search" onSubmit={handleSearch} role="search">
            <input 
              type="search" 
              placeholder="Search products..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
              autoFocus
            />
            <button type="submit" aria-label="Submit search">&#x1F50D;</button>
          </form>
          <nav className="mobile-nav-links">
            {categoryLinks.map(cat => (
              <Link 
                key={cat.value} 
                to={`/products?category=${encodeURIComponent(cat.value)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
            <hr style={{ margin: '0.5rem 0', opacity: 0.3 }} />
            <Link to={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
              &#x1F464; {user ? 'My Account' : 'Login / Register'}
            </Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
              &#x2665; Wishlist {wishlistItemCount > 0 && `(${wishlistItemCount})`}
            </Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
              &#x1F6D2; Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
            {user && (
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                &#x1F4CB; My Orders
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
