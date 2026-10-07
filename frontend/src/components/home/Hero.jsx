import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container container">
        <div className="hero-content">
          <span className="hero-badge">New Arrival</span>
          <h1 className="hero-title">Discover the Next Generation of Tech</h1>
          <p className="hero-subtitle">
            Upgrade your lifestyle with our premium selection of electronics, 
            smart devices, and everyday essentials.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary hero-btn">Shop Now</Link>
            <Link to="/products" className="btn btn-outline hero-btn">View Collections</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Using a high quality Unsplash image for the hero */}
          <img 
            src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" 
            alt="Premium laptop and headphones" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

