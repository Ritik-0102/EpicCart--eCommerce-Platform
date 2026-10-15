import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';
import { fetchCategories } from '../../services/api';
import './Categories.css';

// Curated high-resolution imagery and metadata for all 7 catalog categories
const CATEGORY_METADATA = {
  'electronics': {
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
    tagline: 'Laptops, 4K Displays & Audio',
    badge: '100+ Products'
  },
  'mobile': {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    tagline: 'Flagship 5G Handsets & Fast GaN Chargers',
    badge: '100+ Products'
  },
  'clothing': {
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    tagline: 'Streetwear, Formal & Activewear',
    badge: '100+ Products'
  },
  'home & kitchen': {
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
    tagline: 'Tri-Ply Cookware & Smart Appliances',
    badge: '100+ Products'
  },
  'food & groceries': {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    tagline: 'Organic Staples, Spices & Gourmet Teas',
    badge: '100+ Products'
  },
  'furniture': {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    tagline: 'Solid Wood Sofas, Ergonomic Desks & Beds',
    badge: '110+ Products'
  },
  'sports & outdoors': {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    tagline: 'Fitness Weights, Cricket, Football & Camping',
    badge: '100+ Products'
  }
};

const DEFAULT_CATEGORY_META = {
  image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
  tagline: 'Explore verified quality collections',
  badge: 'Popular'
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCategories();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="categories" className="categories-section" aria-label="Shop by Category">
      <div className="container">
        {/* Header */}
        <div className="categories-header">
          <div>
            <div className="categories-eyebrow">
              <LayoutGrid size={14} className="eyebrow-icon" />
              <span>STORE DEPARTMENTS</span>
            </div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">
              Browse authentic, quality-tested products across all seven curated store departments.
            </p>
          </div>
          <Link to="/products" className="categories-view-all">
            <span>Browse Full Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="categories-grid">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="category-tile skeleton-box" style={{ minHeight: '260px' }}></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="status-message error">
            <p>Unable to load categories: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-secondary"
              style={{ marginTop: '0.75rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="categories-grid">
            {categories.map((category) => {
              const key = category.name.toLowerCase().trim();
              const meta = CATEGORY_METADATA[key] || DEFAULT_CATEGORY_META;

              return (
                <Link 
                  to={`/products?category=${encodeURIComponent(category.name.toLowerCase())}`} 
                  key={category.id} 
                  className="category-tile"
                  aria-label={`Browse ${category.name} collection`}
                >
                  <div className="category-tile-bg">
                    <img 
                      src={meta.image} 
                      alt={category.name}
                      className="category-tile-img"
                      loading="lazy"
                    />
                    <div className="category-tile-gradient"></div>
                  </div>

                  <div className="category-tile-content">
                    <div className="category-badge-pill">
                      <span>{meta.badge}</span>
                    </div>

                    <div className="category-text-block">
                      <h3 className="category-tile-name">{category.name}</h3>
                      <p className="category-tile-tagline">
                        {category.description || meta.tagline}
                      </p>
                    </div>

                    <div className="category-tile-footer">
                      <span className="shop-link-text">Explore Department</span>
                      <div className="arrow-circle">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
