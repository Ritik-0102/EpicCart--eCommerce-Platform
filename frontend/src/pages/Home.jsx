import React from 'react';
import Hero from '../components/home/Hero';
import Promotions from '../components/home/Promotions';
import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Benefits from '../components/home/Benefits';

const Home = () => {
  return (
    <main>
      <Hero />
      <Promotions />
      <Categories />
      <FeaturedProducts />
      <Benefits />
    </main>
  );
};

export default Home;
