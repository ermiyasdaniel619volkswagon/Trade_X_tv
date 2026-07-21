
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiStar as FiStarFilled,
  FiEye,
  FiEyeOff,
  FiSave,
  FiVideo,
  FiUsers,
} from 'react-icons/fi';

const ManageVideos = () => {
  const { isDark } = useTheme();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    videoId: '',
    title: '',
    description: '',
    category: 'General',
    isFeatured: false,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General',
    'Company',
    'Behind the Scenes',
    'Tutorial',
    'Equipment',
    'Testimonials',
    'Masterclass',
    'Strategy',
  ];

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/videos');
      if (response.data.success) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      console.error('Load videos error:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.videoId.trim()) {
      toast.error('YouTube video ID or URL is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (editingVideo) {
        response = await api.put(`/admin/videos/${editingVideo._id}`, formData);
      } else {
        response = await api.post('/admin/videos', formData);
      }
      
      if (response.data.success) {
        toast.success(editingVideo ? 'Video updated successfully' : 'Video added successfully');
        setShowForm(false);
        setEditingVideo(null);
        setFormData({
          videoId: '',
          title: '',
          description: '',
          category: 'General',
          isFeatured: false,
          isActive: true,
        });
        loadVideos();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Are you sure you want to delete "${video.title}"?`)) return;
    
    try {
      const response = await api.delete(`/admin/videos/${video._id}`);
      if (response.data.success) {
        toast.success('Video deleted successfully');
        loadVideos();
      }
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleToggleFeatured = async (video) => {
    try {
      const response = await api.put(`/admin/videos/${video._id}/toggle-featured`);
      if (response.data.success) {
        toast.success(`Video ${video.isFeatured ? 'unfeatured' : 'featured'}`);
        loadVideos();
      }
    } catch (error) {
      toast.error('Failed to toggle featured status');
    }
  };

  const handleToggleActive = async (video) => {
    try {
      const response = await api.put(`/admin/videos/${video._id}/toggle-active`);
      if (response.data.success) {
        toast.success(`Video ${video.isActive ? 'deactivated' : 'activated'}`);
        loadVideos();
      }
    } catch (error) {
      toast.error('Failed to toggle active status');
    }
  };

  const handleRefreshData = async (video) => {
    toast.loading('Refreshing video data...', { id: 'refresh' });
    try {
      const response = await api.post(`/admin/videos/${video._id}/refresh`);
      if (response.data.success) {
        toast.success('Video data refreshed successfully', { id: 'refresh' });
        loadVideos();
      }
    } catch (error) {
      toast.error('Failed to refresh video data', { id: 'refresh' });
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      videoId: video.videoId,
      title: video.title,
      description: video.description || '',
      category: video.category || 'General',
      isFeatured: video.isFeatured || false,
      isActive: video.isActive !== undefined ? video.isActive : true,
    });
    setShowForm(true);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.videoId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'featured' && video.isFeatured) ||
                          (filter === 'active' && video.isActive) ||
                          (filter === 'inactive' && !video.isActive);
    return matchesSearch && matchesFilter;
  });

  const getThumbnailUrl = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
            Loading videos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Videos - TRADE X TV</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${
              isDark ? 'text-white' : 'text-emerald-950'
            }`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                <FiVideo className="text-white" size={24} />
              </div>
              Manage Videos
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
              Manage YouTube videos displayed in the video library
            </p>
          </div>
          <button
            onClick={() => {
              setEditingVideo(null);
              setFormData({
                videoId: '',
                title: '',
                description: '',
                category: 'General',
                isFeatured: false,
                isActive: true,
              });
              setShowForm(!showForm);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add Video
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
                placeholder="Search videos..."
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
              <option value="all">All Videos</option>
              <option value="featured">Featured</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={loadVideos}
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

        {/* Add/Edit Form - NO COLORS */}
        {showForm && (
          <div className={`p-6 rounded-2xl animate-slide-down ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  YouTube Video ID or URL *
                </label>
                <input
                  type="text"
                  placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                  value={formData.videoId}
                  onChange={(e) => setFormData({...formData, videoId: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white placeholder-emerald-200/30' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950 placeholder-emerald-800/30'
                  }`}
                  required
                  disabled={!!editingVideo}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/30' : 'text-emerald-800/30'}`}>
                  Paste the full YouTube URL or just the 11-character video ID
                </p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Video title"
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
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1.5 ${
                  isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                }`}>
                  Description
                </label>
                <textarea
                  placeholder="Video description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[80px] ${
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
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#032e1d]/40 border-white/10 focus:ring-emerald-500/50 text-white' 
                      : 'bg-emerald-50/50 border-emerald-100 focus:ring-emerald-500/50 text-emerald-950'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 rounded border-2 border-emerald-500/30 text-emerald-600 focus:ring-emerald-500 transition-all duration-200"
                    />
                    Featured
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer ${
                    isDark ? 'text-emerald-200/70' : 'text-emerald-800/70'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-2 border-emerald-500/30 text-emerald-600 focus:ring-emerald-500 transition-all duration-200"
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
                      {editingVideo ? 'Update Video' : 'Add Video'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVideo(null);
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                No Videos Found
              </h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                {searchTerm ? 'Try a different search term' : 'Start by adding your first video'}
              </p>
            </div>
          ) : (
            filteredVideos.map((video) => (
              <div
                key={video._id}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isDark
                    ? 'bg-[#032e1d]/40 border-white/5 hover:border-emerald-500/30'
                    : 'bg-white/60 border-emerald-100/50 hover:border-emerald-400/30'
                } backdrop-blur-sm`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-800">
                  <img
                    src={getThumbnailUrl(video.videoId)}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {video.isFeatured && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center gap-1.5">
                      <FiStarFilled size={12} />
                      Featured
                    </div>
                  )}
                  {!video.isActive && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/80 text-white">
                      Inactive
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-medium text-white">
                    {video.duration || '0:00'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h4 className={`font-semibold text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-200/40' : 'text-emerald-800/40'}`}>
                      <FiUsers size={12} />
                      {video.views ? new Intl.NumberFormat().format(video.views) : '0'} views
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-white/5 text-emerald-200/40' : 'bg-emerald-50 text-emerald-800/40'
                    }`}>
                      {video.category || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleToggleFeatured(video)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        video.isFeatured
                          ? 'text-amber-500'
                          : isDark ? 'text-emerald-200/30 hover:text-amber-500' : 'text-emerald-800/30 hover:text-amber-500'
                      }`}
                      title={video.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {video.isFeatured ? <FiStarFilled size={16} /> : <FiStar size={16} />}
                    </button>
                    <button
                      onClick={() => handleToggleActive(video)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        video.isActive
                          ? 'text-emerald-500'
                          : isDark ? 'text-emerald-200/30 hover:text-emerald-500' : 'text-emerald-800/30 hover:text-emerald-500'
                      }`}
                      title={video.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {video.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleRefreshData(video)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-white/5 text-emerald-200/40' : 'hover:bg-emerald-50 text-emerald-800/40'
                      }`}
                      title="Refresh data from YouTube"
                    >
                      <FiRefreshCw size={16} />
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleEdit(video)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-white/5 text-emerald-200/40' : 'hover:bg-emerald-50 text-emerald-800/40'
                      }`}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(video)}
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

        {/* Video Stats */}
        {videos.length > 0 && (
          <div className={`p-4 rounded-2xl ${
            isDark 
              ? 'bg-[#032e1d]/40 border border-white/5' 
              : 'bg-white/60 border border-emerald-100/50'
          } backdrop-blur-sm`}>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Total Videos: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {videos.length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Featured: <span className="font-bold text-amber-500">
                  {videos.filter(v => v.isFeatured).length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Active: <span className="font-bold text-emerald-500">
                  {videos.filter(v => v.isActive).length}
                </span>
              </span>
              <span className={isDark ? 'text-emerald-200/60' : 'text-emerald-800/60'}>
                Total Views: <span className={`font-bold ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {new Intl.NumberFormat().format(videos.reduce((sum, v) => sum + (v.views || 0), 0))}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageVideos;