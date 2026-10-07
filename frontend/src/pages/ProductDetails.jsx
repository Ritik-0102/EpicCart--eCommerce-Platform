import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <div className="container status-message loading">Loading product details...</div>;
  }

  // Handle the not-found state or generic errors
  if (error || !product) {
    return (
      <div className="container status-message error">
        <h2>⚠️ Product Not Found</h2>
        <p>We couldn't find the product you're looking for.</p>
        <p className="error-details">{error}</p>
        <Link to="/shop" className="back-link">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <main className="product-details-page container">
      <Link to="/shop" className="breadcrumb">← Back to Shop</Link>
      
      <div className="product-details-grid">
        {/* Product Image */}
        <div className="product-details-image">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} 
            alt={product.name} 
          />
        </div>

        {/* Product Info */}
        <div className="product-details-info">
          <p className="product-category">{product.category?.name || 'General'}</p>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
          
          <div className="product-stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          <button 
            className="add-to-cart-btn large" 
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
