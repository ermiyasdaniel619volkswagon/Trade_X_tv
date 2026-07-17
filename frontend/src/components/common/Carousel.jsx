
import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

const BRAND = {
  maroon: '#A53D32',
};

const ContinuousTrack = ({ items, direction = 'left', speed = 50 }) => {
  const trackRef = useRef(null);

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.getAnimations().forEach(anim => {
        anim.playbackRate = 0.2; 
      });
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.getAnimations().forEach(anim => {
        anim.playbackRate = 1; 
      });
    }
  };

  const loopItems = [...items, ...items];

  return (
    <div 
      className="flex gap-1.5 md:gap-2.5 w-max overflow-visible select-none cursor-pointer" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={trackRef}
        className="flex gap-1.5 md:gap-2.5 w-max will-change-transform"
        style={{
          animation: `${direction === 'left' ? 'scrollLeft' : 'scrollRight'} ${speed}s linear infinite`
        }}
      >
        {loopItems.map((child, index) => (
          <div 
            key={`${direction}-item-${index}`} 
            className="w-[230px] sm:w-[280px] md:w-[340px] lg:w-[390px] flex-shrink-0 transformation-gpu transition-transform duration-500 hover:scale-[1.04] z-10 hover:z-30"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

const Carousel = ({ title, children }) => {
  const { isDark } = useTheme();
  const childrenArray = React.Children.toArray(children);
  
  if (childrenArray.length === 0) return null;

  const half = Math.ceil(childrenArray.length / 2);
  const row1 = childrenArray.slice(0, half);
  const row2 = childrenArray.slice(half);
  const finalRow2 = row2.length > 0 ? row2 : row1;

  // Mixes Navy, Maroon, and Gold into an immersive ambient LED backlighting matrix
  const backgroundStyle = isDark ? {
    background: `
      radial-gradient(circle at 15% 20%, rgba(26, 50, 88, 0.35) 0%, transparent 50%), 
      radial-gradient(circle at 85% 80%, rgba(165, 61, 50, 0.25) 0%, transparent 50%), 
      radial-gradient(circle at 50% 50%, rgba(182, 159, 96, 0.12) 0%, transparent 60%), 
      #04060a
    `
  } : {
    background: `
      radial-gradient(circle at 15% 20%, rgba(26, 50, 88, 0.08) 0%, transparent 45%), 
      radial-gradient(circle at 85% 80%, rgba(165, 61, 50, 0.06) 0%, transparent 50%), 
      radial-gradient(circle at 50% 30%, rgba(182, 159, 96, 0.09) 0%, transparent 40%), 
      #f5f7fa
    `
  };

  return (
    <div 
      className="relative w-full overflow-hidden py-8 md:py-12 transition-all duration-700 ease-in-out"
      style={backgroundStyle}
    >
      
      {/* 3D Hardware Accelerated Loop Keyframes */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes scrollRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      {title && (
        <div className="container mx-auto px-4 md:px-8 relative z-30 mb-6">
          <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight border-l-4 pl-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}
              style={{ borderLeftColor: BRAND.maroon }}>
            {title}
          </h2>
        </div>
      )}

      {/* Tilted Geometric Ribbon Wall Wrapper */}
      <div className="relative w-full overflow-visible transform -rotate-[10.5deg] scale-[1.15] origin-center flex flex-col gap-1.5 md:gap-2.5">
        {/* Row 1 - Left Direction Flow */}
        <ContinuousTrack items={row1} direction="left" speed={25} />
        {/* Row 2 - Right Direction Flow */}
        <ContinuousTrack items={finalRow2} direction="right" speed={28} />
      </div>

      {/* Sidebar Edge Shading Vignettes blended with the active background tone */}
      <div className={`absolute inset-y-0 left-0 w-20 md:w-40 pointer-events-none z-20 bg-gradient-to-r ${isDark ? 'from-[#04060a]/80' : 'from-[#f5f7fa]/80'} to-transparent`} />
      <div className={`absolute inset-y-0 right-0 w-20 md:w-40 pointer-events-none z-20 bg-gradient-to-l ${isDark ? 'from-[#04060a]/80' : 'from-[#f5f7fa]/80'} to-transparent`} />
    </div>
  );
};

export default Carousel;
