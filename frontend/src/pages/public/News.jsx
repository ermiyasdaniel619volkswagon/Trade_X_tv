

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api.js';
import { FiTag, FiUser, FiX } from 'react-icons/fi';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const News = ({ isHomePage = false }) => {
  const { isDark } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const intervalRef = useRef(null);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop',
  ];

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    if (loading || news.length <= 1 || isPopupOpen) {
      stopRotation();
      return;
    }

    stopRotation();
    intervalRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }
    }, 2000);

    return () => stopRotation();
  }, [news, loading, isPopupOpen, isHovering]);

  const stopRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/news/public');
      if (response.data.success) {
        const newsWithImages = response.data.news.map((item, index) => ({
          ...item,
          image: item.image?.trim() ? item.image : fallbackImages[index % fallbackImages.length],
        }));
        setNews(newsWithImages);
      }
    } catch (error) {
      console.error('Load news error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openPopup = (newsItem) => {
    setSelectedNews(newsItem);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div className="py-16 text-center font-sans text-xl tracking-wide" style={{ color: isDark ? '#666' : '#999' }}>
        Loading Latest News...
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-16 text-center font-sans text-xl tracking-wide" style={{ color: isDark ? '#666' : '#999' }}>
        No news available at the moment.
      </div>
    );
  }

  const displayNews = [...news];
  if (currentIndex > 0) {
    displayNews.splice(0, 0, displayNews.splice(currentIndex, 1)[0]);
  }

  const featuredNews = displayNews[0];
  const secondaryNews = displayNews.slice(1, 5);
  const latestNews = displayNews.slice(5);

  const tickerItems = [...news, ...news];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    // ✅ FIXED: Added explicit background color for light mode
    <div 
      className={`relative font-sans antialiased overflow-hidden ${
        !isHomePage ? 'max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10' : ''
      }`}
      style={{ 
        backgroundColor: isDark ? 'transparent' : '#FFFFFF',
      }}
    >
      <Helmet>
        <title>Latest News - Tradex TV</title>
        <meta name="description" content="Stay updated with the latest news and updates from Tradex TV" />
      </Helmet>

      <style>{`
        @keyframes scrollTicker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: scrollTicker 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        
        .light-effect-maroon { border: 1px solid transparent; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .light-effect-maroon:hover {
          border-color: ${BRAND.maroon};
          box-shadow: 0 0 30px 2px ${BRAND.maroon}50;
          transform: translateY(-3px);
        }

        .light-effect-gold { border: 1px solid transparent; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .light-effect-gold:hover {
          border-color: ${BRAND.gold};
          box-shadow: 0 0 25px 2px ${BRAND.gold}45;
          transform: translateY(-2px);
        }

        .light-effect-navy { border: 1px solid transparent; transition: all 0.4s ease; }
        .light-effect-navy:hover {
          border-color: ${BRAND.navy};
          box-shadow: 0 0 20px 2px ${BRAND.navy}40;
          background-color: ${isDark ? '#0b1524' : '#f4f7fa'};
        }
      `}</style>

      {/* Page Header */}
      {!isHomePage && (
        <div className="border-b-2 pb-4 mb-8 flex justify-between items-baseline" style={{ borderColor: BRAND.gold }}>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
            News Hub
          </h1>
          <div className="flex gap-4 items-baseline">
            <span className="hidden md:block font-sans text-xs md:text-sm tracking-widest font-black uppercase" style={{ color: BRAND.maroon }}>
              Dispatches from Tradex TV
            </span>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* MAIN 3-COLUMN EDITORIAL SYSTEM */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* LEFT COLUMN: Featured News (7 cols) */}
        <div
          // ✅ FIXED: Explicit white background in light mode
          className="lg:col-span-7 rounded-md p-2 light-effect-maroon cursor-pointer group"
          style={{
            backgroundColor: isDark ? '#0c0c0c' : '#FFFFFF',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => openPopup(featuredNews)}
        >
          <div className="layout-card-clean relative">
            <div className="aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-900 rounded-sm relative shadow-sm">
              <img 
                src={featuredNews.image} 
                alt={featuredNews.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="mt-4 px-1">
              <span className="font-sans text-xs md:text-sm font-black uppercase tracking-[0.2em]"
                    style={{ color: BRAND.maroon }}>
                {featuredNews.category || 'Featured Story'}
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black leading-tight mt-2" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                {featuredNews.title}
              </h2>
              
              <p className="text-sm md:text-base lg:text-17px font-sans font-normal leading-relaxed mt-3 line-clamp-3"
                 style={{ color: isDark ? '#B3B3B3' : '#4A4A4A' }}>
                {getExcerpt(featuredNews.content)}
              </p>
              
              <div className="flex items-center gap-2 mt-4 font-sans text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">
                <span style={{ color: BRAND.navy }}>{formatDate(featuredNews.date)}</span>
                <span>•</span>
                <span>Read Full Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Secondary News (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {secondaryNews.map((item) => (
            <div 
              key={item._id} 
              // ✅ FIXED: Explicit background in light mode
              className="group cursor-pointer p-4 rounded-md light-effect-gold flex flex-col justify-center min-h-[150px]"
              style={{
                backgroundColor: isDark ? 'rgba(24,24,24,0.3)' : '#F9FAFB',
              }}
              onClick={() => openPopup(item)}
            >
              <span className="block font-sans text-[10px] md:text-xs font-black uppercase tracking-[0.18em] mb-2"
                    style={{ color: BRAND.gold }}>
                {item.category || 'General'}
              </span>
              
              <h3 className="text-lg md:text-xl lg:text-2xl font-serif font-bold leading-snug tracking-tight mb-2 line-clamp-3"
                  style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                {item.title}
              </h3>
              
              <div className="mt-auto font-sans text-xs font-bold" style={{ color: isDark ? '#666' : '#9CA3AF' }}>
                {formatDate(item.date)}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Latest Sidebar (2 cols) */}
        <div className="lg:col-span-2">
          <div 
            className="sticky top-24 p-3 rounded-md border-t-2" 
            style={{ 
              borderColor: BRAND.navy,
              backgroundColor: isDark ? '#111111' : '#FFFFFF',
            }}
          >
            <div className="pb-2 mb-4 border-b" style={{ borderColor: isDark ? '#2a2a2a' : '#E5E7EB' }}>
              <h3 className="text-lg md:text-xl font-serif font-black tracking-tight" style={{ color: BRAND.navy }}>
                Latest
              </h3>
            </div>
            
            <div className="space-y-2">
              {latestNews.slice(0, 5).map((item, index) => (
                <div 
                  key={item._id} 
                  className="group cursor-pointer flex items-start gap-2 p-2 rounded-sm light-effect-navy"
                  onClick={() => openPopup(item)}
                >
                  <span className="font-sans text-sm font-black" style={{ color: BRAND.navy }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <span className="block font-sans text-[9px] font-bold uppercase tracking-widest" style={{ color: isDark ? '#666' : '#9CA3AF' }}>
                      {item.category || 'Update'}
                    </span>
                    <h4 className="text-xs md:text-sm font-serif font-bold leading-snug tracking-tight line-clamp-2"
                        style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* SCROLLING TICKER */}
      {/* ============================================= */}
      <div 
        className="relative mt-12 mb-6 overflow-hidden border-t-2 border-b-2 py-2.5 shadow-md rounded-sm" 
        style={{ 
          backgroundColor: BRAND.navy, 
          borderColor: BRAND.gold 
        }}
      >
        <div className="animate-ticker cursor-pointer">
          {tickerItems.map((item, idx) => (
            <div 
              key={`${item._id}-${idx}`} 
              className="flex items-center whitespace-nowrap mx-6 text-white hover:opacity-90 transition-opacity"
              onClick={() => openPopup(item)}
            >
              <span className="font-black text-xs md:text-sm uppercase tracking-wider mr-3" style={{ color: BRAND.gold }}>
                [{item.category || 'NEWS'}]
              </span>
              <span className="font-serif text-sm md:text-base font-bold tracking-wide mr-3">
                {item.title}
              </span>
              <span className="font-sans text-xs text-gray-300 mr-6">
                {getExcerpt(item.content, 50)}
              </span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND.maroon }} />
            </div>
          ))}
        </div>
      </div>

      {/* ============================================= */}
      {/* NEWS POPUP / MODAL */}
      {/* ============================================= */}
      {isPopupOpen && selectedNews && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-md"
          onClick={closePopup}
        >
          <div 
            className="w-full max-w-4xl max-h-[85vh] overflow-y-auto relative rounded-md shadow-2xl border-t-4"
            style={{ 
              boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 30px ${BRAND.maroon}30`,
              borderColor: BRAND.maroon,
              backgroundColor: isDark ? '#0e0e0e' : '#FFFFFF',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closePopup} 
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black rounded-full text-white transition-all border shadow-sm"
              style={{ borderColor: BRAND.gold }}
            >
              <FiX size={18}/>
            </button>

            <div className="w-full h-[300px] md:h-[380px] overflow-hidden bg-zinc-900 relative">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-10 relative -mt-12 rounded-t-2xl mx-3 md:mx-6"
                 style={{ backgroundColor: isDark ? '#0e0e0e' : '#FFFFFF' }}>
              <span className="inline-block font-sans text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-sm mb-4 text-white"
                    style={{ backgroundColor: BRAND.navy }}>
                {selectedNews.category || 'General'}
              </span>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black leading-tight mb-4"
                  style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                {selectedNews.title}
              </h2>
              
              <div className="flex items-center gap-3 font-sans text-sm pb-6 border-b mb-6"
                   style={{ 
                     borderColor: BRAND.gold,
                     color: isDark ? '#9CA3AF' : '#6B7280'
                   }}>
                <span className="font-bold">{formatDate(selectedNews.date)}</span>
                <span style={{ color: BRAND.maroon }}>•</span>
                <span className="uppercase tracking-widest font-bold text-xs">Tradex TV Desk</span>
              </div>
              
              <div 
                className="font-sans text-base md:text-lg leading-relaxed space-y-6 font-normal max-w-3xl"
                style={{ color: isDark ? '#D1D1D1' : '#333333' }}
              >
                <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default News;