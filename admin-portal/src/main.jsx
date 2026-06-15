import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/admin.css';

// Global fetch interceptor to handle 401 Unauthorized responses
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const url = typeof args[0] === 'string' 
      ? args[0] 
      : (args[0] instanceof URL ? args[0].href : (args[0] && args[0].url) || '');
    
    const isAuth = url.includes('/auth/login') || 
                   url.includes('/auth/register') || 
                   url.includes('/auth/forgot-password') || 
                   url.includes('/auth/reset-password') ||
                   url.includes('/auth/verify-email') ||
                   url.includes('/auth/resend-verification');
    
    if (!isAuth) {
      console.warn('401 Unauthorized interceptor triggered. Clearing session and reloading...');
      localStorage.removeItem('ck_admin_token');
      localStorage.removeItem('ck_admin_user');
      window.location.reload();
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(<App />);
