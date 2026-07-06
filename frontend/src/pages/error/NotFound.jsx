import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        isDark ? 'bg-[#01110a]' : 'bg-emerald-50'
      }`}>
        <div className="text-center max-w-lg">
          <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            404
          </div>
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${
            isDark ? 'bg-amber-500/20' : 'bg-amber-100'
          }`}>
            <FiAlertTriangle className="text-4xl text-amber-500" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-emerald-950'
          }`}>
            Page Not Found
          </h1>
          <p className={`text-sm mb-6 ${
            isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'
          }`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <FiHome size={18} />
              Go Home
            </Link>
            <Link 
              to="/dashboard/report" 
              className={`px-6 py-3 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                isDark 
                  ? 'border-white/10 text-emerald-200/60 hover:bg-white/5' 
                  : 'border-emerald-200 text-emerald-800/60 hover:bg-emerald-50'
              }`}
            >
              <FiArrowLeft size={18} />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;