import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowRight, FiAward, FiCamera, FiGlobe, FiLayers,
  FiRadio, FiTrendingUp, FiTv, FiZap
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const PACKAGES = [
  { name: 'Starter Visibility', price: '15,000 ETB', period: '/ week', description: '5 weekly TV advertisements supported by a targeted social media post.', badge: 'High Engagement', icon: FiTv },
  { name: 'Growth Partner', price: '35,000 ETB', period: '/ week', description: 'TV advertisements, on-screen logo placement, and a featured guest appearance.', badge: 'Popular Choice', icon: FiTrendingUp, featured: true },
  { name: 'Strategic Sponsor', price: '150K–250K ETB', period: '/ month', description: 'Premium sponsorship placements across a complete Tradex TV program.', badge: 'Enterprise Core', icon: FiAward },
  { name: 'Business Documentary', price: '80K–150K ETB', period: '', description: 'A high-definition, customized company-profile film produced by our team.', badge: 'Brand Focus', icon: FiCamera },
  { name: 'Embassy Promotion', price: '250K–450K ETB', period: '', description: 'Country-focused thematic-week content and professional media coverage.', badge: 'Global Scale', icon: FiGlobe },
  { name: 'Livestream Launch', price: '20K–45K ETB', period: '/ session', description: 'Live multi-platform production and broadcast for your product launch.', badge: 'Instant Leads', icon: FiRadio },
  { name: 'Studio Rental', price: '4,500 ETB', period: '/ session', description: 'One hour of professional multi-camera recording in our studio.', badge: 'Creator Hub', icon: FiLayers },
  { name: 'Digital Ads Boost', price: '10K–50K ETB', period: '/ campaign', description: 'Multi-platform campaign optimization designed to expand your audience.', badge: 'Social Reach', icon: FiZap },
];

const Packages = () => {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handlePackageClick = () => {
    if (isAuthenticated && user?.role === 'customer') {
      navigate('/customer/dashboard');
      return;
    }

    window.dispatchEvent(new Event('openAuth'));
  };

  return (
    <section
      id="packages"
      className={`relative overflow-hidden py-16 md:py-20 lg:py-24 ${isDark ? 'bg-[#0D0D0D]' : 'bg-[#fbf9f3]'}`}
      aria-labelledby="packages-title"
    >
      <div className="pointer-events-none absolute inset-0 brand-led-ambient" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#1A3258]/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#A53D32]/15 blur-3xl" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B69F60]/40 bg-[#B69F60]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B69F60]">
            <FiZap aria-hidden="true" /> Advertising Solutions
          </div>
          <h2 id="packages-title" className={`text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-[#1A3258]'}`}>
            Put Your Brand in the <span className="text-[#A53D32]">Spotlight</span>
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${isDark ? 'text-white/65' : 'text-[#1A3258]/70'}`}>
            Choose a professionally designed media package to reach more customers through television, digital platforms, live production, and premium storytelling.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.name}
                type="button"
                onClick={handlePackageClick}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -7 }}
                whileTap={{ scale: 0.98 }}
                className={`brand-led group relative flex min-h-[290px] flex-col overflow-hidden rounded-2xl border p-6 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69F60] focus-visible:ring-offset-2 ${
                  isDark
                    ? 'border-white/10 bg-[#101d33]/90 hover:border-[#B69F60]/60'
                    : 'border-[#1A3258]/10 bg-white hover:border-[#B69F60]/70'
                } ${item.featured ? 'sm:-translate-y-2' : ''}`}
                aria-label={`Choose ${item.name} and sign in`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1A3258] via-[#B69F60] to-[#A53D32]" />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#B69F60]/10 blur-2xl transition-all duration-500 group-hover:bg-[#A53D32]/20" aria-hidden="true" />

                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A3258] via-[#2A4A78] to-[#A53D32] text-xl text-white shadow-lg shadow-[#1A3258]/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-[#B69F60]/30 bg-[#B69F60]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#B69F60]">
                    {item.badge}
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1A3258]'}`}>{item.name}</h3>
                <div className="mt-3 flex flex-wrap items-end gap-1">
                  <span className="text-xl font-black text-[#A53D32]">{item.price}</span>
                  {item.period && <span className={`pb-0.5 text-xs ${isDark ? 'text-white/45' : 'text-[#1A3258]/55'}`}>{item.period}</span>}
                </div>
                <p className={`mt-4 flex-1 text-sm leading-6 ${isDark ? 'text-white/60' : 'text-[#1A3258]/65'}`}>{item.description}</p>

                <span className={`mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-[#B69F60]' : 'text-[#1A3258]'} group-hover:text-[#A53D32]`}>
                  Get started <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className={`mx-auto mt-9 max-w-2xl text-center text-xs ${isDark ? 'text-white/45' : 'text-[#1A3258]/55'}`}>
          Select any package to sign in or create a customer account. Custom packages are also available based on your campaign goals.
        </p>
      </div>
    </section>
  );
};

export default Packages;
