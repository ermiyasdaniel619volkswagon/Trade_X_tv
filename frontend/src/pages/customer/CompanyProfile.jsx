import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiGlobe,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit2,
  FiFileText,
} from 'react-icons/fi';

const CompanyProfile = () => {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    phone: '',
    companyName: '',
    companyIndustry: '',
    companyDescription: '',
    companyWebsite: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer/profile');
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (profile.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(profile.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await api.put('/customer/profile', profile);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Update auth context with new profile data
        await login(user.email, user.password);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Company Profile - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiUser className="text-white" size={24} />
              </div>
              Company Profile
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Manage your company information and contact details
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
              isDark
                ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
            }`}
          >
            {isEditing ? (
              <>
                <FiCheckCircle size={16} />
                Cancel Editing
              </>
            ) : (
              <>
                <FiEdit2 size={16} />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Form */}
        <div className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                  <FiMail className="inline mr-1.5" size={14} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  } ${errors.email ? 'border-rose-500/50 focus:ring-rose-500/30' : ''} ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                  <FiPhone className="inline mr-1.5" size={14} />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  } ${errors.phone ? 'border-rose-500/50 focus:ring-rose-500/30' : ''} ${
                    !isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                <FiBriefcase className="inline mr-1.5" size={14} />
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                Industry
              </label>
              <input
                type="text"
                name="companyIndustry"
                value={profile.companyIndustry || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Industry"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                <FiGlobe className="inline mr-1.5" size={14} />
                Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={profile.companyWebsite || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
                Company Description
              </label>
              <textarea
                name="companyDescription"
                value={profile.companyDescription || ''}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Brief description of your company..."
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadProfile();
                  }}
                  className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                      : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Info */}
        <div className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            Account Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                Account Type
              </span>
              <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                Customer
              </span>
            </div>
            <div>
              <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                Status
              </span>
              <span className="text-emerald-500 flex items-center gap-1.5">
                <FiCheckCircle size={14} />
                Active
              </span>
            </div>
            <div>
              <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                Member Since
              </span>
              <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className={`block text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                Last Login
              </span>
              <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;