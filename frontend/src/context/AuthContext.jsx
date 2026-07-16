
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';

// =============================================
// 🔍 DEBUG MODE
// =============================================
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('🔍 [AuthContext]', ...args);
  }
}

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const notificationInterval = useRef(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  // ✅ Use a ref that persists across re-renders AND StrictMode remounts
  const initializedRef = useRef(false);
  const loadAttempts = useRef(0);

  // =============================================
  // 🔍 Debug: Log state changes
  // =============================================
  useEffect(() => {
    debugLog('🔄 State changed:', { 
      hasUser: !!user, 
      userRole: user?.role,
      loading, 
      initialized: initializedRef.current,
      loadAttempts: loadAttempts.current
    });
  }, [user, loading, notifications, unreadCount]);

  // =============================================
  // ✅ loadUnreadNotifications
  // =============================================
  const loadUnreadNotifications = useCallback(async () => {
    if (!user || !isMounted.current) return;
    
    try {
      const response = await api.get('/notifications/unread');
      if (isMounted.current) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.notifications?.length || 0);
      }
    } catch (error) {
      if (error.response?.status === 401) return;
      console.error('Failed to load notifications:', error);
    }
  }, [user]);

  // =============================================
  // ✅ login
  // =============================================
  const login = useCallback(async (email, password) => {
    debugLog('🔑 Login attempt:', { email });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, redirectUrl } = response.data;

      if (!token || !user) {
        toast.error('Invalid login response. Please try again.');
        return { success: false, error: 'Invalid response' };
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const displayName = user.firstName && user.firstName !== '' 
        ? user.firstName 
        : user.email?.split('@')[0] || 'User';
      
      toast.success(`Welcome back, ${displayName}!`);
      
      setTimeout(() => {
        loadUnreadNotifications();
      }, 200);
      
      let finalRedirectUrl = redirectUrl;
      
      if (!finalRedirectUrl) {
        if (user.role === 'supervisor') {
          finalRedirectUrl = '/admin/overview';
        } else if (user.role === 'customer') {
          finalRedirectUrl = '/customer/dashboard';
        } else {
          finalRedirectUrl = '/dashboard/report';
        }
      }
      
      try {
        navigate(finalRedirectUrl);
      } catch (navError) {
        window.location.href = finalRedirectUrl;
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
      return {
        success: false,
        error: message,
        retryAfter: Number(error.response?.data?.retryAfter) || 0,
      };
    }
  }, [navigate, loadUnreadNotifications]);

  // =============================================
  // ✅ logout
  // =============================================
  const logout = useCallback(async () => {
    debugLog('🚪 Logout called');
    
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Silent fail
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    delete api.defaults.headers.common['Authorization'];
    
    if (notificationInterval.current) {
      clearInterval(notificationInterval.current);
      notificationInterval.current = null;
    }
    
    navigate('/');
    toast.success('Logged out successfully');
  }, [navigate]);

  // =============================================
  // ✅ markNotificationRead
  // =============================================
  const markNotificationRead = useCallback(async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      if (response.data.success && isMounted.current) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // =============================================
  // ✅ loadUser - CRITICAL FIX
  // =============================================
  const loadUser = useCallback(async () => {
    loadAttempts.current += 1;
    
    debugLog(`📥 loadUser called (attempt ${loadAttempts.current})`, { 
      initialized: initializedRef.current,
      hasStoredToken: !!localStorage.getItem('token')
    });
    
    // ✅ Check if already initialized
    if (initializedRef.current) {
      debugLog('⚠️ Already initialized - skipping');
      return;
    }

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        const response = await api.get('/auth/me');
        const userData = response.data.user;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (isMounted.current) {
          setTimeout(() => {
            loadUnreadNotifications();
          }, 200);
        }
      } catch (error) {
        debugLog('❌ User verification failed:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
    } else {
      debugLog('ℹ️ No stored token - user is not authenticated');
    }
    
    // ✅ Mark as initialized BEFORE setting loading to false
    initializedRef.current = true;
    
    if (isMounted.current) {
      debugLog('✅ Setting loading to false');
      setLoading(false);
    }
  }, []); // ← EMPTY DEPENDENCY ARRAY - NO DEPENDENCIES!

  // =============================================
  // ✅ useEffect - WITH CLEANUP
  // =============================================
  useEffect(() => {
    let isActive = true;
    
    debugLog('🚀 AuthProvider mounted/effect running', { 
      initialized: initializedRef.current,
      loading 
    });
    
    // ✅ Only run if not initialized
    if (!initializedRef.current && isActive) {
      loadUser();
    } else {
      // ✅ If already initialized, just make sure loading is false
      if (initializedRef.current && loading) {
        debugLog('⚠️ Already initialized but loading is true - fixing');
        setLoading(false);
      }
    }

    // Cleanup
    return () => {
      debugLog('🧹 AuthProvider cleanup');
      isActive = false;
      isMounted.current = false;
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
        notificationInterval.current = null;
      }
    };
  }, []); // ← EMPTY DEPENDENCY ARRAY

  // =============================================
  // ✅ Notification interval
  // =============================================
  useEffect(() => {
    if (!user || loading) {
      return;
    }

    if (notificationInterval.current) {
      clearInterval(notificationInterval.current);
      notificationInterval.current = null;
    }
    
    notificationInterval.current = setInterval(() => {
      loadUnreadNotifications();
    }, 60000);
    
    return () => {
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
        notificationInterval.current = null;
      }
    };
  }, [user, loading, loadUnreadNotifications]);

  // =============================================
  // ✅ getDashboardUrl
  // =============================================
  const getDashboardUrl = useCallback(() => {
    if (!user) return '/';
    if (user.role === 'supervisor') return '/admin/overview';
    if (user.role === 'customer') return '/customer/dashboard';
    return '/dashboard/report';
  }, [user]);

  // =============================================
  // ✅ Debug: Log final state
  // =============================================
  useEffect(() => {
    if (!loading) {
      debugLog('📊 Final state:', {
        isAuthenticated: !!user,
        userRole: user?.role,
        loading,
        initialized: initializedRef.current
      });
    }
  });

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    notifications,
    unreadCount,
    setUnreadCount,
    markNotificationRead,
    loadUnreadNotifications,
    loadAllNotifications: loadUnreadNotifications,
    getDashboardUrl,
    isAuthenticated: !!user && !loading,
    isSupervisor: user?.role === 'supervisor',
    isMediaOfficer: user?.role === 'media_officer',
    isCustomer: user?.role === 'customer',
    displayName: user?.firstName && user.firstName !== ''
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.email?.split('@')[0] || 'User',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
