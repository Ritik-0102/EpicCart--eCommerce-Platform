import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/api';
import './Auth.css'; // We'll share CSS between Login and Register

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Attempt to login using the API service
      const data = await loginUser({ email, password });
      
      // Ensure the logged in user is actually an admin
      if (data.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }
      
      // Save the user (including role) and token to our global AuthContext
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token);
      
      // Redirect to the admin dashboard after successful login
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page container">
      <div className="auth-box" style={{ borderTop: '4px solid #1e293b' }}>
        <h1 className="auth-title">Admin Portal</h1>
        <p className="auth-subtitle">Login to access the EpicCart dashboard</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading} style={{ backgroundColor: '#1e293b' }}>
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;

