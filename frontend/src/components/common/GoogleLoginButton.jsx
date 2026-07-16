

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const GoogleLoginButton = ({ 
  text = 'Continue with Google', 
  userType = 'customer',
  className = '',
  onSuccess = null,
  onError = null,
}) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      console.log('🚀 Google login successful!');
      console.log('Credential received:', credentialResponse.credential ? '✅' : '❌');
      
      const idToken = credentialResponse.credential;
      
      let endpoint = '/auth/google';
      if (userType === 'customer') {
        endpoint = '/auth/google/customer';
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken: idToken,
          role: userType === 'customer' ? 'customer' : userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = data.redirectUrl || '/';
        
        if (onSuccess) onSuccess(data);
        toast.success(`Welcome, ${data.user.firstName || 'User'}!`);
      } else {
        console.error('Backend error:', data);
        toast.error(data.error || 'Google sign-in failed');
        if (onError) onError(data);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('An error occurred during Google sign-in');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google login error');
    toast.error('Failed to sign in with Google');
    setIsLoading(false);
    if (onError) onError(new Error('Google login failed'));
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <button
          disabled
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-sm ${
            isDark
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-gray-100 text-gray-800 border border-gray-300'
          } ${className}`}
        >
          <FiLoader className="animate-spin" size={20} />
          Signing in...
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          logo_alignment="center"
          width="100%"
          containerProps={{
            style: {
              width: '100%',
              borderRadius: '12px',
            }
          }}
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;
