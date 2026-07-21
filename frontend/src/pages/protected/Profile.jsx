

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FiUser, FiMail, FiBriefcase, FiCalendar, FiAward, 
  FiVideo, FiCamera, FiEdit, FiMapPin, FiPhone,
  FiTrendingUp, FiStar, FiClock, FiCheckCircle,
  FiShield, FiZap, FiUsers, FiMonitor, FiBarChart2,
  FiPieChart, FiTarget, FiActivity, FiSmile, FiThumbsUp,
  FiFileText, FiMessageSquare
} from 'react-icons/fi';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart,
  Line, Area, AreaChart, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend
} from 'recharts';

const Profile = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState({
    user: {},
    summary: { totalReports: 0, approvedReports: 0, pendingReports: 0, revisionReports: 0, approvalRate: 0 },
    production: { videosRecorded: 0, interviewsRecorded: 0, brollClips: 0, photosTaken: 0, videosEdited: 0, reelsProduced: 0, thumbnailsCreated: 0 },
    monthlyTrend: [],
    recentFeedback: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // ✅ FIXED: Use existing stats endpoint instead of non-existent analytics endpoint
      const response = await api.get('/reports/stats');
      
      if (response.data.success && response.data.stats) {
        const stats = response.data.stats;
        
        setAnalytics({
          user: user || {},
          summary: {
            totalReports: stats.totalReports || 0,
            approvedReports: stats.approvedReports || 0,
            pendingReports: stats.pendingReports || 0,
            revisionReports: 0, // Not directly available from stats endpoint
            approvalRate: stats.totalReports > 0 
              ? Math.round((stats.approvedReports / stats.totalReports) * 100) 
              : 0,
          },
          production: {
            videosRecorded: stats.totalVideosRecorded || 0,
            interviewsRecorded: stats.totalInterviewsRecorded || 0,
            brollClips: stats.totalBrollClips || 0,
            photosTaken: stats.totalPhotos || 0,
            videosEdited: stats.totalVideosEdited || 0,
            reelsProduced: stats.totalReelsProduced || 0,
            thumbnailsCreated: stats.totalThumbnails || 0,
          },
          monthlyTrend: [], // Not available from stats endpoint
          recentFeedback: [], // Not available from stats endpoint
          reports: [],
        });
      } else {
        // Fallback to empty stats
        setAnalytics({
          user: user || {},
          summary: { totalReports: 0, approvedReports: 0, pendingReports: 0, revisionReports: 0, approvalRate: 0 },
          production: { videosRecorded: 0, interviewsRecorded: 0, brollClips: 0, photosTaken: 0, videosEdited: 0, reelsProduced: 0, thumbnailsCreated: 0 },
          monthlyTrend: [],
          recentFeedback: [],
          reports: [],
        });
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics');
      
      // Set empty stats on error
      setAnalytics({
        user: user || {},
        summary: { totalReports: 0, approvedReports: 0, pendingReports: 0, revisionReports: 0, approvalRate: 0 },
        production: { videosRecorded: 0, interviewsRecorded: 0, brollClips: 0, photosTaken: 0, videosEdited: 0, reelsProduced: 0, thumbnailsCreated: 0 },
        monthlyTrend: [],
        recentFeedback: [],
        reports: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const productionData = [
    { name: 'Videos', value: analytics.production.videosRecorded || 0 },
    { name: 'Interviews', value: analytics.production.interviewsRecorded || 0 },
    { name: 'B-Roll', value: analytics.production.brollClips || 0 },
    { name: 'Photos', value: analytics.production.photosTaken || 0 },
    { name: 'Edits', value: analytics.production.videosEdited || 0 },
    { name: 'Reels', value: analytics.production.reelsProduced || 0 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
      isDark ? 'bg-[#032e1d]/40 border border-white/5' : 'bg-emerald-50/50 border border-emerald-100/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-emerald-900/20`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            {value}
          </div>
          <div className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
            {label}
          </div>
          {subtitle && <div className={`text-[10px] ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'}`}>
            {subtitle}
          </div>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>My Analytics - TRADE X TV</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
            isDark ? 'text-white' : 'text-emerald-950'
          }`}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <FiBarChart2 className="text-white" size={24} />
            </div>
            My Analytics
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
            Your personal performance metrics and production statistics
          </p>
        </div>

        {/* User Card */}
        <div className={`p-6 rounded-2xl relative overflow-hidden ${
          isDark 
            ? 'bg-[#032e1d]/40 border border-white/5' 
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-emerald-500/30 shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  <FiMail size={14} />
                  {user?.email}
                </span>
                <span className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  <FiBriefcase size={14} />
                  {user?.role?.replace('_', ' ')}
                </span>
                <span className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  <FiCalendar size={14} />
                  ID: {user?.employeeId || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user?.isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark 
                    ? 'bg-white/5 text-emerald-200/60 border border-white/5' 
                    : 'bg-emerald-100/50 text-emerald-800/60 border border-emerald-100'
                }`}>
                  {user?.department || 'Production'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={FiFileText}
            label="Total Reports"
            value={analytics.summary.totalReports || 0}
            color="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Approved"
            value={analytics.summary.approvedReports || 0}
            color="from-emerald-500 to-green-600"
          />
          <StatCard
            icon={FiClock}
            label="Pending"
            value={analytics.summary.pendingReports || 0}
            color="from-amber-500 to-orange-600"
          />
          <StatCard
            icon={FiTrendingUp}
            label="Approval Rate"
            value={`${analytics.summary.approvalRate || 0}%`}
            color="from-purple-500 to-pink-600"
          />
        </div>

        {/* Production Stats */}
        <div className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-[#032e1d]/40 border border-white/5' 
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-emerald-950'
          }`}>
            <FiAward className="text-emerald-500" />
            Production Milestones
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={FiVideo}
              label="Videos Recorded"
              value={analytics.production.videosRecorded || 0}
              color="from-blue-500 to-cyan-600"
            />
            <StatCard
              icon={FiCamera}
              label="Photos Taken"
              value={analytics.production.photosTaken || 0}
              color="from-rose-500 to-pink-600"
            />
            <StatCard
              icon={FiEdit}
              label="Videos Edited"
              value={analytics.production.videosEdited || 0}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              icon={FiStar}
              label="Reels Produced"
              value={analytics.production.reelsProduced || 0}
              color="from-amber-500 to-orange-600"
            />
          </div>
        </div>

        {/* Production Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Production Distribution */}
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              Production Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#032e1d' : '#ffffff',
                      borderColor: isDark ? '#1a3a2a' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Radar */}
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              Performance Radar
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { skill: 'Video Production', value: Math.min(100, (analytics.production.videosRecorded || 0) * 10) },
                  { skill: 'Photography', value: Math.min(100, (analytics.production.photosTaken || 0) * 5) },
                  { skill: 'Editing', value: Math.min(100, (analytics.production.videosEdited || 0) * 10) },
                  { skill: 'Interviews', value: Math.min(100, (analytics.production.interviewsRecorded || 0) * 20) },
                  { skill: 'B-Roll', value: Math.min(100, (analytics.production.brollClips || 0) * 5) },
                  { skill: 'Reels', value: Math.min(100, (analytics.production.reelsProduced || 0) * 20) },
                ]}>
                  <PolarGrid stroke={isDark ? '#1a3a2a' : '#e5e7eb'} />
                  <PolarAngleAxis dataKey="skill" stroke={isDark ? '#6b8a7a' : '#6b7280'} tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis stroke={isDark ? '#6b8a7a' : '#6b7280'} />
                  <Radar name="Performance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Trend - Hidden when no data */}
        {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              Monthly Performance Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1a3a2a' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="_id" 
                    tickFormatter={(value) => `${value.month}/${value.year}`}
                    stroke={isDark ? '#6b8a7a' : '#6b7280'}
                  />
                  <YAxis stroke={isDark ? '#6b8a7a' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#032e1d' : '#ffffff',
                      borderColor: isDark ? '#1a3a2a' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                  />
                  <Line type="monotone" dataKey="reports" stroke="#10b981" name="Reports" />
                  <Line type="monotone" dataKey="videos" stroke="#3b82f6" name="Videos" />
                  <Line type="monotone" dataKey="edits" stroke="#8b5cf6" name="Edits" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Feedback - Hidden when no data */}
        {analytics.recentFeedback && analytics.recentFeedback.length > 0 && (
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              <FiMessageSquare className="text-amber-500" />
              Recent Supervisor Feedback
            </h3>
            <div className="space-y-3">
              {analytics.recentFeedback.map((feedback, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'border-white/5 bg-[#032e1d]/40' 
                    : 'border-emerald-100/50 bg-emerald-50/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                      {format(new Date(feedback.date), 'MMM d, yyyy')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      feedback.status === 'approved' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-emerald-200/80' : 'text-emerald-800/80'}`}>
                    {feedback.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;