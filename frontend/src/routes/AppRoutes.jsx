import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/common/Loader';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoutes from './AdminRoutes';

// Lazy-loaded Pages
const Home = React.lazy(() => import('../pages/Home'));
const Templates = React.lazy(() => import('../pages/Templates'));
const Pricing = React.lazy(() => import('../components/landing/Pricing'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Builder = React.lazy(() => import('../pages/Builder'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const AIAssistant = React.lazy(() => import('../pages/AIAssistant'));
const Admin = React.lazy(() => import('../pages/Admin'));
const AdminVendors = React.lazy(() => import('../pages/admin/Vendors'));
const VendorStore = React.lazy(() => import('../pages/VendorStore'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const Products = React.lazy(() => import('../pages/Products'));

// Placeholder components for routes that don't have full pages yet
const Settings = () => <div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p>Settings page content goes here.</p></div>;
const Orders = () => <div className="p-8"><h1 className="text-2xl font-bold">Orders</h1><p>Orders management content goes here.</p></div>;

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader message="Loading page..." />}>
      <Routes>
        {/* Public Routes (with Navbar/Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={
            <div className="pt-24 min-h-screen">
              <Pricing />
            </div>
          } />
        </Route>

        {/* Public Routes (No Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dynamic Vendor Storefront Route */}
        <Route path="/store/:vendorSlug" element={<VendorStore />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Admin />} />
            {/* Additional admin routes would go here */}
            <Route path="/admin/users" element={<div className="p-8"><h1 className="text-2xl font-bold">Users</h1></div>} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
            <Route path="/admin/reports" element={<div className="p-8"><h1 className="text-2xl font-bold">Reports</h1></div>} />
            <Route path="/admin/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
          </Route>
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
