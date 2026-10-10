import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchStoreSettings, updateStoreSettings } from '../services/api';

const AdminSettings = () => {
  const { user, token } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    storeName: '',
    supportEmail: '',
    currency: 'INR',
    taxRate: '0',
    shippingFee: '0'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      loadSettings();
    }
  }, [user, token]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchStoreSettings(token);
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings(settings, token);
      alert('Settings updated successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading settings...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Store Settings</h1>
      
      <div style={{ background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Store Name</label>
            <input 
              type="text" 
              name="storeName" 
              value={settings.storeName || ''} 
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              placeholder="EpicCart"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Support Email</label>
            <input 
              type="email" 
              name="supportEmail" 
              value={settings.supportEmail || ''} 
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              placeholder="support@epiccart.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Default Currency</label>
              <select 
                name="currency" 
                value={settings.currency || 'INR'} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tax Rate (%)</label>
              <input 
                type="number" 
                step="0.01"
                name="taxRate" 
                value={settings.taxRate || '0'} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Base Shipping Fee (₹)</label>
              <input 
                type="number" 
                step="0.01"
                name="shippingFee" 
                value={settings.shippingFee || '0'} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{ background: '#2563eb', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

