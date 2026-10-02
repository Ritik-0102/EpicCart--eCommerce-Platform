import React from 'react';
import { categories } from '../../data/mockData';
import './Categories.css';

const Categories = () => {
  return (
    <section className="categories-section container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
