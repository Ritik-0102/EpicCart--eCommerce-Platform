import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Sparkles, Flame } from 'lucide-react';
import './Promotions.css';

const Promotions = () => {
  return (
    <section className="deals-section" aria-label="Curated Deals & Campaigns">
      <div className="container">
        {/* Section Header */}
        <div className="deals-header">
          <div>
            <div className="deals-eyebrow">
              <Flame size={14} className="flame-icon" />
              <span>CURATED DEALS & CAMPAIGNS</span>
            </div>
            <h2 className="section-title">Limited Edition Collections</h2>
          </div>
          <Link to="/products" className="deals-view-all">
            <span>Explore All Deals</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Merchandising Grid: 1 Large Feature + 2 Supporting Cards */}
        <div className="deals-grid">
          {/* 1. Large Feature Card: Flagship Tech */}
          <div className="deal-card deal-feature-card">
            <div className="deal-card-content">
              <span className="deal-badge badge-dark">
                <Sparkles size={12} />
                <span>Featured Showcase</span>
              </span>
              <h3 className="deal-title">Pro Audio &amp; Next-Gen Tech</h3>
              <p className="deal-description">
                Immerse yourself in lossless wireless audio, 165Hz gaming displays, and flagship ultrabooks built for modern creators.
              </p>
              <div className="deal-benefit-tag">
                <Tag size={13} />
                <span>Starting from ₹1,299 • Express Delivery</span>
              </div>
              <Link 
                to="/products?category=electronics" 
                className="btn btn-primary deal-cta"
                aria-label="Shop Electronics Collection"
              >
                <span>Shop Electronics</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="deal-card-image">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
                alt="Pro audio headphones"
                loading="lazy"
              />
            </div>
          </div>

          {/* 2. Supporting Card: Contemporary Apparel */}
          <div className="deal-card deal-supporting-card card-warm">
            <div className="deal-card-content">
              <span className="deal-badge badge-warm">
                <Tag size={12} />
                <span>New Season</span>
              </span>
              <h3 className="deal-title">Contemporary Fashion</h3>
              <p className="deal-description">
                Refined streetwear, formal attire, and everyday breathable activewear.
              </p>
              <Link 
                to="/products?category=clothing" 
                className="btn btn-outline deal-cta"
                aria-label="Shop Clothing Collection"
              >
                <span>Shop Apparel</span>
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="deal-card-image">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80" 
                alt="Contemporary fashion apparel"
                loading="lazy"
              />
            </div>
          </div>

          {/* 3. Supporting Card: Gourmet & Kitchen */}
          <div className="deal-card deal-supporting-card card-slate">
            <div className="deal-card-content">
              <span className="deal-badge badge-slate">
                <Sparkles size={12} />
                <span>Artisanal Living</span>
              </span>
              <h3 className="deal-title">Cookware &amp; Dining</h3>
              <p className="deal-description">
                Tri-ply stainless steel cookware, chef knives, and luxury kitchenware.
              </p>
              <Link 
                to={`/products?category=${encodeURIComponent('home & kitchen')}`} 
                className="btn btn-outline deal-cta"
                aria-label="Shop Home and Kitchen Collection"
              >
                <span>Shop Kitchen</span>
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="deal-card-image">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80" 
                alt="Chef cookware and kitchen essentials"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
