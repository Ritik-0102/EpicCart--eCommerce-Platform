import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>EpicCart<span>.</span></h3>
          <p>Your one-stop shop for everything epic. Quality products, competitive prices, and excellent customer service.</p>
        </div>
        
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products?category=electronics">Electronics</Link></li>
            <li><Link to="/products?category=fashion">Fashion</Link></li>
            <li><Link to="/products?category=home">Home & Living</Link></li>
            <li><Link to="/products?category=sports">Sports</Link></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns</Link></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get updates on new products and sales.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} EpicCart. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#fb">Fb</a>
          <a href="#tw">Tw</a>
          <a href="#ig">Ig</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
