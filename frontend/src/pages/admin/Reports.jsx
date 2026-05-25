import React, { useState, useEffect } from 'react';
import { 
  Download, FileText, Filter, Search, Calendar, Target,
  TrendingUp, Users, Globe, LayoutTemplate, Activity, ChevronDown,
  MoreVertical, CheckCircle, Clock, CheckSquare, Square, FileOutput,
  Zap, ArrowUpRight, ArrowDownRight, RefreshCw, Box, Bot, Sparkles,
  Trophy, Medal, X, Eye, Store
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// --- Theme Config ---
const theme = {
  primary: '#FF7A18',
  secondary: '#FF5722',
  sidebar: '#0B1120',
  text: '#111827',
  muted: '#6B7280',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
};

// --- Mock Data ---
const areaData = [
  { name: 'Jan', revenue: 40000, websites: 24, vendors: 10 },
  { name: 'Feb', revenue: 30000, websites: 18, vendors: 15 },
  { name: 'Mar', revenue: 55000, websites: 35, vendors: 25 },
  { name: 'Apr', revenue: 45000, websites: 28, vendors: 20 },
  { name: 'May', revenue: 60000, websites: 42, vendors: 30 },
  { name: 'Jun', revenue: 80000, websites: 55, vendors: 40 },
  { name: 'Jul', revenue: 75000, websites: 48, vendors: 35 },
  { name: 'Aug', revenue: 95000, websites: 60, vendors: 45 },
  { name: 'Sep', revenue: 110000, websites: 72, vendors: 50 },
  { name: 'Oct', revenue: 125000, websites: 80, vendors: 60 },
  { name: 'Nov', revenue: 140000, websites: 95, vendors: 70 },
  { name: 'Dec', revenue: 165000, websites: 110, vendors: 85 },
];

const barData = [
  { name: 'Bakery Hub', value: 85, fill: 'url(#colorOrange)' },
  { name: 'Fashion Studio', value: 72, fill: 'url(#colorOrange)' },
  { name: 'Glow Beauty', value: 65, fill: 'url(#colorOrange)' },
  { name: 'Real Estate', value: 58, fill: 'url(#colorOrange)' },
  { name: 'Healthy Living', value: 45, fill: 'url(#colorOrange)' },
  { name: 'Cafe Delights', value: 38, fill: 'url(#colorOrange)' },
];

const tableData = [
  { id: 1, name: 'Amrutha Bakery', type: 'Food', revenue: '₹45,200', status: 'Published', active: '2 mins ago', templates: 3, growth: '+12.5%' },
  { id: 2, name: 'Glow Beauty', type: 'Beauty', revenue: '₹32,100', status: 'Draft', active: '1 hr ago', templates: 1, growth: '+8.2%' },
  { id: 3, name: 'Urban Fashion', type: 'Retail', revenue: '₹89,500', status: 'Published', active: '5 mins ago', templates: 4, growth: '+24.8%' },
  { id: 4, name: 'Green Grocery', type: 'Grocery', revenue: '₹12,400', status: 'Published', active: '1 day ago', templates: 2, growth: '+3.1%' },
  { id: 5, name: 'Cafe Aroma', type: 'Food', revenue: '₹56,800', status: 'Suspended', active: '3 days ago', templates: 5, growth: '-2.4%' },
  { id: 6, name: 'FitLife Studio', type: 'Health', revenue: '₹41,000', status: 'Published', active: '10 mins ago', templates: 2, growth: '+15.6%' },
  { id: 7, name: 'Royal Jewellery', type: 'Retail', revenue: '₹120,500', status: 'Published', active: 'Just now', templates: 6, growth: '+42.1%' },
];

const activities = [
  { text: "Amrutha Bakery generated website", time: "10 mins ago", color: "text-emerald-500", bg: "bg-emerald-50", icon: Globe },
  { text: "Glow Beauty updated products", time: "1 hr ago", color: "text-blue-500", bg: "bg-blue-50", icon: Box },
  { text: "Urban Fashion published website", time: "2 hrs ago", color: "text-[#FF7A18]", bg: "bg-[#FF7A18]/10", icon: Sparkles },
  { text: "Green Grocery changed theme", time: "5 hrs ago", color: "text-purple-500", bg: "bg-purple-50", icon: LayoutTemplate },
  { text: "Cafe Aroma exported report", time: "1 day ago", color: "text-gray-500", bg: "bg-gray-100", icon: Download },
];

const insights = [
  "Bakery businesses have 24% higher engagement this month.",
  "Beauty category vendors are growing fastest.",
  "Published websites convert 38% better than drafts.",
  "Vendor activity peaks between 7PM–10PM."
];

// --- Subcomponents ---

const TopCard = ({ title, value, change, icon: Icon, isPositive = true }) => (
  <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF7A18]/5 to-transparent rounded-bl-full pointer-events-none" />
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-[#FF7A18]/10 group-hover:scale-110 transition-all duration-300 text-gray-500 group-hover:text-[#FF7A18]">
        <Icon className="w-6 h-6" />
      </div>
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </span>
    </div>
    <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
    <h3 className="text-3xl font-display font-bold text-gray-900 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF7A18] group-hover:to-[#FF5722] transition-colors">
      {value}
    </h3>
  </div>
);

const AdvancedReportCard = ({ title, metrics, icon: Icon }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-[#FF7A18] group-hover:bg-[#FF7A18]/10 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-[#FF7A18] transition-colors" onClick={(e) => { e.stopPropagation(); alert('Exporting ' + title); }}>
            <Download className="w-4 h-4" />
          </button>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          {metrics.map((m, i) => (
            <div key={i}>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{m.label}</p>
              <p className="text-lg font-bold text-gray-900">{m.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [dataVisible, setDataVisible] = useState({ revenue: true, websites: true, vendors: true });
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [search, setSearch] = useState('');

  // Toggles
  const [toggles, setToggles] = useState({
    activeOnly: false,
    highRevenue: false,
    publishedOnly: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = (type) => {
    alert(`Exporting ${type}...`);
  };

  const toggleVisibility = (key) => {
    setDataVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-[#FF7A18]/20 border-t-[#FF7A18] rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading enterprise reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans pb-20 overflow-x-hidden">
      
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-gray-900 tracking-tight">Reports & Insights</h1>
              <p className="text-gray-500 mt-1 font-medium">Track vendor performance, sales growth, customer activity, and business analytics.</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A18] cursor-pointer"
                >
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 bg-white border border-gray-200 px-4 h-10 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#FF7A18] transition-all shadow-sm">
                <FileText className="w-4 h-4" /> PDF
              </button>
              
              <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 bg-white border border-gray-200 px-4 h-10 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#FF7A18] transition-all shadow-sm">
                <FileOutput className="w-4 h-4" /> CSV
              </button>
              
              <button onClick={() => handleExport('Analytics')} className="flex items-center gap-2 bg-gradient-to-r from-[#FF7A18] to-[#FF5722] hover:shadow-[0_8px_20px_rgba(255,122,24,0.3)] hover:-translate-y-0.5 text-white px-5 h-10 rounded-xl font-bold transition-all">
                <Download className="w-4 h-4" /> Download Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <TopCard title="Total Revenue" value="₹4,58,230" change="+18.4%" icon={DollarSignIcon} />
          <TopCard title="Total Vendors" value="124" change="+12%" icon={Store} />
          <TopCard title="Website Published" value="89" change="+8.5%" icon={Globe} />
          <TopCard title="Active Users" value="3,245" change="+15.7%" icon={Users} />
          <TopCard title="Conversion Rate" value="68.2%" change="+5.4%" icon={TrendingUp} />
          <TopCard title="Total Templates" value="432" change="+10%" icon={LayoutTemplate} />
        </div>

        {/* REPORT FILTER SECTION */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vendor reports..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A18] focus:bg-white transition-all font-medium"
              />
            </div>
            <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A18]">
              <option>Vendor Type (All)</option>
              <option>Retail</option>
              <option>Food</option>
            </select>
            <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A18]">
              <option>Category (All)</option>
              <option>Bakery</option>
              <option>Beauty</option>
            </select>
            <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A18]">
              <option>Status (All)</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
            <div className="flex flex-wrap gap-6">
              {[
                { id: 'activeOnly', label: 'Active Vendors Only' },
                { id: 'highRevenue', label: 'High Revenue Vendors' },
                { id: 'publishedOnly', label: 'Published Websites Only' }
              ].map(toggle => (
                <label key={toggle.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 group-hover:border-[#FF7A18] transition-colors">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={toggles[toggle.id]}
                      onChange={() => setToggles({ ...toggles, [toggle.id]: !toggles[toggle.id] })}
                    />
                    {toggles[toggle.id] && <CheckSquare className="absolute inset-[-2px] w-5 h-5 text-[#FF7A18] bg-white" />}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{toggle.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setToggles({activeOnly: false, highRevenue: false, publishedOnly: false})} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Reset Filters
              </button>
              <button className="px-6 py-2 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#1f2937] transition-colors shadow-md">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* MAIN ANALYTICS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
                <p className="text-gray-500 text-sm">12 Months Growth Overview</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => toggleVisibility('revenue')} className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${dataVisible.revenue ? 'bg-[#FF7A18]/10 text-[#FF7A18]' : 'bg-gray-100 text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${dataVisible.revenue ? 'bg-[#FF7A18]' : 'bg-gray-400'}`} /> Revenue
                </button>
                <button onClick={() => toggleVisibility('websites')} className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${dataVisible.websites ? 'bg-[#0B1120]/10 text-[#0B1120]' : 'bg-gray-100 text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${dataVisible.websites ? 'bg-[#0B1120]' : 'bg-gray-400'}`} /> Websites
                </button>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A18" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF7A18" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1120" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0B1120" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  {dataVisible.revenue && (
                    <Area type="monotone" dataKey="revenue" stroke="#FF7A18" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  )}
                  {dataVisible.websites && (
                    <Area type="monotone" dataKey="websites" stroke="#0B1120" strokeWidth={3} fillOpacity={1} fill="url(#colorWeb)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Vendor Performance</h3>
                <p className="text-gray-500 text-sm">Top Performing Vendors</p>
              </div>
              <button className="text-gray-400 hover:text-[#FF7A18]"><MoreVertical className="w-5 h-5" /></button>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrange" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF7A18" />
                      <stop offset="100%" stopColor="#FF5722" />
                    </linearGradient>
                  </defs>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#111827', fontSize: 13, fontWeight: 600 }} width={110} />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ADVANCED REPORTING SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AdvancedReportCard 
            title="Website Performance" 
            icon={Globe}
            metrics={[
              { label: 'Published', value: '3,204' },
              { label: 'Drafts', value: '450' },
              { label: 'Failed Publishes', value: '12' },
              { label: 'Avg Publish Time', value: '45s' }
            ]}
          />
          <AdvancedReportCard 
            title="Vendor Engagement" 
            icon={Activity}
            metrics={[
              { label: 'Daily Logins', value: '1.2k' },
              { label: 'Avg Edit Time', value: '24m' },
              { label: 'Most Edited', value: 'Header' },
              { label: 'Top AI Prompt', value: '"Make it modern"' }
            ]}
          />
          <AdvancedReportCard 
            title="Product Activity" 
            icon={Box}
            metrics={[
              { label: 'Added Today', value: '430' },
              { label: 'Deleted Today', value: '15' },
              { label: 'Top Category', value: 'Fashion' },
              { label: 'Most Edits', value: 'Pricing' }
            ]}
          />
          <AdvancedReportCard 
            title="AI Usage Report" 
            icon={Bot}
            metrics={[
              { label: 'Prompts Today', value: '8,432' },
              { label: 'Site Gens', value: '145' },
              { label: 'Content Gens', value: '4,200' },
              { label: 'Error Rate', value: '0.4%' }
            ]}
          />
        </div>

        {/* BOTTOM SECTION: Table, Timeline, Leaderboard */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* RECENT REPORTS TABLE */}
          <div className="xl:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Reports</h3>
                <p className="text-gray-500 text-sm">Latest vendor activity and data</p>
              </div>
              <button className="text-sm font-bold text-[#FF7A18] hover:text-[#FF5722] transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Vendor Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Growth</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{row.revenue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                          row.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${row.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                          {row.growth}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#FF7A18] transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-[#FF7A18] transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-sm text-gray-500 font-medium">Showing 1 to 7 of 124 entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold text-gray-400 cursor-not-allowed">Prev</button>
                <button className="px-3 py-1 bg-[#FF7A18] text-white rounded text-sm font-bold shadow-md shadow-[#FF7A18]/30">1</button>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            
            {/* LEADERBOARD */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Trophy className="w-24 h-24 text-[#FF7A18]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Top Performing</h3>
              <div className="space-y-4 relative z-10">
                {[
                  { name: 'Amrutha Bakery', rev: '₹4.2L', medal: 'gold' },
                  { name: 'Glow Beauty', rev: '₹3.8L', medal: 'silver' },
                  { name: 'Urban Fashion', rev: '₹3.5L', medal: 'bronze' },
                  { name: 'Cafe Aroma', rev: '₹2.9L', medal: 'none' },
                  { name: 'Healthy Living', rev: '₹2.4L', medal: 'none' },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B1120] to-gray-700 flex items-center justify-center text-white font-bold shadow-sm">
                        {v.name.charAt(0)}
                      </div>
                      {v.medal !== 'none' && (
                        <div className="absolute -bottom-1 -right-1">
                          <Medal className={`w-5 h-5 ${
                            v.medal === 'gold' ? 'text-yellow-400 fill-yellow-400' :
                            v.medal === 'silver' ? 'text-gray-300 fill-gray-300' :
                            'text-amber-600 fill-amber-600'
                          }`} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm group-hover:text-[#FF7A18] transition-colors">{v.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                        <div className="bg-[#FF7A18] h-1.5 rounded-full" style={{ width: `${100 - (i*15)}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{v.rev}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI INSIGHTS */}
            <div className="bg-gradient-to-br from-[#0B1120] to-[#1e293b] rounded-3xl shadow-xl p-6 relative overflow-hidden text-white group hover:shadow-[0_8px_30px_rgba(11,17,32,0.3)] transition-all">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-bl from-[#FF7A18] to-[#FF5722] rounded-full blur-[50px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                <Sparkles className="w-5 h-5 text-[#FF7A18]" /> AI Insights
              </h3>
              <div className="space-y-4 relative z-10">
                {insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Zap className="w-4 h-4 text-[#FF7A18] mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium leading-snug">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-6">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== activities.length - 1 && <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-gray-100" />}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${act.bg} ${act.color}`}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{act.text}</p>
                      <p className="text-xs text-gray-500 font-medium">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function DollarSignIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
