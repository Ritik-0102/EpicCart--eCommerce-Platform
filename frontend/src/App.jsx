import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import InfoPage from './pages/InfoPage';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/contact" element={<InfoPage title="Contact Us" />} />
        <Route path="/faq" element={<InfoPage title="Frequently Asked Questions" />} />
        <Route path="/shipping" element={<InfoPage title="Shipping Information" />} />
        <Route path="/returns" element={<InfoPage title="Returns Policy" />} />
        {/* Redirect legacy /shop URL to /products */}
        <Route path="/shop" element={<Navigate to="/products" replace />} />
        {/* 404 catch-all */}
        <Route path="*" element={
          <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 — Page Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
            <a href="/products" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', borderRadius: '0.5rem', textDecoration: 'none' }}>Browse Products</a>
          </div>
        } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
