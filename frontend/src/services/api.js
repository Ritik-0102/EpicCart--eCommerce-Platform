// We use Vite's environment variable syntax to get the base API URL.
// If it's not defined, we fall back to the local development server URL.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable function to fetch products from the backend.
 * Throws an error if the response is not ok, which allows components to display error states.
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    
    // Check if the API returned an HTTP error (e.g. 500 Internal Server Error)
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    
    return data.data; // Return the actual array of products
  } catch (error) {
    console.error('API Error (fetchProducts):', error);
    throw error;
  }
};

/**
 * Reusable function to fetch categories from the backend.
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data.data; // Return the actual array of categories
  } catch (error) {
    console.error('API Error (fetchCategories):', error);
    throw error;
  }
};

/**
 * Fetch the cart for the logged-in user.
 */
export const fetchCart = async (token) => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch cart');
    return data.data;
  } catch (error) {
    console.error('API Error (fetchCart):', error);
    throw error;
  }
};

/**
 * Add an item to the cart.
 */
export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ productId, quantity })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add to cart');
    return data.data;
  } catch (error) {
    console.error('API Error (addToCart):', error);
    throw error;
  }
};

/**
 * Update cart item quantity.
 */
export const updateCartItem = async (cartItemId, quantity, token) => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update cart');
    return data.data;
  } catch (error) {
    console.error('API Error (updateCartItem):', error);
    throw error;
  }
};

/**
 * Remove an item from the cart.
 */
export const removeCartItem = async (cartItemId, token) => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove from cart');
    return data.data;
  } catch (error) {
    console.error('API Error (removeCartItem):', error);
    throw error;
  }
};

/**
 * Fetch the wishlist for the logged-in user.
 */
export const fetchWishlist = async (token) => {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch wishlist');
    return data.data;
  } catch (error) {
    console.error('API Error (fetchWishlist):', error);
    throw error;
  }
};

/**
 * Add an item to the wishlist.
 */
export const addToWishlist = async (productId, token) => {
  try {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ productId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add to wishlist');
    return data.data;
  } catch (error) {
    console.error('API Error (addToWishlist):', error);
    throw error;
  }
};

/**
 * Remove an item from the wishlist.
 */
export const removeWishlistItem = async (wishlistItemId, token) => {
  try {
    const response = await fetch(`${API_URL}/wishlist/${wishlistItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to remove from wishlist');
    return data.data;
  } catch (error) {
    console.error('API Error (removeWishlistItem):', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID.
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch product details');
    }
    
    return data.data; 
  } catch (error) {
    console.error('API Error (fetchProductById):', error);
    throw error;
  }
};

/**
 * Get checkout summary (subtotal, discount, total)
 */
export const fetchCheckoutSummary = async (couponCode, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/checkout-summary`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ couponCode })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch checkout summary');
    return data.data;
  } catch (error) {
    console.error('API Error (fetchCheckoutSummary):', error);
    throw error;
  }
};

/**
 * Create a new order (Checkout)
 */
export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create order');
    return data.data;
  } catch (error) {
    console.error('API Error (createOrder):', error);
    throw error;
  }
};

/**
 * Get logged in user's orders
 */
export const fetchMyOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data.data;
  } catch (error) {
    console.error('API Error (fetchMyOrders):', error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const fetchOrderById = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch order details');
    return data.data;
  } catch (error) {
    console.error('API Error (fetchOrderById):', error);
    throw error;
  }
};
