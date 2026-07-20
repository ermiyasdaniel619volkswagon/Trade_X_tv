
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
  FiHome, FiInfo, FiRss, FiEdit2, FiHelpCircle,
  FiMail, FiPhone, FiMapPin, FiYoutube, FiLinkedin, FiTwitter,
  FiX, FiExternalLink
} from 'react-icons/fi';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo2.png';

// Brand Colors - Only these 3 colors
const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const Footer = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const logoSrc = isDark ? logoDark : logoLight;

  // Contact Information
  const contactInfo = {
    email: 'media@tradextv.com',
    phone: '+251 90 400 4400',
    location: 'https://maps.app.goo.gl/9eUcT162pnvTkdmz9',
    locationAddress: '8th Floor, Bole Medhanealem Building, Addis Ababa, Ethiopia',
    youtube: 'https://www.youtube.com/@tradextv7',
    linkedin: 'https://www.linkedin.com/showcase/tetv/posts/?feedView=all',
    twitter: 'https://x.com/tradeethio83150',
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 72;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      return true;
    }
    return false;
  };

  const handleFooterLinkClick = (e, sectionId) => {
    e.preventDefault();
    
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        let attempts = 0;
        const maxAttempts = 5;
        const tryScroll = () => {
          if (scrollToSection(sectionId)) {
            return;
          }
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(tryScroll, 300);
          }
        };
        setTimeout(tryScroll, 300);
      }, 100);
      return;
    }

    scrollToSection(sectionId);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLocationClick = () => {
    setShowLocationPopup(true);
  };

  const closeLocationPopup = () => {
    setShowLocationPopup(false);
  };

  const footerLinks = [
    { to: '/', label: 'Home', sectionId: 'home', icon: FiHome },
    { to: '/about', label: 'About', sectionId: 'about', icon: FiInfo },
    { to: '/news', label: 'News', sectionId: 'news', icon: FiRss },
    { to: '/blog', label: 'Blog', sectionId: 'blog', icon: FiEdit2 },
    { to: '/faq', label: 'FAQ', sectionId: 'faq', icon: FiHelpCircle },
  ];

  // Social Links
  const socialLinks = [
    { icon: FiYoutube, label: 'YouTube', href: contactInfo.youtube },
    { icon: FiLinkedin, label: 'LinkedIn', href: contactInfo.linkedin },
    { icon: FiTwitter, label: 'Twitter', href: contactInfo.twitter },
  ];

  return (
    <>
      <footer className={`w-full border-t ${
        isDark 
          ? 'bg-[#1A3258] border-[#A53D32]' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleHomeClick}
              className="transition-all duration-500 ease-in-out hover:scale-105"
            >
              <img 
                src={logoSrc} 
                alt="TradeEthiopia TV" 
                className="h-16 md:h-20 w-auto object-contain" 
              />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8">
            {footerLinks.map((link) => {
              const Icon = link.icon;
              if (link.sectionId === 'home') {
                return (
                  <button
                    key={link.to}
                    onClick={handleHomeClick}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:scale-105 ${
                      isDark 
                        ? 'text-white hover:text-[#B69F60]' 
                        : 'text-gray-600 hover:text-[#1A3258]'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </button>
                );
              }
              return (
                <button
                  key={link.to}
                  onClick={(e) => handleFooterLinkClick(e, link.sectionId)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:scale-105 ${
                    isDark 
                      ? 'text-white hover:text-[#B69F60]' 
                      : 'text-gray-600 hover:text-[#1A3258]'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className={`w-full max-w-md mx-auto mb-8`}>
            <div className={`w-full border-t ${isDark ? 'border-[#B69F60]' : 'border-gray-200'}`} />
          </div>

          {/* ============================================= */}
          {/* CONTACT INFORMATION - Using only brand colors */}
          {/* ============================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Email */}
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                isDark ? 'bg-[#A53D32]/20' : 'bg-gray-50'
              }`}>
                <FiMail size={22} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-500'}`}>Email</p>
              <a 
                href={`mailto:${contactInfo.email}`}
                className={`text-sm font-semibold transition-colors hover:scale-105 ${
                  isDark ? 'text-[#B69F60] hover:text-white' : 'text-[#1A3258] hover:text-[#A53D32]'
                }`}
              >
                {contactInfo.email}
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                isDark ? 'bg-[#A53D32]/20' : 'bg-gray-50'
              }`}>
                <FiPhone size={22} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-500'}`}>Phone</p>
              <a 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className={`text-sm font-semibold transition-colors hover:scale-105 ${
                  isDark ? 'text-[#B69F60] hover:text-white' : 'text-[#1A3258] hover:text-[#A53D32]'
                }`}
              >
                {contactInfo.phone}
              </a>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center text-center cursor-pointer" onClick={handleLocationClick}>
              <div className={`p-3 rounded-xl mb-3 ${
                isDark ? 'bg-[#A53D32]/20' : 'bg-gray-50'
              }`}>
                <FiMapPin size={22} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-500'}`}>Location</p>
              <span className={`text-sm font-semibold transition-colors hover:scale-105 flex items-center gap-1 ${
                isDark ? 'text-[#B69F60] hover:text-white' : 'text-[#1A3258] hover:text-[#A53D32]'
              }`}>
                Bole Medhanealem
                <FiExternalLink size={12} />
              </span>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                isDark ? 'bg-[#A53D32]/20' : 'bg-gray-50'
              }`}>
                <FiYoutube size={22} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-500'}`}>Follow Us</p>
              <div className="flex items-center gap-3 mt-1">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      isDark ? 'hover:bg-[#A53D32]/20' : 'hover:bg-gray-100'
                    }`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={`w-full max-w-md mx-auto mb-6`}>
            <div className={`w-full border-t ${isDark ? 'border-[#B69F60]' : 'border-gray-200'}`} />
          </div>

          {/* Copyright */}
          <div className={`text-center text-xs ${isDark ? 'text-[#B69F60]' : 'text-gray-400'}`}>
            &copy; {currentYear} TradeX TV. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ============================================= */}
      {/* LOCATION POPUP - Using only brand colors */}
      {/* ============================================= */}
      {showLocationPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeLocationPopup}
        >
          <div 
            className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-[#1A3258] border border-[#B69F60]' : 'bg-white border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Navy */}
            <div className="px-6 py-4 bg-[#1A3258]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-[#B69F60]" size={20} />
                  <h3 className="text-lg font-bold text-white">Our Location</h3>
                </div>
                <button
                  onClick={closeLocationPopup}
                  className="p-1.5 rounded-lg hover:bg-[#A53D32]/20 text-white/70 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-[#A53D32]/20' : 'bg-gray-50'
                }`}>
                  <FiMapPin size={24} style={{ color: isDark ? '#B69F60' : '#1A3258' }} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    Address
                  </p>
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#1A3258]'}`}>
                    Bole Medhanealem 
                    <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#1A3258]'}`}>  HelzerTower</span>
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                    8th Floor, Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              {/* Open in Google Maps Button - Using Maroon */}
              <a
                href={contactInfo.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: '#A53D32',
                  boxShadow: `0 4px 20px ${'#A53D32'}44`,
                }}
              >
                <FiExternalLink size={18} />
                Open in Google Maps
              </a>

              <button
                onClick={closeLocationPopup}
                className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isDark 
                    ? 'text-[#B69F60] hover:text-white hover:bg-[#A53D32]/20' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Close
              </button>
            </div>

            {/* Bottom Gold Accent */}
            <div className="h-1 w-full bg-[#B69F60]" />
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
