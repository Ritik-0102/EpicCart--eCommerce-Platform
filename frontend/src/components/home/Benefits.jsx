import React from 'react';
import './Benefits.css';

const Benefits = () => {
  const benefitsList = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'On all orders over $50'
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: '100% secure payment'
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '30 days return policy'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Dedicated support'
    }
  ];

  return (
    <section className="benefits-section">
      <div className="container benefits-grid">
        {benefitsList.map((benefit, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-icon">{benefit.icon}</div>
            <div className="benefit-text">
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
