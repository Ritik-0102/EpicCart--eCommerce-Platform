import React, { useContext, useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingBag, 
  Users, 
  FolderTree, 
  TicketPercent, 
  MessageSquare, 
  Settings, 
  History, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/account" replace />;
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-layout-root">
      {/* Mobile Sticky Header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-title">
          <span>⚡ EpicCart Admin</span>
        </div>
        <button 
          className="admin-menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle admin navigation menu"
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{isSidebarOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="admin-backdrop" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">Admin Portal</h2>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-nav-link" onClick={closeSidebar}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link" onClick={closeSidebar}>
            <Package size={18} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/admin/inventory" className="admin-nav-link" onClick={closeSidebar}>
            <Boxes size={18} />
            <span>Inventory</span>
          </NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link" onClick={closeSidebar}>
            <ShoppingBag size={18} />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/admin/customers" className="admin-nav-link" onClick={closeSidebar}>
            <Users size={18} />
            <span>Customers</span>
          </NavLink>
          <NavLink to="/admin/categories" className="admin-nav-link" onClick={closeSidebar}>
            <FolderTree size={18} />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/coupons" className="admin-nav-link" onClick={closeSidebar}>
            <TicketPercent size={18} />
            <span>Coupons</span>
          </NavLink>
          <NavLink to="/admin/reviews" className="admin-nav-link" onClick={closeSidebar}>
            <MessageSquare size={18} />
            <span>Reviews</span>
          </NavLink>
          <NavLink to="/admin/settings" className="admin-nav-link" onClick={closeSidebar}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/admin/audit-logs" className="admin-nav-link" onClick={closeSidebar}>
            <History size={18} />
            <span>Audit Logs</span>
          </NavLink>
        </nav>

        <div className="admin-store-link">
          <Link to="/" onClick={closeSidebar}>
            <ExternalLink size={16} />
            <span>View Live Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

