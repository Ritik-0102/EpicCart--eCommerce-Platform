import React from 'react';
import { Link } from 'react-router-dom';
import './Promotions.css';

const Promotions = () => {
  return (
    <section className="promotions-section container">
      <div className="promo-banner primary-promo">
        <div className="promo-content">
          <p className="promo-tag">Limited Time</p>
          <h2>Summer Sale</h2>
          <p>Up to 50% off on all clothing</p>
          <Link to="/products" className="btn btn-outline promo-btn">Shop Sale</Link>
        </div>
      </div>
      
      <div className="promo-banner secondary-promo">
        <div className="promo-content">
          <p className="promo-tag">New Collection</p>
          <h2>Smart Home</h2>
          <p>Upgrade your living space</p>
          <Link to="/products" className="btn btn-outline promo-btn">Explore</Link>
        </div>
      </div>
    </section>
  );
};

export default Promotions;

