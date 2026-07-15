
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './styles/index.css';

// =============================================
// ✅ GOOGLE CLIENT ID - MATCHES GOOGLE CLOUD CONSOLE
// =============================================
const GOOGLE_CLIENT_ID = '936990049446-3f1ehig92jmt5iqh6h06jh4l1q8hmgv2.apps.googleusercontent.com';

console.log('🔍 [Google OAuth] Using Client ID:', GOOGLE_CLIENT_ID);

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);