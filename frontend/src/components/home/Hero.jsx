import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section" aria-label="Featured Collection">
      <div className="container hero-container">
        {/* Left Column: Editorial & Value Proposition */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>THE NEW SEASON • CURATED MARKETPLACE</span>
          </div>

          <h1 className="hero-title">
            Everyday Luxury, <br className="hidden-mobile" />
            <span className="hero-title-highlight">Engineered</span> for Life.
          </h1>

          <p className="hero-description">
            Discover over 700+ verified products across flagship electronics, contemporary apparel, 
            tri-ply cookware, and organic lifestyle essentials—delivered directly with secure verification.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-btn-primary">
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/products?sort=rating" className="btn btn-outline hero-btn-secondary">
              <span>Shop Bestsellers</span>
            </Link>
          </div>

          {/* Value Proposition Micro-Pills */}
          <div className="hero-trust-row">
            <div className="trust-pill">
              <ShieldCheck size={16} className="trust-icon" />
              <span>100% Authentic</span>
            </div>
            <div className="trust-pill">
              <Truck size={16} className="trust-icon" />
              <span>Express Delivery</span>
            </div>
            <div className="trust-pill">
              <Star size={16} className="trust-icon star-icon" />
              <span>4.9 / 5 Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Merchandising Showcase */}
        <div className="hero-visual">
          <div className="hero-image-frame">
            <img 
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&q=80" 
              alt="Premium electronics and workspace essentials"
              className="hero-main-img"
              loading="eager"
            />
            <div className="hero-image-overlay"></div>
          </div>

          {/* Floating Merchandising Card 1 (Top Left) */}
          <div className="hero-floating-badge badge-top-left">
            <div className="badge-icon-box">
              <Sparkles size={16} />
            </div>
            <div className="badge-info">
              <span className="badge-tag">Featured Drop</span>
              <span className="badge-value">Curated Electronics</span>
            </div>
          </div>

          {/* Floating Merchandising Card 2 (Bottom Right) */}
          <div className="hero-floating-badge badge-bottom-right">
            <div className="badge-stars">★★★★★</div>
            <div className="badge-review-text">
              <strong>12,500+ Orders</strong> Fulfilled Nationwide
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
