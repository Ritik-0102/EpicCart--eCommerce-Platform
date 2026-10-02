import React from 'react';
import { featuredProducts } from '../../data/mockData';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">Featured Products</h2>
        <a href="#all" className="view-all">View All ➔</a>
      </div>
      
      <div className="products-grid">
        {featuredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <button className="wishlist-btn">🤍</button>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <div className="product-rating">
                <span className="stars">★★★★★</span>
                <span className="rating-value">{product.rating}</span>
                <span className="reviews">({product.reviews})</span>
              </div>
              
              <div className="product-price-row">
                <div className="price-container">
                  <span className="current-price">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <button className="add-to-cart-btn">Add +</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
