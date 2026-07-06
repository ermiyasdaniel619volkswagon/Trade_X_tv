

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FiSend, 
  FiBell, 
  FiSettings as FiSettingsIcon,
  FiAlertCircle
} from 'react-icons/fi';

const Settings = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Announcement state
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    priority: 'medium',
    targetAudience: 'all',
    targetUsers: [],
    deleteAfter: '30days',
  });

  // =============================================
  // ANNOUNCEMENT HANDLERS
  // =============================================
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    
    if (!announcement.title.trim() || !announcement.message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: announcement.title.trim(),
        message: announcement.message.trim(),
        priority: announcement.priority,
        type: 'announcement',
        targetAudience: announcement.targetAudience,
        targetUsers: announcement.targetUsers,
        deleteAfter: announcement.deleteAfter,
        isActive: true,
        createdBy: user?._id || user?.id || 'admin',
      };

      const response = await api.post('/notifications', payload);

      if (response.data.success) {
        toast.success('✅ Announcement sent successfully!');
        setAnnouncement({
          title: '',
          message: '',
          priority: 'medium',
          targetAudience: 'all',
          targetUsers: [],
          deleteAfter: '30days',
        });
      } else {
        toast.error(response.data.error || 'Failed to send announcement');
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      toast.error(error.response?.data?.error || 'Failed to send announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
            isDark ? 'text-white' : 'text-emerald-950'
          }`}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 shadow-lg shadow-slate-500/20">
              <FiSettingsIcon className="text-white" size={24} />
            </div>
            Settings
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
            Send announcements to team members
          </p>
        </div>

        <div className="max-w-3xl">
          {/* ============================================= */}
          {/* ANNOUNCEMENT FORM */}
          {/* ============================================= */}
          <div className={`p-6 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <FiBell className="text-white" size={16} />
              </div>
              Send Announcement
            </h2>
            <p className={`text-sm mb-4 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Send announcements to all team members or specific users
            </p>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  placeholder="Enter announcement title..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Message
                </label>
                <textarea
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[100px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  placeholder="Enter announcement message..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Priority
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAnnouncement({...announcement, priority: p})}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all duration-300 capitalize ${
                        announcement.priority === p
                          ? isDark
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                          : isDark
                            ? 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
                            : 'bg-emerald-50/50 border-emerald-100/50 text-emerald-800/60 hover:bg-emerald-100/50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional: Target Audience */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Target Audience
                </label>
                <select
                  value={announcement.targetAudience}
                  onChange={(e) => setAnnouncement({...announcement, targetAudience: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
                  }`}
                >
                  <option value="all">All Users</option>
                  <option value="admins">Admins Only</option>
                  <option value="users">Regular Users Only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Announcement
                  </>
                )}
              </button>
            </form>

            <div className={`mt-4 p-3 rounded-xl text-xs ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}>
              <FiAlertCircle size={14} className="inline mr-1.5" />
              Announcements will be sent to all team members via notification.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;