import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../services/api';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        const arr = Array.isArray(data) ? data : (data?.data || []);
        setFeaturedProducts(arr.slice(0, 4)); // Get first 4 products
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (isLoading) return <div className="container status-message">Loading featured products...</div>;
  if (error) return <div className="container status-message error">{error}</div>;

  return (
    <section className="featured-section container">
      <div className="section-header">
        <h2 className="section-title">Featured Products</h2>
        <Link to="/products" className="view-all">View All</Link>
      </div>
      
      <div className="products-grid">
        {featuredProducts.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} alt={product.name} className="product-image" />
              <button className="wishlist-btn" onClick={(e) => e.preventDefault()}>♡</button>
            </div>
            
            <div className="product-info">
              <p className="product-category-label">{product.category?.name || 'General'}</p>
              <h3 className="product-name">{product.name}</h3>
              
              <div className="product-price-row">
                <div className="price-container">
                  <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <button className="add-to-cart-btn" onClick={(e) => e.preventDefault()}>Add +</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
