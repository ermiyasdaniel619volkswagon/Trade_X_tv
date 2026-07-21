
import React, { useEffect, useRef } from 'react';
import { FiX, FiPlus, FiCheck, FiClock, FiEye, FiCalendar } from 'react-icons/fi';

const VideoModal = ({ 
  isOpen, 
  video, 
  onClose, 
  onWatchlistToggle,
  isInWatchlist,
  brandColors 
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const colors = brandColors || {
    navy: '#1A3258',
    maroon: '#A53D32',
    gold: '#B69F60',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: `0 50px 100px -12px ${colors.navy}66`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white transition-all duration-300 hover:scale-110"
        >
          <FiX size={24} />
        </button>

        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <FiClock size={14} />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FiEye size={14} />
                  {video.views}
                </span>
                {video.date && (
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    {new Date(video.date).toLocaleDateString()}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                  backgroundColor: `${colors.navy}44`,
                  color: colors.navy,
                }}>
                  {video.category || 'General'}
                </span>
              </div>
            </div>

            <button
              onClick={onWatchlistToggle}
              className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 whitespace-nowrap"
              style={{
                backgroundColor: isInWatchlist ? `${colors.gold}33` : `${colors.gold}22`,
                border: `1px solid ${colors.gold}44`,
                color: colors.gold,
              }}
            >
              {isInWatchlist ? (
                <>
                  <FiCheck size={18} />
                  Added to Watchlist
                </>
              ) : (
                <>
                  <FiPlus size={18} />
                  Add to Watchlist
                </>
              )}
            </button>
          </div>

          {video.description && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">About</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Channel:</span>
                <span className="text-zinc-300 ml-2">{video.channel || 'TRADE X TV Official'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Views:</span>
                <span className="text-zinc-300 ml-2">{video.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;