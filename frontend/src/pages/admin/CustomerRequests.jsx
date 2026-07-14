
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiArrowRight,
  FiFacebook,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiMusic,
  FiPhone,
  FiGlobe,
  FiSend,
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

const CustomerRequests = () => {
  const { isDark } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);

      // ✅ FIXED: Use correct endpoint - /admin/advertising (not /admin/customer/advertising)
      const response = await api.get(`/admin/advertising?${params}`);
      if (response.data.success) {
        setRequests(response.data.requests);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      }
    } catch (error) {
      console.error('Load requests error:', error);
      toast.error('Failed to load customer requests');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filter, searchTerm]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleReview = async (requestId, action) => {
    if (action === 'reject' && !reviewNotes) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ FIXED: Use correct endpoint - /admin/advertising/:id/review
      const response = await api.put(`/admin/advertising/${requestId}/review`, {
        action,
        notes: reviewNotes,
        finalPrice: action === 'approve' ? parseFloat(reviewNotes.match(/\d+\.?\d*/)?.[0] || 0) : undefined,
      });

      if (response.data.success) {
        toast.success(`Request ${action}d successfully`);
        setReviewNotes('');
        setSelectedRequest(null);
        await loadRequests();
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.error || 'Failed to review request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductionUpdate = async (requestId, status) => {
    setIsSubmitting(true);
    try {
      // ✅ FIXED: Use correct endpoint - /admin/advertising/:id/production
      const response = await api.put(`/admin/advertising/${requestId}/production`, {
        status: status === 'production' ? 'in_production' : status,
      });

      if (response.data.success) {
        toast.success(`Production ${status === 'production' ? 'started' : 'completed'} successfully!`);
        setSelectedRequest(null);
        await loadRequests();
      }
    } catch (error) {
      console.error('Production update error:', error);
      toast.error(error.response?.data?.error || `Failed to ${status === 'production' ? 'start' : 'complete'} production`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination(prev => ({ ...prev, page }));
  };

  const changeLimit = (e) => {
    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/20',
      reviewing: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
      rejected: 'bg-rose-500/20 text-rose-400 border border-rose-500/20',
      in_production: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
      completed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
      revision_required: 'bg-orange-500/20 text-orange-400 border border-orange-500/20',
    };
    return map[status] || 'bg-slate-500/20 text-slate-400 border border-slate-500/20';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-amber-400" />;
      case 'reviewing': return <FiEye className="text-blue-400" />;
      case 'approved': return <FiCheckCircle className="text-emerald-400" />;
      case 'rejected': return <FiXCircle className="text-rose-400" />;
      case 'in_production': return <FiTrendingUp className="text-purple-400" />;
      case 'completed': return <FiCheckCircle className="text-emerald-400" />;
      case 'revision_required': return <FiMessageSquare className="text-orange-400" />;
      default: return <FiClock className="text-slate-400" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending Review',
      reviewing: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      in_production: 'In Production',
      completed: 'Completed',
      revision_required: 'Revision Required',
    };
    return labels[status] || status;
  };

  const toggleExpand = (id) => {
    setSelectedRequest(selectedRequest === id ? null : id);
  };

  // =============================================
  // ✅ SOCIAL MEDIA ICON HELPER
  // =============================================
  const getSocialIcon = (platform) => {
    const icons = {
      facebook: FiFacebook,
      telegram: FiSend,
      linkedin: FiLinkedin,
      instagram: FiInstagram,
      youtube: FiYoutube,
      twitter: FiTwitter,
      tiktok: FiMusic,
    };
    return icons[platform] || null;
  };

  const getSocialColor = (platform) => {
    const colors = {
      facebook: '#1877F2',
      telegram: '#26A5E4',
      linkedin: '#0A66C2',
      instagram: '#E4405F',
      youtube: '#FF0000',
      twitter: '#000000',
      tiktok: '#000000',
    };
    return colors[platform] || '#666';
  };

  // Get ad type label
  const getAdTypeLabel = (value) => {
    const types = {
      starter_visibility: 'Starter Visibility',
      growth_partner: 'Growth Partner',
      strategic_sponsor: 'Strategic Sponsor',
      business_documentary: 'Business Documentary',
      embassy_promotion: 'Embassy Promotion',
      livestream_launch: 'Livestream Launch',
      studio_rental: 'Studio Rental',
      digital_ads: 'Digital Ads Boost',
    };
    return types[value] || value?.replace('_', ' ').toUpperCase() || 'N/A';
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading customer requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Requests - Tradex TV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiUsers className="text-white" size={24} />
              </div>
              Customer Advertising Requests
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Review and manage customer advertising requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              Total: {pagination.total}
            </span>
            <button
              onClick={loadRequests}
              disabled={loading}
              className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
                isDark
                  ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                  : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'
              }`} />
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadRequests()}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                }`}
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
                  : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="reviewing">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in_production">In Production</option>
              <option value="completed">Completed</option>
              <option value="revision_required">Revision Required</option>
            </select>
            <select
              value={pagination.limit}
              onChange={changeLimit}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
                  : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
              }`}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl ${
            isDark
              ? 'bg-[#032e1d]/40 border border-white/5'
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              No Customer Requests Found
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {filter !== 'all'
                ? `No ${filter} requests found.`
                : 'Customers haven\'t submitted any advertising requests yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className={`p-5 rounded-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border border-white/5 hover:border-emerald-500/30'
                    : 'bg-white/60 border border-emerald-100/50 hover:border-emerald-400/30'
                } backdrop-blur-sm`}
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  onClick={() => toggleExpand(request._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      request.status === 'approved' || request.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : request.status === 'pending' || request.status === 'reviewing'
                        ? 'bg-amber-500/20 text-amber-400'
                        : request.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400'
                        : request.status === 'revision_required'
                        ? 'bg-orange-500/20 text-orange-400'
                        : request.status === 'in_production'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                        {request.companyName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>
                          {request.contactPerson}
                        </span>
                        <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>
                          {request.customerId?.email}
                        </span>
                        <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusLabel(request.status)}
                    </span>
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-100/50'
                    }`}>
                      {selectedRequest === request._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {selectedRequest === request._id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-slide-down">
                    {/* Company Information */}
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        Company Information
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Company Name
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {request.companyName}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Industry
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {request.companyIndustry}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Contact Person
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {request.contactPerson}
                          </span>
                        </div>
                        {request.contactPhone && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              <FiPhone className="inline mr-1" size={12} />
                              Phone
                            </span>
                            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                              {request.contactPhoneCode || '+251'} {request.contactPhone}
                            </span>
                          </div>
                        )}
                        {request.companyWebsite && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              <FiGlobe className="inline mr-1" size={12} />
                              Website
                            </span>
                            <a 
                              href={request.companyWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`hover:underline ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                            >
                              {request.companyWebsite}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Media */}
                    {request.socialMedia && Object.values(request.socialMedia).some(v => v) && (
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          Social Media Profiles
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(request.socialMedia).map(([platform, value]) => {
                            if (!value) return null;
                            const Icon = getSocialIcon(platform);
                            const color = getSocialColor(platform);
                            return (
                              <div key={platform} className="flex items-center gap-1.5">
                                {Icon && <Icon size={14} style={{ color }} />}
                                <span className={`text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                                  {platform}: {value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {request.companyDescription && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-white/5' : 'bg-emerald-50/50'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          Company Description
                        </p>
                        <p className={`text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {request.companyDescription}
                        </p>
                      </div>
                    )}

                    {/* Advertising Details */}
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        Advertising Details
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Ad Package
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {getAdTypeLabel(request.adType)}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Budget Range
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {request.budgetRange?.min || 0} - {request.budgetRange?.max || 0} ETB
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Target Age
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {request.targetAudience?.ageGroup || 'All'}
                          </span>
                        </div>
                        {request.targetAudience?.location && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              Target Location
                            </span>
                            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                              {request.targetAudience.location}
                            </span>
                          </div>
                        )}
                        {request.finalPrice && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              Final Price
                            </span>
                            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                              {request.finalPrice.toLocaleString()} ETB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.message && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-white/5' : 'bg-emerald-50/50'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          Customer Message
                        </p>
                        <p className={`text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {request.message}
                        </p>
                      </div>
                    )}

                    {request.supervisorNotes && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                          Supervisor Notes
                        </p>
                        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          {request.supervisorNotes}
                        </p>
                      </div>
                    )}

                    {/* Review Actions - Only for pending requests */}
                    {(request.status === 'pending') && (
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'border-white/5 bg-[#032e1d]/40' : 'border-emerald-100/50 bg-white/40'
                      }`}>
                        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          Review Request
                        </h4>
                        <div className="space-y-3">
                          <textarea
                            placeholder="Add review notes or rejection reason..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
                              isDark
                                ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                                : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                            }`}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleReview(request._id, 'approve')}
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-emerald-500/30 disabled:opacity-50 flex items-center gap-2"
                            >
                              <FiCheckCircle size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(request._id, 'revision')}
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-orange-500/30 disabled:opacity-50 flex items-center gap-2"
                            >
                              <FiMessageSquare size={14} />
                              Request Revision
                            </button>
                            <button
                              onClick={() => handleReview(request._id, 'reject')}
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-rose-500/30 disabled:opacity-50 flex items-center gap-2"
                            >
                              <FiXCircle size={14} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Production Status Update - Only for approved requests */}
                    {request.status === 'approved' && (
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'border-white/5 bg-[#032e1d]/40' : 'border-emerald-100/50 bg-white/40'
                      }`}>
                        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          Production Status
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleProductionUpdate(request._id, 'production')}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-purple-500/30 disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiTrendingUp size={14} />
                            )}
                            Start Production
                          </button>
                        </div>
                      </div>
                    )}

                    {/* In Production Display */}
                    {request.status === 'in_production' && (
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'border-purple-500/20 bg-purple-500/10' : 'border-purple-200 bg-purple-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <FiTrendingUp className="text-purple-500" size={20} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                              In Production
                            </p>
                            <p className={`text-xs ${isDark ? 'text-purple-300/60' : 'text-purple-600/70'}`}>
                              Production is currently in progress
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleProductionUpdate(request._id, 'completed')}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-emerald-500/30 disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheckCircle size={14} />
                            )}
                            Complete Production
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Completed Display */}
                    {request.status === 'completed' && (
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <FiCheckCircle className="text-emerald-500" size={20} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                              ✅ Production Completed
                            </p>
                            <p className={`text-xs ${isDark ? 'text-emerald-300/60' : 'text-emerald-600/70'}`}>
                              This request has been completed
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected Display */}
                    {request.status === 'rejected' && (
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'border-rose-500/20 bg-rose-500/10' : 'border-rose-200 bg-rose-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <FiXCircle className="text-rose-500" size={20} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
                              ❌ Request Rejected
                            </p>
                            {request.supervisorNotes && (
                              <p className={`text-xs mt-1 ${isDark ? 'text-rose-300/60' : 'text-rose-600/70'}`}>
                                Reason: {request.supervisorNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t ${
            isDark ? 'border-white/5' : 'border-emerald-100/50'
          }`}>
            <p className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              Showing {requests.length} of {pagination.total} requests
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-1 ${
                  isDark
                    ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30'
                    : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                }`}
              >
                <FiArrowLeft size={14} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > pagination.pages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-sm font-medium transition-all duration-300 ${
                        pageNum === pagination.page
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                          : isDark
                            ? 'text-emerald-200/60 hover:bg-white/5'
                            : 'text-emerald-800/60 hover:bg-emerald-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                  <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>...</span>
                )}
                
                {pagination.pages > 5 && pagination.page < pagination.pages - 1 && (
                  <button
                    onClick={() => goToPage(pagination.pages)}
                    className={`w-8 h-8 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isDark
                        ? 'text-emerald-200/60 hover:bg-white/5'
                        : 'text-emerald-800/60 hover:bg-emerald-50'
                    }`}
                  >
                    {pagination.pages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-1 ${
                  isDark
                    ? 'border-white/10 text-emerald-200/60 hover:bg-white/5 disabled:opacity-30'
                    : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50 disabled:opacity-30'
                }`}
              >
                Next
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerRequests;