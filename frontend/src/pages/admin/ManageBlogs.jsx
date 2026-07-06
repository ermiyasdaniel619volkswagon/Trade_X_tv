
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
  FiStar,
  FiStar as FiStarFilled,
} from 'react-icons/fi';

const ManageBlogs = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
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

  // Cloudinary configuration
  const CLOUDINARY_CONFIG = {
    cloudName: 'djiskruyy',
    uploadPreset: 'news_media',
    sources: ['local', 'url', 'camera'],
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
      }
    }
  };

  // Define colors
  const colors = {
    primary: isDark ? '#34d399' : '#10b981',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#A0A0A0' : '#6B6B6B',
    border: isDark ? '#333333' : '#E8E8E0',
    cardBg: isDark ? '#1A1A1A' : '#FFFFFF',
  };

  const categories = [
    'Technology',
    'Media Production',
    'Video Editing',
    'Content Creation',
    'Industry News',
    'Tutorials',
    'Case Studies',
    'General'
  ];

  // Fallback images
  const fallbackImages = [
    'https://picsum.photos/seed/blog1/600/400',
    'https://picsum.photos/seed/blog2/600/400',
    'https://picsum.photos/seed/blog3/600/400',
    'https://picsum.photos/seed/blog4/600/400',
    'https://picsum.photos/seed/blog5/600/400',
  ];

  // =============================================
  // LOAD CLOUDINARY SCRIPT DYNAMICALLY
  // =============================================
  useEffect(() => {
    // Check if Cloudinary is already loaded
    if (window.cloudinary) {
      console.log('✅ Cloudinary already loaded');
      return;
    }

    // Dynamically load the Cloudinary script
    console.log('⏳ Loading Cloudinary script...');
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Cloudinary script loaded successfully!');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Cloudinary script');
      toast.error('Failed to load upload widget. Please refresh the page.');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs');
      if (response.data.success) {
        const blogsWithImages = response.data.blogs.map((item, index) => ({
          ...item,
          image: item.image && item.image.trim() !== '' 
            ? item.image 
            : fallbackImages[index % fallbackImages.length],
        }));
        setBlogs(blogsWithImages);
      }
    } catch (error) {
      console.error('Load blogs error:', error);
      toast.error(error.response?.data?.error || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // CLOUDINARY UPLOAD FUNCTION
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

    if (formData.image && !validateImageUrl(formData.image)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (editingBlog) {
        response = await api.put(`/blogs/${editingBlog._id}`, formData);
      } else {
        response = await api.post('/blogs', formData);
      }
      
      if (response.data.success) {
        toast.success(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        setShowForm(false);
        setEditingBlog(null);
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
        loadBlogs();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (blogItem) => {
    if (!window.confirm(`Are you sure you want to delete "${blogItem.title}"?`)) return;
    
    try {
      const response = await api.delete(`/blogs/${blogItem._id}`);
      if (response.data.success) {
        toast.success('Blog deleted successfully');
        loadBlogs();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete blog');
    }
  };

  const handleToggleActive = async (blogItem) => {
    try {
      const response = await api.put(`/blogs/${blogItem._id}/toggle-active`);
      if (response.data.success) {
        toast.success(`Blog ${blogItem.isActive ? 'deactivated' : 'activated'}`);
        loadBlogs();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.error || 'Failed to toggle active status');
    }
  };

  const handleToggleFeatured = async (blogItem) => {
    try {
      const response = await api.put(`/blogs/${blogItem._id}/toggle-featured`);
      if (response.data.success) {
        toast.success(`Blog ${blogItem.isFeatured ? 'unfeatured' : 'featured'}`);
        loadBlogs();
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error(error.response?.data?.error || 'Failed to toggle featured status');
    }
  };

  const handleEdit = (blogItem) => {
    setEditingBlog(blogItem);
    setFormData({
      title: blogItem.title,
      category: blogItem.category,
      tag: blogItem.tag || blogItem.category,
      excerpt: blogItem.excerpt,
      content: blogItem.content,
      image: blogItem.image || '',
      author: blogItem.author,
      date: blogItem.date ? new Date(blogItem.date).toISOString().split('T')[0] : '',
    });
    setImagePreview(blogItem.image || '');
    setImageError(false);
    setShowForm(true);
  };

  const filteredBlogs = blogs.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && item.isActive) ||
                          (filter === 'inactive' && !item.isActive) ||
                          (filter === 'featured' && item.isFeatured);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading blogs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Blogs - TradeExTV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">
                <FiFileText className="text-white" size={24} />
              </div>
              Manage Blogs
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Create and manage blog posts for the website
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBlog(null);
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
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add Blog
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
                placeholder="Search blogs..."
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
              <option value="all">All Blogs</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
            <button
              onClick={loadBlogs}
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

        {/* Add/Edit Form */}
        {showForm && (
          <div className={`p-6 rounded-2xl animate-slide-down ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
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
                    placeholder="Blog title"
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
                  <FiTag className="inline mr-1" size={14} /> Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g., video, editing, tutorial"
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
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
                  Excerpt *
                </label>
                <textarea
                  placeholder="Brief summary of the blog..."
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
                  placeholder="Full blog content..."
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
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      {editingBlog ? 'Update Blog' : 'Create Blog'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBlog(null);
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

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl">
              <div className="text-5xl mb-4">📝</div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                No Blogs Found
              </h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                {searchTerm ? 'Try a different search term' : 'Start by creating your first blog post'}
              </p>
            </div>
          ) : (
            filteredBlogs.map((item) => (
              <div
                key={item._id}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/5 hover:border-purple-500/30'
                    : 'bg-white/60 border-emerald-100/50 hover:border-purple-400/30'
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
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                    {item.category}
                  </div>
                  {item.isFeatured && (
                    <div className="absolute top-2 left-20 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 text-white flex items-center gap-1">
                      <FiStarFilled size={10} />
                      Featured
                    </div>
                  )}
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
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isFeatured
                          ? 'text-amber-500'
                          : isDark ? 'text-emerald-200/30 hover:text-amber-500' : 'text-emerald-800/30 hover:text-amber-500'
                      }`}
                      title={item.isFeatured ? 'Unfeature' : 'Feature'}
                    >
                      {item.isFeatured ? <FiStarFilled size={16} /> : <FiStar size={16} />}
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
        {blogs.length > 0 && (
          <div className={`p-4 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Total Blogs: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {blogs.length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Active: <span className="font-bold text-emerald-500">
                  {blogs.filter(v => v.isActive).length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Inactive: <span className="font-bold text-rose-500">
                  {blogs.filter(v => !v.isActive).length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Featured: <span className="font-bold text-amber-500">
                  {blogs.filter(v => v.isFeatured).length}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageBlogs;