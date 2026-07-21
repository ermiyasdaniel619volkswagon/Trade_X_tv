

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiMail, FiMapPin, FiPhone, FiSend, FiUser, FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar.jsx';

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact - TRADE X TV</title>
        <meta name="description" content="Get in touch with TRADE X TV for your media production needs." />
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#01110a]' : 'bg-white'
      }`}>
        <Navbar />
        
        <div className="container mx-auto px-4 pt-28 pb-20">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              Contact Us
            </h1>
            <p className={`text-xl mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get in touch with our team for your media production needs.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: FiMail, label: 'Email', value: 'info@tradetv.com' },
                { icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: FiMapPin, label: 'Location', value: 'Los Angeles, CA' },
              ].map((item, index) => (
                <div key={index} className={`p-6 rounded-2xl text-center ${
                  isDark 
                    ? 'bg-[#1a1a1a] border border-white/5' 
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${
                    isDark ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <item.icon className={`text-xl ${isDark ? 'text-[#B69F60]' : 'text-[#1A3258]'}`} />
                  </div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>{item.label}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className={`p-8 rounded-2xl ${
              isDark 
                ? 'bg-[#1a1a1a] border border-white/5' 
                : 'bg-white border border-gray-100 shadow-sm'
            }`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Name
                    </label>
                    <div className="relative">
                      <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                        }`}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                          isDark 
                            ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500' 
                            : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                        }`}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Company
                  </label>
                  <div className="relative">
                    <FiBriefcase className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isDark 
                          ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                      }`}
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <div className="relative">
                    <FiMessageSquare className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isDark 
                          ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                      }`}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 min-h-[150px] ${
                      isDark 
                        ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                    }`}
                    placeholder="Tell us about your project..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, #1A3258, #A53D32)`,
                    boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
