

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiList,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiRefreshCw,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiInfo,
  FiPackage,
  FiTrendingUp,
  FiEdit2,
  FiTrash2,
  FiSend,
  FiPhone,
  FiGlobe,
  FiFacebook,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiMusic,
  FiTarget,
  FiMail,
  FiMessageSquare,
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

const MyRequests = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [pagination.page, filter]);

  // =============================================
  // LOAD REQUESTS
  // =============================================
  const loadRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (filter !== 'all') params.append('status', filter);

      const response = await api.get(`/customer/advertising?${params}`);
      if (response.data.success) {
        setRequests(response.data.requests || []);
        setPagination({
          ...pagination,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // DELETE REQUEST
  // =============================================
  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.delete(`/customer/advertising/${requestId}`);
      if (response.data.success) {
        toast.success('Request cancelled successfully');
        loadRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =============================================
  // SUBMIT REQUEST FOR REVIEW
  // =============================================
  const handleSubmit = async (requestId) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(`/customer/advertising/${requestId}/submit`);
      if (response.data.success) {
        toast.success('Request submitted for review!');
        loadRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =============================================
  // ✅ EDIT REQUEST - Navigate to Dashboard with edit mode
  // =============================================
  const handleEdit = (request) => {
    // Store the request data in localStorage or state to edit
    // For now, we'll navigate to the dashboard with the request ID
    // You can implement this based on your routing
    toast.success('Edit functionality - Redirecting to edit form...');
    // Navigate to dashboard with edit mode
    // window.location.href = `/customer/dashboard?edit=${request._id}`;
    
    // For now, show a message
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FiEdit2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Edit Request
              </p>
              <p className="text-sm text-gray-500">
                Edit functionality is available on the Dashboard page.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Click "New Request" and select "Edit" on your request.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // =============================================
  // SOCIAL MEDIA HELPERS
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

  const getSocialLabel = (platform) => {
    const labels = {
      facebook: 'Facebook',
      telegram: 'Telegram',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      youtube: 'YouTube',
      twitter: 'Twitter/X',
      tiktok: 'TikTok',
    };
    return labels[platform] || platform;
  };

  // =============================================
  // STATUS HELPERS
  // =============================================
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
      default: return <FiInfo className="text-slate-400" />;
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

  // =============================================
  // GET AD TYPE LABEL
  // =============================================
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading your requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Advertising Requests - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiList className="text-white" size={24} />
              </div>
              My Requests
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Track and manage your advertising requests
            </p>
          </div>
          <button
            onClick={loadRequests}
            className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
              isDark
                ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
            }`}
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter */}
        <div className={`p-4 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'} size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
                }`}
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending Review</option>
                <option value="reviewing">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_production">In Production</option>
                <option value="completed">Completed</option>
                <option value="revision_required">Revision Required</option>
              </select>
            </div>
            <div className="flex-1" />
            <span className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              {pagination.total} total
            </span>
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
              No Requests Found
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {filter !== 'all'
                ? 'No requests match the selected filter.'
                : 'You haven\'t submitted any advertising requests yet.'}
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
                {/* HEADER */}
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
                      <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </p>
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
                      {expandedId === request._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {expandedId === request._id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-slide-down">
                    
                    {/* Company Information */}
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <FiBriefcase className="inline mr-1.5" size={12} />
                        Company Information
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Company Name
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {request.companyName}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Industry
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {request.companyIndustry}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            <FiUser className="inline mr-1" size={12} />
                            Contact Person
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {request.contactPerson}
                          </span>
                        </div>
                        
                        {request.contactPhone && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              <FiPhone className="inline mr-1" size={12} />
                              Phone
                            </span>
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
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
                              className={`font-medium hover:underline ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                            >
                              {request.companyWebsite.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Media */}
                    {request.socialMedia && Object.values(request.socialMedia).some(v => v) && (
                      <div>
                        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          <FiSend className="inline mr-1.5" size={12} />
                          Social Media Profiles
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {Object.entries(request.socialMedia).map(([platform, value]) => {
                            if (!value) return null;
                            const Icon = getSocialIcon(platform);
                            const color = getSocialColor(platform);
                            const label = getSocialLabel(platform);
                            return (
                              <div key={platform} className="flex items-center gap-1.5">
                                {Icon && <Icon size={14} style={{ color }} />}
                                <span className={`text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                                  <span className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                                    {label}:
                                  </span>{' '}
                                  {value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Company Description */}
                    {request.companyDescription && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-white/5' : 'bg-emerald-50/50'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          <FiFileText className="inline mr-1.5" size={12} />
                          Company Description
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {request.companyDescription}
                        </p>
                      </div>
                    )}

                    {/* Advertising Details */}
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <FiTarget className="inline mr-1.5" size={12} />
                        Advertising Details
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            Ad Package
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {getAdTypeLabel(request.adType)}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            <FiDollarSign className="inline mr-1" size={12} />
                            Budget Range
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {request.budgetRange?.min || 0} - {request.budgetRange?.max || 0} ETB
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                            <FiTarget className="inline mr-1" size={12} />
                            Target Age
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {request.targetAudience?.ageGroup || 'All Ages'}
                          </span>
                        </div>
                        {request.targetAudience?.location && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              <FiGlobe className="inline mr-1" size={12} />
                              Target Location
                            </span>
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                              {request.targetAudience.location}
                            </span>
                          </div>
                        )}
                        {request.finalPrice && (
                          <div>
                            <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              Final Price
                            </span>
                            <span className={`font-medium text-emerald-400`}>
                              {request.finalPrice.toLocaleString()} ETB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Supervisor Notes */}
                    {request.supervisorNotes && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                          <FiMessageSquare className="inline mr-1.5" size={12} />
                          Supervisor Notes
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          {request.supervisorNotes}
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {request.status === 'rejected' && request.supervisorNotes && (
                      <div className={`p-3 rounded-xl ${
                        isDark ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'
                      }`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
                          <FiXCircle className="inline mr-1.5" size={12} />
                          Rejection Reason
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                          {request.supervisorNotes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {/* ✅ EDIT BUTTON - Now using toast.success instead of toast.info */}
                      {(request.status === 'pending' || request.status === 'revision_required') && (
                        <button
                          onClick={() => {
                            // Navigate to dashboard with edit mode
                            toast.success('Redirecting to edit form...');
                            // Store request data in sessionStorage and redirect
                            sessionStorage.setItem('editRequestId', request._id);
                            window.location.href = '/customer/dashboard';
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isDark
                              ? 'bg-white/5 text-emerald-200/60 hover:bg-white/10'
                              : 'bg-emerald-50 text-emerald-800/60 hover:bg-emerald-100'
                          }`}
                        >
                          <FiEdit2 size={14} />
                          Edit Request
                        </button>
                      )}

                      {/* SUBMIT BUTTON - Only for pending requests */}
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleSubmit(request._id)}
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isDark
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          } disabled:opacity-50`}
                        >
                          {isSubmitting ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiSend size={14} />
                          )}
                          Submit for Review
                        </button>
                      )}

                      {/* DELETE BUTTON - Only for pending requests */}
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(request._id)}
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isDark
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          } disabled:opacity-50`}
                        >
                          <FiTrash2 size={14} />
                          Cancel Request
                        </button>
                      )}
                      
                      {/* Status Messages */}
                      {request.status === 'pending' && (
                        <span className={`text-sm flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          <FiClock size={16} />
                          ⏳ Waiting for review...
                        </span>
                      )}
                      
                      {request.status === 'reviewing' && (
                        <span className={`text-sm flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          <FiEye size={16} />
                          🔍 Under review by supervisor...
                        </span>
                      )}
                      
                      {request.status === 'approved' && (
                        <span className={`text-sm flex items-center gap-2 text-emerald-500`}>
                          <FiCheckCircle size={16} />
                          ✅ Approved! Production will start soon.
                        </span>
                      )}
                      
                      {request.status === 'in_production' && (
                        <span className={`text-sm flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                          <FiTrendingUp size={16} />
                          🎬 In production...
                        </span>
                      )}
                      
                      {request.status === 'completed' && (
                        <span className={`text-sm flex items-center gap-2 text-emerald-500`}>
                          <FiCheckCircle size={16} />
                          ✅ Completed! Thank you for your business.
                        </span>
                      )}
                      
                      {request.status === 'rejected' && (
                        <span className={`text-sm flex items-center gap-2 text-rose-500`}>
                          <FiXCircle size={16} />
                          ❌ Rejected. Please contact support.
                        </span>
                      )}

                      {request.status === 'revision_required' && (
                        <span className={`text-sm flex items-center gap-2 text-orange-500`}>
                          <FiMessageSquare size={16} />
                          🔄 Revision required. Please update and resubmit.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className={`flex items-center justify-between gap-4 pt-4 border-t ${
            isDark ? 'border-white/5' : 'border-emerald-100/50'
          }`}>
            <p className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              Showing {requests.length} of {pagination.total}
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

export default MyRequests;