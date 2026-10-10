import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from '../services/api';

const AdminCoupons = () => {
  const { user, token } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    discountValue: '',
    isPercentage: true,
    isActive: true,
    expiryDate: '',
    minPurchase: '',
    usageLimit: ''
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
      const data = await fetchCoupons(token);
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const openModal = (mode, coupon = null) => {
    setModalMode(mode);
    if (mode === 'edit' && coupon) {
      // Format date for datetime-local input
      let formattedDate = '';
      if (coupon.expiryDate) {
        const d = new Date(coupon.expiryDate);
        formattedDate = d.toISOString().slice(0, 16);
      }
      setFormData({
        id: coupon.id,
        code: coupon.code,
        discountValue: coupon.discountValue,
        isPercentage: coupon.isPercentage,
        isActive: coupon.isActive,
        expiryDate: formattedDate,
        minPurchase: coupon.minPurchase || '',
        usageLimit: coupon.usageLimit || ''
      });
    } else {
      setFormData({
        id: '',
        code: '',
        discountValue: '',
        isPercentage: true,
        isActive: true,
        expiryDate: '',
        minPurchase: '',
        usageLimit: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        isPercentage: formData.isPercentage,
        isActive: formData.isActive,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
      };

      if (modalMode === 'create') {
        await createAdminCoupon(payload, token);
        alert('Coupon created successfully');
      } else {
        await updateAdminCoupon(formData.id, payload, token);
        alert('Coupon updated successfully');
      }
      
      closeModal();
      loadData();
    } catch (err) {
      alert(`Error saving coupon: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteAdminCoupon(id, token);
        alert('Coupon deleted');
        loadData();
      } catch (err) {
        alert(`Failed to delete coupon: ${err.message}`);
      }
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading coupons...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Manage Coupons</h1>
        <button 
          onClick={() => openModal('create')}
          style={{ background: '#16a34a', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + New Coupon
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>Code</th>
              <th style={{ padding: '15px' }}>Discount</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Usage</th>
              <th style={{ padding: '15px' }}>Min. Purchase</th>
              <th style={{ padding: '15px' }}>Expires</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{coupon.code}</td>
                <td style={{ padding: '15px' }}>
                  {coupon.isPercentage ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </td>
                <td style={{ padding: '15px' }}>
                  {coupon.isActive 
                    ? <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>Active</span>
                    : <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>Inactive</span>
                  }
                </td>
                <td style={{ padding: '15px' }}>
                  {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </td>
                <td style={{ padding: '15px' }}>{coupon.minPurchase ? `₹${coupon.minPurchase}` : '-'}</td>
                <td style={{ padding: '15px' }}>
                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <button 
                    onClick={() => openModal('edit', coupon)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No coupons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{modalMode === 'create' ? 'Create Coupon' : 'Edit Coupon'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Coupon Code</label>
                  <input 
                    type="text" 
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Discount Value</label>
                  <input 
                    type="number"
                    step="0.01" 
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="isPercentage"
                      checked={formData.isPercentage}
                      onChange={handleInputChange}
                      style={{ marginRight: '10px', width: '16px', height: '16px' }}
                    />
                    Is Percentage Discount?
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ marginRight: '10px', width: '16px', height: '16px' }}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Minimum Purchase Amount (Optional)</label>
                <input 
                  type="number"
                  step="0.01" 
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Usage Limit (Optional)</label>
                  <input 
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Expiry Date & Time (Optional)</label>
                  <input 
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
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

export default AdminCoupons;
