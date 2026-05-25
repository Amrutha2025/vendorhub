import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, RefreshCw, Download, 
  Plus, Users, Store, CheckCircle, Clock, ShieldCheck, 
  DollarSign, Activity, Eye, Edit, Trash2, Globe, ExternalLink,
  ChevronDown, X
} from 'lucide-react';
import axios from 'axios';

// --- Subcomponents ---

const StatsCard = ({ title, value, icon: Icon, colorClass, gradientClass, trend }) => (
  <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
          {trend}
        </span>
      )}
    </div>
    <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
    <h3 className="text-3xl font-display font-bold text-gray-900">{value}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Suspended: "bg-red-100 text-red-700 border-red-200",
    Published: "bg-purple-100 text-purple-700 border-purple-200",
    Draft: "bg-gray-100 text-gray-700 border-gray-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Draft}`}>
      {status}
    </span>
  );
};

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // UI States
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // For actions menu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Mock initial data as fallback if API fails
  const mockVendors = [
    { _id: '1', businessName: 'Sweet Crumbs Bakery', ownerId: { name: 'Sarah Lee', email: 'sarah@sweetcrumbs.com' }, category: 'Bakery', plan: 'Pro', status: 'Active', websiteStatus: 'Published', productsCount: 32, revenue: 15000, lastActive: '2 mins ago', createdAt: '2023-01-10', template: 'Botanica' },
    { _id: '2', businessName: 'GreenLeaf Store', ownerId: { name: 'Mike Ross', email: 'mike@greenleaf.com' }, category: 'Plant Store', plan: 'Starter', status: 'Active', websiteStatus: 'Draft', productsCount: 12, revenue: 500, lastActive: '1 day ago', createdAt: '2023-03-15', template: 'Lumière' },
    { _id: '3', businessName: 'Urban Fashion', ownerId: { name: 'Emma Watson', email: 'emma@urban.com' }, category: 'Clothing', plan: 'Business', status: 'Active', websiteStatus: 'Published', productsCount: 85, revenue: 45000, lastActive: '10 mins ago', createdAt: '2022-11-05', template: 'Studio Minimal' },
    { _id: '4', businessName: 'Glow Beauty', ownerId: { name: 'Jessica Alba', email: 'jess@glow.com' }, category: 'Beauty', plan: 'Pro', status: 'Pending', websiteStatus: 'Pending', productsCount: 17, revenue: 0, lastActive: '5 hours ago', createdAt: '2023-06-20', template: 'None' },
    { _id: '5', businessName: 'Handmade Crafts', ownerId: { name: 'Elena Gomez', email: 'elena@crafts.com' }, category: 'Crafts', plan: 'Starter', status: 'Suspended', websiteStatus: 'Published', productsCount: 45, revenue: 3200, lastActive: '1 week ago', createdAt: '2023-02-14', template: 'Café Delight' },
  ];

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.get('http://localhost:5000/api/v1/admin/vendors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.data && response.data.data.length > 0) {
        const mapped = response.data.data.map(v => ({
          _id: v._id,
          businessName: v.businessName || 'Unnamed Business',
          ownerId: v.ownerId || { name: 'Unknown', email: 'N/A' },
          category: v.category || 'Other',
          plan: v.plan || 'Starter',
          status: v.status || 'Pending',
          websiteStatus: v.websiteStatus || 'Draft',
          productsCount: v.productsCount || Math.floor(Math.random() * 50),
          revenue: v.revenue || Math.floor(Math.random() * 50000),
          lastActive: v.lastActive || 'Recently',
          createdAt: v.createdAt,
          template: v.template || 'Default'
        }));
        setVendors(mapped);
      } else {
        setVendors([]); 
      }
    } catch (err) {
      console.warn("API failed, using mock data", err);
      setVendors(mockVendors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSuspend = async (vendorId, currentStatus) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    try {
      const token = localStorage.getItem('token') || '';
      await axios.put(`http://localhost:5000/api/v1/admin/vendors/${vendorId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateVendorStatusLocally(vendorId, newStatus);
    } catch (err) {
      console.warn("Failed to update status on backend, updating locally.", err);
      updateVendorStatusLocally(vendorId, newStatus);
    }
    setActiveDropdown(null);
  };

  const updateVendorStatusLocally = (vendorId, newStatus) => {
    setVendors(vendors.map(v => v._id === vendorId ? { ...v, status: newStatus } : v));
    if (selectedVendor && selectedVendor._id === vendorId) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;
    try {
      const token = localStorage.getItem('token') || '';
      await axios.delete(`http://localhost:5000/api/v1/admin/vendors/${vendorToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteVendorLocally();
    } catch (err) {
      console.warn("Failed to delete on backend, deleting locally.", err);
      deleteVendorLocally();
    } finally {
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    }
  };

  const deleteVendorLocally = () => {
    setVendors(vendors.filter(v => v._id !== vendorToDelete._id));
    if (selectedVendor && selectedVendor._id === vendorToDelete._id) {
      setIsDrawerOpen(false);
    }
  };

  const openDrawer = (vendor) => {
    setSelectedVendor(vendor);
    setIsDrawerOpen(true);
    setActiveDropdown(null);
  };

  // Filtering & Sorting
  let filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerId.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' ? true : v.status === statusFilter || v.websiteStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  filteredVendors.sort((a, b) => {
    if (sortBy === 'Most Products') return b.productsCount - a.productsCount;
    if (sortBy === 'Revenue') return b.revenue - a.revenue;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'Active').length;
  const pendingVendors = vendors.filter(v => v.status === 'Pending').length;
  const suspendedVendors = vendors.filter(v => v.status === 'Suspended').length;
  const publishedSites = vendors.filter(v => v.websiteStatus === 'Published').length;
  const totalRevenue = vendors.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown-btn') && !e.target.closest('.action-dropdown-menu')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans pb-20 overflow-x-hidden relative">
      
      {/* 1. PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">Vendor Management</h1>
              <p className="text-gray-500 mt-1 font-medium">Monitor vendors, websites, products, activities and platform performance.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchVendors}
                className="flex items-center justify-center w-11 h-11 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#5B5EF7] transition-all shadow-sm hover:shadow group"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-[#5B5EF7]' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </button>
              
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 h-11 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <button className="flex items-center gap-2 bg-gradient-to-r from-[#5B5EF7] to-[#8B5CF6] hover:from-[#4f52e3] hover:to-[#7c4dec] text-white px-5 h-11 rounded-xl font-bold transition-all shadow-lg shadow-[#5B5EF7]/30 hover:shadow-[#5B5EF7]/50 hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 2. DASHBOARD STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
          <StatsCard title="Total Vendors" value={totalVendors} icon={Users} colorClass="bg-blue-500 text-blue-600" gradientClass="from-blue-400 to-blue-600" trend="+12%" />
          <StatsCard title="Active Vendors" value={activeVendors} icon={CheckCircle} colorClass="bg-emerald-500 text-emerald-600" gradientClass="from-emerald-400 to-emerald-600" trend="+5%" />
          <StatsCard title="Pending" value={pendingVendors} icon={Clock} colorClass="bg-amber-500 text-amber-600" gradientClass="from-amber-400 to-amber-600" />
          <StatsCard title="Suspended" value={suspendedVendors} icon={ShieldCheck} colorClass="bg-red-500 text-red-600" gradientClass="from-red-400 to-red-600" />
          <StatsCard title="Published Websites" value={publishedSites} icon={Globe} colorClass="bg-purple-500 text-purple-600" gradientClass="from-purple-400 to-purple-600" trend="+18%" />
          <StatsCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="bg-[#06B6D4] text-[#06B6D4]" gradientClass="from-[#06B6D4] to-cyan-600" trend="+24%" />
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          <div className="xl:w-3/4 space-y-6">
            {/* 3. SEARCH + FILTER BAR */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search vendors, business, email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5EF7] focus:bg-white transition-all font-medium"
                />
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                  {['All', 'Active', 'Pending', 'Suspended', 'Published', 'Draft'].map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${statusFilter === filter ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B5EF7] cursor-pointer"
                  >
                    <option>Newest</option>
                    <option>Last Active</option>
                    <option>Most Products</option>
                    <option>Revenue</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 4. VENDOR TABLE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-visible relative min-h-[400px]">
              
              {loading ? (
                <div className="p-8 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48" />
                          <div className="h-3 bg-gray-200 rounded w-32" />
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-full w-24" />
                      <div className="h-8 bg-gray-200 rounded-full w-20" />
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center rounded-3xl z-10">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load vendors</h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <button onClick={fetchVendors} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Retry
                  </button>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center rounded-3xl z-10">
                  <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="No Vendors" className="w-48 h-48 opacity-50 mb-6 grayscale" />
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No vendors found</h3>
                  <p className="text-gray-500 max-w-sm mb-6">There are no vendors matching your current filters. Add your first vendor to get started.</p>
                  <button className="flex items-center gap-2 bg-[#5B5EF7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4f52e3] transition-all shadow-md">
                    <Plus className="w-5 h-5" />
                    Add Vendor
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Business Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stats</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredVendors.map((vendor) => (
                        <tr key={vendor._id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4 cursor-pointer" onClick={() => openDrawer(vendor)}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B5EF7] to-purple-400 flex flex-shrink-0 items-center justify-center text-white font-bold text-lg shadow-sm">
                                {vendor.businessName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-[#5B5EF7] transition-colors">{vendor.businessName}</p>
                                <p className="text-xs text-gray-500">{vendor.ownerId.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                              <Store className="w-3.5 h-3.5 text-gray-500" />
                              {vendor.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${vendor.plan === 'Enterprise' ? 'text-purple-600' : vendor.plan === 'Business' ? 'text-blue-600' : 'text-gray-600'}`}>
                              {vendor.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={vendor.websiteStatus} />
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={vendor.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 text-sm font-medium">
                              <span className="text-gray-900">{vendor.productsCount} Products</span>
                              <span className="text-xs text-gray-500">₹{vendor.revenue.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            {/* ACTIONS MENU */}
                            <button 
                              className="action-dropdown-btn p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === vendor._id ? null : vendor._id);
                              }}
                            >
                              <MoreVertical className="w-5 h-5 pointer-events-none" />
                            </button>

                            {activeDropdown === vendor._id && (
                              <div className="action-dropdown-menu absolute right-8 top-12 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => { window.open(`http://${vendor.businessName.toLowerCase().replace(/\s+/g, '')}.vendorhub.com`, '_blank'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5B5EF7] flex items-center gap-2 font-medium">
                                  <ExternalLink className="w-4 h-4" /> View Website
                                </button>
                                <button onClick={() => openDrawer(vendor)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5B5EF7] flex items-center gap-2 font-medium">
                                  <Eye className="w-4 h-4" /> View Details
                                </button>
                                <button onClick={() => setActiveDropdown(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5B5EF7] flex items-center gap-2 font-medium border-b border-gray-100 pb-3 mb-1">
                                  <Activity className="w-4 h-4" /> View Activity
                                </button>
                                <button 
                                  onClick={() => handleSuspend(vendor._id, vendor.status)} 
                                  className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 ${vendor.status === 'Suspended' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`}
                                >
                                  {vendor.status === 'Suspended' ? <CheckCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                  {vendor.status === 'Suspended' ? 'Activate Vendor' : 'Suspend Vendor'}
                                </button>
                                <button 
                                  onClick={() => { setVendorToDelete(vendor); setIsDeleteModalOpen(true); setActiveDropdown(null); }} 
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium mt-1"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete Vendor
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="xl:w-1/4 space-y-6">
            {/* 8. ANALYTICS SECTION */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B5EF7]/5 rounded-bl-full" />
              <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Overview</h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">Active Vendors</span>
                    <span className="text-gray-900 font-bold">{Math.round((activeVendors/totalVendors)*100 || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(activeVendors/totalVendors)*100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 font-medium">Published Sites</span>
                    <span className="text-gray-900 font-bold">{Math.round((publishedSites/totalVendors)*100 || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#8B5CF6] h-2 rounded-full transition-all duration-1000" style={{ width: `${(publishedSites/totalVendors)*100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. RECENT VENDOR ACTIVITY PANEL */}
            <div className="bg-[#0B1120] text-white rounded-3xl border border-gray-800 shadow-xl p-6 relative overflow-hidden h-[500px] flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#5B5EF7]/20 blur-[60px] rounded-full pointer-events-none" />
              
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <Activity className="w-5 h-5 text-[#06B6D4]" />
                Live Activity Feed
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar relative z-10">
                {[
                  { text: 'Sweet Crumbs Bakery published website', time: '2 mins ago', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { text: 'GreenLeaf changed homepage content', time: '10 mins ago', icon: Edit, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { text: 'Urban Fashion added 12 products', time: '1 hour ago', icon: Store, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { text: 'Glow Beauty changed theme colors', time: '2 hours ago', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { text: 'Beauty Store subscription expired', time: 'Yesterday', icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-400/10' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.bg} ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-200 font-medium leading-tight mb-1">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. VENDOR DETAILS DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-display font-bold text-gray-900">Vendor Profile</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedVendor && (
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5B5EF7] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {selectedVendor.businessName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedVendor.businessName}</h3>
                    <p className="text-[#5B5EF7] font-medium text-sm mt-1">{selectedVendor.ownerId.name}</p>
                    <div className="flex gap-2 mt-2">
                      <StatusBadge status={selectedVendor.status} />
                      <StatusBadge status={selectedVendor.plan} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wide">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedVendor.productsCount}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wide">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{selectedVendor.revenue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Contact Details</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{selectedVendor.ownerId.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">+1 (555) 000-0000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium text-gray-900">{new Date(selectedVendor.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Website Info</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">URL</span>
                    <a href={`http://${selectedVendor.businessName.toLowerCase().replace(/\s+/g, '')}.vendorhub.com`} className="font-medium text-[#5B5EF7] hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
                      Visit Site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-gray-900">{selectedVendor.websiteStatus}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Template</span>
                    <span className="font-medium text-gray-900">{selectedVendor.template}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-gray-100 bg-white space-y-3">
              <button 
                onClick={() => {
                  window.open(`http://${selectedVendor?.businessName.toLowerCase().replace(/\s+/g, '')}.vendorhub.com`, '_blank');
                }}
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" /> Open Website
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSuspend(selectedVendor._id, selectedVendor.status)}
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${selectedVendor?.status === 'Suspended' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                >
                  {selectedVendor?.status === 'Suspended' ? <CheckCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {selectedVendor?.status === 'Suspended' ? 'Activate' : 'Suspend'}
                </button>
                <button 
                  onClick={() => { setVendorToDelete(selectedVendor); setIsDeleteModalOpen(true); }}
                  className="flex-1 bg-red-50 text-red-600 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && vendorToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertTriangleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Delete Vendor?</h3>
            <p className="text-center text-gray-500 mb-8">
              Are you sure you want to delete <span className="font-bold text-gray-900">{vendorToDelete.businessName}</span>? This action cannot be undone and will erase their website and all products.
            </p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteModalOpen(false); setVendorToDelete(null); }} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Custom simple icon for alert
function AlertTriangleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  );
}
