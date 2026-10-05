import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/api';
import './Categories.css';

const Categories = () => {
  // We use state to track our data, loading status, and any potential errors.
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We define an async function inside useEffect to handle the data fetching
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Whether success or error, stop loading
      }
    };

    loadCategories();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <section className="categories-section container">
      <h2 className="section-title">Shop by Category</h2>
      
      {/* Loading State */}
      {isLoading && <div className="status-message loading">Loading categories...</div>}
      
      {/* Error State */}
      {error && !isLoading && (
        <div className="status-message error">
          <p>⚠️ Oops! We couldn't load the categories.</p>
          <p className="error-details">{error}</p>
          <p className="error-hint">If this is a local environment, ensure your PostgreSQL database is running.</p>
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
            <div key={category.id} className="category-card">
              {/* Fallback icon if the database doesn't supply one */}
              <div className="category-icon">{category.icon || '📦'}</div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Categories;
