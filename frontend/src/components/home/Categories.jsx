import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../services/api';
import './Categories.css';

// Map category names to icons (SVG-safe emoji alternatives)
const CATEGORY_ICONS = {
  'Electronics': '📱',
  'Clothing': '👗',
  'Home & Kitchen': '🏠',
  'Sports & Outdoors': '⚽',
};

// Fallback icon for unknown categories
const DEFAULT_ICON = '🛍️';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section id="categories" className="categories-section container" aria-label="Shop by category">
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <Link to="/products" className="view-all">Browse All</Link>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="categories-grid skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="category-card skeleton"></div>
          ))}
        </div>
      )}
      
      {/* Error State */}
      {error && !isLoading && (
        <div className="status-message error">
          <p>Could not load categories.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && categories.length === 0 && (
        <div className="status-message empty">
          <p>No categories found.</p>
        </div>
      )}

      {/* Data State */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              to={`/products?category=${encodeURIComponent(category.name.toLowerCase())}`} 
              key={category.id} 
              className="category-card"
              aria-label={`Browse ${category.name}`}
            >
              {/* Use emoji icon mapped by category name, or default */}
              <div className="category-icon" role="img" aria-hidden="true">
                {CATEGORY_ICONS[category.name] || DEFAULT_ICON}
              </div>
              <h3 className="category-name">{category.name}</h3>
              {category.description && (
                <p className="category-desc">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Categories;
