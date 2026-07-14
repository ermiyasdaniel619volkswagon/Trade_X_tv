
import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';

// Brand Colors
const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const About = ({ isHomePage = false }) => {
  const { isDark } = useTheme();

  const colors = {
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#B0B0B0' : '#4A4A4A',
  };

  const renderAboutContent = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Mission */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8" style={{ backgroundColor: BRAND.navy }} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: BRAND.navy }}>
            Mission
          </span>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
          To create an informed and innovative business society.
        </p>
      </div>

      {/* Vision */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8" style={{ backgroundColor: BRAND.maroon }} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: BRAND.maroon }}>
            Vision
          </span>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
          To be the leading business media in Africa by 2030.
        </p>
      </div>

      {/* About TradEthiopia */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8" style={{ backgroundColor: BRAND.gold }} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: BRAND.gold }}>
            About TradEthiopia
          </span>
        </div>
        <p className="text-base leading-relaxed mb-3" style={{ color: colors.textSecondary }}>
          TradEthiopia is an online B2B marketplace that aim to interlink businesses.
        </p>
        <p className="text-base leading-relaxed mb-3" style={{ color: colors.textSecondary }}>
          Our web based B2B platform is enabling farmers and other businesses to get potential local and international buyer for their products with a fair value at their convenience.
        </p>
        <p className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
          Also finding potential input suppliers at ease with a competitive price using just their cellphones without even traveling to a physical market place.
        </p>
      </div>

      {/* Tagline */}
      <div className="pt-4">
        <p className="text-lg font-medium text-center" style={{ color: BRAND.maroon }}>
          የመጀመሪያው ቢዝነስ ቴሌቪዥን እና ሬዲዮ በኢትዮጵያ!
        </p>
        <p className="text-base text-center mt-1" style={{ color: colors.textSecondary }}>
          Business TV & Radio | Tradextv. 
        </p>
      </div>

      {/* Thank You */}
      <div className="text-center pt-4">
        <p className="text-lg font-semibold" style={{ color: BRAND.navy }}>
        </p>
      </div>
    </div>
  );

  if (isHomePage) {
    return renderAboutContent();
  }

  return (
    <>
      <Helmet>
        <title>About - Tradex TV</title>
        <meta name="description" content="Learn about Tradex TV - leading business media production company." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10" style={{ backgroundColor: BRAND.navy }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: colors.text }}>
              About <span style={{ color: BRAND.gold }}>Tradex TV</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Connecting businesses effectively!
            </p>
            <div className="w-16 h-1" style={{ backgroundColor: BRAND.gold }} />
          </div>
        </div>

        {renderAboutContent()}
      </div>
    </>
  );
};

export default About;