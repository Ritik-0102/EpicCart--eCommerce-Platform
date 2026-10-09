import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWishlist, addToWishlist as apiAddToWishlist, removeWishlistItem as apiRemoveWishlistItem } from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      loadWishlist();
    } else {
      setWishlist(null);
    }
  }, [token]);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWishlist(token);
      setWishlist(data);
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) {
      setError('Please log in to add items to wishlist.');
      return false;
    }
    
    setLoading(true);
    try {
      const data = await apiAddToWishlist(productId, token);
      setWishlist(data);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add item to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    setLoading(true);
    try {
      const data = await apiRemoveWishlistItem(wishlistItemId, token);
      setWishlist(data);
    } catch (err) {
      setError(err.message || 'Failed to remove item from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some(item => item.productId === productId);
  };

  /**
   * Returns the wishlist item's id (row id) for a given productId.
   * Used by components that need to call removeFromWishlist(itemId).
   */
  const getWishlistItemId = (productId) => {
    if (!wishlist || !wishlist.items) return null;
    const item = wishlist.items.find(item => item.productId === productId);
    return item ? item.id : null;
  };

  const wishlistItemCount = wishlist?.items?.length || 0;

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId, wishlistItemCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
