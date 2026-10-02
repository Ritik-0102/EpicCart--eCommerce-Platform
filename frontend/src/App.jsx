import React from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import Promotions from './components/home/Promotions';
import Categories from './components/home/Categories';
import FeaturedProducts from './components/home/FeaturedProducts';
import Benefits from './components/home/Benefits';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main>
        <Hero />
        <Promotions />
        <Categories />
        <FeaturedProducts />
        <Benefits />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
