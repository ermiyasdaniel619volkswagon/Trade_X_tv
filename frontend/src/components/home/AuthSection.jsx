
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, 
  FiUser, FiCheckCircle, FiX, FiArrowRight
} from 'react-icons/fi';
import api from '../../services/api.js';

const BRAND = {
  navy: '#1A3258',
  maroon: '#A53D32',
  gold: '#B69F60',
};

const AuthSection = ({ isVisible, onClose }) => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isLoginMode = mode === 'login';

  useEffect(() => {
    if (isVisible) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    }
  }, [isVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          if (onClose) onClose();
        }
      } else {
        const response = await api.post('/auth/register/customer', {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        if (response.data.success) {
          toast.success('✅ Registration successful! Please login.');
          setMode('login');
          setFormData(prev => ({ 
            ...prev, 
            password: '', 
            confirmPassword: '' 
          }));
          setErrors({});
        } else {
          toast.error(response.data.error || 'Registration failed');
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isLoginMode ? 'register' : 'login');
    setFormData(prev => ({ 
      ...prev, 
      password: '', 
      confirmPassword: '' 
    }));
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`py-12 sm:py-16 md:py-20 border-t ${
            isDark
              ? 'bg-[#0a0a0a] border-white/5'
              : 'bg-white border-gray-100'
          }`}
          id="auth-section"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-center mb-8"
              >
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl text-white mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                    boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                  }}
                >
                  {isLoginMode ? <FiUser size={28} /> : <FiBriefcase size={28} />}
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {isLoginMode ? 'Welcome Back' : 'Create Customer Account'}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isLoginMode 
                    ? 'Sign in to your account to continue' 
                    : 'Register to start advertising your business'}
                </p>
              </motion.div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  isDark ? 'bg-[#1a1a1a] border border-white/5' : 'bg-white border border-gray-100'
                }`}
              >
                <div className="px-6 py-8">
                  {!isLoginMode && (
                    <div className={`mb-4 p-3 rounded-xl text-center text-sm ${
                      isDark ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600'
                    }`}>
                      <FiBriefcase className="inline mr-2" size={16} />
                      Create your customer account with email and password
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`} size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                            isDark
                              ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                          } ${errors.email ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
                          placeholder="you@example.com"
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Password
                      </label>
                      <div className="relative">
                        <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`} size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                            isDark
                              ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500'
                              : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                          } ${errors.password ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
                          placeholder={isLoginMode ? 'Enter your password' : 'Min 8 characters'}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          } transition-colors`}
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-rose-400 mt-1">{errors.password}</p>
                      )}
                    </div>

                    {!isLoginMode && (
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`} size={18} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
                              isDark
                                ? 'bg-[#2a2a2a] border-gray-700 focus:ring-[#B69F60]/50 text-white placeholder-gray-500'
                                : 'bg-gray-50 border-gray-200 focus:ring-[#B69F60]/50 text-[#1A1A1A] placeholder-gray-400'
                            } ${errors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}`}
                            placeholder="Confirm your password"
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                            } transition-colors`}
                          >
                            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.maroon})`,
                        boxShadow: `0 8px 32px rgba(26, 50, 88, 0.3)`,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isLoginMode ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        isLoginMode ? 'Sign In' : 'Create Account'
                      )}
                    </motion.button>
                  </form>

                  {/* Switch Mode */}
                  <div className="text-center mt-4">
                    <button
                      onClick={switchMode}
                      className={`text-sm hover:underline transition-colors ${
                        isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {isLoginMode ? (
                        <>Don't have an account? <span style={{ color: BRAND.gold }}>Register as Customer</span></>
                      ) : (
                        <>Already have an account? <span style={{ color: BRAND.gold }}>Sign In</span></>
                      )}
                    </button>
                  </div>

                  {/* Demo Credentials */}
                  <div className="text-center mt-4">
                   
                  </div>
                </div>

                {/* Bottom Gold Accent */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.gold}, ${BRAND.maroon})` }} />
              </motion.div>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-6"
              >
                <button
                  onClick={onClose}
                  className={`text-sm transition-colors ${
                    isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FiX className="inline mr-1" size={16} />
                  Close
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default AuthSection;