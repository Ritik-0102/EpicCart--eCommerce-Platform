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
    }
  };

  return (
    <header className="navbar-header">
      <div className="top-banner">
        <p>Free shipping on orders over $50! Shop now.</p>
      </div>
      <div className="navbar-main container">
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
        <div className="navbar-logo"><Link to="/">EpicCart<span>.</span></Link></div>
        <form className="navbar-search hidden-mobile" onSubmit={handleSearch}>
          <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        <div className="navbar-icons">
          <Link to={user ? "/account" : "/login"} className="icon-link hidden-mobile">👤 <span className="icon-text">{user ? "Account" : "Login"}</span></Link>
          <Link to="/wishlist" className="icon-link hidden-mobile">❤️ <span className="icon-text">Wishlist</span>{wishlistItemCount > 0 && <span className="cart-badge">{wishlistItemCount}</span>}</Link>
          <Link to="/cart" className="icon-link cart-link">🛒 <span className="icon-text">Cart</span>{cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}</Link>
        </div>
      </div>
      <nav className="navbar-categories hidden-mobile">
        <div className="container category-links">
          <Link to="/products?category=electronics">Electronics</Link>
          <Link to="/products?category=fashion">Fashion</Link>
          <Link to="/products?category=home">Home & Living</Link>
          <Link to="/products?category=sports">Sports</Link>
          <Link to="/products?category=beauty">Beauty</Link>
          <Link to="/products" className="highlight-link">Shop All</Link>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit">🔍</button>
          </form>
          <nav className="mobile-nav-links">
            <Link to="/products?category=electronics" onClick={() => setIsMobileMenuOpen(false)}>Electronics</Link>
            <Link to="/products?category=fashion" onClick={() => setIsMobileMenuOpen(false)}>Fashion</Link>
            <Link to="/products?category=home" onClick={() => setIsMobileMenuOpen(false)}>Home & Living</Link>
            <Link to={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>👤 {user ? "Account" : "Login"}</Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>❤️ Wishlist</Link>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;
