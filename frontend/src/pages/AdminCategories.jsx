import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const AdminCategories = () => {
  const { user, token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      loadData();
    }
  }, [user, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    if (mode === 'edit' && category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description || ''
      });
    } else {
      setFormData({
        id: '',
        name: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description
      };

      if (modalMode === 'create') {
        await createCategory(payload, token);
        alert('Category created successfully');
      } else {
        await updateCategory(formData.id, payload, token);
        alert('Category updated successfully');
      }
      
      closeModal();
      loadData();
    } catch (err) {
      alert(`Error saving category: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might fail if products are linked to it.')) {
      try {
        await deleteCategory(id, token);
        alert('Category deleted');
        loadData();
      } catch (err) {
        alert(`Failed to delete category: ${err.message}`);
      }
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading categories...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Manage Categories</h1>
        <button 
          onClick={() => openModal('create')}
          style={{ background: '#16a34a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + New Category
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Name</th>
              <th style={{ padding: '15px' }}>Description</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', color: '#64748b' }}>#{category.id}</td>
                <td style={{ padding: '15px', fontWeight: '500' }}>{category.name}</td>
                <td style={{ padding: '15px' }}>{category.description || '-'}</td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <button 
                    onClick={() => openModal('edit', category)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{modalMode === 'create' ? 'Create Category' : 'Edit Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description (Optional)</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{ padding: '10px 15px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '10px 15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

