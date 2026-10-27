// Shop page: product discovery catalog with multi-facet filtering, search, sorting, and pagination
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import './Shop.css';

const CATEGORY_METADATA = {
  'electronics': {
    name: 'Electronics',
    icon: '💻',
    tagline: 'Cutting-edge computing, studio acoustics, 4K displays, and smart gadgets.',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
  },
  'mobile': {
    name: 'Mobile',
    icon: '📱',
    tagline: 'Flagship smartphones, performance 5G devices, GaN fast chargers, and accessories.',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)'
  },
  'clothing': {
    name: 'Clothing & Apparel',
    icon: '👗',
    tagline: 'Contemporary fashion, designer streetwear, ethnic styles, and premium activewear.',
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)'
  },
  'home & kitchen': {
    name: 'Home & Kitchen',
    icon: '🏠',
    tagline: 'Tri-ply stainless cookware, intelligent kitchen appliances, decor, and luxury dining.',
    gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)'
  },
  'food & groceries': {
    name: 'Food & Groceries',
    icon: '🍎',
    tagline: 'Organic farm staples, heritage grains, whole spices, cold-pressed oils, and gourmet dry fruits.',
    gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)'
  },
  'furniture': {
    name: 'Furniture & Living',
    icon: '🛋️',
    tagline: 'Handcrafted solid wood living room essentials, ergonomic workstations, and bedroom comfort.',
    gradient: 'linear-gradient(135deg, #451a03 0%, #d97706 100%)'
  },
  'sports & outdoors': {
    name: 'Sports & Outdoors',
    icon: '⚽',
    tagline: 'High-grade fitness equipment, team sports gear, outdoor camping equipment, and accessories.',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)'
  }
};

const ITEMS_PER_PAGE = 24;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Local state for UI filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceBracket, setPriceBracket] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('newest'); 
  const [currentPage, setCurrentPage] = useState(1);

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [cats, prods] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchProducts().catch(() => [])
        ]);
        setCategories(cats);
        setAllProducts(Array.isArray(prods) ? prods : (prods.data || []));
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Update URL when search changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setSearchParams(prev => {
      if (e.target.value) prev.set('search', e.target.value);
      else prev.delete('search');
      return prev;
    });
  };

  // Update URL when category filter changes
  const handleCategoryChange = (e) => {
    const catVal = e.target.value;
    setSelectedCategory(catVal);
    setCurrentPage(1);
    setSearchParams(prev => {
      if (catVal) prev.set('category', catVal);
      else prev.delete('category');
      return prev;
    });
  };

  // Sync state if URL changes externally (e.g. from Navbar category link)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setCurrentPage(1);
  }, [searchParams]);

  // --- Filtering and sorting (derived state) ---
  let displayedProducts = [...allProducts];

  // 1. Search Filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // 2. Category Filter
  if (selectedCategory) {
    const catLower = selectedCategory.toLowerCase();
    displayedProducts = displayedProducts.filter(p => {
      if (p.categoryId?.toString() === selectedCategory) return true;
      if (p.category?.name?.toLowerCase() === catLower) return true;
      if (p.category?.slug?.toLowerCase() === catLower) return true;
      return false;
    });
  }

  // 3. Price Bracket Filter
  if (priceBracket === 'under_500') {
    displayedProducts = displayedProducts.filter(p => p.price < 500);
  } else if (priceBracket === '500_2000') {
    displayedProducts = displayedProducts.filter(p => p.price >= 500 && p.price <= 2000);
  } else if (priceBracket === '2000_10000') {
    displayedProducts = displayedProducts.filter(p => p.price > 2000 && p.price <= 10000);
  } else if (priceBracket === 'above_10000') {
    displayedProducts = displayedProducts.filter(p => p.price > 10000);
  }

  // 4. In-Stock Filter
  if (inStockOnly) {
    displayedProducts = displayedProducts.filter(p => p.stock > 0);
  }

  // 5. Sorting
  if (sort === 'price_asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'name_asc') {
    displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name_desc') {
    displayedProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // newest — higher id is newer
    displayedProducts.sort((a, b) => b.id - a.id);
  }

  // Pagination calculation
  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeCategoryMeta = selectedCategory ? CATEGORY_METADATA[selectedCategory.toLowerCase()] : null;

  return (
    <div className="shop-page container">
      {/* Category Hero Banner if Category Selected */}
      {activeCategoryMeta ? (
        <div 
          className="category-hero-banner"
          style={{ background: activeCategoryMeta.gradient }}
        >
          <div className="banner-content">
            <span className="banner-icon">{activeCategoryMeta.icon}</span>
            <div className="banner-text">
              <h1 className="banner-title">{activeCategoryMeta.name}</h1>
              <p className="banner-tagline">{activeCategoryMeta.tagline}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="shop-header">
          <h1 className="page-title">Shop All Products</h1>
          <p className="page-subtitle">Discover thousands of premium curated products with fast delivery across India</p>
        </div>
      )}

      {/* Discovery Controls Bar */}
      <div className="discovery-controls">
        <div className="controls-row-top">
          <input 
            type="text" 
            placeholder="Search products by title, specs or keyword..." 
            value={search} 
            onChange={handleSearchChange} 
            className="search-input"
            aria-label="Search products"
          />

          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="controls-row-bottom">
          {/* Price Range Filter */}
          <div className="filter-group">
            <label htmlFor="price-bracket-select" className="filter-label">Price:</label>
            <select
              id="price-bracket-select"
              value={priceBracket}
              onChange={(e) => { setPriceBracket(e.target.value); setCurrentPage(1); }}
              className="filter-select-sm"
              aria-label="Filter by price range"
            >
              <option value="all">All Prices</option>
              <option value="under_500">Under ₹500</option>
              <option value="500_2000">₹500 - ₹2,000</option>
              <option value="2000_10000">₹2,000 - ₹10,000</option>
              <option value="above_10000">Above ₹10,000</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="filter-group">
            <label htmlFor="sort-select" className="filter-label">Sort:</label>
            <select 
              id="sort-select"
              value={sort} 
              onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <label className="checkbox-label" title="Show only available products with active stock">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Result count & Active filters info */}
      {!isLoading && !error && (
        <div className="results-header">
          <p className="result-count">
            Showing {displayedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
            {Math.min(currentPage * ITEMS_PER_PAGE, displayedProducts.length)} of {displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''}
          </p>
          {(search || selectedCategory || priceBracket !== 'all' || inStockOnly) && (
            <button
              className="clear-filters-link"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setPriceBracket('all');
                setInStockOnly(false);
                setSearchParams({});
                setCurrentPage(1);
              }}
            >
              ✕ Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* States */}
      {isLoading && <div className="status-message loading">Loading catalogue...</div>}
      {error && !isLoading && (
        <div className="status-message error">
          <p>Failed to load products.</p>
          <p className="error-details">{error}</p>
        </div>
      )}
      {!isLoading && !error && displayedProducts.length === 0 && (
        <div className="status-message empty">
          <p>No products found matching your criteria.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setPriceBracket('all');
              setInStockOnly(false);
              setSearchParams({});
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product grid */}
      {!isLoading && !error && paginatedProducts.length > 0 && (
        <>
          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar" role="navigation" aria-label="Pagination Navigation">
              <button
                className="pagination-btn prev-btn"
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                ← Prev
              </button>

              <div className="pagination-info">
                Page <span className="current-page-num">{currentPage}</span> of {totalPages}
              </div>

              <button
                className="pagination-btn next-btn"
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
