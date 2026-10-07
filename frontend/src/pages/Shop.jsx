import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for UI
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest'); 

  // Load everything on mount
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

  // Update URL and state
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams(prev => {
      if (e.target.value) prev.set('search', e.target.value);
      else prev.delete('search');
      return prev;
    });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchParams(prev => {
      if (e.target.value) prev.set('category', e.target.value);
      else prev.delete('category');
      return prev;
    });
  };

  // Sync state if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Derived state (Filtering and Sorting)
  let displayedProducts = [...allProducts];

  if (search) {
    const q = search.toLowerCase();
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (selectedCategory) {
    displayedProducts = displayedProducts.filter(p => {
      // Allow matching by ID or Slug/Name depending on how the URL is structured
      if (p.categoryId?.toString() === selectedCategory) return true;
      if (p.category?.name?.toLowerCase() === selectedCategory.toLowerCase()) return true;
      if (p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase()) return true;
      return false;
    });
  }

  if (sort === 'price_asc') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else {
    // newest (assume higher id is newer if no date available)
    displayedProducts.sort((a, b) => b.id - a.id);
  }

  return (
    <div className="shop-page container">
      <h1 className="page-title">Shop All Products</h1>

      <div className="discovery-controls">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search} 
          onChange={handleSearchChange} 
          className="search-input"
        />

        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
          ))}
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading && <div className="status-message loading">Loading products...</div>}
      {error && !isLoading && (
        <div className="status-message error">
          <p>Failed to load products.</p>
          <p className="error-details">{error}</p>
        </div>
      )}
      {!isLoading && !error && displayedProducts.length === 0 && (
        <div className="status-message empty">
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {!isLoading && !error && displayedProducts.length > 0 && (
        <div className="products-grid">
          {displayedProducts.map((product) => (
            <Link to={/products/ + product.id} key={product.id} className="product-card shop-product-card">
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
    </div>
  );
};

export default Shop;
