
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FiCalendar, FiChevronDown, FiChevronUp, FiCheckCircle, 
  FiClock, FiAlertCircle, FiFilter, FiSearch, FiList,
  FiFileText, FiEye, FiStar
} from 'react-icons/fi';
import { format } from 'date-fns';

const MyHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filter, setFilter] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    loadReports();
  }, [pagination.page, filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (filter) params.append('status', filter);

      const response = await api.get(`/reports/my?${params}`);
      setReports(response.data.reports);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      });
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/20',
      approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
      revision_required: 'bg-rose-500/20 text-rose-400 border border-rose-500/20',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/20',
    };
    return map[status] || 'bg-slate-500/20 text-slate-400 border border-slate-500/20';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle className="text-emerald-400" />;
      case 'pending': return <FiClock className="text-amber-400" />;
      case 'revision_required': return <FiAlertCircle className="text-rose-400" />;
      default: return <FiClock className="text-slate-400" />;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My History - Tradex TV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiClock className="text-white" size={24} />
              </div>
              My History
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Review your past submissions and feedback
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'
              }`} size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                  isDark 
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white' 
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
                }`}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="revision_required">Revision Required</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <div className="text-4xl mb-4">📋</div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              No Reports Found
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              You haven't submitted any reports yet. Start by logging your daily activities.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className={`p-5 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-[#032e1d]/40 border border-white/5 hover:border-emerald-500/30' 
                  : 'bg-white/60 border border-emerald-100/50 hover:border-emerald-400/30'
              } backdrop-blur-sm`}>
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  onClick={() => toggleExpand(report._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      report.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : report.status === 'pending' 
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {getStatusIcon(report.status)}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                        {format(new Date(report.date), 'EEEE, MMM d, yyyy')}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                        {format(new Date(report.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusBadge(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status.replace('_', ' ')}
                    </span>
                    <button className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-100/50'
                    }`}>
                      {expandedId === report._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {expandedId === report._id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-slide-down">
                    {/* Content Production Summary */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                        Content Production
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        {[
                          { label: 'Videos', value: report.contentProduction?.videosRecorded || 0 },
                          { label: 'Interviews', value: report.contentProduction?.interviewsRecorded || 0 },
                          { label: 'B-Roll', value: report.contentProduction?.brollClipsCaptured || 0 },
                          { label: 'Photos', value: report.contentProduction?.photosTaken || 0 },
                        ].map((item, index) => (
                          <div key={index} className={`p-3 rounded-xl text-center ${
                            isDark ? 'bg-[#032e1d]/40' : 'bg-emerald-50/50'
                          }`}>
                            <span className={`block text-lg font-bold ${
                              isDark ? 'text-white' : 'text-emerald-950'
                            }`}>
                              {item.value}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EOD */}
                    {report.eod?.accomplishments && (
                      <div>
                        <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                          Accomplishments
                        </h4>
                        <p className={`text-sm rounded-xl p-3 ${
                          isDark ? 'bg-[#032e1d]/40 text-emerald-200/80' : 'bg-emerald-50/50 text-emerald-800/80'
                        }`}>
                          {report.eod.accomplishments}
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {report.supervisorFeedback && (
                      <div className={`p-4 rounded-xl border ${
                        isDark 
                          ? 'bg-amber-500/10 border-amber-500/20' 
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <h4 className={`text-sm font-semibold mb-1 flex items-center gap-2 ${
                          isDark ? 'text-amber-400' : 'text-amber-700'
                        }`}>
                          <FiAlertCircle size={16} />
                          Supervisor Feedback
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                          {report.supervisorFeedback}
                        </p>
                        {report.reviewedAt && (
                          <p className={`text-xs mt-2 ${isDark ? 'text-amber-400/60' : 'text-amber-600/70'}`}>
                            Reviewed: {format(new Date(report.reviewedAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className={`flex items-center justify-between gap-4 pt-4 border-t ${
                isDark ? 'border-white/5' : 'border-emerald-100/50'
              }`}>
                <p className={`text-sm ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                  Showing {reports.length} of {pagination.total} reports
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
        )}
      </div>
    </>
  );
};

export default MyHistory;