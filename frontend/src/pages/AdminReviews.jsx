import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchAdminReviews, deleteAdminReview } from '../services/api';

const AdminReviews = () => {
  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' && token) {
      loadData();
    }
  }, [user, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminReviews(token);
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteAdminReview(id, token);
        alert('Review deleted');
        loadData();
      } catch (err) {
        alert(`Failed to delete review: ${err.message}`);
      }
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading reviews...</div>;
  if (error) return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Moderate Reviews</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Product</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Rating</th>
              <th style={{ padding: '15px' }}>Comment</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '15px', fontWeight: '500' }}>
                  {review.product?.name || 'Unknown Product'}
                </td>
                <td style={{ padding: '15px' }}>
                  {review.user?.name || 'Unknown User'}
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{review.user?.email}</div>
                </td>
                <td style={{ padding: '15px', color: '#eab308', letterSpacing: '2px' }}>
                  {renderStars(review.rating)}
                </td>
                <td style={{ padding: '15px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.comment}>
                  {review.comment}
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(review.id)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;

