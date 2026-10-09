import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({}); // per-product loading state

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local state for UI filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest'); 

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
    setSearchParams(prev => {
      if (e.target.value) prev.set('search', e.target.value);
      else prev.delete('search');
      return prev;
    });
  };

  // Update URL when category filter changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchParams(prev => {
      if (e.target.value) prev.set('category', e.target.value);
      else prev.delete('category');
      return prev;
    });
  };

  // Sync state if URL changes externally (e.g. from Navbar category link)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Add to cart handler (stops link click propagation)
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to add items to the cart.');
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    const success = await addToCart(product.id, 1);
    setAddingToCart(prev => ({ ...prev, [product.id]: false }));

    if (success) {
      toast.success(`"${product.name}" added to cart!`);
    } else {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  // Wishlist toggle handler (stops link click propagation)
  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to manage your wishlist.');
      navigate('/login');
      return;
    }

    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      const itemId = getWishlistItemId(product.id);
      if (itemId) {
        await removeFromWishlist(itemId);
        toast.success(`"${product.name}" removed from wishlist.`);
      }
    } else {
      const success = await addToWishlist(product.id);
      if (success) {
        toast.success(`"${product.name}" added to wishlist!`);
      } else {
        toast.error('Failed to update wishlist. Please try again.');
      }
    }
  };

  // --- Filtering and sorting (derived state, no extra renders) ---
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
      // Match by category name (case-insensitive) or by category ID string
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
    // newest — higher id is newer
    displayedProducts.sort((a, b) => b.id - a.id);
  }

  return (
    <div className="shop-page container">
      <h1 className="page-title">Shop All Products</h1>

      {/* Filter + sort controls */}
      <div className="discovery-controls">
        <input 
          type="text" 
          placeholder="Search products..." 
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
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</option>
          ))}
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
          aria-label="Sort products"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Result count */}
      {!isLoading && !error && displayedProducts.length > 0 && (
        <p className="result-count">
          {displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* States */}
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
          {(search || selectedCategory) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSearchParams({});
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!isLoading && !error && displayedProducts.length > 0 && (
        <div className="products-grid">
          {displayedProducts.map((product) => (
            <div key={product.id} className="product-card-wrapper">
              <Link to={`/products/${product.id}`} className="product-card shop-product-card">
                <div className="product-image-container">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/500?text=No+Image'} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }}
                  />
                  {/* Wishlist heart button — does NOT navigate */}
                  <button
                    className={`wishlist-btn${isInWishlist(product.id) ? ' in-wishlist' : ''}`}
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isInWishlist(product.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="product-info">
                  <p className="product-category-label">{product.category?.name || 'General'}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-row">
                    <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </div>
              </Link>

              {/* Add to Cart button outside the Link to avoid nested interactive elements */}
              <button
                className="add-to-cart-btn shop-add-btn"
                onClick={(e) => handleAddToCart(e, product)}
                disabled={addingToCart[product.id]}
                aria-label={`Add ${product.name} to cart`}
              >
                {addingToCart[product.id] ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
