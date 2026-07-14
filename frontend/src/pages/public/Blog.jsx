
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api.js';
import { FiCalendar, FiClock, FiUser, FiTag, FiX, FiArrowRight } from 'react-icons/fi';

// Company Brand Colors
const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const Blog = ({ isHomePage = false }) => {
  const { isDark } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fallback images
  const fallbackImages = [
    'https://picsum.photos/seed/blog1/800/500',
    'https://picsum.photos/seed/blog2/800/500',
    'https://picsum.photos/seed/blog3/800/500',
    'https://picsum.photos/seed/blog4/800/500',
    'https://picsum.photos/seed/blog5/800/500',
  ];

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs/public');
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
      console.error('Load blogs error:', error.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    e.target.src = fallbackImages[randomIndex];
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

  const openPopup = (blogItem) => {
    setSelectedBlog(blogItem);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBlog(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isPopupOpen) {
        closePopup();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isPopupOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderBlogContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
              style={{ borderColor: BRAND.navy, borderTopColor: 'transparent' }}
            />
            <p style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}>Loading blogs...</p>
          </div>
        </div>
      );
    }

    if (blogs.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold" style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
            No Blog Posts
          </h3>
          <p style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}>Check back later for new content.</p>
        </div>
      );
    }

    const displayBlogs = isHomePage ? blogs.slice(0, 6) : blogs;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBlogs.map((post) => (
          <div 
            key={post._id} 
            className="group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
              border: `1px solid ${isDark ? '#333333' : '#E8E8E0'}`,
            }}
          >
            <div className="w-full" style={{ height: '220px' }}>
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={handleImageError}
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3"
                style={{ backgroundColor: BRAND.maroon }}
              >
                {post.category}
              </span>

              {post.isFeatured && (
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ml-2"
                  style={{ backgroundColor: BRAND.gold }}
                >
                  ⭐ Featured
                </span>
              )}

              <h3 className="text-lg font-bold mb-2 leading-tight"
                style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}
              >
                {post.title}
              </h3>

              <p className="text-sm leading-relaxed mb-3 line-clamp-2"
                style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}
              >
                {post.excerpt || post.content.substring(0, 120) + '...'}
              </p>

              <button
                onClick={() => openPopup(post)}
                className="px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.02] flex items-center gap-2"
                style={{ 
                  backgroundColor: BRAND.gold,
                  boxShadow: `0 4px 15px ${BRAND.gold}44`,
                }}
              >
                Read More
                <FiArrowRight size={16} />
              </button>

              <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2"
                style={{ 
                  borderTop: `1px solid ${isDark ? '#333333' : '#E8E8E0'}`,
                }}
              >
                <span className="text-xs flex items-center gap-1.5"
                  style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}
                >
                  <FiUser size={14} style={{ color: BRAND.navy }} />
                  {post.author}
                </span>
                <span className="text-xs flex items-center gap-1.5"
                  style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}
                >
                  <FiCalendar size={12} style={{ color: BRAND.maroon }} />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="text-xs flex items-center gap-1.5"
                  style={{ color: BRAND.gold }}
                >
                  <FiClock size={12} />
                  {calculateReadTime(post.content)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // =============================================
  // FIX: Popup rendered with createPortal - WORKS ON BOTH HOME AND STANDALONE
  // =============================================
  const renderPopup = () => {
    if (!isPopupOpen || !selectedBlog) return null;

    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={closePopup}
      >
        <div 
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl"
          style={{ 
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            border: `1px solid ${isDark ? '#333333' : '#E8E8E0'}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              color: isDark ? '#FFFFFF' : '#1A1A1A',
            }}
          >
            <FiX size={24} />
          </button>

          <div className="w-full rounded-t-xl overflow-hidden" style={{ height: '320px' }}>
            <img 
              src={selectedBlog.image} 
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>

          <div className="p-6 md:p-8">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3 rounded"
              style={{ backgroundColor: BRAND.maroon }}
            >
              {selectedBlog.category}
            </span>

            {selectedBlog.isFeatured && (
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ml-2"
                style={{ backgroundColor: BRAND.gold }}
              >
                ⭐ Featured
              </span>
            )}

            <h2 className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}
            >
              {selectedBlog.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mb-6 pb-4"
              style={{ 
                borderBottom: `1px solid ${isDark ? '#333333' : '#E8E8E0'}`,
              }}
            >
              <span className="text-sm flex items-center gap-2"
                style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}
              >
                <FiCalendar size={16} style={{ color: BRAND.navy }} />
                {new Date(selectedBlog.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="text-sm flex items-center gap-2"
                style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}
              >
                <FiUser size={16} style={{ color: BRAND.maroon }} />
                {selectedBlog.author}
              </span>
              <span className="text-sm flex items-center gap-2"
                style={{ color: BRAND.gold }}
              >
                <FiClock size={14} />
                {calculateReadTime(selectedBlog.content)}
              </span>
              {selectedBlog.tag && (
                <span className="text-sm flex items-center gap-2"
                  style={{ color: BRAND.gold }}
                >
                  <FiTag size={14} />
                  {selectedBlog.tag}
                </span>
              )}
            </div>

            <div className="prose prose-lg max-w-none"
              style={{ 
                color: isDark ? '#D0D0D0' : '#1A1A1A',
              }}
            >
              <p className="leading-relaxed whitespace-pre-wrap">
                {selectedBlog.content}
              </p>
            </div>

            <div className="mt-8 pt-4 flex justify-end"
              style={{ 
                borderTop: `1px solid ${isDark ? '#333333' : '#E8E8E0'}`,
              }}
            >
              <button
                onClick={closePopup}
                className="px-8 py-3 text-white font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-90 hover:scale-[1.02] rounded-lg"
                style={{ 
                  backgroundColor: BRAND.gold,
                  boxShadow: `0 4px 20px ${BRAND.gold}44`,
                }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // =============================================
  // FIX: ALWAYS render content AND popup (both home and standalone)
  // =============================================
  const content = (
    <>
      {!isHomePage && (
        <>
          <Helmet>
            <title>Blog - Tradex TV</title>
            <meta name="description" content="Insights and articles from Tradex TV media production experts." />
          </Helmet>
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-10" style={{ backgroundColor: BRAND.navy }} />
                <h1 className="text-4xl md:text-5xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                  Our Blog
                </h1>
              </div>
              <p className="ml-4 text-lg" style={{ color: isDark ? '#A0A0A0' : '#6B6B6B' }}>
                Insights and stories from our team
              </p>
            </div>
          </div>
        </>
      )}
      <div className={!isHomePage ? "max-w-7xl mx-auto" : ""}>
        {renderBlogContent()}
      </div>
    </>
  );

  // Always render content AND popup
  return (
    <>
      {content}
      {renderPopup()}
    </>
  );
};

export default Blog;