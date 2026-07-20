

import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { FiRss, FiEdit2, FiInfo, FiHelpCircle } from 'react-icons/fi';

import NewsPage from '../../pages/public/News.jsx';
import BlogPage from '../../pages/public/Blog.jsx';
import AboutPage from '../../pages/public/About.jsx';
import FAQPage from '../../pages/public/FAQ.jsx';

// Import the new Partnerships component
import Partnerships from './Partnerships.jsx';
import Packages from './Packages.jsx';
import CurrencyMarket from './CurrencyMarket.jsx';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const HomeSections = () => {
  const { isDark } = useTheme();

  const colors = {
    navy: BRAND.navy,
    maroon: BRAND.maroon,
    gold: BRAND.gold,
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#B0B0B0' : '#4A4A4A',
    background: isDark ? '#0D0D0D' : '#FFFFFF',
    backgroundAlt: isDark ? '#1A1A1A' : '#FFFFFF',
    border: isDark ? '#333333' : '#E8E8E0',
  };

  const SectionWrapper = ({ children, className = '', id = '', style = {} }) => (
    <div 
      id={id} 
      className={`w-full py-16 md:py-20 lg:py-24 ${className}`}
      style={{ backgroundColor: colors.background, ...style }}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );

  // =============================================
  // NEWS SECTION
  // =============================================
  const NewsSection = () => (
    <SectionWrapper id="news">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8" style={{ backgroundColor: colors.navy }} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.navy }}>
              Stay Informed
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            Latest <span style={{ color: colors.gold }}>News</span>
          </h2>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Updates and insights from our team
          </p>
          <div className="mt-3 w-16 h-1" style={{ backgroundColor: colors.gold }} />
        </div>

        <NewsPage isHomePage={true} />
      </div>
    </SectionWrapper>
  );

  // =============================================
  // BLOG SECTION
  // =============================================
  const BlogSection = () => (
    <SectionWrapper id="blog" style={{ backgroundColor: colors.backgroundAlt }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8" style={{ backgroundColor: colors.maroon }} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.maroon }}>
              Insights
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            From Our <span style={{ color: colors.gold }}>Blog</span>
          </h2>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Expert analysis and commentary from our team
          </p>
          <div className="mt-3 w-16 h-1" style={{ backgroundColor: colors.gold }} />
        </div>

        <BlogPage isHomePage={true} />
      </div>
    </SectionWrapper>
  );

  // =============================================
  // ABOUT SECTION
  // =============================================
  const AboutSection = () => (
    <SectionWrapper id="about">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8" style={{ backgroundColor: colors.navy }} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.navy }}>
              About Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            About <span style={{ color: colors.gold }}>TradeX TV</span>
          </h2>
          <p className="mt-2 text-lg" style={{ color: colors.textSecondary }}>
            Welcome to TradeX TV Zillion News!!
          </p>
          
          <div className="mt-4 overflow-hidden">
            <div 
              className="flex items-center gap-6 whitespace-nowrap animate-marquee"
              style={{ 
                animationDuration: '25s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            >
              <span className="text-lg font-medium" style={{ color: colors.maroon }}>
                Inform Markets |
              </span>
              <span className="text-lg font-medium" style={{ color: colors.navy }}>
                 Connect Businesses |
              </span>
              <span className="text-lg font-medium" style={{ color: colors.gold }}>
                 Create Opportunities 
              </span>
            </div>
          </div>
        </div>

        <AboutPage isHomePage={true} />
      </div>
    </SectionWrapper>
  );

  // =============================================
  // FAQ SECTION
  // =============================================
  const FAQSection = () => (
    <SectionWrapper id="faq" style={{ backgroundColor: colors.backgroundAlt }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-1 h-8" style={{ backgroundColor: colors.maroon }} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: colors.maroon }}>
              Help Center
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: colors.text }}>
            Frequently Asked <span style={{ color: colors.gold }}>Questions</span>
          </h2>
          <p className="mx-auto mt-2 text-lg max-w-2xl" style={{ color: colors.textSecondary }}>
            Find answers to common questions about our platform
          </p>
          <div className="mt-3 w-16 h-1 mx-auto" style={{ backgroundColor: colors.gold }} />
        </div>

        <FAQPage isHomePage={true} />
      </div>
    </SectionWrapper>
  );

  return (
    <>
      <NewsSection />
      <BlogSection />
      <Packages />
      <CurrencyMarket />
      <AboutSection />
     <FAQSection />
      <Partnerships />
    </>
  );
};

export default HomeSections;
