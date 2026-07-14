

// import React, { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from './Sidebar.jsx';
// import TopBar from './TopBar.jsx';
// import { useTheme } from '../../context/ThemeContext.jsx';
// import { useAuth } from '../../context/AuthContext.jsx';

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { isDark } = useTheme();
//   const { isCustomer, isAuthenticated } = useAuth();
//   const location = useLocation();

//   // ✅ Check if current route is public (no sidebar needed)
//   const isPublicRoute = ['/', '/about', '/contact', '/faq', '/news', '/blog'].includes(location.pathname);
  
//   // ✅ Check if current route is customer route
//   const isCustomerRoute = location.pathname.startsWith('/customer');

//   // ✅ If public route, render WITHOUT sidebar
//   if (isPublicRoute) {
//     return (
//       <div className={`relative min-h-screen overflow-y-auto transition-colors duration-500 ${
//         isDark ? 'bg-[#1a1a1a]' : 'bg-zinc-50'
//       }`}>
//         <div className="fixed inset-0 pointer-events-none">
//           {isDark ? (
//             <>
//               <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-soft" />
//               <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-[120px] animate-pulse-soft delay-1000" />
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[160px]" />
//             </>
//           ) : (
//             <>
//               <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] animate-pulse-soft" />
//               <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
//             </>
//           )}
//         </div>

//         <div className="relative flex flex-col min-h-screen">
//           <TopBar toggleSidebar={() => {}} hideMenuButton={true} />
//           <main className="flex-1">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     );
//   }

//   // ✅ For customer routes - show sidebar with customer menu
//   // ✅ For media officer and supervisor - show sidebar with their menus
//   return (
//     <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
//       isDark ? 'bg-[#1a1a1a]' : 'bg-zinc-50'
//     }`}>
//       <div className="fixed inset-0 pointer-events-none">
//         {isDark ? (
//           <>
//             <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-soft" />
//             <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-[120px] animate-pulse-soft delay-1000" />
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[160px]" />
//           </>
//         ) : (
//           <>
//             <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] animate-pulse-soft" />
//             <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
//           </>
//         )}
//       </div>

//       <div className="relative flex h-screen overflow-hidden">
//         <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           {/* ✅ hideMenuButton for customers - hides the menu toggle */}
//           <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} hideMenuButton={isCustomer} />
//           <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
//             <div className="max-w-[1600px] mx-auto animate-fade-in">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// frontend/src/components/layout/Layout.jsx

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark } = useTheme();
  const { isCustomer, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ Check if current route is public (no sidebar needed)
  const isPublicRoute = ['/', '/about', '/contact', '/faq', '/news', '/blog'].includes(location.pathname);
  
  // ✅ If public route, render WITHOUT sidebar
  if (isPublicRoute) {
    return (
      <div className={`relative min-h-screen overflow-y-auto transition-colors duration-500 ${
        isDark ? 'bg-[#1a1a1a]' : 'bg-zinc-50'
      }`}>
               <div className="fixed inset-0 pointer-events-none">
          {isDark ? (
            <>
              <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-soft" />
              <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-[120px] animate-pulse-soft delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[160px]" />
            </>
          ) : (
            <>
              <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] animate-pulse-soft" />
              <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
            </>
          )}
        </div>

        <div className="relative flex flex-col min-h-screen">
          <TopBar toggleSidebar={() => {}} hideMenuButton={true} />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // ✅ For ALL authenticated users (including customers) - show sidebar with menu button
  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#1a1a1a]' : 'bg-zinc-50'
    }`}>
      <div className="fixed inset-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-soft" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-[120px] animate-pulse-soft delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[160px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] animate-pulse-soft" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
          </>
        )}
      </div>

      <div className="relative flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* ✅ ALWAYS show menu button for ALL users (including customers) */}
          <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} hideMenuButton={false} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
            <div className="max-w-[1600px] mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;