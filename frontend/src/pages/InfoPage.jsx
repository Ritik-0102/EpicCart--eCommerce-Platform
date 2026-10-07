import React from 'react';

const InfoPage = ({ title }) => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <h2>{title}</h2>
      <p style={{ marginTop: '20px', color: '#666' }}>This information page will be available soon.</p>
    </div>
  );
};

export default InfoPage;
