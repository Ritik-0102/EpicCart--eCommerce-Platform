import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../../services/api';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Sorting State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest', 'price_asc', 'price_desc'
  const [page, setPage] = useState(1);

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories for filters", err);
      }
    };
    loadCategories();
  }, []);

  // Load Products whenever filters or page change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const queryParams = {
          page,
          limit: 8,
          sort
        };
        if (search) queryParams.search = search;
        if (selectedCategory) queryParams.category = selectedCategory;

        const response = await fetchProducts(queryParams);
        setProducts(response.data);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search slightly to avoid spamming the API
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, sort, page]);

  return (
    <div className="shop-page container">
      <h1 className="page-title">Shop All Products</h1>

      <div className="discovery-controls">
        {/* Search */}
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          className="search-input"
        />

        {/* Category Filter */}
        <select 
          value={selectedCategory} 
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sorting */}
        <select 
          value={sort} 
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="sort-select"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* API States */}
      {isLoading && <div className="status-message loading">Loading products...</div>}
      {error && !isLoading && (
        <div className="status-message error">
          <p>⚠️ Failed to load products.</p>
          <p className="error-details">{error}</p>
        </div>
      )}
      {!isLoading && !error && products.length === 0 && (
        <div className="status-message empty">
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="product-card shop-product-card">
              <div className="product-image-container">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} 
                  alt={product.name} 
                  className="product-image" 
                />
              </div>
              <div className="product-info">
                <p className="product-category-label">{product.category?.name || 'General'}</p>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                  <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            disabled={pagination.currentPage === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button 
            disabled={pagination.currentPage === pagination.totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
