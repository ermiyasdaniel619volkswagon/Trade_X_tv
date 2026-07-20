

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext.jsx';
// import { ThemeProvider } from './context/ThemeContext.jsx';
// import ProtectedRoute from './components/common/ProtectedRoute.jsx';
// import Layout from './components/layout/Layout.jsx';
// import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// // =============================================
// // PUBLIC PAGES
// // =============================================
// import Home from './pages/public/Home.jsx';
// import About from './pages/public/About.jsx';
// import Contact from './pages/public/Contact.jsx';
// import FAQ from './pages/public/FAQ.jsx';
// import News from './pages/public/News.jsx';
// import Blog from './pages/public/Blog.jsx';
// // ✅ Combined Auth Page (Login + Register in ONE page)


// // =============================================
// // PROTECTED PAGES
// // =============================================
// import DailyReport from './pages/protected/DailyReport.jsx';
// import Announcements from './pages/protected/Announcements.jsx';
// import ManageAnnouncements from './pages/protected/ManageAnnouncements.jsx';
// import MyHistory from './pages/protected/MyHistory.jsx';
// import Profile from './pages/protected/Profile.jsx';

// // =============================================
// // ADMIN PAGES
// // =============================================
// import AdminOverview from './pages/admin/AdminOverview.jsx';
// import ReviewPipeline from './pages/admin/ReviewPipeline.jsx';
// import TeamRoster from './pages/admin/TeamRoster.jsx';
// import Settings from './pages/admin/Settings.jsx';
// import ManageVideos from './pages/admin/ManageVideos.jsx';
// import ManageHeroVideos from './pages/admin/ManageHeroVideos.jsx';
// import ManageNews from './pages/admin/ManageNews.jsx';
// import ManageBlogs from './pages/admin/ManageBlogs.jsx';
// import CustomerRequests from './pages/admin/CustomerRequests.jsx';

// // =============================================
// // CUSTOMER PAGES
// // =============================================
// import CustomerDashboard from './pages/customer/Dashboard.jsx';
// import MyRequests from './pages/customer/MyRequests.jsx';
// import CompanyProfile from './pages/customer/CompanyProfile.jsx';

// // =============================================
// // ERROR PAGES
// // =============================================
// import NotFound from './pages/error/NotFound.jsx';
// import Unauthorized from './pages/error/Unauthorized.jsx';

// function App() {
//   return (
//     <HelmetProvider>
//       <ThemeProvider>
//         <BrowserRouter>
//           <AuthProvider>
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   borderRadius: '10px',
//                   background: '#333',
//                   color: '#fff',
//                 },
//                 success: {
//                   iconTheme: {
//                     primary: '#10b981',
//                     secondary: '#fff',
//                   },
//                 },
//                 error: {
//                   iconTheme: {
//                     primary: '#ef4444',
//                     secondary: '#fff',
//                   },
//                 },
//               }}
//             />
//             <ErrorBoundary>
//               <Routes>
//                 {/* =============================================
//                     PUBLIC ROUTES
//                 ============================================= */}
//                 <Route path="/" element={<Home />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/faq" element={<FAQ />} />
//                 <Route path="/news" element={<News />} />
//                 <Route path="/blog" element={<Blog />} />
                
          
                
//                 {/* Redirect old paths to new combined path */}
//                 <Route path="/login" element={<Navigate to="/auth" replace />} />
//                 <Route path="/register" element={<Navigate to="/auth" replace />} />

//                 {/* =============================================
//                     CUSTOMER ROUTES
//                 ============================================= */}
//                 <Route element={<ProtectedRoute requiredRoles={['customer']} />}>
//                   <Route element={<Layout />}>
//                     <Route path="/customer/dashboard" element={<CustomerDashboard />} />
//                     <Route path="/customer/requests" element={<MyRequests />} />
//                     <Route path="/customer/profile" element={<CompanyProfile />} />
//                   </Route>
//                 </Route>

//                 {/* =============================================
//                     PROTECTED ROUTES - Media Officer + Supervisor
//                 ============================================= */}
//                 <Route element={<ProtectedRoute requiredRoles={['media_officer', 'supervisor']} />}>
//                   <Route element={<Layout />}>
//                     <Route path="/dashboard/report" element={<DailyReport />} />
//                     <Route path="/dashboard/announcements" element={<Announcements />} />
//                     <Route path="/dashboard/manage-announcements" element={<ManageAnnouncements />} />
//                     <Route path="/dashboard/my-history" element={<MyHistory />} />
//                     <Route path="/dashboard/profile" element={<Profile />} />
//                   </Route>
//                 </Route>

//                 {/* =============================================
//                     ADMIN ROUTES - Supervisor ONLY
//                 ============================================= */}
//                 <Route element={<ProtectedRoute requiredRoles={['supervisor']} />}>
//                   <Route element={<Layout />}>
//                     <Route path="/admin/overview" element={<AdminOverview />} />
//                     <Route path="/admin/reviews" element={<ReviewPipeline />} />
//                     <Route path="/admin/team" element={<TeamRoster />} />
//                     <Route path="/admin/settings" element={<Settings />} />
//                     <Route path="/admin/media/videos" element={<ManageVideos />} />
//                     <Route path="/admin/media/hero" element={<ManageHeroVideos />} />
//                     <Route path="/admin/news" element={<ManageNews />} />
//                     <Route path="/admin/blogs" element={<ManageBlogs />} />
//                     <Route path="/admin/customer-requests" element={<CustomerRequests />} />
//                   </Route>
//                 </Route>

//                 {/* =============================================
//                     ERROR ROUTES
//                 ============================================= */}
//                 <Route path="/unauthorized" element={<Unauthorized />} />
//                 <Route path="/404" element={<NotFound />} />
//                 <Route path="*" element={<Navigate to="/404" replace />} />
//               </Routes>
//             </ErrorBoundary>
//           </AuthProvider>
//         </BrowserRouter>
//       </ThemeProvider>
//     </HelmetProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// =============================================
// PUBLIC PAGES
// =============================================
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';
import FAQ from './pages/public/FAQ.jsx';
import News from './pages/public/News.jsx';
import Blog from './pages/public/Blog.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
import ResetPassword from './pages/public/ResetPassword.jsx';

// =============================================
// PROTECTED PAGES
// =============================================
import DailyReport from './pages/protected/DailyReport.jsx';
import Announcements from './pages/protected/Announcements.jsx';
import ManageAnnouncements from './pages/protected/ManageAnnouncements.jsx';
import MyHistory from './pages/protected/MyHistory.jsx';
import Profile from './pages/protected/Profile.jsx';

// =============================================
// ADMIN PAGES
// =============================================
import AdminOverview from './pages/admin/AdminOverview.jsx';
import ReviewPipeline from './pages/admin/ReviewPipeline.jsx';
import TeamRoster from './pages/admin/TeamRoster.jsx';
import Settings from './pages/admin/Settings.jsx';
import ManageVideos from './pages/admin/ManageVideos.jsx';
import ManageHeroVideos from './pages/admin/ManageHeroVideos.jsx';
import ManageNews from './pages/admin/ManageNews.jsx';
import ManageBlogs from './pages/admin/ManageBlogs.jsx';
import CustomerRequests from './pages/admin/CustomerRequests.jsx';
// ✅ NEW: Customer Management
import CustomerManagement from './pages/admin/CustomerManagement.jsx';

// =============================================
// CUSTOMER PAGES
// =============================================
import CustomerDashboard from './pages/customer/Dashboard.jsx';
import MyRequests from './pages/customer/MyRequests.jsx';
import CompanyProfile from './pages/customer/CompanyProfile.jsx';

// =============================================
// ERROR PAGES
// =============================================
import NotFound from './pages/error/NotFound.jsx';
import Unauthorized from './pages/error/Unauthorized.jsx';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster
              position="top-right"
              containerStyle={{ zIndex: 99999 }}
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  zIndex: 99999,
                },
                success: {
                  iconTheme: {
                    primary: '#B69F60',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#A53D32',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <ErrorBoundary>
              <Routes>
                {/* =============================================
                    PUBLIC ROUTES
                ============================================= */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/news" element={<News />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Redirect old paths to new combined path */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />

                {/* =============================================
                    CUSTOMER ROUTES
                ============================================= */}
                <Route element={<ProtectedRoute requiredRoles={['customer']} />}>
                  <Route element={<Layout />}>
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/customer/requests" element={<MyRequests />} />
                    <Route path="/customer/profile" element={<CompanyProfile />} />
                  </Route>
                </Route>

                {/* =============================================
                    PROTECTED ROUTES - Media Officer + Supervisor
                ============================================= */}
                <Route element={<ProtectedRoute requiredRoles={['media_officer', 'supervisor']} />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard/report" element={<DailyReport />} />
                    <Route path="/dashboard/announcements" element={<Announcements />} />
                    <Route path="/dashboard/manage-announcements" element={<ManageAnnouncements />} />
                    <Route path="/dashboard/my-history" element={<MyHistory />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                  </Route>
                </Route>

                {/* =============================================
                    ADMIN ROUTES - Supervisor ONLY
                ============================================= */}
                <Route element={<ProtectedRoute requiredRoles={['supervisor']} />}>
                  <Route element={<Layout />}>
                    <Route path="/admin/overview" element={<AdminOverview />} />
                    <Route path="/admin/reviews" element={<ReviewPipeline />} />
                    <Route path="/admin/team" element={<TeamRoster />} />
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route path="/admin/media/videos" element={<ManageVideos />} />
                    <Route path="/admin/media/hero" element={<ManageHeroVideos />} />
                    <Route path="/admin/news" element={<ManageNews />} />
                    <Route path="/admin/blogs" element={<ManageBlogs />} />
                    <Route path="/admin/customer-requests" element={<CustomerRequests />} />
                    {/* ✅ NEW: Customer Management Route */}
                    <Route path="/admin/customers" element={<CustomerManagement />} />
                  </Route>
                </Route>

                {/* =============================================
                    ERROR ROUTES
                ============================================= */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
