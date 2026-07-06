
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiUser, FiBriefcase, FiStar, FiTv } from 'react-icons/fi';
import api from '../../services/api.js';
import HeroBanner from '../../components/common/HeroBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import HomeSections from '../../components/home/HomeSections.jsx';
import HomeVideos from '../../components/home/HomeVideos.jsx';
import AuthSection from '../../components/home/AuthSection.jsx';

import hero1 from '../../assets/hero/hero-1.jpg';
import hero2 from '../../assets/hero/hero-2.jpg';
import hero3 from '../../assets/hero/hero-3.jpg';
import hero4 from '../../assets/hero/hero-4.jpg';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
  navyLight: '#2A4A78',
  maroonLight: '#C54D42',
  goldLight: '#C6AF70',
};

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    title: 'Premium Broadcast Ready',
    description: 'State-of-the-art equipment and expert crew for stunning visual content delivery.',
    image: hero1,
    badge: 'Live Now',
    color: BRAND.navy,
    colorLight: BRAND.navyLight,
    videoId: '',
  },
  {
    id: 2,
    title: 'Content Creation Studio',
    description: 'Professional video production, editing, and content creation for the modern media landscape.',
    image: hero2,
    badge: 'Featured',
    color: BRAND.maroon,
    colorLight: BRAND.maroonLight,
    videoId: '',
  },
  {
    id: 3,
    title: 'TradeExTV Live',
    description: 'Experience premium media production and broadcasting at its finest.',
    image: hero3,
    badge: 'Premium',
    color: BRAND.gold,
    colorLight: BRAND.goldLight,
    videoId: '',
  },
  {
    id: 4,
    title: 'Studio Production',
    description: 'State-of-the-art equipment and expert crew for stunning visual content delivery.',
    image: hero4,
    badge: 'New Release',
    color: BRAND.navy,
    colorLight: BRAND.navyLight,
    videoId: '',
  }
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [heroVideos, setHeroVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingHero, setLoadingHero] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [heroMode, setHeroMode] = useState('slide');
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadVideos();
      loadHeroVideos();
    }
  }, []);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('tradextv_watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    const savedContinue = localStorage.getItem('tradextv_continue');
    if (savedContinue) {
      setContinueWatching(JSON.parse(savedContinue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tradextv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // ✅ Listen for auth open event from Navbar
  useEffect(() => {
    const handleOpenAuth = () => {
      setShowAuth(true);
      setTimeout(() => {
        const authElement = document.getElementById('auth-section');
        if (authElement) {
          const navbarHeight = 72;
          const elementPosition = authElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    window.addEventListener('openAuth', handleOpenAuth);
    return () => window.removeEventListener('openAuth', handleOpenAuth);
  }, []);

  const loadVideos = async () => {
    setLoadingVideos(true);
    try {
      const response = await api.get('/public/videos');
      if (response.data.success) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      console.error('Failed to load videos:', error.message);
      setVideos([]);
    } finally {
      setLoadingVideos(false);
    }
  };

  const loadHeroVideos = async () => {
    setLoadingHero(true);
    try {
      const response = await api.get('/public/hero/public');
      
      if (response.data.success && response.data.videos && response.data.videos.length > 0) {
        const transformed = response.data.videos.map((v, index) => ({
          id: v._id || index,
          title: v.title || 'Untitled Video',
          description: v.description || '',
          image: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
          badge: v.badge || 'Featured',
          color: v.color || BRAND.navy,
          colorLight: v.colorLight || BRAND.navyLight,
          videoId: v.videoId,
        }));
        setHeroVideos(transformed);
      } else {
        setHeroVideos(DEFAULT_HERO_SLIDES);
      }
    } catch (error) {
      console.error('Failed to load hero videos:', error.message);
      setHeroVideos(DEFAULT_HERO_SLIDES);
    } finally {
      setLoadingHero(false);
    }
  };

  const handleHeroPlay = (videoId) => {
    setHeroMode('video');
    setIsHeroVideoPlaying(true);
  };

  const handleHeroVideoEnd = () => {
    setIsHeroVideoPlaying(false);
    setTimeout(() => {
      setHeroMode('slide');
    }, 3000);
  };

  const handleCloseHeroVideo = () => {
    setIsHeroVideoPlaying(false);
    setHeroMode('slide');
  };

  const toggleWatchlist = (video) => {
    setWatchlist((prev) => {
      const exists = prev.find((v) => v.id === video.id);
      if (exists) {
        return prev.filter((v) => v.id !== video.id);
      } else {
        return [...prev, video];
      }
    });
  };

  const isInWatchlist = (videoId) => {
    return watchlist.some((v) => v.id === videoId);
  };

  const openAuth = () => {
    setShowAuth(true);
    setTimeout(() => {
      const authElement = document.getElementById('auth-section');
      if (authElement) {
        const navbarHeight = 72;
        const elementPosition = authElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const closeAuth = () => {
    setShowAuth(false);
  };

  if (loadingVideos || loadingHero) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#01110a]' : 'bg-white'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#B69F60] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const heroSlides = heroVideos;

  return (
    <>
      <Helmet>
        <title>TradeExTV - Premium Media Production</title>
        <meta
          name="description"
          content="Professional media production, broadcasting, and content creation services."
        />
      </Helmet>

      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-[#01110a]' : 'bg-white'
        }`}
      >
        <Navbar />

        <div id="home" className="pt-16 md:pt-20">
          <HeroBanner
            slides={heroSlides}
            mode={heroMode}
            isPlaying={isHeroVideoPlaying}
            onPlay={handleHeroPlay}
            onVideoEnd={handleHeroVideoEnd}
            onClose={handleCloseHeroVideo}
          />
        </div>

        <HomeVideos
          videos={videos}
          watchlist={watchlist}
          continueWatching={continueWatching}
          toggleWatchlist={toggleWatchlist}
          isInWatchlist={isInWatchlist}
          loading={loadingVideos}
        />

        <HomeSections />

        {/* ============================================= */}
        {/* CTA SECTION - NO GREEN */}
        {/* ============================================= */}
        {!isAuthenticated ? (
          <>
            <section
              className={`py-12 sm:py-16 md:py-20 border-t ${
                isDark
                  ? 'bg-[#0a0a0a] border-white/5'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                      boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                    }}
                  >
                    <FiTv  size={32} />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
                  >
                    Your Business Deserves <span style={{ color: BRAND.gold }}>Premium Exposure</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Join TradeExTV today and showcase your business to thousands of viewers. Get started with our premium advertising packages designed for businesses like yours.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
                    <button
                      onClick={openAuth}
                      className="px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center gap-2 text-sm sm:text-base"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                        boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                      }}
                    >
                      <FiUser size={18} />
                      Sign In / Register
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={openAuth}
                      className="px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 flex items-center gap-2 text-sm sm:text-base"
                      style={{
                        color: BRAND.navy,
                        borderColor: BRAND.gold,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                      }}
                    >
                      <FiBriefcase size={18} />
                      Register Your Business
                    </button>
                  </motion.div>

                  <p className={`text-xs mt-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span style={{ color: BRAND.gold }}>✦</span> Create your customer account to start advertising your business. 
                    <span className="block sm:inline"> Supervisors can manage requests after approval.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Auth Section */}
            <AuthSection isVisible={showAuth} onClose={closeAuth} />
          </>
        ) : (
          // ✅ AUTHENTICATED USER - Dashboard CTA
          <section
            className={`py-12 sm:py-16 md:py-20 border-t ${
              isDark
                ? 'bg-[#0a0a0a] border-white/5'
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl text-white mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                    boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                  }}
                >
                  <FiStar size={32} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                >
                  Welcome Back, <span style={{ color: BRAND.gold }}>{user?.firstName || 'Customer'}!</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Ready to take your business to the next level? Access your dashboard to manage your advertising requests and track your campaigns.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => {
                      if (user?.role === 'supervisor') {
                        navigate('/admin/overview');
                      } else if (user?.role === 'customer') {
                        navigate('/customer/dashboard');
                      } else {
                        navigate('/dashboard/report');
                      }
                    }}
                    className="px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center gap-2 text-sm sm:text-base"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                      boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                    }}
                  >
                    <FiShield size={18} />
                    Go to Dashboard
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>

                {user?.role === 'customer' && (
                  <p className={`text-xs mt-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span style={{ color: BRAND.gold }}>✦</span> Ready to submit a new advertising request or check your existing ones?
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Home;