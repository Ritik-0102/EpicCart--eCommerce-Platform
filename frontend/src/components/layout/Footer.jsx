import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, CheckCircle, Package } from 'lucide-react';
import './Footer.css';

const CATEGORIES_LIST = [
  { name: 'Electronics', path: '/products?category=electronics' },
  { name: 'Mobile Devices', path: '/products?category=mobile' },
  { name: 'Clothing & Fashion', path: '/products?category=clothing' },
  { name: 'Home & Kitchen', path: `/products?category=${encodeURIComponent('home & kitchen')}` },
  { name: 'Food & Groceries', path: `/products?category=${encodeURIComponent('food & groceries')}` },
  { name: 'Furniture & Living', path: '/products?category=furniture' },
  { name: 'Sports & Outdoors', path: `/products?category=${encodeURIComponent('sports & outdoors')}` },
];

const SUPPORT_LINKS = [
  { name: 'Contact Customer Care', path: '/contact' },
  { name: 'Frequently Asked Questions', path: '/faq' },
  { name: 'Shipping & Delivery Policy', path: '/shipping' },
  { name: 'Returns & Exchange Terms', path: '/returns' },
];

const ACCOUNT_LINKS = [
  { name: 'My Account Dashboard', path: '/account' },
  { name: 'Track My Orders', path: '/orders', isHighlight: true },
  { name: 'Saved Wishlist', path: '/wishlist' },
  { name: 'Shopping Cart', path: '/cart' },
  { name: 'Sign In / Register', path: '/login' },
];

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer-root" role="contentinfo" aria-label="Site footer">
      {/* Top Value Banner */}
      <div className="footer-top-strip">
        <div className="container footer-top-container">
          <div className="footer-feature">
            <ShieldCheck size={20} className="feature-icon" />
            <span>100% Verified Quality &amp; Genuine Products</span>
          </div>
          <div className="footer-feature">
            <Package size={20} className="feature-icon" />
            <span>Curated Catalog with 700+ Verified Products</span>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="container footer-main-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo" aria-label="EpicCart Home">
              <span className="logo-text">EpicCart</span>
              <span className="logo-dot">.</span>
            </Link>
            <p className="brand-mission">
              EpicCart is India's curated digital marketplace offering verified electronics, 
              contemporary apparel, tri-ply kitchenware, and artisanal groceries with reliable door-to-door delivery.
            </p>
            <div className="payment-badges-row">
              <span className="payment-pill">Razorpay</span>
              <span className="payment-pill">UPI</span>
              <span className="payment-pill">Cards</span>
              <span className="payment-pill">NetBanking</span>
            </div>
          </div>

          {/* Column 2: All 7 Categories */}
          <div className="footer-col">
            <h4 className="col-title">Shop by Department</h4>
            <ul className="footer-nav-list">
              {CATEGORIES_LIST.map((cat, idx) => (
                <li key={idx}>
                  <Link to={cat.path}>{cat.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/products" className="highlight-nav-item">Browse All 700+ Products →</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="col-title">Customer Support</h4>
            <ul className="footer-nav-list">
              {SUPPORT_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Account & My Orders */}
          <div className="footer-col">
            <h4 className="col-title">Account &amp; Orders</h4>
            <ul className="footer-nav-list">
              {ACCOUNT_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className={link.isHighlight ? 'orders-link-highlight' : ''}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter Subscription */}
          <div className="footer-col newsletter-col">
            <h4 className="col-title">Stay in Touch</h4>
            <p className="newsletter-desc">
              Subscribe to receive exclusive collection updates, seasonal releases, and special deals.
            </p>

            {subscribed ? (
              <div className="newsletter-success-box">
                <CheckCircle size={18} className="success-icon" />
                <span>Thank you! You are subscribed to EpicCart updates.</span>
              </div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="footer-input-wrapper">
                  <Mail size={16} className="newsletter-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    aria-label="Email address for updates"
                  />
                </div>
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  <span>Join</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
            <p className="privacy-note">Zero spam. You can unsubscribe at any time.</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} EpicCart Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/shipping">Shipping</Link>
            <span className="dot-divider">•</span>
            <Link to="/returns">Returns</Link>
            <span className="dot-divider">•</span>
            <Link to="/faq">FAQ</Link>
            <span className="dot-divider">•</span>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
