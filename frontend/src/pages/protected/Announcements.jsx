
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiBell,
  FiMessageSquare,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiFilter,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiFlag,
  FiStar,
  FiUsers,
  FiEye,
  FiChevronRight,
  FiBookOpen,
  FiVolume2,   // ← MAKE SURE THIS IS IMPORTED
  FiMail,
  FiShield,
  FiTag,
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

// ... rest of the component code remains the same ...
const Announcements = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');

      if (response.data.success) {
        const sorted = (response.data.notifications || []).sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setNotifications(sorted);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => {
          if (n._id === id) {
            const isRead = n.readBy?.some((r) => r.userId === user?.id);
            if (!isRead) {
              return {
                ...n,
                readBy: [...(n.readBy || []), { userId: user?.id, readAt: new Date() }],
              };
            }
          }
          return n;
        })
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'from-red-500 to-rose-600 border-red-500/30',
      high: 'from-amber-500 to-orange-600 border-amber-500/30',
      medium: 'from-blue-500 to-cyan-600 border-blue-500/30',
      low: 'from-emerald-500 to-teal-600 border-emerald-500/30',
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: FiAlertCircle,
      high: FiFlag,
      medium: FiInfo,
      low: FiCheckCircle,
    };
    return icons[priority] || FiInfo;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      urgent: 'Urgent',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    return labels[priority] || 'Medium';
  };

  // FIX: Use FiVolume2 instead of FiMegaphone
  const getTypeIcon = (type) => {
    const icons = {
      announcement: FiVolume2, // Changed from FiMegaphone
      system: FiInfo,
      reminder: FiBell,
      feedback: FiMessageSquare,
      alert: FiAlertCircle,
    };
    return icons[type] || FiBell;
  };

  const isRead = (notification) => {
    return notification.readBy?.some((r) => r.userId === user?.id) || false;
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !isRead(n);
    if (filter === 'read') return isRead(n);
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Announcements - Tradex TV</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
                isDark ? 'text-white' : 'text-emerald-950'
              }`}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiBell className="text-white" size={24} />
              </div>
              Announcements
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Stay updated with the latest announcements from your supervisor
            </p>
          </div>
          <button
            onClick={loadNotifications}
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

        <div
          className={`p-4 rounded-2xl ${
            isDark
              ? 'bg-[#032e1d]/40 border border-white/5'
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Total: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {notifications.length}
                  </span>
                </span>
              </div>
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Unread: <span className="font-bold text-amber-500">
                    {notifications.filter((n) => !isRead(n)).length}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
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
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl ${
              isDark
                ? 'bg-[#032e1d]/40 border border-white/5'
                : 'bg-white/60 border border-emerald-100/50'
            } backdrop-blur-sm`}
          >
            <div className="text-5xl mb-4">📭</div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              No Announcements
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {filter === 'all'
                ? 'There are no announcements at the moment.'
                : filter === 'unread'
                ? 'You have no unread announcements.'
                : 'You have no read announcements.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const PriorityIcon = getPriorityIcon(notification.priority);
              const TypeIcon = getTypeIcon(notification.type);
              const read = isRead(notification);
              const isSelected = selectedId === notification._id;

              return (
                <div
                  key={notification._id}
                  className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isDark
                      ? `bg-[#032e1d]/40 border ${
                          isSelected ? 'border-emerald-500/40' : 'border-white/5'
                        } hover:border-emerald-500/30`
                      : `bg-white/60 border ${
                          isSelected ? 'border-emerald-400/40' : 'border-emerald-100/50'
                        } hover:border-emerald-400/30`
                  } ${!read ? (isDark ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-emerald-500') : ''}`}
                  onClick={() => {
                    setSelectedId(isSelected ? null : notification._id);
                    if (!read) markAsRead(notification._id);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${getPriorityColor(
                        notification.priority
                      )} shadow-lg`}
                    >
                      <PriorityIcon className="text-white" size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                            {notification.title}
                          </h3>
                          {!read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              isDark
                                ? 'bg-white/5 text-emerald-200/60 border border-white/5'
                                : 'bg-emerald-100/50 text-emerald-800/60 border border-emerald-100'
                            }`}
                          >
                            {getPriorityLabel(notification.priority)}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            <FiClock size={12} />
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm mt-2 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                          }`}
                        >
                          <TypeIcon size={12} />
                          {notification.type}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                          }`}
                        >
                          <FiUsers size={12} />
                          {notification.targetAudience === 'all' ? 'All Team Members' : notification.targetAudience}
                        </span>
                        {notification.sentBy && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            <FiMessageSquare size={12} />
                            From Supervisor
                          </span>
                        )}
                        {read && (
                          <span className={`flex items-center gap-1 text-emerald-500`}>
                            <FiEye size={12} />
                            Read
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50'
                      }`}
                    >
                      <FiChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${
                          isSelected ? 'rotate-90' : ''
                        } ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}
                      />
                    </button>
                  </div>

                  {isSelected && (
                    <div
                      className={`mt-4 pt-4 border-t ${
                        isDark ? 'border-white/5' : 'border-emerald-100/50'
                      } animate-slide-down`}
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span
                            className={`block text-xs ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            Sent
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {format(new Date(notification.createdAt), 'PPP p')}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`block text-xs ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            Priority
                          </span>
                          <span className="flex items-center gap-1">
                            <PriorityIcon
                              size={14}
                              className={
                                notification.priority === 'urgent'
                                  ? 'text-red-500'
                                  : notification.priority === 'high'
                                  ? 'text-amber-500'
                                  : notification.priority === 'medium'
                                  ? 'text-blue-500'
                                  : 'text-emerald-500'
                              }
                            />
                            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                              {getPriorityLabel(notification.priority)}
                            </span>
                          </span>
                        </div>
                        <div>
                          <span
                            className={`block text-xs ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            Type
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`block text-xs ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            Audience
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {notification.targetAudience === 'all' ? 'All Team Members' : notification.targetAudience}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Announcements;