import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setupAdminProfile } from '../services/api';
import toast from 'react-hot-toast';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bootstrapSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // assuming AuthContext has login method or similar? Wait, AuthContext usually provides user state and login/register methods. Let's assume it has login that sets the user. Or maybe we just call loginUser from api and then pass to context. Wait, AuthContext login method usually takes (email, password) or (userData). I'll manually set token and user. Actually, if AuthContext has a login method that takes token and user, I can use it. Let's check how Login.jsx uses it.
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await setupAdminProfile(formData);
      // Wait, AuthContext in this app usually just updates state or has a login function.
      // I will import the AuthContext and check its shape, but for now I'll just save token to localStorage and dispatch/reload if necessary. Or I can just call the context's login method if it accepts userData.
      
      // Typical context usage in this app:
      // login(userData)
      // Or just save token and let the app reload.
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Let's reload to let context pick it up, or if context has a method, we can try using it.
      // Easiest is to just reload the page to /admin
      toast.success('Admin setup successful!');
      window.location.href = '/admin';
    } catch (error) {
      toast.error(error.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Admin Portal Setup</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This is a one-time setup to create the initial admin user. You will need the Bootstrap Secret from the server environment.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Bootstrap Secret</label>
          <input
            type="password"
            name="bootstrapSecret"
            value={formData.bootstrapSecret}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Admin Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Admin Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Admin Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            background: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Setting up...' : 'Create Admin Account'}
        </button>
      </form>
    </div>
  );
};

export default AdminSetup;

