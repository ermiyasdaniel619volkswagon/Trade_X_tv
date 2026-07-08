

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiMenu, FiBell, FiChevronDown, FiBookOpen, FiTrash2, FiLogOut, FiUser } from 'react-icons/fi';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { useTheme } from '../../context/ThemeContext.jsx';
// import logoLight from '../../assets/logo.png';
// import logoDark from '../../assets/logo2.png';
// import { formatDistanceToNow } from 'date-fns';

// const TopBar = ({ toggleSidebar, hideMenuButton = false }) => {
//   const { 
//     user, 
//     notifications, 
//     unreadCount, 
//     markNotificationRead, 
//     loadUnreadNotifications, 
//     logout,
//     isCustomer
//   } = useAuth();
//   const { isDark } = useTheme();
//   const navigate = useNavigate();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const logoSrc = isDark ? logoDark : logoLight;

//   useEffect(() => {
//     if (showNotifications && !isCustomer) {
//       loadNotifications();
//     }
//   }, [showNotifications, isCustomer]);

//   const loadNotifications = async () => {
//     setLoading(true);
//     await loadUnreadNotifications();
//     setLoading(false);
//   };

//   const handleNotificationClick = async (notificationId) => {
//     await markNotificationRead(notificationId);
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//     setShowUserMenu(false);
//   };

//   const getDisplayName = () => {
//     if (!user) return 'User';
//     if (isCustomer) {
//       return user.email?.split('@')[0] || 'Customer';
//     }
//     return user?.firstName || user?.email?.split('@')[0] || 'User';
//   };

//   const getInitials = () => {
//     if (!user) return 'U';
//     if (isCustomer) {
//       return user.email?.[0]?.toUpperCase() || 'C';
//     }
//     return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}` || 'U';
//   };

//   const getRoleDisplay = () => {
//     if (!user) return '';
//     if (isCustomer) return 'Customer';
//     if (user.role === 'supervisor') return 'Supervisor';
//     if (user.role === 'media_officer') return 'Media Officer';
//     return user.role || '';
//   };

//   const getProfileLink = () => {
//     if (isCustomer) return '/customer/profile';
//     return '/dashboard/profile';
//   };

//   const getDashboardLink = () => {
//     if (isCustomer) return '/customer/dashboard';
//     if (user?.role === 'supervisor') return '/admin/overview';
//     return '/dashboard/report';
//   };

//   return (
//     <header className={`sticky top-0 z-30 h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 transition-all duration-300 ${
//       isDark 
//         ? 'bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-[#3a3a3a]' 
//         : 'bg-white/60 backdrop-blur-xl border-b border-emerald-100/50'
//     }`}>
//       <div className="flex items-center gap-4">
//         {/* Menu Toggle Button - HIDDEN for customers */}
//         {!hideMenuButton && !isCustomer && (
//           <button
//             onClick={toggleSidebar}
//             className={`p-2 rounded-xl transition-all duration-200 ${
//               isDark 
//                 ? 'hover:bg-[#2a2a2a] text-gray-400 hover:text-white' 
//                 : 'hover:bg-emerald-50 text-emerald-800/70 hover:text-emerald-950'
//             }`}
//           >
//             <FiMenu size={22} />
//           </button>
//         )}
        
//         <div className="flex items-center transition-all duration-500 ease-in-out hover:scale-105">
//           <img 
//             src={logoSrc} 
//             alt="TradeEthiopia TV" 
//             className="h-12 md:h-14 w-auto object-contain transition-all duration-500 ease-in-out" 
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         {/* ============================================= */}
//         {/* ✅ NOTIFICATIONS - HIDDEN FOR CUSTOMERS */}
//         {/* ============================================= */}
//         {!hideMenuButton && !isCustomer && (
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className={`p-2 rounded-xl transition-all duration-200 relative ${
//                 isDark 
//                   ? 'hover:bg-[#2a2a2a] text-gray-400 hover:text-white' 
//                   : 'hover:bg-emerald-50 text-emerald-800/70 hover:text-emerald-950'
//               }`}
//             >
//               <FiBell size={20} />
//               {unreadCount > 0 && (
//                 <span 
//                   className="absolute top-0.5 right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center text-white ring-2 animate-pulse"
//                   style={{
//                     background: 'linear-gradient(135deg, #e11d48, #be123c)',
//                   }}
//                 >
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </span>
//               )}
//             </button>

//             {showNotifications && (
//               <div className={`absolute right-0 mt-2 w-80 sm:w-96 max-h-[450px] rounded-xl shadow-2xl border overflow-hidden ${
//                 isDark
//                   ? 'bg-[#1a1a1a] border-[#3a3a3a] shadow-black/50'
//                   : 'bg-white border-emerald-100 shadow-emerald-950/10'
//               } backdrop-blur-xl`}>
//                 <div className={`p-3 border-b ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
//                   <div className="flex items-center justify-between">
//                     <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
//                       Notifications
//                     </h4>
//                     {unreadCount > 0 && (
//                       <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
//                         {unreadCount} unread
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="overflow-y-auto max-h-72">
//                   {loading ? (
//                     <div className="p-4 text-center">
//                       <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-emerald-800/40'}`}>
//                       <FiBell size={32} className="mx-auto mb-2 opacity-30" />
//                       <p className="text-sm">No new notifications</p>
//                     </div>
//                   ) : (
//                     notifications.map((notification) => (
//                       <div
//                         key={notification._id}
//                         onClick={() => handleNotificationClick(notification._id)}
//                         className={`p-3 border-b cursor-pointer transition-colors ${
//                           isDark 
//                             ? 'border-[#3a3a3a] hover:bg-[#2a2a2a]' 
//                             : 'border-emerald-100/50 hover:bg-emerald-50/50'
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className={`p-1.5 rounded-lg ${
//                             notification.priority === 'urgent' || notification.priority === 'high'
//                               ? 'bg-rose-500/20 text-rose-400'
//                               : notification.priority === 'medium'
//                               ? 'bg-amber-500/20 text-amber-400'
//                               : 'bg-emerald-500/20 text-emerald-400'
//                           }`}>
//                             <FiBell size={14} />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between gap-2">
//                               <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
//                                 {notification.title}
//                               </p>
//                               {notification.priority === 'urgent' && (
//                                 <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">
//                                   URGENT
//                                 </span>
//                               )}
//                             </div>
//                             <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-emerald-800/60'} line-clamp-2`}>
//                               {notification.message}
//                             </p>
//                             <div className="flex items-center justify-between mt-1">
//                               <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-emerald-800/30'}`}>
//                                 {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
//                               </p>
//                               <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
//                                 notification.type === 'announcement' 
//                                   ? 'bg-blue-500/20 text-blue-400' 
//                                   : 'bg-emerald-500/20 text-emerald-400'
//                               }`}>
//                                 {notification.type}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className={`p-2 border-t ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
//                   <Link
//                     to={isCustomer ? '/customer/requests' : '/dashboard/announcements'}
//                     className={`w-full py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
//                       isDark 
//                         ? 'text-gray-400 hover:bg-[#2a2a2a]' 
//                         : 'text-emerald-800/60 hover:bg-emerald-50'
//                     }`}
//                     onClick={() => setShowNotifications(false)}
//                   >
//                     <FiBookOpen size={14} />
//                     View All
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* User Profile */}
//         <div className="relative">
//           <button
//             onClick={() => setShowUserMenu(!showUserMenu)}
//             className={`flex items-center gap-2 ml-2 pl-3 border-l transition-all duration-200 ${
//               isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'
//             }`}
//           >
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-900/10">
//               {getInitials()}
//             </div>
//             <span className={`hidden lg:block text-sm font-semibold transition-colors ${
//               isDark ? 'text-gray-300' : 'text-emerald-950'
//             }`}>
//               {getDisplayName()}
//             </span>
//             <FiChevronDown size={14} className={isDark ? 'text-gray-500' : 'text-emerald-800/40'} />
//           </button>

//           {/* User Dropdown */}
//           {showUserMenu && (
//             <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden ${
//               isDark
//                 ? 'bg-[#1a1a1a] border-[#3a3a3a] shadow-black/50'
//                 : 'bg-white border-emerald-100 shadow-emerald-950/10'
//             } backdrop-blur-xl`}>
//               <div className={`p-3 border-b ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
//                 <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
//                   {getDisplayName()}
//                 </p>
//                 <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-emerald-800/60'}`}>
//                   {user?.email}
//                 </p>
//                 <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
//                   isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
//                 }`}>
//                   {getRoleDisplay()}
//                 </span>
//               </div>
//               <div className="p-1">
//                 <Link
//                   to={getDashboardLink()}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
//                     isDark 
//                       ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
//                       : 'text-emerald-800/60 hover:text-emerald-950 hover:bg-emerald-50'
//                   }`}
//                   onClick={() => setShowUserMenu(false)}
//                 >
//                   <FiUser size={16} />
//                   Dashboard
//                 </Link>
//                 <Link
//                   to={getProfileLink()}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
//                     isDark 
//                       ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
//                       : 'text-emerald-800/60 hover:text-emerald-950 hover:bg-emerald-50'
//                   }`}
//                   onClick={() => setShowUserMenu(false)}
//                 >
//                   <FiUser size={16} />
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full ${
//                     isDark 
//                       ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' 
//                       : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
//                   }`}
//                 >
//                   <FiLogOut size={16} />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default TopBar;

// frontend/src/components/layout/TopBar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiChevronDown, FiBookOpen, FiTrash2, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo2.png';
import { formatDistanceToNow } from 'date-fns';

const TopBar = ({ toggleSidebar, hideMenuButton = false }) => {
  const { 
    user, 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    loadUnreadNotifications, 
    logout,
    isCustomer
  } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const logoSrc = isDark ? logoDark : logoLight;

  useEffect(() => {
    if (showNotifications) {
      loadNotifications();
    }
  }, [showNotifications]);

  const loadNotifications = async () => {
    setLoading(true);
    await loadUnreadNotifications();
    setLoading(false);
  };

  const handleNotificationClick = async (notificationId) => {
    await markNotificationRead(notificationId);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    if (isCustomer) {
      return user.email?.split('@')[0] || 'Customer';
    }
    return user?.firstName || user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (isCustomer) {
      return user.email?.[0]?.toUpperCase() || 'C';
    }
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}` || 'U';
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    if (isCustomer) return 'Customer';
    if (user.role === 'supervisor') return 'Supervisor';
    if (user.role === 'media_officer') return 'Media Officer';
    return user.role || '';
  };

  const getProfileLink = () => {
    if (isCustomer) return '/customer/profile';
    return '/dashboard/profile';
  };

  const getDashboardLink = () => {
    if (isCustomer) return '/customer/dashboard';
    if (user?.role === 'supervisor') return '/admin/overview';
    return '/dashboard/report';
  };

  return (
    <header className={`sticky top-0 z-30 h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 transition-all duration-300 ${
      isDark 
        ? 'bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-[#3a3a3a]' 
        : 'bg-white/60 backdrop-blur-xl border-b border-emerald-100/50'
    }`}>
      <div className="flex items-center gap-4">
        {/* ✅ Menu Toggle Button - SHOW for ALL users (including customers) */}
        {!hideMenuButton && (
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isDark 
                ? 'hover:bg-[#2a2a2a] text-gray-400 hover:text-white' 
                : 'hover:bg-emerald-50 text-emerald-800/70 hover:text-emerald-950'
            }`}
          >
            <FiMenu size={22} />
          </button>
        )}
        
        <div className="flex items-center transition-all duration-500 ease-in-out hover:scale-105">
          <img 
            src={logoSrc} 
            alt="TradeEthiopia TV" 
            className="h-12 md:h-14 w-auto object-contain transition-all duration-500 ease-in-out" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* ✅ NOTIFICATIONS - SHOW for ALL users (including customers) */}
        {!hideMenuButton && (
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all duration-200 relative ${
                isDark 
                  ? 'hover:bg-[#2a2a2a] text-gray-400 hover:text-white' 
                  : 'hover:bg-emerald-50 text-emerald-800/70 hover:text-emerald-950'
              }`}
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span 
                  className="absolute top-0.5 right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center text-white ring-2 animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #e11d48, #be123c)',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 max-h-[450px] rounded-xl shadow-2xl border overflow-hidden ${
                isDark
                  ? 'bg-[#1a1a1a] border-[#3a3a3a] shadow-black/50'
                  : 'bg-white border-emerald-100 shadow-emerald-950/10'
              } backdrop-blur-xl`}>
                <div className={`p-3 border-b ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-72">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-emerald-800/40'}`}>
                      <FiBell size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification._id)}
                        className={`p-3 border-b cursor-pointer transition-colors ${
                          isDark 
                            ? 'border-[#3a3a3a] hover:bg-[#2a2a2a]' 
                            : 'border-emerald-100/50 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            notification.priority === 'urgent' || notification.priority === 'high'
                              ? 'bg-rose-500/20 text-rose-400'
                              : notification.priority === 'medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            <FiBell size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                                {notification.title}
                              </p>
                              {notification.priority === 'urgent' && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">
                                  URGENT
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-emerald-800/60'} line-clamp-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-emerald-800/30'}`}>
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                notification.type === 'announcement' 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className={`p-2 border-t ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
                  <Link
                    to={isCustomer ? '/customer/requests' : '/dashboard/announcements'}
                    className={`w-full py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isDark 
                        ? 'text-gray-400 hover:bg-[#2a2a2a]' 
                        : 'text-emerald-800/60 hover:bg-emerald-50'
                    }`}
                    onClick={() => setShowNotifications(false)}
                  >
                    <FiBookOpen size={14} />
                    View All
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2 ml-2 pl-3 border-l transition-all duration-200 ${
              isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-900/10">
              {getInitials()}
            </div>
            <span className={`hidden lg:block text-sm font-semibold transition-colors ${
              isDark ? 'text-gray-300' : 'text-emerald-950'
            }`}>
              {getDisplayName()}
            </span>
            <FiChevronDown size={14} className={isDark ? 'text-gray-500' : 'text-emerald-800/40'} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border overflow-hidden ${
              isDark
                ? 'bg-[#1a1a1a] border-[#3a3a3a] shadow-black/50'
                : 'bg-white border-emerald-100 shadow-emerald-950/10'
            } backdrop-blur-xl`}>
              <div className={`p-3 border-b ${isDark ? 'border-[#3a3a3a]' : 'border-emerald-100'}`}>
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                  {getDisplayName()}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-emerald-800/60'}`}>
                  {user?.email}
                </p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {getRoleDisplay()}
                </span>
              </div>
              <div className="p-1">
                <Link
                  to={getDashboardLink()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
                      : 'text-emerald-800/60 hover:text-emerald-950 hover:bg-emerald-50'
                  }`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser size={16} />
                  Dashboard
                </Link>
                <Link
                  to={getProfileLink()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' 
                      : 'text-emerald-800/60 hover:text-emerald-950 hover:bg-emerald-50'
                  }`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser size={16} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 w-full ${
                    isDark 
                      ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' 
                      : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;