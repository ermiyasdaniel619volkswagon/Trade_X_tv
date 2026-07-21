

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { 
  FiBriefcase, FiLayers, FiUsers, FiFileText, 
  FiArrowRight, FiArrowLeft, FiCheck, FiInfo, 
  FiClock, FiDollarSign, FiTag, FiEye, FiCalendar,
  FiPlus, FiEdit, FiTrash2, FiRefreshCw
} from 'react-icons/fi';

// =============================================
// SERVICES ARRAY
// =============================================
const SERVICES = [
  { 
    value: 'starter_visibility', 
    label: 'Starter Visibility', 
    price: '15,000 ETB / week', 
    desc: '5x weekly TV ads + social media post', 
    badge: 'High Engagement' 
  },
  { 
    value: 'growth_partner', 
    label: 'Growth Partner', 
    price: '35,000 ETB / week', 
    desc: 'Ads + logo on screen + guest appearance', 
    badge: 'Popular Choice' 
  },
  { 
    value: 'strategic_sponsor', 
    label: 'Strategic Sponsor', 
    price: '150K - 250K ETB / mo', 
    desc: 'Full program premium sponsorship slots', 
    badge: 'Enterprise Core' 
  },
  { 
    value: 'business_documentary', 
    label: 'Business Documentary', 
    price: '80K - 150K ETB', 
    desc: 'High-definition customized company profile film', 
    badge: 'Brand Focus' 
  },
  { 
    value: 'embassy_promotion', 
    label: 'Embassy Promotion', 
    price: '250K - 450K ETB', 
    desc: 'Country-focused thematic week content coverage', 
    badge: 'Global Scale' 
  },
  { 
    value: 'livestream_launch', 
    label: 'Livestream Launch', 
    price: '20K - 45K ETB / sess', 
    desc: 'Live multi-platform product launching broadcast', 
    badge: 'Instant Leads' 
  },
  { 
    value: 'studio_rental', 
    label: 'Studio Rental', 
    price: '4,500 ETB / session', 
    desc: '1-hour professional multi-cam studio recording', 
    badge: 'Creator Hub' 
  },
  { 
    value: 'digital_ads', 
    label: 'Digital Ads Boost', 
    price: '10K - 50K ETB / once', 
    desc: 'Multi-platform optimization audience push', 
    badge: 'Social Viral' 
  },
];

// =============================================
// STATUS COLORS
// =============================================
const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  revision_required: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  in_production: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function CustomerDashboard() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // =============================================
  // FORM DATA - Auto-populated from profile
  // =============================================
  const [formData, setFormData] = useState({
    companyName: '',
    companyIndustry: '',
    companyDescription: '',
    companyWebsite: '',
    contactPerson: '',
    contactPhone: '',
    contactPhoneCode: '+251',
    adType: 'starter_visibility',
    message: '',
    targetAudience: {
      ageGroup: 'all',
      location: '',
      interests: [],
    },
    budgetRange: { min: '', max: '' },
    agreementAccepted: false,
    socialMedia: { 
      facebook: '', 
      telegram: '', 
      linkedin: '', 
      instagram: '', 
      youtube: '', 
      twitter: '', 
      tiktok: '' 
    }
  });

  // =============================================
  // ✅ LOAD PROFILE AND AUTO-POPULATE FORM
  // =============================================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await api.get('/customer/profile');
      if (response.data.success) {
        const customer = response.data.customer;
        
        if (customer) {
          // ✅ Auto-populate form with profile data
          setFormData(prev => ({
            ...prev,
            companyName: customer.companyName || '',
            companyIndustry: customer.companyIndustry || '',
            companyDescription: customer.companyDescription || '',
            companyWebsite: customer.companyWebsite || '',
            contactPerson: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
            contactPhone: customer.phone || '',
            contactPhoneCode: customer.phoneCode || '+251',
            socialMedia: {
              facebook: customer.socialMedia?.facebook || '',
              telegram: customer.socialMedia?.telegram || '',
              linkedin: customer.socialMedia?.linkedin || '',
              instagram: customer.socialMedia?.instagram || '',
              youtube: customer.socialMedia?.youtube || '',
              twitter: customer.socialMedia?.twitter || '',
              tiktok: customer.socialMedia?.tiktok || '',
            }
          }));
          
          setProfileLoaded(true);
          console.log('✅ Profile loaded and form auto-populated');
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // =============================================
  // ✅ LOAD REQUESTS
  // =============================================
  useEffect(() => {
    if (viewMode === 'list') {
      fetchMyRequests();
    }
  }, [viewMode]);

  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get('/customer/advertising');
      setRequests(response.data.requests || []);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to view your requests');
      } else {
        toast.error('Failed to load your advertising requests');
      }
      console.error('Error fetching requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }));
  };

  // =============================================
  // ✅ VALIDATION
  // =============================================
  const validateStep = (currentStep) => {
    const errors = {};
    
    if (currentStep === 1) {
      if (!formData.companyName?.trim() || formData.companyName.trim().length < 2) {
        errors.companyName = 'Company name must be at least 2 characters';
      }
      if (!formData.companyIndustry?.trim() || formData.companyIndustry.trim().length < 2) {
        errors.companyIndustry = 'Industry category is required';
      }
      if (!formData.contactPerson?.trim() || formData.contactPerson.trim().length < 2) {
        errors.contactPerson = 'Contact person name is required';
      }
    }
    
    if (currentStep === 4 && !formData.agreementAccepted) {
      errors.agreementAccepted = 'You must review and accept the media alignment agreement';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // =============================================
  // ✅ SUBMIT
  // =============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      const formattedPayload = {
        companyName: formData.companyName.trim(),
        companyIndustry: formData.companyIndustry.trim(),
        companyDescription: formData.companyDescription?.trim() || '',
        companyWebsite: formData.companyWebsite?.trim() || '',
        contactPerson: formData.contactPerson.trim(),
        contactPhone: formData.contactPhone?.trim() || '',
        contactPhoneCode: formData.contactPhoneCode || '+251',
        adType: formData.adType,
        message: formData.message?.trim() || '',
        targetAudience: {
          ageGroup: formData.targetAudience.ageGroup || 'all',
          location: formData.targetAudience.location?.trim() || '',
          interests: formData.targetAudience.interests || [],
        },
        budgetRange: {
          min: Number(formData.budgetRange.min) || 0,
          max: Number(formData.budgetRange.max) || 0,
        },
        agreementAccepted: Boolean(formData.agreementAccepted),
        socialMedia: {
          facebook: formData.socialMedia.facebook?.trim() || '',
          telegram: formData.socialMedia.telegram?.trim() || '',
          linkedin: formData.socialMedia.linkedin?.trim() || '',
          instagram: formData.socialMedia.instagram?.trim() || '',
          youtube: formData.socialMedia.youtube?.trim() || '',
          twitter: formData.socialMedia.twitter?.trim() || '',
          tiktok: formData.socialMedia.tiktok?.trim() || '',
        }
      };

      const url = editingId 
        ? `/customer/advertising/${editingId}`
        : '/customer/advertising';
      
      if (editingId) {
        await api.put(url, formattedPayload);
        toast.success('Your advertising request has been updated successfully!');
      } else {
        await api.post(url, formattedPayload);
        toast.success('Your advertising request has been submitted successfully!');
      }
      
      resetForm();
      setViewMode('list');
      fetchMyRequests();
    } catch (error) {
      console.error('❌ Submission error:', error.response?.data);
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => err.message)
          .join('\n');
        toast.error(`Validation failed:\n${errorMessages}`);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to submit your request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEditingId(null);
    loadProfile(); // Reload profile to reset form
  };

  const handleEdit = (request) => {
    setEditingId(request._id);
    setFormData({
      companyName: request.companyName || '',
      companyIndustry: request.companyIndustry || '',
      companyDescription: request.companyDescription || '',
      companyWebsite: request.companyWebsite || '',
      contactPerson: request.contactPerson || '',
      contactPhone: request.contactPhone || '',
      contactPhoneCode: request.contactPhoneCode || '+251',
      adType: request.adType || 'starter_visibility',
      message: request.message || '',
      targetAudience: request.targetAudience || { ageGroup: 'all', location: '', interests: [] },
      budgetRange: request.budgetRange || { min: '', max: '' },
      agreementAccepted: request.agreementAccepted || false,
      socialMedia: request.socialMedia || { facebook: '', telegram: '', linkedin: '', instagram: '', youtube: '', twitter: '', tiktok: '' }
    });
    setViewMode('create');
    setStep(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this advertising request?')) return;
    
    try {
      await api.delete(`/customer/advertising/${id}`);
      toast.success('Request cancelled successfully');
      fetchMyRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete request');
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setViewMode('detail');
  };

  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getAdTypeLabel = (value) => {
    const service = SERVICES.find(s => s.value === value);
    return service ? service.label : value;
  };

  // ============ LIST VIEW ============
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
        <Helmet>
          <title>My Advertising Requests - TRADE X TV</title>
        </Helmet>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                My Advertising Requests
              </h1>
              <p className={`text-sm ${isDark ? 'text-emerald-100/70' : 'text-emerald-900/70'}`}>
                Track and manage all your TRADE X TV advertising submissions
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setViewMode('create');
              }}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              <FiPlus size={20} />
              New Request
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
              <p className="text-2xl font-bold text-emerald-500">{requests.length}</p>
              <p className="text-xs text-zinc-400">Total Requests</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
              <p className="text-2xl font-bold text-yellow-400">{requests.filter(r => r.status === 'pending').length}</p>
              <p className="text-xs text-zinc-400">Pending</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
              <p className="text-2xl font-bold text-green-400">{requests.filter(r => r.status === 'approved').length}</p>
              <p className="text-xs text-zinc-400">Approved</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
              <p className="text-2xl font-bold text-purple-400">{requests.filter(r => r.status === 'completed').length}</p>
              <p className="text-xs text-zinc-400">Completed</p>
            </div>
          </div>

          {loadingRequests ? (
            <div className="text-center py-12">
              <FiRefreshCw className="animate-spin text-emerald-500 text-4xl mx-auto mb-4" />
              <p className="text-zinc-400">Loading your requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className={`text-center py-16 rounded-3xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
              <FiFileText className="text-6xl text-emerald-500/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">No Requests Yet</h3>
              <p className="text-sm text-zinc-500">Start your first advertising campaign with TRADE X TV today</p>
              <button
                onClick={() => {
                  resetForm();
                  setViewMode('create');
                }}
                className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold inline-flex items-center gap-2"
              >
                <FiPlus size={20} />
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${
                    isDark ? 'bg-zinc-900/60 border-white/5 hover:border-emerald-500/30' : 'bg-white border-emerald-100 hover:border-emerald-300'
                  }`}
                  onClick={() => handleView(request)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                          {request.companyName}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <FiTag size={14} />
                          {getAdTypeLabel(request.adType)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        {request.finalPrice && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <FiDollarSign size={14} />
                            {request.finalPrice.toLocaleString()} ETB
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(request.status === 'pending' || request.status === 'revision_required') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(request);
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isDark ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <FiEdit size={16} className="text-zinc-400" />
                        </button>
                      )}
                      {request.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(request._id);
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isDark ? 'border-white/10 hover:bg-red-500/10' : 'border-zinc-200 hover:bg-red-50'
                          }`}
                        >
                          <FiTrash2 size={16} className="text-red-400" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(request);
                        }}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold text-sm transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ DETAIL VIEW ============
  if (viewMode === 'detail' && selectedRequest) {
    return (
      <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
        <Helmet>
          <title>Request Details - TRADE X TV</title>
        </Helmet>

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`mb-6 px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${
              isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <FiArrowLeft size={16} />
            Back to Requests
          </button>

          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {selectedRequest.companyName}
                </h1>
                <p className="text-sm text-zinc-400">{selectedRequest.companyIndustry}</p>
              </div>
              {getStatusBadge(selectedRequest.status)}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Contact Person</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {selectedRequest.contactPerson}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {selectedRequest.contactPhoneCode} {selectedRequest.contactPhone}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Package</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {getAdTypeLabel(selectedRequest.adType)}
                  </p>
                </div>
                {selectedRequest.companyWebsite && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Website</h3>
                    <a href={selectedRequest.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm">
                      {selectedRequest.companyWebsite}
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {selectedRequest.budgetRange && (selectedRequest.budgetRange.min > 0 || selectedRequest.budgetRange.max > 0) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Budget Range (ETB)</h3>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      {selectedRequest.budgetRange.min.toLocaleString()} - {selectedRequest.budgetRange.max.toLocaleString()} ETB
                    </p>
                  </div>
                )}
                {selectedRequest.targetAudience?.location && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Target Location</h3>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      {selectedRequest.targetAudience.location}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 mb-1">Submitted</h3>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedRequest.finalPrice && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-emerald-400 mb-1">Final Price</h3>
                    <p className="font-bold text-emerald-400 text-xl">
                      {selectedRequest.finalPrice.toLocaleString()} ETB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.companyDescription && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-2">Company Description</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {selectedRequest.companyDescription}
                </p>
              </div>
            )}

            {selectedRequest.message && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-xs font-bold uppercase text-zinc-400 mb-2">Message / Briefing</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {selectedRequest.message}
                </p>
              </div>
            )}

            {selectedRequest.supervisorNotes && (
              <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <h3 className="text-xs font-bold uppercase text-yellow-400 mb-2">Supervisor Notes</h3>
                <p className="text-sm text-yellow-300/80">{selectedRequest.supervisorNotes}</p>
              </div>
            )}

            {(selectedRequest.status === 'pending' || selectedRequest.status === 'revision_required') && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(selectedRequest)}
                  className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"
                >
                  Edit Request
                </button>
                <button
                  onClick={() => handleDelete(selectedRequest._id)}
                  className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ CREATE/EDIT VIEW ============
  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <Helmet>
        <title>{editingId ? 'Edit Advertising Request' : 'New Advertising Request'} - TRADE X TV</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            resetForm();
            setViewMode('list');
          }}
          className={`mb-6 px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${
            isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
          }`}
        >
          <FiArrowLeft size={16} />
          Cancel & Back
        </button>

        {/* Hero Banner */}
        <div className={`mb-8 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl border ${
          isDark ? 'bg-gradient-to-br from-emerald-950/80 via-zinc-950 to-emerald-950/40 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 border-emerald-200'
        }`}>
          <div className="relative z-10 max-w-2xl">
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'}`}>
              {editingId ? 'Edit Campaign' : 'New Advertising Request'}
            </span>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-3 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              {editingId ? 'Update Your Request' : 'Advertise With TRADE X TV'}
            </h1>
            <p className={`mt-2 text-sm md:text-base leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-emerald-900/70'}`}>
              {editingId 
                ? 'Review and update your advertising campaign details'
                : 'Grow your brand, reach decision makers, and influence markets'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Steps */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-lg ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-emerald-100'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              Campaign Steps
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { num: 1, label: 'Company Info', icon: FiBriefcase },
                { num: 2, label: 'Select Package', icon: FiLayers },
                { num: 3, label: 'Target Audience', icon: FiUsers },
                { num: 4, label: 'Review & Submit', icon: FiFileText },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                    step === s.num 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105' 
                      : step > s.num 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isDark ? 'bg-white/5 text-zinc-500 border border-white/5' : 'bg-zinc-50 text-zinc-400 border border-zinc-200'
                  }`}>
                    {step > s.num ? <FiCheck size={16} /> : <s.icon size={16} />}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-xs font-semibold ${step === s.num ? (isDark ? 'text-white' : 'text-emerald-950') : 'text-zinc-400'}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
              isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-emerald-100'
            }`}>
              
              {/* STEP 1: Company Info - Auto-populated from Profile */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-800/10 dark:border-white/5 pb-4">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      Company Information
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                      {loadingProfile ? 'Loading your profile...' : '✅ Company information loaded from your profile'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Company Name *</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        } ${loadingProfile ? 'opacity-60' : ''}`}
                        placeholder="e.g. TradEx Global Importers"
                        disabled={loadingProfile}
                      />
                      {validationErrors.companyName && <p className="text-red-500 text-[11px] mt-1">{validationErrors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Industry *</label>
                      <input type="text" name="companyIndustry" value={formData.companyIndustry} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        } ${loadingProfile ? 'opacity-60' : ''}`}
                        placeholder="e.g. Technology, Export, Finance"
                        disabled={loadingProfile}
                      />
                      {validationErrors.companyIndustry && <p className="text-red-500 text-[11px] mt-1">{validationErrors.companyIndustry}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Contact Person *</label>
                      <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        } ${loadingProfile ? 'opacity-60' : ''}`}
                        placeholder="Full Name"
                        disabled={loadingProfile}
                      />
                      {validationErrors.contactPerson && <p className="text-red-500 text-[11px] mt-1">{validationErrors.contactPerson}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Phone</label>
                      <div className="flex gap-2">
                        <select name="contactPhoneCode" value={formData.contactPhoneCode} onChange={handleInputChange}
                          className={`px-3 py-3 rounded-xl border text-sm focus:outline-none ${
                            isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                          } ${loadingProfile ? 'opacity-60' : ''}`}
                          disabled={loadingProfile}
                        >
                          <option value="+251">+251 (ET)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                        </select>
                        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                            isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                          } ${loadingProfile ? 'opacity-60' : ''}`}
                          placeholder="911223344"
                          disabled={loadingProfile}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-400">Website (Optional)</label>
                    <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                        isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                      } ${loadingProfile ? 'opacity-60' : ''}`}
                      placeholder="https://example.com"
                      disabled={loadingProfile}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-400">Company Description</label>
                    <textarea name="companyDescription" value={formData.companyDescription} onChange={handleInputChange} rows="3"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                        isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                      } ${loadingProfile ? 'opacity-60' : ''}`}
                      placeholder="Briefly describe your company's core value proposition..."
                      disabled={loadingProfile}
                    />
                  </div>

                  {/* Profile Info Notice */}
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      <FiInfo className="inline mr-1.5" size={14} />
                      Company information is loaded from your profile. 
                      <a href="/customer/profile" className={`font-medium hover:underline ml-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Update your profile here →
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Select Package */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-800/10 dark:border-white/5 pb-4">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>Select Advertising Package</h2>
                    <p className="text-xs text-zinc-400">Choose the package that best fits your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map((srv) => (
                      <button key={srv.value} type="button" onClick={() => setFormData(p => ({ ...p, adType: srv.value }))}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                          formData.adType === srv.value
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                            : isDark ? 'bg-zinc-950/40 border-white/5 hover:bg-zinc-800/40' : 'bg-zinc-50/50 border-zinc-200 hover:bg-zinc-100/70'
                        }`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className={`font-bold text-sm ${formData.adType === srv.value ? 'text-emerald-400' : (isDark ? 'text-white' : 'text-emerald-950')}`}>
                            {srv.label}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            formData.adType === srv.value ? 'bg-emerald-500 text-white' : (isDark ? 'bg-white/5 text-zinc-400' : 'bg-zinc-200 text-zinc-700')
                          }`}>
                            {srv.price}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{srv.desc}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{srv.badge}</span>
                          {formData.adType === srv.value && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-400">Custom Message</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="3"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                        isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                      }`} placeholder="Tell us about your goals, ideas, or special requirements..." />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-zinc-400">Budget Range (ETB)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={formData.budgetRange.min} onChange={(e) => handleNestedChange('budgetRange', 'min', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        }`} placeholder="Min ETB" />
                      <input type="number" value={formData.budgetRange.max} onChange={(e) => handleNestedChange('budgetRange', 'max', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        }`} placeholder="Max ETB" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Target Audience */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-800/10 dark:border-white/5 pb-4">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>Target Audience</h2>
                    <p className="text-xs text-zinc-400">Define your target audience for better results</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Age Group</label>
                      <select value={formData.targetAudience.ageGroup} onChange={(e) => handleNestedChange('targetAudience', 'ageGroup', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        }`}>
                        <option value="all">All Audiences</option>
                        <option value="18-24">18-24 (Youth / Innovators)</option>
                        <option value="25-34">25-34 (SMEs / Digital Builders)</option>
                        <option value="35-44">35-44 (Corporate Leaders)</option>
                        <option value="45-54">45-54 (Institutional Executives)</option>
                        <option value="55+">55+ (Senior Advisors)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-zinc-400">Location</label>
                      <input type="text" value={formData.targetAudience.location} onChange={(e) => handleNestedChange('targetAudience', 'location', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                          isDark ? 'bg-zinc-950/50 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                        }`} placeholder="e.g. Addis Ababa, Ethiopian Diaspora, East Africa" />
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/10 dark:border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Social Media Handles (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {['telegram', 'linkedin', 'facebook', 'youtube', 'instagram', 'tiktok'].map((platform) => (
                        <div key={platform}>
                          <label className="block text-[10px] capitalize font-medium text-zinc-500 mb-1">{platform}</label>
                          <input type="text" value={formData.socialMedia[platform]} onChange={(e) => handleSocialChange(platform, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                              isDark ? 'bg-zinc-950/30 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-emerald-950'
                            }`} placeholder={`@username`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-800/10 dark:border-white/5 pb-4">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>Review & Submit</h2>
                    <p className="text-xs text-zinc-400">Review your request before submitting</p>
                  </div>

                  <div className={`p-4 rounded-xl border text-xs space-y-3 ${isDark ? 'bg-zinc-950/40 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-zinc-500">Company:</span> 
                      <span className="font-bold text-zinc-300">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-zinc-500">Package:</span> 
                      <span className="font-bold text-emerald-400">{SERVICES.find(s=>s.value === formData.adType)?.label}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-zinc-500">Budget:</span> 
                      <span className="text-zinc-300">{formData.budgetRange.min || 0} - {formData.budgetRange.max || 'Unspecified'} ETB</span>
                    </div>
                    {formData.message && (
                      <div className="pt-1">
                        <span className="text-zinc-500 block mb-1">Message:</span>
                        <p className="text-zinc-400 bg-black/20 p-2 rounded-lg">{formData.message}</p>
                      </div>
                    )}
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'}`}>
                    <FiInfo size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-zinc-400 leading-relaxed">
                      <p className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>Terms & Conditions</p>
                      <p className="mt-1 text-[11px]">By submitting this request, you agree to TRADE X TV's advertising terms. Final pricing and production details will be confirmed upon supervisor approval.</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData.agreementAccepted} onChange={(e) => setFormData(p => ({ ...p, agreementAccepted: e.target.checked }))}
                      className="w-4 h-4 rounded text-emerald-500 border-zinc-700 focus:ring-0 bg-transparent cursor-pointer" />
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      I agree to the terms and conditions *
                    </span>
                  </label>
                  {validationErrors.agreementAccepted && <p className="text-red-500 text-[11px]">{validationErrors.agreementAccepted}</p>}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 pt-4 border-t border-zinc-800/10 dark:border-white/5 flex justify-between items-center">
                {step > 1 ? (
                  <button type="button" onClick={prevStep}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isDark ? 'bg-zinc-950/40 border-white/10 text-white hover:bg-zinc-800' : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                    }`}>
                    <FiArrowLeft size={14} /> Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button type="button" onClick={nextStep}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 ${
                      isDark ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    }`}>
                    Continue <FiArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 ${
                      submitting 
                        ? 'bg-zinc-500 cursor-not-allowed text-zinc-300' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    }`}>
                    {submitting ? (
                      <>Processing <FiRefreshCw className="animate-spin" size={14} /></>
                    ) : (
                      <>{editingId ? 'Update Request' : 'Submit Request'} <FiCheck size={14} /></>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}