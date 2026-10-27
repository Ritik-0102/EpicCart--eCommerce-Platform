import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
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
    <section className="hero" aria-label="Featured Marketplace Showcase">
      <div className="container hero__container">
        {/* Editorial Content */}
        <div className="hero__content">
          <div className="hero__eyebrow">
            YOUR EVERYDAY, UPGRADED
          </div>

          <h1 className="hero__title">
            Good Finds.<br />
            Great Prices.<br />
            Everything on <span className="hero__title-highlight">EpicCart.</span>
          </h1>

          <p className="hero__description">
            From the tech you've been eyeing to the little things that make home feel better — find your next favourite across every category.
          </p>

          <div className="hero__actions">
            <Link to="/products" className="hero__btn hero__btn--primary">
              <span>Explore the Store &rarr;</span>
            </Link>
            <a 
              href="#categories" 
              onClick={handleScrollToCategories} 
              className="hero__btn hero__btn--secondary"
            >
              <span>Shop by Category</span>
            </a>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <ShoppingBag size={16} className="hero__trust-icon" aria-hidden="true" />
              <span>Everyday Essentials</span>
            </div>
            <div className="hero__trust-item">
              <Truck size={16} className="hero__trust-icon" aria-hidden="true" />
              <span>Fast &amp; Convenient Delivery</span>
            </div>
            <div className="hero__trust-item">
              <ShieldCheck size={16} className="hero__trust-icon" aria-hidden="true" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Mobile / Narrow Tablet Visual Showcase (Un-cropped supplied asset) */}
        <div className="hero__mobile-visual" aria-hidden="true">
          <img 
            src="/images/epiccart-marketplace-hero.png" 
            alt=""
            className="hero__mobile-image"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
