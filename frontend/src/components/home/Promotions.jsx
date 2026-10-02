import React from 'react';
import './Promotions.css';

const Promotions = () => {
  return (
    <section className="promotions-section container">
      <div className="promo-banner primary-promo">
        <div className="promo-content">
          <p className="promo-tag">Limited Time</p>
          <h2>Summer Sale</h2>
          <p>Up to 50% off on all clothing</p>
          <button className="btn btn-outline promo-btn">Shop Sale</button>
        </div>
      </div>
      
      <div className="promo-banner secondary-promo">
        <div className="promo-content">
          <p className="promo-tag">New Collection</p>
          <h2>Smart Home</h2>
          <p>Upgrade your living space</p>
          <button className="btn btn-outline promo-btn">Explore</button>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
