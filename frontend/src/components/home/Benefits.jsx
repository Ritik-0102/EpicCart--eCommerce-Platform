import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import './Benefits.css';

const BENEFITS_DATA = [
  {
    icon: Truck,
    title: 'Free Express Delivery',
    description: 'Complimentary shipping on all orders over ₹499 across India with tracking.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Razorpay Payments',
    description: '100% bank-grade encrypted checkout supporting Cards, UPI & NetBanking.'
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description: 'Hassle-free return and exchange policy with convenient doorstep pickup.'
  },
  {
    icon: Headphones,
    title: 'Dedicated Customer Care',
    description: 'Friendly support team ready to assist you via email and help desk.'
  }
];

const Benefits = () => {
  return (
    <section className="benefits-section" aria-label="Customer Benefits & Guarantees">
      <div className="container">
        <div className="benefits-grid">
          {BENEFITS_DATA.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <IconComponent size={24} className="benefit-icon" />
                </div>
                <div className="benefit-content">
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
