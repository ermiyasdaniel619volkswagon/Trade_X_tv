

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  FiPlus,
  FiSave,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiFileText,
  FiBriefcase,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTarget,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiFacebook,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiMusic,
  FiSend,
} from 'react-icons/fi';

// =============================================
// ✅ COUNTRY CODES
// =============================================
const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: '+1 (US/CA)' },
  { code: '+44', country: 'UK', label: '+44 (UK)' },
  { code: '+251', country: 'ET', label: '+251 (Ethiopia)' },
  { code: '+254', country: 'KE', label: '+254 (Kenya)' },
  { code: '+256', country: 'UG', label: '+256 (Uganda)' },
  { code: '+255', country: 'TZ', label: '+255 (Tanzania)' },
  { code: '+250', country: 'RW', label: '+250 (Rwanda)' },
  { code: '+234', country: 'NG', label: '+234 (Nigeria)' },
  { code: '+27', country: 'ZA', label: '+27 (South Africa)' },
  { code: '+33', country: 'FR', label: '+33 (France)' },
  { code: '+49', country: 'DE', label: '+49 (Germany)' },
  { code: '+39', country: 'IT', label: '+39 (Italy)' },
  { code: '+34', country: 'ES', label: '+34 (Spain)' },
  { code: '+55', country: 'BR', label: '+55 (Brazil)' },
  { code: '+91', country: 'IN', label: '+91 (India)' },
  { code: '+86', country: 'CN', label: '+86 (China)' },
  { code: '+81', country: 'JP', label: '+81 (Japan)' },
  { code: '+61', country: 'AU', label: '+61 (Australia)' },
  { code: '+7', country: 'RU', label: '+7 (Russia)' },
  { code: '+20', country: 'EG', label: '+20 (Egypt)' },
];

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agreement, setAgreement] = useState(null);
  const [formStep, setFormStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: '',
    companyIndustry: '',
    companyDescription: '',
    companyWebsite: '',
    contactPerson: '',
    contactPhone: '',
    contactPhoneCode: '+251',
    adType: 'tv_spot',
    packageType: 'standard',
    duration: 4,
    frequency: 'daily',
    targetAudience: {
      ageGroup: 'all',
      location: '',
      interests: [],
    },
    budgetRange: {
      min: 0,
      max: 0,
    },
    agreementAccepted: false,
    socialMedia: {
      facebook: '',
      telegram: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      twitter: '',
      tiktok: '',
    }
  });

  const [errors, setErrors] = useState({});

  const adTypes = [
    { value: 'tv_spot', label: 'TV Spot' },
    { value: 'radio_ad', label: 'Radio Ad' },
    { value: 'digital_campaign', label: 'Digital Campaign' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'custom', label: 'Custom Package' },
  ];

  const packageTypes = [
    { value: 'basic', label: 'Basic', price: '$500' },
    { value: 'standard', label: 'Standard', price: '$1,200' },
    { value: 'premium', label: 'Premium', price: '$2,500' },
    { value: 'enterprise', label: 'Enterprise', price: 'Custom' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi_weekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const ageGroups = [
    { value: 'all', label: 'All Ages' },
    { value: '18-24', label: '18-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45-54', label: '45-54' },
    { value: '55+', label: '55+' },
  ];

  const industries = [
    'Agriculture',
    'Construction',
    'Education',
    'Energy',
    'Finance',
    'Healthcare',
    'Hospitality',
    'Manufacturing',
    'Media',
    'Real Estate',
    'Retail',
    'Technology',
    'Telecommunications',
    'Transportation',
    'Other',
  ];

  useEffect(() => {
    loadAgreement();
  }, []);

  const loadAgreement = async () => {
    try {
      const response = await api.get('/customer/agreement/latest');
      if (response.data.success) {
        setAgreement(response.data.agreement);
      }
    } catch (error) {
      console.error('Failed to load agreement:', error);
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 5;
  };

  const validateSocialMedia = (platform, value) => {
    if (!value) return true;
    
    switch (platform) {
      case 'facebook':
        return /^[a-zA-Z0-9._]{1,50}$/.test(value);
      case 'telegram':
        return /^[a-zA-Z0-9_]{1,32}$/.test(value);
      case 'linkedin':
        return /^[a-zA-Z0-9-]{1,100}$/.test(value);
      case 'instagram':
        return /^[a-zA-Z0-9_.]{1,30}$/.test(value);
      case 'youtube':
        return /^[a-zA-Z0-9_-]{1,50}$/.test(value);
      case 'twitter':
        return /^[a-zA-Z0-9_]{1,15}$/.test(value);
      case 'tiktok':
        return /^[a-zA-Z0-9_.]{1,30}$/.test(value);
      default:
        return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const cleaned = value.replace(/[^0-9+]/g, '');
    setFormData(prev => ({ ...prev, contactPhone: cleaned }));
    if (errors.contactPhone) {
      setErrors(prev => ({ ...prev, contactPhone: '' }));
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      }
    }));
    if (errors[`socialMedia_${platform}`]) {
      setErrors(prev => ({ ...prev, [`socialMedia_${platform}`]: '' }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleBudgetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      budgetRange: {
        ...prev.budgetRange,
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (formStep === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.companyIndustry) newErrors.companyIndustry = 'Industry is required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
      
      if (formData.contactPhone && !validatePhoneNumber(formData.contactPhone)) {
        newErrors.contactPhone = 'Please enter a valid phone number';
      }

      // Validate social media fields
      Object.entries(formData.socialMedia).forEach(([key, value]) => {
        if (value && !validateSocialMedia(key, value)) {
          newErrors[`socialMedia_${key}`] = `Invalid ${key} username format`;
        }
      });
    }

    if (formStep === 2) {
      if (!formData.adType) newErrors.adType = 'Advertising type is required';
      if (!formData.duration || formData.duration < 1) newErrors.duration = 'Duration is required';
    }

    if (formStep === 3) {
      if (!formData.agreementAccepted) {
        newErrors.agreementAccepted = 'You must accept the agreement';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setFormStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);
    try {
      const createResponse = await api.post('/customer/advertising', formData);

      if (createResponse.data.success) {
        const requestId = createResponse.data.request._id;

        const submitResponse = await api.post(`/customer/advertising/${requestId}/submit`, {
          agreementAccepted: formData.agreementAccepted,
          signature: true,
        });

        if (submitResponse.data.success) {
          toast.success('Advertising request submitted successfully!');
          setFormData({
            companyName: '',
            companyIndustry: '',
            companyDescription: '',
            companyWebsite: '',
            contactPerson: '',
            contactPhone: '',
            contactPhoneCode: '+251',
            adType: 'tv_spot',
            packageType: 'standard',
            duration: 4,
            frequency: 'daily',
            targetAudience: {
              ageGroup: 'all',
              location: '',
              interests: [],
            },
            budgetRange: {
              min: 0,
              max: 0,
            },
            agreementAccepted: false,
            socialMedia: {
              facebook: '',
              telegram: '',
              linkedin: '',
              instagram: '',
              youtube: '',
              twitter: '',
              tiktok: '',
            }
          });
          setFormStep(1);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const socialMediaFields = [
    { key: 'facebook', icon: FiFacebook, label: 'Facebook', placeholder: 'username', color: '#1877F2' },
    { key: 'telegram', icon: FiSend, label: 'Telegram', placeholder: '@username', color: '#26A5E4' },
    { key: 'linkedin', icon: FiLinkedin, label: 'LinkedIn', placeholder: 'username', color: '#0A66C2' },
    { key: 'instagram', icon: FiInstagram, label: 'Instagram', placeholder: '@username', color: '#E4405F' },
    { key: 'youtube', icon: FiYoutube, label: 'YouTube', placeholder: 'channel_id', color: '#FF0000' },
    { key: 'twitter', icon: FiTwitter, label: 'Twitter/X', placeholder: '@username', color: '#000000' },
    { key: 'tiktok', icon: FiMusic, label: 'TikTok', placeholder: '@username', color: '#000000' },
  ];

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Company Name *
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
          } ${errors.companyName ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
          placeholder="Enter your company name"
        />
        {errors.companyName && (
          <p className="text-xs text-rose-400 mt-1">{errors.companyName}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Industry *
        </label>
        <select
          name="companyIndustry"
          value={formData.companyIndustry}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
          } ${errors.companyIndustry ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
        >
          <option value="">Select Industry</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        {errors.companyIndustry && (
          <p className="text-xs text-rose-400 mt-1">{errors.companyIndustry}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Contact Person *
        </label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
          } ${errors.contactPerson ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
          placeholder="Full name of contact person"
        />
        {errors.contactPerson && (
          <p className="text-xs text-rose-400 mt-1">{errors.contactPerson}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          <FiPhone className="inline mr-1.5" size={14} />
          Contact Phone
        </label>
        <div className="flex gap-2">
          <select
            value={formData.contactPhoneCode}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPhoneCode: e.target.value }))}
            className={`w-32 px-3 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
              isDark
                ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
                : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
            }`}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handlePhoneChange}
            maxLength="9"  
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
              isDark
                ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
            } ${errors.contactPhone ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
            placeholder="Enter phone number"
          />
        </div>
        {errors.contactPhone && (
          <p className="text-xs text-rose-400 mt-1">{errors.contactPhone}</p>
        )}
        <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'}`}>
          Enter phone number with country code
        </p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          <FiGlobe className="inline mr-1.5" size={14} />
          Company Website
        </label>
        <input
          type="url"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
          }`}
          placeholder="https://www.example.com"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Social Media Profiles
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialMediaFields.map((field) => {
            const Icon = field.icon;
            const value = formData.socialMedia[field.key] || '';
            const error = errors[`socialMedia_${field.key}`];
            
            return (
              <div key={field.key}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} style={{ color: field.color }} />
                  <span className={`text-xs ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                    {field.label}
                  </span>
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleSocialMediaChange(field.key, e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                    isDark
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  } ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
                  placeholder={field.placeholder}
                />
                {error && (
                  <p className="text-xs text-rose-400 mt-0.5">{error}</p>
                )}
              </div>
            );
          })}
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'}`}>
          Enter your social media usernames (without @ symbol)
        </p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Company Description
        </label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleInputChange}
          rows="3"
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
          }`}
          placeholder="Brief description of your company and what you do..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Advertising Type *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {adTypes.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, adType: type.value }))}
              className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                formData.adType === type.value
                  ? isDark
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
                    : 'bg-emerald-50/50 border-emerald-100/50 text-emerald-800/60 hover:bg-emerald-100/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        {errors.adType && (
          <p className="text-xs text-rose-400 mt-1">{errors.adType}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Package Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {packageTypes.map(pkg => (
            <button
              key={pkg.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, packageType: pkg.value }))}
              className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                formData.packageType === pkg.value
                  ? isDark
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
                    : 'bg-emerald-50/50 border-emerald-100/50 text-emerald-800/60 hover:bg-emerald-100/50'
              }`}
            >
              <div className="font-semibold">{pkg.label}</div>
              <div className="text-xs opacity-60">{pkg.price}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Duration (weeks) *
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          min="1"
          max="52"
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
          } ${errors.duration ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
          placeholder="Number of weeks"
        />
        {errors.duration && (
          <p className="text-xs text-rose-400 mt-1">{errors.duration}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-2">
          {frequencies.map(freq => (
            <button
              key={freq.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, frequency: freq.value }))}
              className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                formData.frequency === freq.value
                  ? isDark
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
                    : 'bg-emerald-50/50 border-emerald-100/50 text-emerald-800/60 hover:bg-emerald-100/50'
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Target Age Group
        </label>
        <select
          value={formData.targetAudience.ageGroup}
          onChange={(e) => handleNestedChange('targetAudience', 'ageGroup', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDark
              ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white'
              : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
          }`}
        >
          {ageGroups.map(group => (
            <option key={group.value} value={group.value}>{group.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'}`}>
          Budget Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>Min ($)</label>
            <input
              type="number"
              value={formData.budgetRange.min}
              onChange={(e) => handleBudgetChange('min', e.target.value)}
              min="0"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                  : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
              }`}
              placeholder="0"
            />
          </div>
          <div>
            <label className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>Max ($)</label>
            <input
              type="number"
              value={formData.budgetRange.max}
              onChange={(e) => handleBudgetChange('max', e.target.value)}
              min="0"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark
                  ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30'
                  : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
              }`}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <FiInfo className="text-amber-500 mt-0.5" size={20} />
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Please read the agreement carefully
            </p>
            <p className={`text-xs ${isDark ? 'text-amber-300/60' : 'text-amber-600/70'}`}>
              By accepting, you agree to the terms and conditions of the advertising service.
            </p>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border max-h-60 overflow-y-auto ${
        isDark ? 'bg-[#032e1d]/40 border-white/10' : 'bg-emerald-50/50 border-emerald-100'
      }`}>
        {agreement ? (
          <div className="prose prose-sm max-w-none" style={{ color: isDark ? '#D0D0D0' : '#1A1A1A' }}>
            <div dangerouslySetInnerHTML={{ __html: agreement.content }} />
            <p className="text-xs mt-4 opacity-50">Version: {agreement.version}</p>
          </div>
        ) : (
          <p className={`text-sm ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
            Loading agreement...
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ borderColor: errors.agreementAccepted ? '#f43f5e' : isDark ? '#333333' : '#E8E8E0' }}
      >
        <input
          type="checkbox"
          checked={formData.agreementAccepted}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, agreementAccepted: e.target.checked }));
            if (errors.agreementAccepted) {
              setErrors(prev => ({ ...prev, agreementAccepted: '' }));
            }
          }}
          className="mt-0.5 w-4 h-4 rounded border-2 border-emerald-500/30 text-emerald-600 focus:ring-emerald-500 transition-all duration-200"
        />
        <div>
          <label className={`text-sm font-medium cursor-pointer ${isDark ? 'text-white' : 'text-emerald-950'}`}>
            I have read and accept the terms and conditions
          </label>
          <p className={`text-xs ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
            By checking this box, you agree to the advertising service agreement
          </p>
          {errors.agreementAccepted && (
            <p className="text-xs text-rose-400 mt-1">{errors.agreementAccepted}</p>
          )}
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-emerald-500" size={18} />
          <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Digital signature will be applied upon submission
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
      }`}>
        <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
          Review Your Request
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Company</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>{formData.companyName || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Industry</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>{formData.companyIndustry || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Ad Type</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
              {adTypes.find(t => t.value === formData.adType)?.label || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Package</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
              {packageTypes.find(p => p.value === formData.packageType)?.label || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Duration</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>{formData.duration} weeks</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Budget Range</span>
            <span className={isDark ? 'text-white' : 'text-emerald-950'}>
              ${formData.budgetRange.min} - ${formData.budgetRange.max}
            </span>
          </div>
          {formData.contactPhone && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Phone</span>
              <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                {formData.contactPhoneCode} {formData.contactPhone}
              </span>
            </div>
          )}
          {Object.entries(formData.socialMedia).some(([_, value]) => value) && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>Social Media</span>
              <span className={isDark ? 'text-white' : 'text-emerald-950'}>
                {Object.entries(formData.socialMedia).filter(([_, value]) => value).map(([key, value]) => (
                  <span key={key} className="inline-block mr-2">{key}: {value}</span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-amber-500 mt-0.5" size={20} />
          <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
            Once submitted, your request will be reviewed by our team. You will receive a notification about the decision.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (formStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (formStep) {
      case 1: return 'Company Information';
      case 2: return 'Advertising Details';
      case 3: return 'Agreement';
      case 4: return 'Review & Submit';
      default: return '';
    }
  };

  const getStepIcon = () => {
    switch (formStep) {
      case 1: return <FiBriefcase size={18} />;
      case 2: return <FiTarget size={18} />;
      case 3: return <FiFileText size={18} />;
      case 4: return <FiCheckCircle size={18} />;
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>New Advertising Request - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiPlus className="text-white" size={24} />
              </div>
              New Advertising Request
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Submit a new advertising request for your business
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step <= formStep
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                      : isDark
                        ? 'bg-white/5 text-emerald-200/30'
                        : 'bg-emerald-100/50 text-emerald-800/30'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-2 transition-all duration-300 ${
                      step < formStep
                        ? 'bg-emerald-500'
                        : isDark
                          ? 'bg-white/10'
                          : 'bg-emerald-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>Company</span>
            <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>Details</span>
            <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>Agreement</span>
            <span className={isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}>Review</span>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-[#032e1d]/40 border border-white/5'
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {getStepIcon()}
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              {getStepTitle()}
            </h2>
            <span className={`text-xs ml-auto ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
              Step {formStep} of 4
            </span>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
            <button
              onClick={prevStep}
              disabled={formStep === 1}
              className={`px-6 py-2.5 rounded-xl border transition-all duration-300 ${
                formStep === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : isDark
                    ? 'border-white/10 text-emerald-200/60 hover:bg-white/5'
                    : 'border-emerald-100 text-emerald-800/60 hover:bg-emerald-50'
              }`}
            >
              <FiArrowLeft className="inline mr-1" size={16} />
              Previous
            </button>

            {formStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                Next
                <FiArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiCheck size={18} />
                    Submit Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;