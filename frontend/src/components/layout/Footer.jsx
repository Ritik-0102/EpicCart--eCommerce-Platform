import React from 'react';
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
            <li><a href="#electronics">Electronics</a></li>
            <li><a href="#fashion">Fashion</a></li>
            <li><a href="#home">Home & Living</a></li>
            <li><a href="#offers">Special Offers</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
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
