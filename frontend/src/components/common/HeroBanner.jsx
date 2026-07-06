
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlay, FiInfo, FiX, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';

// Brand Colors - Fixed
const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
  navyLight: '#2A4A78',
  maroonLight: '#C54D42',
  goldLight: '#C6AF70',
};

const HeroBanner = ({ 
  slides, 
  mode = 'slide',
  isPlaying = false,
  onPlay,
  onVideoEnd,
  onClose,
  autoPlay = true,
  interval = 3000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const slideIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isMounted = useRef(true);
  const videoPlayerRef = useRef(null);
  const isAutoSliding = useRef(true);

  // Check if there are slides
  const hasSlides = slides && slides.length > 0;
  
  // Check if current slide has a valid video ID (for buttons)
  const getCurrentSlide = () => {
    return slides && slides.length > 0 ? slides[currentSlide] : null;
  };

  const slide = getCurrentSlide();
  const hasValidVideoId = slide && slide.videoId && slide.videoId.trim() !== '';

  // =============================================
  // ✅ FIXED: nextSlide with proper dependency management
  // =============================================
  const nextSlide = useCallback(() => {
    if (isTransitioning || mode === 'video' || !hasSlides || !isMounted.current) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => {
      if (isMounted.current) {
        setIsTransitioning(false);
      }
    }, 800);
  }, [isTransitioning, slides, mode, hasSlides]);

  // =============================================
  // ✅ FIXED: prevSlide with proper dependency management
  // =============================================
  const prevSlide = useCallback(() => {
    if (isTransitioning || mode === 'video' || !hasSlides || !isMounted.current) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => {
      if (isMounted.current) {
        setIsTransitioning(false);
      }
    }, 800);
  }, [isTransitioning, slides, mode, hasSlides]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || mode === 'video' || !hasSlides) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => {
      if (isMounted.current) {
        setIsTransitioning(false);
      }
    }, 800);
  };

  // =============================================
  // ✅ FIXED: Auto-slide effect with proper cleanup
  // =============================================
  useEffect(() => {
    if (mode === 'video' || !autoPlay || !hasSlides) return;

    // Reset progress on slide change
    setProgressWidth(0);

    // Progress interval
    progressIntervalRef.current = setInterval(() => {
      if (isMounted.current && mode === 'slide') {
        setProgressWidth((prev) => {
          if (prev >= 100) return 100;
          return prev + (100 / 30);
        });
      }
    }, 100);

    // Slide interval
    slideIntervalRef.current = setInterval(() => {
      if (isMounted.current && mode === 'slide' && !isTransitioning) {
        nextSlide();
      }
    }, interval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
  }, [mode, autoPlay, interval, hasSlides, nextSlide, isTransitioning]);

  // =============================================
  // ✅ FIXED: Reset progress on slide change
  // =============================================
  useEffect(() => {
    setProgressWidth(0);
  }, [currentSlide]);

  // Play button - opens YouTube in new tab (only if valid video)
  const handlePlayClick = () => {
    if (slide && slide.videoId) {
      window.open(`https://www.youtube.com/watch?v=${slide.videoId}`, '_blank');
    }
  };

  // Open Info Modal (only if valid video)
  const handleInfoClick = () => {
    if (slide && slide.videoId) {
      setShowInfoModal(true);
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    }
  };

  // Close Info Modal
  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    if (autoPlay && mode === 'slide' && hasSlides) {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
      slideIntervalRef.current = setInterval(() => {
        if (isMounted.current && mode === 'slide' && !isTransitioning) {
          nextSlide();
        }
      }, interval);
    }
  };

  // Handle video end event (for modal video)
  useEffect(() => {
    if (mode === 'video' && isPlaying && videoPlayerRef.current) {
      const iframe = videoPlayerRef.current;
      const handleMessage = (event) => {
        if (event.data === 'ended') {
          if (onVideoEnd) onVideoEnd();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [mode, isPlaying, onVideoEnd]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (mode === 'video') return;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchStartX - touchEndX < -50) prevSlide();
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // No slides - show nothing
  if (!hasSlides) {
    return null;
  }

  return (
    <>
      {/* ============================================= */}
      {/* HERO BANNER - Clean Image, No Overlay */}
      {/* ============================================= */}
      <div className="relative w-full bg-black">
        <div 
          className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] min-h-[350px] max-h-[700px] overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {mode === 'slide' ? (
            <>
              <div 
                className="absolute inset-0 transition-all duration-1000 ease-out"
                style={{ 
                  backgroundImage: `url(${slide.image || `https://img.youtube.com/vi/${slide.videoId}/hqdefault.jpg`})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${isTransitioning ? 1.08 : 1})`,
                }}
              />

              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                    style={{ borderColor: `${BRAND.navy}44` }}
                  >
                    <FiChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                    style={{ borderColor: `${BRAND.navy}44` }}
                  >
                    <FiChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
              >
                <FiX size={24} />
              </button>
              <div className="w-full max-w-5xl aspect-video mx-4">
                <iframe
                  ref={videoPlayerRef}
                  src={`https://www.youtube.com/embed/${slide?.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={slide?.title || 'Video Player'}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {mode === 'slide' && (
          <div 
            className="w-full border-t border-white/5 transition-all duration-1000 ease-out"
            style={{
              background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`,
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 70% 50%, ${BRAND.navyLight}55 0%, transparent 70%)`,
              }}
            />

            <div className="relative container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-2 sm:space-y-3">
                  {slide.badge && (
                    <span 
                      className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                      style={{ 
                        backgroundColor: BRAND.maroon,
                        boxShadow: `0 4px 15px ${BRAND.maroon}44`,
                      }}
                    >
                      {slide.badge}
                    </span>
                  )}

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>

                  {hasValidVideoId && (
                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
                      <button 
                        onClick={handlePlayClick}
                        className="px-4 sm:px-6 py-2 text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02] flex items-center gap-2 text-sm sm:text-base"
                        style={{ 
                          backgroundColor: BRAND.gold,
                          boxShadow: `0 4px 15px ${BRAND.gold}44`,
                        }}
                      >
                        <FiPlay size={16} className="sm:w-5 sm:h-5" />
                        <span>Watch on YouTube</span>
                      </button>

                      <button 
                        onClick={handleInfoClick}
                        className="px-4 sm:px-6 py-2 text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02] flex items-center gap-2 text-sm sm:text-base"
                        style={{ 
                          backgroundColor: BRAND.navy,
                          boxShadow: `0 4px 15px ${BRAND.navy}55`,
                        }}
                      >
                        <FiInfo size={16} className="sm:w-5 sm:h-5" />
                        <span>More Info</span>
                      </button>
                    </div>
                  )}
                </div>

                {slides.length > 1 && (
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex gap-1.5">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                          style={{
                            width: index === currentSlide ? '24px' : '8px',
                            backgroundColor: index === currentSlide 
                              ? BRAND.gold 
                              : 'rgba(255,255,255,0.2)',
                          }}
                        >
                          {index === currentSlide && (
                            <div 
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: BRAND.gold,
                                width: `${progressWidth}%`,
                                transition: 'width 0.1s linear',
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <span className="text-xs font-medium text-white/60">
                      {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* More Info Modal */}
      {showInfoModal && slide && hasValidVideoId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onClick={handleCloseInfoModal}
        >
          <div 
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
            style={{ 
              backgroundColor: '#1A1A1A',
              border: `1px solid #333333`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseInfoModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
              }}
            >
              <FiX size={24} />
            </button>

            <div className="p-6 md:p-8">
              {slide.badge && (
                <span 
                  className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4"
                  style={{ 
                    backgroundColor: BRAND.maroon,
                  }}
                >
                  {slide.badge}
                </span>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {slide.title}
              </h2>

              <div className="mb-6 pb-4">
                <p className="text-sm text-white/70 leading-relaxed">
                  {slide.description || 'No description available.'}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${slide.videoId}`, '_blank');
                    handleCloseInfoModal();
                  }}
                  className="w-full py-3 text-white font-semibold rounded-xl transition-all duration-300 hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: BRAND.gold,
                    boxShadow: `0 4px 15px ${BRAND.gold}44`,
                  }}
                >
                  <FiExternalLink size={18} />
                  Watch on YouTube
                </button>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleCloseInfoModal}
                  className="w-full py-2.5 text-white/60 font-medium rounded-xl transition-all duration-300 hover:text-white hover:bg-white/5 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroBanner;