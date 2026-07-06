

import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

// Imported logos based on your specified filenames
import enesra from '../../assets/enesra.png';
import tesbin from '../../assets/tesbin.png';
import logo from '../../assets/logo.png';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

// Configured links for the respective platforms
const CLIENT_LOGOS = [
  { id: 1, src: enesra, alt: 'Enisra', link: 'https://www.enisra.com' },
  { id: 2, src: tesbin, alt: 'Tesbinn', link: 'https://tesbinn.com/' },
  { id: 3, src: logo, alt: 'TradeX TV', link: null },
  { id: 4, src: enesra, alt: 'Enisra', link: 'https://www.enisra.com' },
  { id: 5, src: tesbin, alt: 'Tesbinn', link: 'https://tesbinn.com/' },
];

const Partnerships = () => {
  const { isDark } = useTheme();

  const colors = {
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#B0B0B0' : '#4A4A4A',
    background: isDark ? '#080808' : '#F8F9FA',
    cardBg: isDark ? '#111111' : '#FFFFFF',
    border: isDark ? '#2A2A2A' : '#E5E7EB',
  };

  // We triple the logos array to ensure the screen is filled and the infinite loop is seamless
  const duplicatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <div className="w-full py-12 md:py-16 border-t" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
      {/* Self-contained CSS for the smooth infinite marquee and pause-on-hover */}
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: infinite-scroll 15s linear infinite; /* Reduced from 25s to 15s for faster speed */
          }
          .scroll-container:hover .animate-infinite-scroll {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase" style={{ color: colors.text }}>
            Our <span style={{ color: BRAND.gold }}>Ecosystem</span>
          </h2>
          <p className="mt-3 text-base md:text-lg max-w-3xl leading-relaxed" style={{ color: colors.textSecondary }}>
            We operate an integrated network of digital platforms dedicated to driving real business growth and career advancement. From digital job-matching and practical skills training to seamless B2B networking and international trade facilitation, our ecosystem empowers individuals and enterprises to thrive in the global market.
          </p>
        </div>

        {/* Scrolling Clients Label */}
        <div className="mb-6">
          <span className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: BRAND.navy }}>
            Our Platforms
          </span>
        </div>

        {/* Infinite Scroll Ticker Container */}
        <div 
          className="scroll-container relative overflow-hidden flex items-center py-6 mb-12 
          before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-[color:var(--bg-color)] before:to-transparent 
          after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-[color:var(--bg-color)] after:to-transparent"
          style={{ '--bg-color': colors.background }}
        >
          <div className="animate-infinite-scroll gap-16 md:gap-24 items-center">
            {duplicatedLogos.map((logoItem, index) => (
              <div 
                key={index} 
                className={`flex-shrink-0 flex justify-center items-center w-28 md:w-36 h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 ${logoItem.link ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {logoItem.link ? (
                  <a 
                    href={logoItem.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex justify-center items-center"
                  >
                    <img 
                      src={logoItem.src} 
                      alt={logoItem.alt} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </a>
                ) : (
                  <img 
                    src={logoItem.src} 
                    alt={logoItem.alt} 
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Box */}
        <div 
          className="p-8 md:p-10 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <div className="max-w-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: colors.text }}>
              Discover Our Solutions
            </h3>
            <p style={{ color: colors.textSecondary }}>
              Whether you are a professional looking to upskill, an employer seeking top talent, or a business ready to expand into global markets, our platforms provide the comprehensive tools and connections you need to succeed.
            </p>
          </div>
         
        </div>

      </div>
    </div>
  );
};

export default Partnerships;