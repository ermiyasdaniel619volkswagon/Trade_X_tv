

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo2.png';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...', size = 'md' }) => {
  const { isDark } = useTheme();
  const [dots, setDots] = useState('');

  const logoSrc = isDark ? logoDark : logoLight;

  // ✅ Size configurations
  const sizes = {
    sm: {
      logo: 'w-12 h-12',
      ring: 'w-16 h-16',
      text: 'text-sm',
      gap: 'gap-3',
    },
    md: {
      logo: 'w-16 h-16',
      ring: 'w-24 h-24',
      text: 'text-base',
      gap: 'gap-4',
    },
    lg: {
      logo: 'w-24 h-24',
      ring: 'w-32 h-32',
      text: 'text-lg',
      gap: 'gap-5',
    },
  };

  const currentSize = sizes[size] || sizes.md;

  // ✅ Animated dots effect
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  const SpinnerContent = () => (
    <div className={`flex flex-col items-center justify-center ${currentSize.gap}`}>
      {/* Outer Ring with Gradient */}
      <div className="relative">
        {/* Pulsing background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${isDark ? '#34d399' : '#10b981'} 0%, transparent 70%)`,
            transform: 'scale(1.2)',
          }}
        />
        
        {/* Main Spinner Ring */}
        <div 
          className={`relative ${currentSize.ring} rounded-full animate-spin-slow`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${isDark ? '#34d399' : '#10b981'} 40%, ${isDark ? '#059669' : '#047857'} 70%, transparent 100%)`,
            padding: '3px',
            animationDuration: '1.8s',
          }}
        >
          {/* Inner Circle with Logo */}
          <div 
            className={`w-full h-full rounded-full flex items-center justify-center`}
            style={{
              background: isDark ? '#1a1a1a' : '#ffffff',
            }}
          >
            <div className={`${currentSize.logo} animate-bounce-soft`}>
              <img 
                src={logoSrc} 
                alt="TradeEthiopia TV" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Decorative Orbiting Dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-orbit`}
              style={{
                backgroundColor: isDark ? '#34d399' : '#10b981',
                top: '50%',
                left: '50%',
                animationDelay: `${i * 0.6}s`,
                transformOrigin: '0 0',
                boxShadow: `0 0 10px ${isDark ? '#34d39966' : '#10b98166'}`,
                '--orbit-radius': `${currentSize.ring === 'w-32 h-32' ? '64' : currentSize.ring === 'w-24 h-24' ? '48' : '32'}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Message with Animated Dots */}
      <div className="flex items-center gap-2">
        <span className={`font-medium ${currentSize.text} transition-colors duration-300`}
          style={{ color: isDark ? '#e5e7eb' : '#374151' }}
        >
          {message}
        </span>
        <span className={`${currentSize.text} font-medium`}
          style={{ color: isDark ? '#34d399' : '#10b981' }}
        >
          {dots}
        </span>
      </div>

      {/* Subtle Tip */}
      <div className="mt-2 text-[10px] transition-colors duration-300 opacity-50"
        style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
      >
        Please wait while we prepare your experience...
      </div>
    </div>
  );

  // Full Screen Layout
  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 100%)'
            : 'radial-gradient(ellipse at center, #f0fdf4 0%, #ffffff 100%)',
        }}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                backgroundColor: isDark ? `rgba(52, 211, 153, ${Math.random() * 0.3 + 0.1})` : `rgba(16, 185, 129, ${Math.random() * 0.3 + 0.1})`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  // Inline Layout
  return (
    <div className="flex items-center justify-center p-4">
      <SpinnerContent />
    </div>
  );
};

export default LoadingSpinner;