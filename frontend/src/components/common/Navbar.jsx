
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
  FiMenu, FiX, FiChevronDown, FiUser,
  FiLogOut, FiSun, FiMoon, FiShield,
  FiHome, FiRss, FiEdit2, FiInfo, FiHelpCircle, FiPackage, FiDollarSign
} from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

// Assets
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo2.png';

// =============================================
// ANIMATION VARIANTS
// =============================================
const navVariants = {
  hidden: {
    y: '-100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeInOut' }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const mobileMenuVariants = {
  hidden: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: 'easeInOut',
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const mobileItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: 0.2
    }
  }
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const lastScrollY = useRef(0);

  // =============================================
  // SCROLL DETECTION
  // =============================================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
        setIsUserMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 80) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      
      const sections = ['home', 'packages', 'currency-rates', 'news', 'blog', 'about', 'faq'];
      let current = 'home';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = id;
          }
        }
      });
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // =============================================
  // CLOSE MENUS ON RESIZE
  // =============================================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // =============================================
  // CLOSE MENUS ON CLICK OUTSIDE
  // =============================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =============================================
  // SMOOTH SCROLL TO SECTION
  // =============================================
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 72;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: 'smooth'
          });
        }
      }, 300);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 72;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      });
    }
  };

  // =============================================
  // NAV LINKS
  // =============================================
  const navLinks = [
    { to: '/', label: 'Home', sectionId: 'home', icon: FiHome },
    { to: '/', label: 'Packages', sectionId: 'packages', icon: FiPackage },
    { to: '/', label: 'Rates', sectionId: 'currency-rates', icon: FiDollarSign },
    { to: '/', label: 'News', sectionId: 'news', icon: FiRss },
    { to: '/', label: 'Blog', sectionId: 'blog', icon: FiEdit2 },
    { to: '/', label: 'About', sectionId: 'about', icon: FiInfo },
    { to: '/', label: 'FAQ', sectionId: 'faq', icon: FiHelpCircle },
  ];

  // =============================================
  // HANDLERS
  // =============================================
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getDashboardUrl = () => {
    if (!user) return '/dashboard/report';
    if (user.role === 'supervisor') return '/admin/overview';
    if (user.role === 'customer') return '/customer/dashboard';
    return '/dashboard/report';
  };

  const logoSrc = isDark ? logoDark : logoLight;
  const displayName = user?.firstName && user.firstName !== '' 
    ? user.firstName 
    : user?.email?.split('@')[0] || 'User';

  // =============================================
  // RENDER
  // =============================================
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 bg-black text-white overflow-hidden border-b border-white/10 flex items-center" role="region" aria-label="TRADE X TV contact information and announcements">
        <div className="navbar-ticker flex w-max whitespace-nowrap text-[11px] sm:text-xs font-medium tracking-wide">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              <span className="mx-5 sm:mx-8"> 8th Floor, Bole Medhanealem Building, Addis Ababa, Ethiopia</span>
              <span className="mx-5 sm:mx-8"> +251 90 400 4400</span>
              <span className="mx-5 sm:mx-8"> media@tradextv.com</span>
              <span className="mx-5 sm:mx-8"><span className="inline-block h-2 w-2 rounded-full bg-[#A53D32] mr-2 animate-pulse" />Live updates and the latest stories from TRADE X TV</span>
            </div>
          ))}
        </div>
      </div>

    <motion.nav
      initial="visible"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={navVariants}
      className={`fixed top-8 left-0 right-0 z-[999] transition-colors duration-500 ${
        scrolled
          ? isDark
            ? 'bg-[#0f1014]/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/50'
            : 'bg-white/95 backdrop-blur-2xl border-b border-[#1A3258]/10 shadow-xl shadow-[#1A3258]/5'
          : isDark
            ? 'bg-[#0f1014]/80 backdrop-blur-md border-b border-white/5'
            : 'bg-white/80 backdrop-blur-md border-b border-[#1A3258]/10'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center shrink-0 group"
            onClick={() => scrollToSection('home')}
          >
            <motion.img 
              src={logoSrc} 
              alt="TRADE X TV"
              className="h-7 sm:h-8 w-auto object-contain transition-all duration-500 group-hover:scale-105"
              whileHover={{ rotate: [-1, 1, -1, 0], transition: { duration: 0.5 } }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId && location.pathname === '/';
              return (
                <motion.button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  // Strictly Text Color and Drop-Shadow LED (No Background, No Underline)
                  className={`relative px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? 'text-[#B69F60] drop-shadow-[0_0_10px_rgba(182,159,96,0.8)]' // Gold LED Active (Dark Mode)
                        : 'text-[#1A3258] drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'    // Navy LED Active (Light Mode)
                      : isDark
                        ? 'text-white/70 hover:text-[#B69F60] hover:drop-shadow-[0_0_10px_rgba(182,159,96,0.8)]' // Gold LED Hover
                        : 'text-black/70 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'    // Navy LED Hover
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* YouTube Button */}
            <motion.a
              href="https://www.youtube.com/@tradextv7"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 border ${
                isDark 
                  ? 'bg-[#18181b] text-white border-white/10 hover:bg-[#27272a] hover:border-white/20' 
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="YouTube Channel"
            >
              <FaYoutube className="text-[#ff0000] text-base drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
              <span>YouTube</span>
            </motion.a>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDark
                  ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.5)]'
                  : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.4)]'
              }`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={22} /> : <FiMoon size={22} />}
            </motion.button>

            {/* Auth User Menu - Desktop */}
            <div className="hidden md:flex items-center">
              {isAuthenticated && (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'hover:bg-white/5 text-white/80'
                        : 'hover:bg-[#1A3258]/5 text-black/80'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* User Avatar - Mixes Navy, Maroon, and Gold in a gradient */}
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1A3258] via-[#A53D32] to-[#B69F60] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#A53D32]/20">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>
                      {displayName}
                    </span>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown size={18} className={isDark ? 'text-white/40' : 'text-black/40'} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`absolute right-0 mt-2 w-60 rounded-2xl shadow-2xl border overflow-hidden ${
                          isDark
                            ? 'bg-[#0f1014]/95 border-white/5 shadow-black/50 backdrop-blur-xl'
                            : 'bg-white border-[#1A3258]/10 shadow-[#1A3258]/10 backdrop-blur-xl'
                        }`}
                      >
                        <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-[#1A3258]/10'}`}>
                          <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-black'}`}>
                            {displayName}
                          </p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-2 space-y-1">
                          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                            <Link
                              to={getDashboardUrl()}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                                isDark
                                  ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.6)]'
                                  : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'
                              }`}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FiShield size={18} />
                              Dashboard
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                            <Link
                              to="/dashboard/profile"
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                                isDark
                                  ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.6)]'
                                  : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'
                              }`}
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FiUser size={18} />
                              Profile
                            </Link>
                          </motion.div>
                          <motion.button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                              isDark
                                ? 'text-[#A53D32]/80 hover:text-[#A53D32] hover:drop-shadow-[0_0_8px_rgba(165,61,50,0.8)]' // Maroon LED
                                : 'text-[#A53D32]/80 hover:text-[#A53D32] hover:drop-shadow-[0_0_8px_rgba(165,61,50,0.6)]' // Maroon LED
                            }`}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiLogOut size={18} />
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
                isDark
                  ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.5)]'
                  : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.4)]'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden border-t"
              ref={mobileMenuRef}
            >
              <div className={`py-4 space-y-2 ${isDark ? 'border-white/5' : 'border-[#1A3258]/10'}`}>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.sectionId && location.pathname === '/';
                  return (
                    <motion.button
                      key={link.sectionId}
                      variants={mobileItemVariants}
                      onClick={() => scrollToSection(link.sectionId)}
                      className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? isDark
                            ? 'text-[#B69F60] drop-shadow-[0_0_10px_rgba(182,159,96,0.8)]' // Gold Active LED (Dark)
                            : 'text-[#1A3258] drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'    // Navy Active LED (Light)
                          : isDark
                            ? 'text-white/70 hover:text-[#B69F60] hover:drop-shadow-[0_0_10px_rgba(182,159,96,0.8)]'
                            : 'text-black/70 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'
                      }`}
                    >
                      <link.icon size={20} />
                      {link.label}
                    </motion.button>
                  );
                })}

                {/* Mobile Professional YouTube Button */}
                <motion.a
                  variants={mobileItemVariants}
                  href="https://www.youtube.com/@tradextv7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 mt-4 mx-4 px-4 py-3 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border ${
                    isDark 
                      ? 'bg-[#18181b] text-white border-white/10 hover:bg-[#27272a]' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <FaYoutube className="text-[#ff0000] text-xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                  YouTube
                </motion.a>

                {/* Mobile Auth User Section */}
                {isAuthenticated && (
                  <div className={`pt-4 mt-4 border-t ${isDark ? 'border-white/5' : 'border-[#1A3258]/10'}`}>
                    <div className={`px-4 py-4 rounded-xl mb-3 ${isDark ? 'bg-white/5' : 'bg-[#1A3258]/5'}`}>
                      <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-black'}`}>
                        {displayName}
                      </p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to={getDashboardUrl()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium uppercase tracking-wider transition-all duration-300 ${
                        isDark
                          ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.6)]'
                          : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiShield size={18} />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium uppercase tracking-wider transition-all duration-300 ${
                        isDark
                          ? 'text-white/60 hover:text-[#B69F60] hover:drop-shadow-[0_0_8px_rgba(182,159,96,0.6)]'
                          : 'text-black/60 hover:text-[#1A3258] hover:drop-shadow-[0_0_8px_rgba(26,50,88,0.5)]'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium uppercase tracking-wider transition-all duration-300 ${
                        isDark
                          ? 'text-[#A53D32]/80 hover:text-[#A53D32] hover:drop-shadow-[0_0_8px_rgba(165,61,50,0.8)]'
                          : 'text-[#A53D32]/80 hover:text-[#A53D32] hover:drop-shadow-[0_0_8px_rgba(165,61,50,0.6)]'
                      }`}
                    >
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    </>
  );
};

export default Navbar;
