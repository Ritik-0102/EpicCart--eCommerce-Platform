import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  fetchProducts, 
  fetchCategories, 
  updateProductStock, 
  createAdminProduct, 
  updateAdminProduct, 
  deleteAdminProduct, 
  uploadImage 
} from '../services/api';

const AdminProducts = () => {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stock update
  const [updatingId, setUpdatingId] = useState(null);
  const [newStock, setNewStock] = useState({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
    imagePublicId: '',
    sku: '',
    slug: '',
    lowStockThreshold: 5,
    isPublished: true,
    isFeatured: false,
    isArchived: false
  });
  
  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      loadData();
    }
  }, [user, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  // Stock logic
  const handleStockUpdate = async (productId) => {
    const stockVal = newStock[productId];
    if (stockVal === undefined) return;
    
    setUpdatingId(productId);
    try {
      await updateProductStock(productId, parseInt(stockVal), token);
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

  // Modal logic
  const openModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        imagePublicId: product.imagePublicId || '',
        sku: product.sku || '',
        slug: product.slug || '',
        lowStockThreshold: product.lowStockThreshold || 5,
        isPublished: product.isPublished !== undefined ? product.isPublished : true,
        isFeatured: product.isFeatured || false,
        isArchived: product.isArchived || false
      });
      setImagePreview(product.imageUrl);
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        imageUrl: '',
        imagePublicId: '',
        sku: '',
        slug: '',
        lowStockThreshold: 5,
        isPublished: true,
        isFeatured: false,
        isArchived: false
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePublicId = formData.imagePublicId;

      // 1. Upload Image if new file selected
      if (imageFile) {
        setIsUploading(true);
        const uploadRes = await uploadImage(imageFile, token);
        finalImageUrl = uploadRes.secure_url;
        finalImagePublicId = uploadRes.public_id;
        setIsUploading(false);
      }

      // 2. Prepare payload
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        imageUrl: finalImageUrl,
        imagePublicId: finalImagePublicId,
        sku: formData.sku || undefined,
        slug: formData.slug || undefined,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        isArchived: formData.isArchived
      };

      // 3. Save to DB
      if (modalMode === 'create') {
        await createAdminProduct(payload, token);
        alert('Product created successfully');
      } else {
        await updateAdminProduct(formData.id, payload, token);
        alert('Product updated successfully');
      }
      
      closeModal();
      loadData(); // Refresh list
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteAdminProduct(id, token);
        alert('Product deleted');
        loadData();
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products & Inventory</h1>
        <div className="space-x-4">
          <button 
            onClick={() => openModal('create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Product
          </button>
          <a href="/admin" className="text-indigo-600 hover:underline">Back to Dashboard</a>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold w-16">Image</th>
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Quick Update</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">₹{parseFloat(product.price).toFixed(2)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="0"
                      className="border rounded p-1 w-16"
                      defaultValue={product.stock}
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                    />
                    <button 
                      onClick={() => handleStockUpdate(product.id)}
                      disabled={updatingId === product.id}
                      className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updatingId === product.id ? '...' : 'Save'}
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => openModal('edit', product)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full border rounded p-2"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Price (₹)</label>
                  <input 
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Stock</label>
                  <input 
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">SKU</label>
                  <input 
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Slug</label>
                  <input 
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Low Stock Alert</label>
                  <input 
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-2">
                <label className="flex items-center">
                  <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="mr-2" />
                  Published
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="mr-2" />
                  Featured
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="isArchived" checked={formData.isArchived} onChange={handleInputChange} className="mr-2" />
                  Archived
                </label>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Product Image</label>
                
                {imagePreview && (
                  <div className="mb-2">
                    <img src={imagePreview} alt="Preview" className="h-32 object-contain border p-1 rounded" />
                  </div>
                )}
                
                <input 
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  className="w-full border rounded p-2"
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty to keep existing image (if editing). Max size: 5MB.</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? (isUploading ? 'Uploading Image...' : 'Saving...') : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
