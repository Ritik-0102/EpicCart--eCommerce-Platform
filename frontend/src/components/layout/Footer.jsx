import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterMsg('Thanks for subscribing! We\'ll keep you updated.');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h3>EpicCart<span>.</span></h3>
          <p>Your one-stop shop for everything epic. Quality products, competitive prices, and excellent customer service.</p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Fb</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Tw</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Ig</a>
          </div>
        </div>
        
        {/* Shop Links — use correct DB category names */}
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products?category=electronics">Electronics</Link></li>
            <li><Link to="/products?category=clothing">Clothing</Link></li>
            <li><Link to={`/products?category=${encodeURIComponent('home & kitchen')}`}>Home &amp; Kitchen</Link></li>
            <li><Link to={`/products?category=${encodeURIComponent('sports & outdoors')}`}>Sports &amp; Outdoors</Link></li>
            <li><Link to="/products">All Products</Link></li>
          </ul>
        </div>
        
        {/* Support Links */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
          </ul>
        </div>
        
        {/* Account Links */}
        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        
        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get updates on new products and sales. Unsubscribe at any time.</p>
          {newsletterMsg ? (
            <p className="newsletter-success">{newsletterMsg}</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} EpicCart. All rights reserved.</p>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          Built with &#x2665; using React, Node.js, and PostgreSQL
        </p>
      </div>
    </footer>
  );
};

export default Footer;
