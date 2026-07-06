
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
  FiHome, FiClock, FiUser, FiBarChart2, 
  FiUsers, FiSettings, FiLogOut, FiSun, FiMoon,
  FiChevronLeft, FiChevronRight, FiFileText, FiStar,
  FiBell, FiTrash2, FiVideo, FiLayout,
  FiEdit2, FiPlus, FiList, FiUsers as FiCustomers
} from 'react-icons/fi';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo2.png';

const Sidebar = ({ isOpen, toggle }) => {
  const { user, logout, isSupervisor, isMediaOfficer, isCustomer } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const logoSrc = isDark ? logoDark : logoLight;

  const mediaOfficerItems = [
    { to: '/dashboard/report', icon: FiFileText, label: 'Daily Report' },
    { to: '/dashboard/announcements', icon: FiBell, label: 'Announcements' },
    { to: '/dashboard/manage-announcements', icon: FiTrash2, label: 'Manage Announcements' },
    { to: '/dashboard/my-history', icon: FiClock, label: 'My History' },
    { to: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminItems = [
    { to: '/admin/overview', icon: FiBarChart2, label: 'Overview' },
    { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
    { to: '/admin/team', icon: FiUsers, label: 'Team' },
    { to: '/admin/customer-requests', icon: FiCustomers, label: 'Customer Requests' },
    { to: '/admin/news', icon: FiFileText, label: 'Manage News' },
    { to: '/admin/blogs', icon: FiEdit2, label: 'Manage Blogs' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
    { to: '/admin/media/videos', icon: FiVideo, label: 'Videos' },
    { to: '/admin/media/hero', icon: FiLayout, label: 'Main Board' },
  ];

  const customerItems = [
    { to: '/customer/dashboard', icon: FiPlus, label: 'New Request' },
    { to: '/customer/requests', icon: FiList, label: 'My Requests' },
    { to: '/customer/profile', icon: FiUser, label: 'Company Profile' },
  ];

  let displayItems = [];
  let menuTitle = '';

  if (isSupervisor) {
    displayItems = adminItems;
    menuTitle = 'Administration';
  } else if (isCustomer) {
    displayItems = customerItems;
    menuTitle = 'Customer Portal';
  } else if (isMediaOfficer) {
    displayItems = mediaOfficerItems;
    menuTitle = 'Media Officer';
  } else {
    displayItems = mediaOfficerItems;
    menuTitle = 'Dashboard';
  }

  const navLinkClass = ({ isActive }) => {
    const baseClasses = 'relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-300 ease-out group';
    
    if (isActive) {
      return `${baseClasses} ${
        isDark
          ? 'bg-[#1A3258] text-white font-semibold shadow-xl shadow-black/20 scale-[1.01]'
          : 'bg-[#1A3258] text-white font-semibold shadow-xl shadow-gray-300 scale-[1.01]'
      }`;
    }
    
    return `${baseClasses} ${
      isDark
        ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
        : 'text-slate-600 hover:text-[#1A3258] hover:bg-[#1A3258]/5'
    }`;
  };

  const handleLogout = async () => {
    await logout();
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    if (isCustomer) {
      return user.email?.split('@')[0] || 'Customer';
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (isCustomer) {
      return user.email?.[0]?.toUpperCase() || 'C';
    }
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || user.email?.[0]?.toUpperCase() || 'U';
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    if (isCustomer) return 'Customer';
    if (isSupervisor) return 'Supervisor';
    return 'Media Officer';
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-500 ease-out flex flex-col overflow-hidden ${
          isOpen ? 'w-72' : 'w-0 lg:w-20'
        } ${
          isDark 
            ? 'bg-gradient-to-b from-[#1a1a1a]/95 to-[#242424]/98 border-r border-[#3a3a3a]' 
            : 'bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 shadow-xl shadow-slate-200/50'
        } backdrop-blur-xl`}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between px-4 h-20 border-b shrink-0 ${
          isDark ? 'border-[#3a3a3a]' : 'border-slate-100'
        }`}>
          {isOpen && (
            <div className="flex items-center">
              <img 
                src={logoSrc} 
                alt="TradeEthiopia TV" 
                className="h-12 w-auto object-contain" 
              />
            </div>
          )}

          {!isOpen && (
            <div className="hidden lg:flex items-center mx-auto">
              <img 
                src={logoSrc} 
                alt="TradeEthiopia TV" 
                className="h-10 w-auto object-contain" 
              />
            </div>
          )}

          <button
            onClick={toggle}
            className={`p-1.5 rounded-lg border transition-all duration-200 hidden lg:block ${
              isDark 
                ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] border-[#3a3a3a] text-gray-400 hover:text-white' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b ${isDark ? 'border-[#3a3a3a]' : 'border-slate-100'} ${!isOpen ? 'lg:hidden' : ''}`}>
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
            isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-slate-200'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3258] via-[#A53D32] to-[#B69F60] flex items-center justify-center text-white font-bold shadow-inner text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#1A3258]'}`}>
                {getDisplayName()}
              </p>
              <p className={`text-[11px] truncate uppercase tracking-wider font-bold ${
                isDark ? 'text-[#B69F60]/70' : 'text-[#A53D32]/80'
              }`}>
                {getRoleDisplay()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          <div className="mb-2 mt-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest px-3 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            } ${!isOpen ? 'lg:hidden' : ''}`}>
              {menuTitle}
            </p>
          </div>

          {displayItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon size={19} />
              <span className={`text-sm tracking-wide transition-all duration-300 ${!isOpen ? 'lg:hidden' : ''}`}>
                {item.label}
              </span>
            </NavLink>
          ))}

          <div className={`pt-4 mt-4 border-t ${isDark ? 'border-[#3a3a3a]' : 'border-slate-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${
              isDark ? 'text-gray-500' : 'text-slate-400'
            } ${!isOpen ? 'lg:hidden' : ''}`}>
              Quick Actions
            </p>
            <NavLink to="/" className={navLinkClass}>
              <FiHome size={19} />
              <span className={`text-sm tracking-wide ${!isOpen ? 'lg:hidden' : ''}`}>Home</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t space-y-1 shrink-0 ${
          isDark ? 'border-[#3a3a3a] bg-black/10' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
              !isOpen ? 'lg:justify-center' : ''
            } ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
                : 'text-slate-600 hover:text-[#1A3258] hover:bg-[#1A3258]/5'
            }`}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span className={!isOpen ? 'lg:hidden' : ''}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-[#A53D32] hover:bg-[#A53D32]/10 ${
              !isOpen ? 'lg:justify-center' : ''
            }`}
          >
            <FiLogOut size={18} />
            <span className={!isOpen ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;