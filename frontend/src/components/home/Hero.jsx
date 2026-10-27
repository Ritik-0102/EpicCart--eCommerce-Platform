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
    <section className="hero-banner" aria-label="Everything You Love, All in One Place">
      <div className="hero-banner__container">
        {/* Left-Side Safe Content Block (38%-42% of banner) */}
        <div className="hero-banner__content">
          <div className="hero-banner__eyebrow">
            <ShieldCheck size={14} className="eyebrow-icon" aria-hidden="true" />
            <span>India’s Trusted Online Marketplace</span>
          </div>

          <h1 className="hero-banner__title">
            <span className="hero-title-line">Everything You Love,</span>
            <span className="hero-title-line hero-banner__highlight">All in One Place.</span>
          </h1>

          <p className="hero-banner__description">
            From the latest tech to everyday essentials, trendy fashion to home needs — shop more, worry less with EpicCart.
          </p>

          <div className="hero-banner__actions">
            <Link to="/products" className="hero-btn hero-btn--primary">
              <span>Shop Now</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a 
              href="#categories" 
              onClick={handleScrollToCategories} 
              className="hero-btn hero-btn--secondary"
            >
              <span>Explore Categories</span>
            </a>
          </div>

          {/* Compact Trust-Benefits Row */}
          <div className="hero-banner__trust">
            <div className="trust-item">
              <ShieldCheck size={15} className="trust-icon" aria-hidden="true" />
              <span>Authentic Products</span>
            </div>
            <div className="trust-item">
              <Truck size={15} className="trust-icon" aria-hidden="true" />
              <span>Fast Delivery</span>
            </div>
            <div className="trust-item">
              <RotateCcw size={15} className="trust-icon" aria-hidden="true" />
              <span>Easy Returns</span>
            </div>
            <div className="trust-item">
              <Lock size={15} className="trust-icon" aria-hidden="true" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Visual (Stacked below content on < 992px viewports) */}
        <div className="hero-banner__mobile-visual" aria-hidden="true">
          <img 
            src="/images/epiccart-marketplace-hero.png" 
            alt=""
            className="hero-banner__mobile-image"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
