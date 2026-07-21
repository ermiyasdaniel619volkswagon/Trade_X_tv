import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
} from "react-icons/fi";

const CustomerManagement = () => {
  const { user: currentUser } = useAuth();
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCode: "+251",
    companyName: "",
    companyIndustry: "",
    companyDescription: "",
    companyWebsite: "",
    socialMedia: {
      facebook: "",
      telegram: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      twitter: "",
      tiktok: "",
    },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadCustomers();
    loadStats();
  }, [pagination.page, searchTerm, statusFilter]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("isActive", statusFilter);

      const response = await api.get(`/admin/customers?${params}`);
      if (response.data.success) {
        setCustomers(response.data.customers);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      }
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/customers/statistics");
      if (response.data.success) {
        setStats(response.data.statistics);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/admin/customers/${editingCustomer._id}`, formData);
        toast.success("Customer updated successfully");
      }
      setShowForm(false);
      setEditingCustomer(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        phoneCode: "+251",
        companyName: "",
        companyIndustry: "",
        companyDescription: "",
        companyWebsite: "",
        socialMedia: {
          facebook: "",
          telegram: "",
          linkedin: "",
          instagram: "",
          youtube: "",
          twitter: "",
          tiktok: "",
        },
      });
      loadCustomers();
      loadStats();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save customer");
      console.error(error);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      phoneCode: customer.phoneCode || "+251",
      companyName: customer.companyName || "",
      companyIndustry: customer.companyIndustry || "",
      companyDescription: customer.companyDescription || "",
      companyWebsite: customer.companyWebsite || "",
      socialMedia: {
        facebook: customer.socialMedia?.facebook || "",
        telegram: customer.socialMedia?.telegram || "",
        linkedin: customer.socialMedia?.linkedin || "",
        instagram: customer.socialMedia?.instagram || "",
        youtube: customer.socialMedia?.youtube || "",
        twitter: customer.socialMedia?.twitter || "",
        tiktok: customer.socialMedia?.tiktok || "",
      },
    });
    setShowForm(true);
  };

  const handleToggleActive = async (customer) => {
    try {
      await api.patch(`/admin/customers/${customer._id}/toggle`);
      toast.success(
        `Customer ${customer.isActive ? "deactivated" : "activated"} successfully`,
      );
      loadCustomers();
      loadStats();
    } catch (error) {
      toast.error("Failed to toggle customer status");
      console.error(error);
    }
  };

  const handleDeleteCustomer = async (customer) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      )
    ) return;

    try {
      await api.delete(`/admin/customers/${customer._id}`);
      toast.success("Customer deleted successfully");
      loadCustomers();
      loadStats();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewMode('detail');
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
          isDark
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
            : "bg-emerald-100 text-emerald-700 border border-emerald-200"
        }`}>
          <FiUserCheck size={12} />
          Active
        </span>
      );
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
        isDark
          ? "bg-rose-500/20 text-rose-400 border border-rose-500/20"
          : "bg-rose-100 text-rose-700 border border-rose-200"
      }`}>
        <FiUserX size={12} />
        Inactive
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-400',
      approved: 'text-emerald-400',
      revision_required: 'text-orange-400',
      rejected: 'text-red-400',
      in_production: 'text-blue-400',
      completed: 'text-purple-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-400">{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-zinc-50'}`}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );

  // ============ DETAIL VIEW ============
  if (viewMode === 'detail' && selectedCustomer) {
    return (
      <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
        <Helmet>
          <title>Customer Details - TRADE X TV Admin</title>
        </Helmet>

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedCustomer(null);
            }}
            className={`mb-6 px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${
              isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <FiChevronDown className="rotate-90" size={16} />
            Back to Customers
          </button>

          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h1>
                <p className="text-sm text-zinc-400">{selectedCustomer.email}</p>
                {selectedCustomer.companyName && (
                  <p className="text-sm text-emerald-400">{selectedCustomer.companyName}</p>
                )}
              </div>
              {getStatusBadge(selectedCustomer.isActive)}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Personal Info</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                  <p className="text-sm text-zinc-400">{selectedCustomer.email}</p>
                  {selectedCustomer.phone && (
                    <p className="text-sm text-zinc-400">
                      {selectedCustomer.phoneCode} {selectedCustomer.phone}
                    </p>
                  )}
                </div>
                {selectedCustomer.companyName && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Company</h3>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      {selectedCustomer.companyName}
                    </p>
                    {selectedCustomer.companyIndustry && (
                      <p className="text-sm text-zinc-400">{selectedCustomer.companyIndustry}</p>
                    )}
                    {selectedCustomer.companyWebsite && (
                      <a href={selectedCustomer.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        {selectedCustomer.companyWebsite}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Account Info</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    Joined: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Total Requests: {selectedCustomer.requestCount || 0}
                  </p>
                </div>
                {selectedCustomer.requestStatuses && Object.keys(selectedCustomer.requestStatuses).length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Request Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedCustomer.requestStatuses).map(([status, count]) => (
                        <span key={status} className={`text-xs ${getStatusColor(status)}`}>
                          {status}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedCustomer.companyDescription && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-2">Company Description</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {selectedCustomer.companyDescription}
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
              <button
                onClick={() => handleEditCustomer(selectedCustomer)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <FiEdit2 size={16} /> Edit Customer
              </button>
              <button
                onClick={() => handleToggleActive(selectedCustomer)}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  selectedCustomer.isActive
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                }`}
              >
                {selectedCustomer.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                {selectedCustomer.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ LIST VIEW ============
  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? "text-emerald-200/60" : "text-emerald-800/60"}>
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Management - TRADE X TV Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-emerald-950"
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiUsers className="text-white" size={24} />
              </div>
              Customer Management
            </h1>
            <p className={`text-sm mt-1 ${isDark ? "text-emerald-200/50" : "text-emerald-800/50"}`}>
              Manage all registered customers and their activity
            </p>
          </div>
          <button
            onClick={loadCustomers}
            className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
              isDark
                ? "border-white/10 text-emerald-200/60 hover:bg-white/5"
                : "border-emerald-100 text-emerald-800/60 hover:bg-emerald-50"
            }`}
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Customers" value={stats.totalCustomers} color="#10B981" icon={FiUsers} />
            <StatCard label="Active" value={stats.activeCustomers} color="#10B981" icon={FiUserCheck} />
            <StatCard label="Inactive" value={stats.inactiveCustomers} color="#EF4444" icon={FiUserX} />
            <StatCard label="Total Requests" value={stats.totalRequests} color="#3B82F6" icon={FiTrendingUp} />
          </div>
        )}

        {/* Search and Filters */}
        <div className={`p-4 rounded-2xl ${
          isDark
            ? "bg-[#032e1d]/40 border border-white/5"
            : "bg-white/60 border border-emerald-100/50"
        } backdrop-blur-sm`}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? "text-emerald-200/30" : "text-emerald-800/30"
              }`} />
              <input
                type="text"
                placeholder="Search by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                  : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
              }`}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              onClick={loadCustomers}
              className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? "border-white/10 text-emerald-200/60 hover:bg-white/5"
                  : "border-emerald-100 text-emerald-800/60 hover:bg-emerald-50"
              }`}
            >
              <FiRefreshCw size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Edit Customer Form */}
        {showForm && (
          <div className={`p-6 rounded-2xl animate-slide-down ${
            isDark
              ? "bg-[#032e1d]/40 border border-white/5"
              : "bg-white/60 border border-emerald-100/50"
          } backdrop-blur-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-emerald-950"}`}>
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
                required
                disabled={!!editingCustomer}
              />
              <div className="flex gap-2">
                <select
                  value={formData.phoneCode}
                  onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                  className={`px-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark
                      ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white"
                      : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950"
                  }`}
                >
                  <option value="+251">+251</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark
                      ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                      : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
              <input
                type="text"
                placeholder="Industry"
                value={formData.companyIndustry}
                onChange={(e) => setFormData({ ...formData, companyIndustry: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
              <input
                type="url"
                placeholder="Website"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                className={`px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
              <textarea
                placeholder="Company Description"
                value={formData.companyDescription}
                onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                rows="2"
                className={`md:col-span-2 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? "bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30"
                    : "bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30"
                }`}
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20"
                >
                  {editingCustomer ? "Update Customer" : "Create Customer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCustomer(null);
                  }}
                  className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "border-white/10 text-emerald-200/60 hover:bg-white/5"
                      : "border-emerald-100 text-emerald-800/60 hover:bg-emerald-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Customers Table */}
        <div className={`p-6 rounded-2xl overflow-x-auto ${
          isDark
            ? "bg-[#032e1d]/40 border border-white/5"
            : "bg-white/60 border border-emerald-100/50"
        } backdrop-blur-sm`}>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-emerald-950"}`}>
                No Customers Found
              </h3>
              <p className={`text-sm mt-1 ${isDark ? "text-emerald-200/50" : "text-emerald-800/50"}`}>
                No registered customers match your filters.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left border-b ${
                  isDark
                    ? "text-emerald-200/40 border-white/5"
                    : "text-emerald-800/40 border-emerald-100"
                }`}>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Company</th>
                  <th className="pb-3 pr-4 font-medium">Requests</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`border-b ${
                      isDark ? "border-white/5" : "border-emerald-100/50"
                    } hover:bg-white/5 transition-colors`}
                  >
                    <td className="py-3 pr-4">
                      <div className={`font-medium ${isDark ? "text-white" : "text-emerald-950"}`}>
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className={`text-xs ${isDark ? "text-emerald-200/40" : "text-emerald-800/40"}`}>
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className={`text-sm ${isDark ? "text-white" : "text-emerald-950"}`}>
                        {customer.companyName || "N/A"}
                      </div>
                      {customer.companyIndustry && (
                        <div className={`text-xs ${isDark ? "text-emerald-200/40" : "text-emerald-800/40"}`}>
                          {customer.companyIndustry}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <FiTrendingUp className="text-emerald-400" size={14} />
                        <span className={`font-medium ${isDark ? "text-white" : "text-emerald-950"}`}>
                          {customer.requestCount || 0}
                        </span>
                      </div>
                      {customer.requestStatuses && Object.keys(customer.requestStatuses).length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {Object.entries(customer.requestStatuses).map(([status, count]) => (
                            <span key={status} className={`text-[10px] ${getStatusColor(status)}`}>
                              {status.slice(0, 3)}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {getStatusBadge(customer.isActive)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className={`text-xs ${isDark ? "text-emerald-200/40" : "text-emerald-800/40"}`}>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-white/5 text-emerald-200/40 hover:text-white"
                              : "hover:bg-emerald-100 text-emerald-800/40 hover:text-emerald-950"
                          }`}
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-white/5 text-emerald-200/40 hover:text-white"
                              : "hover:bg-emerald-100 text-emerald-800/40 hover:text-emerald-950"
                          }`}
                          title="Edit Customer"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(customer)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-white/5 text-emerald-200/40 hover:text-white"
                              : "hover:bg-emerald-100 text-emerald-800/40 hover:text-emerald-950"
                          }`}
                          title={customer.isActive ? "Deactivate" : "Activate"}
                        >
                          {customer.isActive ? <FiUserX size={15} /> : <FiUserCheck size={15} />}
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? "hover:bg-rose-500/10 text-emerald-200/40 hover:text-rose-400"
                              : "hover:bg-rose-100 text-emerald-800/40 hover:text-rose-600"
                          }`}
                          title="Delete Customer"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className={`flex items-center justify-between gap-4 pt-4 border-t ${
            isDark ? 'border-white/5' : 'border-emerald-100/50'
          }`}>
            <p className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              Showing {customers.length} of {pagination.total} customers
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 ${
                  isDark
                    ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30'
                    : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                }`}
              >
                Previous
              </button>
              <span className={`text-sm px-3 ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 ${
                  isDark
                    ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30'
                    : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerManagement;