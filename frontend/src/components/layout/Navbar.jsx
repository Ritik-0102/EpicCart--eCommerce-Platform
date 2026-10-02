import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-header">
      {/* Top Banner */}
      <div className="top-banner">
        <p>Free shipping on orders over $50! Shop now.</p>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main container">
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Logo */}
        <div className="navbar-logo">
          <a href="/">EpicCart<span>.</span></a>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="navbar-search hidden-mobile">
          <input type="text" placeholder="Search for products, brands and more..." />
          <button className="search-btn">🔍</button>
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          <a href="/account" className="icon-link hidden-mobile">👤 <span className="icon-text">Account</span></a>
          <a href="/wishlist" className="icon-link hidden-mobile">❤️ <span className="icon-text">Wishlist</span></a>
          <a href="/cart" className="icon-link cart-link">
            🛒 <span className="icon-text">Cart</span>
            <span className="cart-badge">2</span>
          </a>
        </div>
      </div>

      {/* Category Navigation (Desktop) */}
      <nav className="navbar-categories hidden-mobile">
        <div className="container category-links">
          <a href="#electronics">Electronics</a>
          <a href="#fashion">Fashion</a>
          <a href="#home">Home & Living</a>
          <a href="#sports">Sports</a>
          <a href="#beauty">Beauty</a>
          <a href="#deals" className="highlight-link">Deals</a>
        </div>
      </nav>

      {/* Mobile Search & Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <input type="text" placeholder="Search..." />
            <button>🔍</button>
          </div>
          <nav className="mobile-nav-links">
            <a href="#electronics">Electronics</a>
            <a href="#fashion">Fashion</a>
            <a href="#home">Home & Living</a>
            <a href="/account">👤 Account</a>
            <a href="/wishlist">❤️ Wishlist</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
