import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchProducts, updateProductStock } from '../services/api';

const AdminProducts = () => {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for stock update
  const [updatingId, setUpdatingId] = useState(null);
  const [newStock, setNewStock] = useState({});

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      const loadProducts = async () => {
        try {
          const data = await fetchProducts();
          setProducts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [user, token]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const handleStockUpdate = async (productId) => {
    const stockVal = newStock[productId];
    if (stockVal === undefined) return;
    
    setUpdatingId(productId);
    try {
      await updateProductStock(productId, parseInt(stockVal), token);
      // Update local state
      setProducts(products.map(p => p.id === productId ? { ...p, stock: parseInt(stockVal) } : p));
      alert('Stock updated successfully!');
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStockChange = (productId, val) => {
    setNewStock({ ...newStock, [productId]: val });
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products & Inventory</h1>
        <a href="/admin" className="text-indigo-600 hover:underline">&larr; Back to Dashboard</a>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Current Stock</th>
              <th className="p-4 font-semibold">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{product.id}</td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">₹{parseFloat(product.price).toFixed(2)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="0"
                      className="border rounded p-1 w-20"
                      defaultValue={product.stock}
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                    />
                    <button 
                      onClick={() => handleStockUpdate(product.id)}
                      disabled={updatingId === product.id}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updatingId === product.id ? 'Updating...' : 'Save'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
