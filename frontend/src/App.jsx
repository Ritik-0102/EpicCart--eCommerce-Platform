import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

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
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminSetup from './pages/AdminSetup';
import InfoPage from './pages/InfoPage';

import AdminInventory from './pages/AdminInventory';

import AdminCustomers from './pages/AdminCustomers';
import AdminCategories from './pages/AdminCategories';
import AdminCoupons from './pages/AdminCoupons';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import AdminAuditLogs from './pages/AdminAuditLogs';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/setup';

  return (
    <div className="app-container">
      {/* Hide customer Navbar/Footer for Admin Portal (except setup maybe, or hide it there too) */}
      {!isAdminRoute && <Navbar />}
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
        <Route path="/contact" element={<InfoPage title="Contact Us" />} />
        <Route path="/faq" element={<InfoPage title="Frequently Asked Questions" />} />
        <Route path="/shipping" element={<InfoPage title="Shipping Information" />} />
        <Route path="/returns" element={<InfoPage title="Returns Policy" />} />
        
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Setup Route (One-time) */}
        <Route path="/admin/setup" element={<AdminSetup />} />

        {/* Admin Portal Routes wrapped in Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="customers" element={<AdminCustomers />} />
          {/* Placeholders for future phases */}
          <Route path="categories" element={<AdminCategories />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

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
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
