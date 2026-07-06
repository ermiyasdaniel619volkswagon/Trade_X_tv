
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import Carousel from '../common/Carousel.jsx';
import VideoCard from '../common/VideoCard.jsx';

const BRAND = {
  maroon: '#A53D32',
};

const HomeVideos = ({
  videos = [],
  watchlist = [],
  continueWatching = [],
  toggleWatchlist = () => {},
  isInWatchlist = () => false,
  loading = false,
  onVideoClick = () => {},
}) => {
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredVideos, setFilteredVideos] = useState([]);

  const filters = [
    { id: 'all', label: 'ALL SHOWS' },
    { id: 'featured', label: 'FEATURED' },
    { id: 'company', label: 'ORIGINALS' },
    { id: 'popular', label: 'TRENDING' },
  ];

  const transformVideo = (dbVideo) => ({
    id: dbVideo.videoId,
    title: dbVideo.title,
    channel: dbVideo.channel || 'Network TV',
    views: dbVideo.views,
    duration: dbVideo.duration || '0:00',
    category: dbVideo.category || 'General',
    isFeatured: dbVideo.isFeatured || false,
    thumbnail: dbVideo.thumbnail || null,
  });

  useEffect(() => {
    if (!videos.length) {
      setFilteredVideos([]);
      return;
    }

    let filtered = [];
    switch (activeFilter) {
      case 'all':
        filtered = videos.filter(v => v.isActive !== false);
        break;
      case 'featured':
        filtered = videos.filter(v => v.isFeatured && v.isActive !== false);
        break;
      case 'company':
        filtered = videos.filter(v => (v.category === 'Company' || v.category === 'General') && v.isActive !== false);
        break;
      case 'popular':
        filtered = [...videos]
          .filter(v => v.isActive !== false)
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 16);
        break;
      default:
        filtered = videos.filter(v => v.isActive !== false);
    }
    setFilteredVideos(filtered);
  }, [videos, activeFilter]);

  const displayVideos = filteredVideos.map(transformVideo);

  // Synchronized color matching for structural consistency
  const containerBackgroundStyle = isDark ? {
    background: `
      radial-gradient(circle at 15% 0%, rgba(26, 50, 88, 0.2) 0%, transparent 40%), 
      #04060a
    `
  } : {
    background: `
      radial-gradient(circle at 15% 0%, rgba(26, 50, 88, 0.04) 0%, transparent 40%), 
      #f5f7fa
    `
  };

  if (loading) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center transition-all duration-700" style={containerBackgroundStyle}>
        <div className="w-10 h-10 border-4 border-t-transparent animate-spin" style={{ borderColor: BRAND.maroon }} />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden transition-all duration-700 ease-in-out" style={containerBackgroundStyle}>
      <div className="container mx-auto px-4 md:px-8 pt-4">
        {/* Navigation Category Filter Row */}
        <div className={`flex flex-wrap items-center gap-6 md:gap-10 border-b pb-2 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative py-2 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                activeFilter === filter.id 
                  ? (isDark ? 'text-white' : 'text-zinc-900')
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[3px]" style={{ backgroundColor: BRAND.maroon }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Diagonal Grid Injection */}
      {displayVideos.length > 0 ? (
        <Carousel>
          {displayVideos.map((video) => {
            const isContinue = continueWatching.some(v => v.id === video.id);
            const progress = continueWatching.find(v => v.id === video.id)?.progress || 0;
            
            return (
              <VideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
                channelName={video.channel}
                views={video.views}
                duration={video.duration}
                thumbnail={video.thumbnail}
                isInWatchlist={isInWatchlist(video.id)}
                isContinueWatching={isContinue}
                progress={progress}
                onClick={() => onVideoClick(video)}
              />
            );
          })}
        </Carousel>
      ) : (
        <div className="text-center py-16 font-black tracking-widest text-xs uppercase text-zinc-500">
          No Broadcasts Found
        </div>
      )}
    </div>
  );
};

export default HomeVideos;