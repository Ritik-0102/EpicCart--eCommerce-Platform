import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const handleScrollToCategories = (e) => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      e.preventDefault();
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#categories');
    }
  };

  return (
    <section className="hero-section" aria-label="Everything You Love, All in One Place">
      <div className="container hero-container">
        {/* Left Column: Editorial Content & Value Proposition */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <ShieldCheck size={14} className="eyebrow-icon" />
            <span>India’s Trusted Online Marketplace</span>
          </div>

          <h1 className="hero-title">
            Everything You Love,<br className="hero-title-br" />
            <span className="hero-title-highlight">All in One Place.</span>
          </h1>

          <p className="hero-description">
            From the latest tech to everyday essentials, trendy fashion to home needs — shop more, worry less with EpicCart.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-btn-primary">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </Link>
            <a 
              href="#categories" 
              onClick={handleScrollToCategories} 
              className="btn btn-outline hero-btn-secondary"
            >
              <span>Explore Categories</span>
            </a>
          </div>

          {/* Compact Trust-Benefits Row */}
          <div className="hero-trust-row">
            <div className="trust-item">
              <ShieldCheck size={16} className="trust-icon" />
              <span>Authentic Products</span>
            </div>
            <div className="trust-item">
              <Truck size={16} className="trust-icon" />
              <span>Fast Delivery</span>
            </div>
            <div className="trust-item">
              <RotateCcw size={16} className="trust-icon" />
              <span>Easy Returns</span>
            </div>
            <div className="trust-item">
              <Lock size={16} className="trust-icon" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Merchandising Showcase */}
        <div className="hero-visual">
          <div className="hero-image-frame">
            <img 
              src="/images/epiccart-marketplace-hero.png" 
              alt="EpicCart Marketplace — Multi-Category Collection"
              className="hero-main-img"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
