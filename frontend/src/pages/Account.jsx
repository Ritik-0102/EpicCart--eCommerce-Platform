import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchProfile } from '../services/api';
import './Auth.css';

const Account = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If there is no user token in context, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
      } catch (err) {
        // If the token is expired or invalid, log them out and redirect
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('Not authorized')) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate, logout]);

  if (isLoading) return <div className="container status-message loading">Loading profile...</div>;

  return (
    <main className="account-page container">
      <div className="account-header">
        <h1>My Account</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
          Log Out
        </button>
      </div>

      {error ? (
        <div className="status-message error">⚠️ {error}</div>
      ) : (
        <div className="profile-details">
          <div className="profile-card">
            <h2>Profile Information</h2>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Member Since:</strong> {new Date(profile?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Account;

