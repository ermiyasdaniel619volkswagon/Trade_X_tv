
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiSave,
  FiCalendar,
  FiUser,
  FiTag,
  FiImage,
  FiFileText,
  FiX,
  FiUploadCloud,
} from 'react-icons/fi';

const ManageNews = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tag: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    date: '',
  });

  // Cloudinary configuration - using your credentials from the screenshot
  const CLOUDINARY_CONFIG = {
    cloudName: 'djiskruyy',
    uploadPreset: 'news_media', // You need to create this in Cloudinary settings
    sources: ['local', 'url', 'camera', 'dropbox', 'google_drive'],
    multiple: false,
    cropping: false,
    showAdvancedOptions: false,
    defaultSource: 'local',
    styles: {
      palette: {
        window: '#FFFFFF',
        sourceBg: '#F4F4F4',
        windowBorder: '#90a0b3',
        tabIcon: '#0078FF',
        inactiveTabIcon: '#697E9A',
        menuIcons: '#0078FF',
        link: '#0078FF',
        action: '#8F5DA5',
        inProgress: '#0078FF',
        complete: '#33B27B',
        error: '#EA2727',
        textDark: '#000000',
        textLight: '#FFFFFF'
      },
      fonts: {
        default: null,
        'inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
      }
    }
  };

  // Define colors inside the component
  const colors = {
    primary: isDark ? '#34d399' : '#10b981',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#A0A0A0' : '#6B6B6B',
    border: isDark ? '#333333' : '#E8E8E0',
    cardBg: isDark ? '#1A1A1A' : '#FFFFFF',
  };

  const categories = [
    'Company News',
    'Awards',
    'Partnerships',
    'Content',
    'Events',
    'Equipment',
    'General'
  ];

  // Reliable fallback images
  const fallbackImages = [
    'https://picsum.photos/seed/1/600/400',
    'https://picsum.photos/seed/2/600/400',
    'https://picsum.photos/seed/3/600/400',
    'https://picsum.photos/seed/4/600/400',
    'https://picsum.photos/seed/5/600/400',
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/news');
      if (response.data.success) {
        const newsWithImages = response.data.news.map((item, index) => ({
          ...item,
          image: item.image && item.image.trim() !== '' 
            ? item.image 
            : fallbackImages[index % fallbackImages.length],
        }));
        setNews(newsWithImages);
      }
    } catch (error) {
      console.error('Load news error:', error);
      toast.error(error.response?.data?.error || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // CLOUDINARY UPLOAD WIDGET FUNCTION
  // =============================================
  const openCloudinaryUpload = () => {
    // Check if the Cloudinary widget script is loaded
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      toast.error('Upload widget is not ready. Please refresh the page.');
      
      // Try to load the script dynamically
      try {
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        script.onload = () => {
          toast.success('Widget loaded! Please try uploading again.');
          // Retry opening the widget
          setTimeout(openCloudinaryUpload, 500);
        };
        script.onerror = () => {
          toast.error('Failed to load upload widget. Check your internet connection.');
        };
        document.head.appendChild(script);
      } catch (e) {
        console.error('Failed to load script dynamically:', e);
      }
      return;
    }

    // Check if upload preset exists
    if (!CLOUDINARY_CONFIG.uploadPreset) {
      toast.error('Upload preset not configured. Please contact administrator.');
      return;
    }

    // Show upload starting state
    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('Opening Cloudinary widget with config:', {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset
      });

      const widget = window.cloudinary.createUploadWidget(
        CLOUDINARY_CONFIG,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            toast.error('Upload failed: ' + (error.message || 'Unknown error'));
            setIsUploading(false);
            setUploadProgress(0);
            return;
          }

          if (result && result.event === 'success') {
            const imageUrl = result.info.secure_url;
            console.log('✅ Uploaded image URL:', imageUrl);
            
            setFormData(prev => ({ ...prev, image: imageUrl }));
            setImagePreview(imageUrl);
            setImageError(false);
            
            toast.success('Image uploaded successfully!');
            setIsUploading(false);
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 2000);
          }
          
          if (result && result.event === 'progress') {
            const progress = Math.round((result.bytesUploaded / result.totalBytes) * 100);
            setUploadProgress(progress);
          }
          
          if (result && result.event === 'close') {
            setIsUploading(false);
            setUploadProgress(0);
          }
        }
      );
      
      widget.open();
    } catch (error) {
      console.error('Failed to open Cloudinary widget:', error);
      toast.error('Failed to open upload dialog. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle image error in list
  const handleImageError = (e) => {
    e.target.onerror = null;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    e.target.src = fallbackImages[randomIndex];
  };

  // Handle image URL change with preview
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({...formData, image: url});
    setImagePreview(url);
    setImageError(false);
  };

  // Validate image URL
  const validateImageUrl = (url) => {
    if (!url || url.trim() === '') return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.excerpt || !formData.content || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate image URL if provided
    if (formData.image && !validateImageUrl(formData.image)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (editingNews) {
        response = await api.put(`/news/${editingNews._id}`, formData);
      } else {
        response = await api.post('/news', formData);
      }
      
      if (response.data.success) {
        toast.success(editingNews ? 'News updated successfully' : 'News created successfully');
        setShowForm(false);
        setEditingNews(null);
        setImagePreview('');
        setImageError(false);
        setFormData({
          title: '',
          category: '',
          tag: '',
          excerpt: '',
          content: '',
          image: '',
          author: '',
          date: '',
        });
        loadNews();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (newsItem) => {
    if (!window.confirm(`Are you sure you want to delete "${newsItem.title}"?`)) return;
    
    try {
      const response = await api.delete(`/news/${newsItem._id}`);
      if (response.data.success) {
        toast.success('News deleted successfully');
        loadNews();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete news');
    }
  };

  const handleToggleActive = async (newsItem) => {
    try {
      const response = await api.put(`/news/${newsItem._id}/toggle-active`);
      if (response.data.success) {
        toast.success(`News ${newsItem.isActive ? 'deactivated' : 'activated'}`);
        loadNews();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.error || 'Failed to toggle active status');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      category: newsItem.category,
      tag: newsItem.tag || newsItem.category,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image || '',
      author: newsItem.author,
      date: newsItem.date ? new Date(newsItem.date).toISOString().split('T')[0] : '',
    });
    setImagePreview(newsItem.image || '');
    setImageError(false);
    setShowForm(true);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && item.isActive) ||
                          (filter === 'inactive' && !item.isActive);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading news...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage News - TRADE X TV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FiFileText className="text-white" size={24} />
              </div>
              Manage News
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Create and manage news articles for the website
            </p>
          </div>
          <button
            onClick={() => {
              setEditingNews(null);
              setImagePreview('');
              setImageError(false);
              setFormData({
                title: '',
                category: '',
                tag: '',
                excerpt: '',
                content: '',
                image: '',
                author: user?.firstName + ' ' + user?.lastName || '',
                date: '',
              });
              setShowForm(!showForm);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add News
          </button>
        </div>

        {/* Search and Filters */}
        <div className={`p-4 rounded-2xl ${
          isDark 
            ? 'bg-[#032e1d]/40 border border-white/5' 
            : 'bg-white/60 border border-emerald-100/50'
        } backdrop-blur-sm`}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'
              }`} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                    : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                }`}
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white' 
                  : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
              }`}
            >
              <option value="all">All News</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={loadNews}
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
        </div>

        {/* Add/Edit Form with Image Preview and Cloudinary Upload */}
        {showForm && (
          <div className={`p-6 rounded-2xl animate-slide-down ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              {editingNews ? 'Edit News' : 'Create New News'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="News title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                        : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value, tag: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white' 
                        : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
                    }`}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Excerpt *
                </label>
                <textarea
                  placeholder="Brief summary of the news..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Full Content *
                </label>
                <textarea
                  placeholder="Full news content..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[150px] ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    <FiImage className="inline mr-1" size={14} /> Image
                  </label>
                  
                  {/* Cloudinary Upload Button */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={openCloudinaryUpload}
                      disabled={isUploading}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        isUploading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading... {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <FiUploadCloud size={18} />
                          Upload Image
                        </>
                      )}
                    </button>
                    
                    {/* Upload Progress Bar */}
                    {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    
                    <p className={`text-xs ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'}`}>
                      Or paste image URL below
                    </p>
                  </div>

                  {/* ✅ FIXED: Removed duplicate placeholder */}
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    className={`w-full px-4 py-3 mt-2 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                        : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    <FiUser className="inline mr-1" size={14} /> Author *
                  </label>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                        : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <label className={`block text-sm font-medium mb-1.5 ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    Image Preview
                  </label>
                  <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: colors.border }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://picsum.photos/seed/preview/600/400';
                        setImageError(true);
                      }}
                      onLoad={() => setImageError(false)}
                    />
                    {imageError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-white text-sm">Image not available</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageError(false);
                        setFormData({...formData, image: ''});
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  <FiCalendar className="inline mr-1" size={14} /> Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      {editingNews ? 'Update News' : 'Create News'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNews(null);
                    setImagePreview('');
                    setImageError(false);
                    setIsUploading(false);
                    setUploadProgress(0);
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
            </form>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl">
              <div className="text-5xl mb-4">📰</div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                No News Found
              </h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                {searchTerm ? 'Try a different search term' : 'Start by creating your first news article'}
              </p>
            </div>
          ) : (
            filteredNews.map((item) => (
              <div
                key={item._id}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/5 hover:border-emerald-500/30'
                    : 'bg-white/60 border-emerald-100/50 hover:border-emerald-400/30'
                } backdrop-blur-sm`}
              >
                <div className="relative aspect-video bg-zinc-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
                    {item.category}
                  </div>
                  {!item.isActive && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/80 text-white">
                      Inactive
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className={`font-semibold text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                      <FiCalendar size={12} />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                      <FiUser size={12} />
                      {item.author}
                    </span>
                  </div>
                  <p className={`text-sm line-clamp-2 ${isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}`}>
                    {item.excerpt}
                  </p>

                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isActive
                          ? 'text-emerald-500'
                          : isDark ? 'text-emerald-200/30 hover:text-emerald-500' : 'text-emerald-800/30 hover:text-emerald-500'
                      }`}
                      title={item.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {item.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleEdit(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-white/5 text-emerald-200/40' : 'hover:bg-emerald-50 text-emerald-800/40'
                      }`}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-rose-500/10 text-rose-400' : 'hover:bg-rose-100 text-rose-500'
                      }`}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {news.length > 0 && (
          <div className={`p-4 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Total News: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {news.length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Active: <span className="font-bold text-emerald-500">
                  {news.filter(v => v.isActive).length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Inactive: <span className="font-bold text-rose-500">
                  {news.filter(v => !v.isActive).length}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageNews;