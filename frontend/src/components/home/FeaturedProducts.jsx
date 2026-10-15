import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Sparkles, Flame, Layers } from 'lucide-react';
import { fetchProducts } from '../../services/api';
import ProductCard from '../common/ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [allFetchedProducts, setAllFetchedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    let isMounted = true;
    const loadCatalogProducts = async () => {
      try {
        setIsLoading(true);
        // Request up to 40 items from production API to curate 10-15 non-overlapping distinct items
        const data = await fetchProducts({ limit: 40 });
        const list = Array.isArray(data) ? data : (data?.data || []);
        
        if (isMounted) {
          setAllFetchedProducts(list);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalogProducts();
    return () => { isMounted = false; };
  }, []);

  // Partition products into non-overlapping, distinct curated groups
  // Aim: ~10 to 15 distinct products total across the homepage
  const bestsellers = allFetchedProducts.slice(0, 5);         // 5 products (Items 0-4)
  const trendingNow = allFetchedProducts.slice(5, 9);         // 4 distinct products (Items 5-8)
  const categoryPicks = allFetchedProducts.slice(9, 13);      // 4 distinct products (Items 9-12)
  const allCuratedPicks = allFetchedProducts.slice(5, 13);    // Combined 8 products (Items 5-12)

  // Determine current active secondary tab products
  const secondaryProducts = activeTab === 'trending' 
    ? trendingNow 
    : activeTab === 'category' 
      ? categoryPicks 
      : allCuratedPicks;

  return (
    <section className="merchandising-section" aria-label="Featured Products">
      <div className="container">
        
        {/* ==============================================================
            SECTION A: POPULAR BESTSELLERS (4-5 Distinct Products)
            ============================================================== */}
        <div className="merchandising-block">
          <div className="block-header">
            <div>
              <div className="block-eyebrow">
                <Star size={14} className="star-icon" fill="#F59E0B" />
                <span>CUSTOMER FAVORITES</span>
              </div>
              <h2 className="section-title">Popular Bestsellers</h2>
              <p className="section-subtitle">
                Top-rated customer selections across electronics, apparel, and home essentials.
              </p>
            </div>
            <Link to="/products?sort=rating" className="block-view-all">
              <span>View All Bestsellers</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="products-grid">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-box" style={{ height: '360px' }}></div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="status-message error">
              <p>Failed to load featured products: {error}</p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && bestsellers.length > 0 && (
            <div className="products-grid bestsellers-grid">
              {bestsellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* ==============================================================
            SECTION B: CURATED SPOTLIGHT (Trending & Category Mix)
            ============================================================== */}
        <div className="merchandising-block spotlight-block">
          <div className="block-header spotlight-header">
            <div>
              <div className="block-eyebrow">
                <TrendingUp size={14} className="trending-icon" />
                <span>CURATED DISCOVERY</span>
              </div>
              <h2 className="section-title">Trending Across Store</h2>
              <p className="section-subtitle">
                Explore handpicked new arrivals and standout essentials from all departments.
              </p>
            </div>

            {/* Interactive Tab Switcher (UIverse Inspired) */}
            <div className="spotlight-tabs" role="tablist" aria-label="Curated sections">
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'trending'}
                className={`tab-pill-btn ${activeTab === 'trending' ? 'active' : ''}`}
                onClick={() => setActiveTab('trending')}
              >
                <Flame size={14} />
                <span>Trending Now (4)</span>
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'category'}
                className={`tab-pill-btn ${activeTab === 'category' ? 'active' : ''}`}
                onClick={() => setActiveTab('category')}
              >
                <Layers size={14} />
                <span>Picks Across Departments (4)</span>
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`tab-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <Sparkles size={14} />
                <span>All Spotlight (8)</span>
              </button>
            </div>
          </div>

          {/* Secondary Products Grid */}
          {!isLoading && !error && secondaryProducts.length > 0 && (
            <div className="products-grid secondary-grid">
              {secondaryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
