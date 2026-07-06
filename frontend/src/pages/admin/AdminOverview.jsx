

import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FiUsers, FiFileText, FiCheckCircle, FiPackage, FiTrendingUp, 
  FiArrowUp, FiArrowDown, FiClock, FiVideo, FiCamera,
  FiAward, FiStar, FiBarChart2, FiRefreshCw
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext.jsx';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    reports: { total: 0, pending: 0, approved: 0, today: 0, approvalRate: 0 },
    equipment: { total: 0, available: 0 },
    recentReports: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useTheme();

  // ✅ useRef to prevent multiple API calls on mount
  const isFirstLoad = useRef(true);

  // ✅ Load stats on mount - ONLY ONCE
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadStats();
    }
  }, []); // ← Empty dependency array - runs once

  const loadStats = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const response = await api.get('/admin/dashboard/stats');
      
      // =============================================
      // FIX: Handle nested data structure correctly
      // =============================================
      if (response.data.success && response.data.stats) {
        setStats(response.data.stats);
      } else {
        console.warn('Unexpected stats response structure:', response.data);
        setStats({
          users: { total: 0, active: 0 },
          reports: { total: 0, pending: 0, approved: 0, today: 0, approvalRate: 0 },
          equipment: { total: 0, available: 0 },
          recentReports: [],
        });
      }
    } catch (error) {
      if (!silent) toast.error('Failed to load dashboard stats');
      console.error('Stats loading error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const KPI = ({ icon: Icon, label, value, subtitle, trend, color }) => (
    <div className={`p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      isDark 
        ? 'bg-[#032e1d]/60 border border-white/5 hover:border-emerald-500/30' 
        : 'bg-white/80 border border-emerald-100/50 hover:border-emerald-400/30'
    } backdrop-blur-sm shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
            {label}
          </p>
          <p className={`text-2xl md:text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            {value !== undefined && value !== null ? value : 0}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/40'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-emerald-900/20`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Overview - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              Command Center
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Real-time studio operations and team performance dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadStats(false)}
              disabled={refreshing}
              className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
                isDark 
                  ? 'border-white/10 text-emerald-200/60 hover:bg-white/5' 
                  : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
              } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              isDark 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              <FiCheckCircle size={12} />
              Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI
            icon={FiUsers}
            label="Active Team"
            value={stats.users?.active}
            subtitle={`${stats.users?.total || 0} total members`}
            color="from-emerald-500 to-teal-600"
          />
          <KPI
            icon={FiFileText}
            label="Pending Reports"
            value={stats.reports?.pending}
            subtitle={`${stats.reports?.today || 0} today`}
            color="from-amber-500 to-orange-600"
          />
          <KPI
            icon={FiCheckCircle}
            label="Approved Reports"
            value={stats.reports?.approved}
            subtitle={`${stats.reports?.approvalRate || 0}% approval rate`}
            color="from-emerald-500 to-green-600"
          />
          <KPI
            icon={FiPackage}
            label="Available Equipment"
            value={stats.equipment?.available}
            subtitle={`${stats.equipment?.total || 0} total`}
            color="from-rose-500 to-pink-600"
          />
        </div>

        <div className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-[#032e1d]/40 border border-white/5' 
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              Recent Reports
            </h3>
          </div>
          {stats.recentReports && stats.recentReports.length === 0 ? (
            <p className={`text-center py-8 ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              No recent reports
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left border-b ${isDark ? 'text-emerald-200/40 border-white/5' : 'text-emerald-800/40 border-emerald-100'}`}>
                    <th className="pb-3 pr-4 font-medium">Employee</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentReports || []).map((report) => (
                    <tr key={report._id} className={`border-b ${isDark ? 'border-white/5' : 'border-emerald-100/50'} hover:bg-white/5 transition-colors`}>
                      <td className="py-3 pr-4">
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {report.userId?.firstName} {report.userId?.lastName}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                          {report.userId?.employeeId}
                        </div>
                      </td>
                      <td className={`py-3 pr-4 ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                        {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          report.status === 'approved' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                            : report.status === 'pending' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                            : report.status === 'revision_required'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                            : 'bg-red-500/20 text-red-400 border border-red-500/20'
                        }`}>
                          {report.status === 'revision_required' ? 'Revision' : report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOverview;