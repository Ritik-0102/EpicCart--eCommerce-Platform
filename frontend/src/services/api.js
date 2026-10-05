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
