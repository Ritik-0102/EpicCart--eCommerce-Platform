// CartContext: global state for the customer's shopping cart
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem } from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Access the authentication token from AuthContext
  const { token, user } = useContext(AuthContext);

  // Automatically fetch cart whenever the user logs in, or clear it if they log out
  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [token]);

  // Fetch the authoritative cart record from the backend API
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCart(token);
      setCart(data);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Add a product to the cart with the specified quantity
  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      setError('Please log in to add items to the cart.');
      return false;
    }
    
    setLoading(true);
    try {
      const data = await apiAddToCart(productId, quantity, token);
      setCart(data);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Modify the quantity of an item already in the cart
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const data = await apiUpdateCartItem(cartItemId, quantity, token);
      setCart(data);
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  // Delete an item from the cart
  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      const data = await apiRemoveCartItem(cartItemId, token);
      setCart(data);
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Compute total number of items in the cart to display in the navbar badge
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, error, addToCart, updateQuantity, removeFromCart, cartItemCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};
