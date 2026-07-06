
import React, { useState, useEffect } from 'react';
import { FiPlay, FiEye } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext.jsx';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];

const VideoCard = ({ 
  videoId, 
  title, 
  channelName, 
  views, 
  duration,
  thumbnail,
  isInWatchlist,
  isContinueWatching,
  progress = 0,
  className = '',
  onClick = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [qualityIndex, setQualityIndex] = useState(0);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const { isDark } = useTheme();

  const currentThumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/${THUMBNAIL_QUALITIES[qualityIndex]}.jpg`;

  useEffect(() => {
    if (!videoId || thumbnail) return;
    const img = new Image();
    img.src = currentThumbnailUrl;
    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => {
      if (qualityIndex < THUMBNAIL_QUALITIES.length - 1) {
        setQualityIndex(prev => prev + 1);
      } else {
        setFallbackFailed(true);
      }
    };
    return () => { img.onload = null; img.onerror = null; };
  }, [videoId, thumbnail, currentThumbnailUrl, qualityIndex]);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
    }
  };

  const formatViews = (viewCount) => {
    if (!viewCount) return '0';
    const num = typeof viewCount === 'string' ? parseInt(viewCount, 10) : viewCount;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      className={`relative w-full aspect-video group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 
        ========================================================
        LED BLOOM BACKDROP LAYER
        This creates the actual "LED Strip" effect behind the card
        ========================================================
      */}
      <style>{`
        @keyframes ledFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-led {
          background: linear-gradient(270deg, ${BRAND.navy}, ${BRAND.maroon}, ${BRAND.gold}, ${BRAND.navy});
          background-size: 300% 300%;
          animation: ledFlow 5s ease infinite;
        }
      `}</style>
      
      <div 
        className={`absolute -inset-1 md:-inset-1.5 rounded-lg blur-md transition-all duration-500 animate-led will-change-transform ${
          isDark 
            ? (isHovered ? 'opacity-100 scale-105' : 'opacity-40 scale-100')
            : (isHovered ? 'opacity-80 scale-105' : 'opacity-30 scale-100')
        }`}
      />

      {/* 
        ========================================================
        ACTUAL VIDEO CARD CONTENT
        Sits on top of the LED layer, blocking the center so only the edges glow
        ========================================================
      */}
      <div className={`relative w-full h-full overflow-hidden border transition-all duration-500 z-10 ${
        isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5'
      } ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}>
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
          {!fallbackFailed && (
            <img
              src={currentThumbnailUrl}
              alt={title || 'Show Frame'}
              className={`w-full h-full object-cover transform transition-all duration-700 ease-out will-change-transform ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              loading="lazy"
            />
          )}
          <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black via-black/20 to-transparent ${
            isHovered ? 'opacity-85' : 'opacity-55'
          }`} />
        </div>

        {isInWatchlist && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-black text-white uppercase tracking-widest border-l-2 z-20" style={{ borderColor: BRAND.gold }}>
            WATCHLIST
          </div>
        )}

        {isContinueWatching && progress > 0 && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-zinc-800 z-20">
            <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: BRAND.maroon }} />
          </div>
        )}

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className={`w-11 h-11 border flex items-center justify-center transition-all duration-500 bg-black/60 backdrop-blur-sm transform ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`} style={{ borderColor: BRAND.gold }}>
            <FiPlay className="text-white text-lg ml-0.5" />
          </div>
        </div>

        {duration && (
          <div className={`absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-black/80 text-[9px] font-mono text-white tracking-wider z-20 transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}>
            {duration}
          </div>
        )}

        {/* Metadata Bottom Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <h4 className="font-black text-sm sm:text-base text-white tracking-wide uppercase line-clamp-1 mb-1 drop-shadow-md">
            {title || 'UNTITLED BROADCAST'}
          </h4>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-white uppercase tracking-widest px-1.5 py-0.5" style={{ backgroundColor: BRAND.maroon }}>
              {channelName || 'TRADEX'}
            </span>
            {views !== undefined && (
              <span className="text-[9px] font-bold text-zinc-300 flex items-center gap-1 uppercase tracking-wider">
                <FiEye size={10} /> {formatViews(views)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;