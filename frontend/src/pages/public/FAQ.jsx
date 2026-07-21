

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FiHelpCircle, 
  FiPlus, 
  FiMinus,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiCheckCircle
} from 'react-icons/fi';

const FAQ = ({ isHomePage = false }) => {
  const { isDark } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const colors = {
    primary: isDark ? '#34d399' : '#10b981',
    primaryLight: isDark ? '#064e3b' : '#d1fae5',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#A0A0A0' : '#6B6B6B',
    background: isDark ? '#0a0a0a' : '#FAFAFA',
    cardBg: isDark ? '#1A1A1A' : '#FFFFFF',
    border: isDark ? '#2a2a2a' : '#E8E8E0',
  };

  const faqs = [
    {
      question: 'How can I promote my business on TRADE X TV?',
      answer: 'TRADE X TV offers various advertising and promotional opportunities for businesses. You can feature your products or services through our TV segments, website banners, or social media promotions. Our team will work with you to create a customized marketing package that fits your budget and goals. Contact our sales team to discuss your specific requirements.'
    },
    {
      question: 'Where can I sell my products through TRADE X TV?',
      answer: 'TRADE X TV connects businesses with potential buyers through our B2B marketplace platform TradEthiopia. You can list your products, reach local and international buyers, and access fair market prices - all from your cellphone without traveling to physical marketplaces. We also feature select products on our TV shows to give them maximum visibility.'
    },
    {
      question: 'How can I contact TRADE X TV?',
      answer: 'You can reach us through multiple channels: Visit our Contact Page for detailed information, Email us at info@tradextv.com, Call our office at +251-XXX-XXX-XXX, or Visit our physical office in Addis Ababa. Our customer service team is available Monday to Friday, 9:00 AM to 6:00 PM. We\'re always happy to hear from you!'
    },
    {
      question: 'What kind of content does TRADE X TV produce?',
      answer: 'TRADE X TV produces diverse business-focused content including market analysis, business interviews, entrepreneurship stories, agricultural updates, and B2B marketplace insights. We aim to create informed and innovative business content that helps our viewers make better business decisions. Our programs feature industry experts, successful entrepreneurs, and market leaders.'
    },
    {
      question: 'How can my business partner with TRADE X TV?',
      answer: 'TRADE X TV welcomes business partnerships across various sectors. We collaborate with companies for content sponsorship, event coverage, business features, and advertising campaigns. We also partner with organizations to produce special programming that highlights business opportunities in Ethiopia and Africa. Contact our partnership team to explore collaboration opportunities.'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderFAQContent = () => (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isExpanded = expandedIndex === index;
        
        return (
          <div 
            key={index}
            className="group rounded-lg transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${isExpanded ? colors.primary : colors.border}`,
              boxShadow: isExpanded ? `0 8px 32px ${isDark ? 'rgba(52,211,153,0.08)' : 'rgba(16,185,129,0.1)'}` : 'none',
              transform: isExpanded ? 'scale(1.01)' : 'scale(1)',
            }}
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
              <span 
                className="font-medium transition-colors duration-300 pr-4"
                style={{ 
                  color: isExpanded ? colors.primary : colors.text,
                  fontSize: '1rem',
                }}
              >
                {faq.question}
              </span>
              <span 
                className="ml-4 flex-shrink-0 transition-all duration-300 p-1 rounded-full"
                style={{
                  backgroundColor: isExpanded ? colors.primaryLight : 'transparent',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: isExpanded ? colors.primary : colors.textSecondary,
                }}
              >
                {isExpanded ? <FiMinus size={18} /> : <FiPlus size={18} />}
              </span>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 pt-1">
                <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                  <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                    {faq.answer}
                  </p>
                  {/* Show contact link for contact question */}
                  {faq.question.toLowerCase().includes('how can i contact') && (
                    <Link 
                      to="/contact"
                      className="inline-flex items-center gap-2 mt-3 text-sm font-medium transition-all duration-300 hover:gap-3"
                      style={{ color: colors.primary }}
                    >
                      <FiMessageCircle size={14} />
                      Go to Contact Page
                    </Link>
                  )}
                  {isExpanded && (
                    <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                      <FiCheckCircle size={12} style={{ color: colors.primary }} />
                      <span>Need more information? Contact our support team</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (isHomePage) {
    return renderFAQContent();
  }

  return (
    <>
      <Helmet>
        <title>FAQ - TRADE X TV</title>
        <meta name="description" content="Frequently Asked Questions about TRADE X TV - your trusted business media platform connecting businesses effectively across Africa." />
        <meta name="keywords" content="TRADE X TV, FAQ, business media, Ethiopia business, B2B marketplace" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: colors.primary }}>
              Help Center
            </span>
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
            Frequently Asked Questions
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
            Find answers to common questions about TRADE X TV and our services
          </p>
        </div>

        {/* FAQ List */}
        {renderFAQContent()}

        {/* Contact Section */}
        <div 
          className="mt-12 p-8 rounded-lg text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.border}`,
          }}
        >
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <FiMail size={18} style={{ color: colors.primary }} />
              </div>
              <span className="text-sm" style={{ color: colors.text }}>info@tradextv.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <FiPhone size={18} style={{ color: colors.primary }} />
              </div>
              <span className="text-sm" style={{ color: colors.text }}>+251-XXX-XXX-XXX</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                <FiMapPin size={18} style={{ color: colors.primary }} />
              </div>
              <span className="text-sm" style={{ color: colors.text }}>Addis Ababa, Ethiopia</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
            Still have questions?
          </h3>
          <p className="mb-4 text-sm" style={{ color: colors.textSecondary }}>
            Our team is ready to assist you with any inquiries
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: '#FFFFFF',
            }}
          >
            <FiMessageCircle size={18} />
            Contact Us Today
          </Link>
        </div>
      </div>
    </>
  );
};

export default FAQ;