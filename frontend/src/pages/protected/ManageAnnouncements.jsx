
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiBell,
  FiTrash2,
  FiRefreshCw,
  FiFilter,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiFlag,
  FiUsers,
  FiEye,
  FiClock,
  FiMessageSquare,
  FiVolume2,
  FiSearch,
  FiX,
  FiShield,
  FiStar,
  FiChevronRight,
  FiSettings,
} from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

const ManageAnnouncements = () => {
  const { user, isSupervisor } = useAuth();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [preferenceNotificationId, setPreferenceNotificationId] = useState(null);
  const [selectedPreference, setSelectedPreference] = useState('30days');
  const [isUpdatingPreference, setIsUpdatingPreference] = useState(false);

  // Delete preferences options
  const preferences = [
    { value: '20min', label: '20 Minutes', icon: FiClock },
    { value: '1hour', label: '1 Hour', icon: FiClock },
    { value: '6hours', label: '6 Hours', icon: FiClock },
    { value: '12hours', label: '12 Hours', icon: FiClock },
    { value: '1day', label: '1 Day', icon: FiClock },
    { value: '3days', label: '3 Days', icon: FiClock },
    { value: '7days', label: '7 Days', icon: FiClock },
    { value: '14days', label: '14 Days', icon: FiClock },
    { value: '30days', label: '30 Days', icon: FiClock },
    { value: 'never', label: 'Never Delete', icon: FiShield },
  ];

  useEffect(() => {
    loadAllNotifications();
  }, []);

  const loadAllNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/all');
      
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

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/notifications/${id}`);
      if (response.data.success) {
        toast.success('Notification deleted permanently');
        setNotifications(prev => prev.filter(n => n._id !== id));
        setShowDeleteModal(false);
        setDeletingId(null);
      } else {
        toast.error(response.data.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to delete notification';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handlePreferenceChange = async (notificationId, deleteAfter) => {
    setIsUpdatingPreference(true);
    try {
      const response = await api.put(`/notifications/${notificationId}/delete-preference`, {
        deleteAfter: deleteAfter,
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.map(n => {
          if (n._id === notificationId) {
            return { ...n, deleteAfter: deleteAfter };
          }
          return n;
        }));
        
        const prefLabel = preferences.find(p => p.value === deleteAfter)?.label || deleteAfter;
        toast.success(`Auto-delete set to ${prefLabel}`);
        setShowPreferenceModal(false);
        setPreferenceNotificationId(null);
      }
    } catch (error) {
      console.error('Update preference error:', error);
      toast.error(error.response?.data?.error || 'Failed to update preference');
    } finally {
      setIsUpdatingPreference(false);
    }
  };

  const openPreferenceModal = (notification) => {
    setPreferenceNotificationId(notification._id);
    setSelectedPreference(notification.deleteAfter || '30days');
    setShowPreferenceModal(true);
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

  const getTypeIcon = (type) => {
    const icons = {
      announcement: FiVolume2,
      system: FiInfo,
      reminder: FiBell,
      feedback: FiMessageSquare,
      alert: FiAlertCircle,
    };
    return icons[type] || FiBell;
  };

  // =============================================
  // FIX: CORE FILTERING FUNCTIONS - PROPERLY IMPLEMENTED
  // =============================================

  // Check if notification is read by the current user
  const isRead = (notification) => {
    if (!notification || !user) return false;
    return notification.readBy?.some((r) => r.userId === user?.id) || false;
  };

  // Check if notification is personal to the current user
  const isPersonalToUser = (notification) => {
    if (!notification || !user) return false;
    // A notification is personal if:
    // 1. targetAudience is 'specific' AND
    // 2. targetUsers array includes the current user's ID
    if (notification.targetAudience === 'specific') {
      return notification.targetUsers?.some(id => id === user?.id) || false;
    }
    return false;
  };

  // Check if notification is public (sent to everyone)
  const isPublic = (notification) => {
    if (!notification) return false;
    return notification.targetAudience === 'all';
  };

  // Check if user can delete this notification
  const canDelete = (notification) => {
    if (!notification || !user) return false;
    // Cannot delete notifications you sent to yourself
    if (notification.sentBy === user?.id) {
      return false;
    }
    return true;
  };

  // Check if user can change preference for this notification
  const canChangePreference = (notification) => {
    if (!notification || !user) return false;
    // Cannot change preference for notifications you sent to yourself
    if (notification.sentBy === user?.id) {
      return false;
    }
    return true;
  };

  // Get delete preference label
  const getDeletePreferenceLabel = (deleteAfter) => {
    const pref = preferences.find(p => p.value === deleteAfter);
    return pref ? pref.label : '30 Days';
  };

  // =============================================
  // FIX: FILTER LOGIC - COMPLETE RE-WRITE
  // =============================================
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((notification) => {
      // =============================================
      // STEP 1: Apply search filter
      // =============================================
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          notification.title?.toLowerCase().includes(term) ||
          notification.message?.toLowerCase().includes(term) ||
          notification.type?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // =============================================
      // STEP 2: Apply status filter
      // =============================================
      const isReadStatus = isRead(notification);
      const isPersonalStatus = isPersonalToUser(notification);
      const isPublicStatus = isPublic(notification);

      switch (filter) {
        case 'all':
          return true;

        case 'unread':
          return !isReadStatus;

        case 'read':
          return isReadStatus;

        case 'personal':
          return isPersonalStatus;

        case 'public':
          return isPublicStatus;

        default:
          return true;
      }
    });
  }, [notifications, filter, searchTerm]);

  // =============================================
  // COMPUTED STATS
  // =============================================
  const stats = React.useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !isRead(n)).length;
    const read = notifications.filter(n => isRead(n)).length;
    const personal = notifications.filter(n => isPersonalToUser(n)).length;
    const publicNotif = notifications.filter(n => isPublic(n)).length;
    return { total, unread, read, personal, public: publicNotif };
  }, [notifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Announcements - TRADE X TV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
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
              Manage Announcements
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {isSupervisor 
                ? 'Manage all team announcements' 
                : 'Manage all notifications'}
            </p>
          </div>
          <button
            onClick={loadAllNotifications}
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

        {/* ============================================= */}
        {/* STATS BAR WITH FILTERS */}
        {/* ============================================= */}
        <div
          className={`p-4 rounded-2xl ${
            isDark
              ? 'bg-[#032e1d]/40 border border-white/5'
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Total: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {stats.total}
                  </span>
                </span>
              </div>
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Unread: <span className="font-bold text-amber-500">
                    {stats.unread}
                  </span>
                </span>
              </div>
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Read: <span className="font-bold text-emerald-500">
                    {stats.read}
                  </span>
                </span>
              </div>
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Personal: <span className="font-bold text-purple-500">
                    {stats.personal}
                  </span>
                </span>
              </div>
              <div>
                <span className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                  Public: <span className="font-bold text-blue-500">
                    {stats.public}
                  </span>
                </span>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'
              }`} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                }`}
              />
            </div>
            
            {/* Filter Dropdown */}
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
                <option value="all">All ({stats.total})</option>
                <option value="unread">Unread ({stats.unread})</option>
                <option value="read">Read ({stats.read})</option>
                <option value="personal">Personal ({stats.personal})</option>
                <option value="public">Public ({stats.public})</option>
              </select>
            </div>
          </div>
        </div>

        {/* ============================================= */}
        {/* NOTIFICATIONS LIST */}
        {/* ============================================= */}
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
              No Notifications Found
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              {searchTerm 
                ? 'No notifications match your search.' 
                : filter === 'unread' 
                ? '🎉 You have no unread notifications!' 
                : filter === 'read' 
                ? 'You have no read notifications.' 
                : filter === 'personal' 
                ? 'You have no personal notifications.' 
                : filter === 'public' 
                ? 'There are no public announcements.' 
                : 'There are no notifications to manage.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
                className={`mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-white/5 text-emerald-200/60 hover:bg-white/10'
                    : 'bg-emerald-50 text-emerald-800/60 hover:bg-emerald-100'
                }`}
              >
                Show all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const PriorityIcon = getPriorityIcon(notification.priority);
              const TypeIcon = getTypeIcon(notification.type);
              const read = isRead(notification);
              const isSelected = selectedId === notification._id;
              const canUserDelete = canDelete(notification);
              const canUserChangePref = canChangePreference(notification);
              const isPublicNotif = isPublic(notification);
              const isPersonalNotif = isPersonalToUser(notification);
              const prefLabel = getDeletePreferenceLabel(notification.deleteAfter || '30days');
              const isSelfSent = notification.sentBy === user?.id;

              return (
                <div
                  key={notification._id}
                  className={`p-5 rounded-2xl transition-all duration-300 ${
                    isDark
                      ? `bg-[#032e1d]/40 border ${
                          isSelected ? 'border-emerald-500/40' : 'border-white/5'
                        } hover:border-emerald-500/30`
                      : `bg-white/60 border ${
                          isSelected ? 'border-emerald-400/40' : 'border-emerald-100/50'
                        } hover:border-emerald-400/30`
                  } ${!read ? (isDark ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-emerald-500') : ''}`}
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
                          {isPublicNotif && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">
                              Public
                            </span>
                          )}
                          {isPersonalNotif && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">
                              Personal
                            </span>
                          )}
                          {isSelfSent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">
                              Self-Sent
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

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
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
                          {isPublicNotif ? 'All Team Members' : 'Specific Users'}
                        </span>
                        {notification.sentBy && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            <FiMessageSquare size={12} />
                            From: {notification.sentBy?.firstName} {notification.sentBy?.lastName}
                          </span>
                        )}
                        {read && (
                          <span className={`flex items-center gap-1 text-emerald-500`}>
                            <FiEye size={12} />
                            Read
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                            isDark
                              ? 'bg-white/5 text-emerald-200/40 border border-white/5'
                              : 'bg-emerald-50 text-emerald-800/40 border border-emerald-100'
                          }`}
                        >
                          <FiClock size={10} />
                          Auto-delete: {prefLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {canUserChangePref && !isSelfSent && (
                        <button
                          onClick={() => openPreferenceModal(notification)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-white/5 text-emerald-200/40 hover:text-emerald-300' : 'hover:bg-emerald-50 text-emerald-800/40 hover:text-emerald-700'
                          }`}
                          title="Change auto-delete preference"
                        >
                          <FiSettings size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedId(isSelected ? null : notification._id);
                          if (!read) {
                            api.put(`/notifications/${notification._id}/read`).catch(() => {});
                          }
                        }}
                        className={`p-2 rounded-lg transition-colors ${
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
                      {canUserDelete && !isSelfSent && (
                        <button
                          onClick={() => confirmDelete(notification._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-rose-500/10 text-rose-400 hover:text-rose-300' : 'hover:bg-rose-100 text-rose-500 hover:text-rose-600'
                          }`}
                          title="Delete permanently"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                      {isSelfSent && (
                        <div
                          className={`p-2 rounded-lg opacity-40 cursor-not-allowed ${
                            isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'
                          }`}
                          title="Cannot delete notifications you sent"
                        >
                          <FiTrash2 size={18} />
                        </div>
                      )}
                    </div>
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
                            Auto-Delete
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {getDeletePreferenceLabel(notification.deleteAfter || '30days')}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`block text-xs ${
                              isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'
                            }`}
                          >
                            Audience
                          </span>
                          <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                            {isPublicNotif ? 'All Team Members' : `${notification.targetUsers?.length || 0} specific user(s)`}
                          </span>
                        </div>
                        <div className="col-span-2 mt-2 flex flex-wrap gap-2">
                          {!isSelfSent && canUserDelete && (
                            <button
                              onClick={() => confirmDelete(notification._id)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                isDark
                                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20'
                                  : 'bg-rose-100 text-rose-600 hover:bg-rose-200 border border-rose-200'
                              }`}
                            >
                              <FiTrash2 size={16} />
                              Delete Permanently
                            </button>
                          )}
                          {!isSelfSent && canUserChangePref && (
                            <button
                              onClick={() => openPreferenceModal(notification)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                isDark
                                  ? 'bg-white/5 text-emerald-200/60 hover:bg-white/10 border border-white/5'
                                  : 'bg-emerald-50 text-emerald-800/60 hover:bg-emerald-100 border border-emerald-100'
                              }`}
                            >
                              <FiSettings size={16} />
                              Change Auto-Delete
                            </button>
                          )}
                          {isSelfSent && (
                            <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                              ℹ️ You cannot delete or modify notifications you sent to yourself.
                            </p>
                          )}
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

      {/* ============================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-[#032e1d] border border-white/5'
              : 'bg-white border border-emerald-100'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-rose-500/20">
                  <FiAlertCircle className="text-rose-500" size={28} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    Delete Notification
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p className={`text-sm mb-6 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                Are you sure you want to permanently delete this notification? This will remove it from all users' views.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingId(null);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                      : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
                  }`}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={18} />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* PREFERENCE SETTINGS MODAL */}
      {/* ============================================= */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
            isDark
              ? 'bg-[#032e1d] border border-white/5'
              : 'bg-white border border-emerald-100'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <FiSettings className="text-emerald-500" size={28} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    Auto-Delete Preference
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                    Choose when this notification should be automatically deleted
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 mb-4">
                {preferences.map((pref) => {
                  const Icon = pref.icon;
                  const isSelected = selectedPreference === pref.value;
                  return (
                    <button
                      key={pref.value}
                      onClick={() => setSelectedPreference(pref.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? isDark
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : isDark
                            ? 'text-emerald-200/60 hover:bg-white/5'
                            : 'text-emerald-800/60 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-emerald-500' : ''} />
                      <span>{pref.label}</span>
                      {isSelected && (
                        <span className="ml-auto text-emerald-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPreferenceModal(false);
                    setPreferenceNotificationId(null);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                      : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
                  }`}
                  disabled={isUpdatingPreference}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePreferenceChange(preferenceNotificationId, selectedPreference)}
                  disabled={isUpdatingPreference}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdatingPreference ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Save Preference
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAnnouncements;