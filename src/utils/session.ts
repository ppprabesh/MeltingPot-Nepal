// src/utils/session.ts

export const setAdminSession = () => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10); // 10 minutes from now
  
  document.cookie = `adminAuthenticated=true; expires=${expirationTime.toUTCString()}; path=/; secure; samesite=strict`;
};

export const clearAdminSession = () => {
  document.cookie = 'adminAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';
};

export const checkAdminSession = () => {
  const cookies = document.cookie.split(';');
  const adminCookie = cookies.find(cookie => cookie.trim().startsWith('adminAuthenticated='));
  
  if (!adminCookie) return false;
  
  const cookieValue = adminCookie.split('=')[1].trim();
  return cookieValue === 'true';
};

// Handle tab/browser close
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearAdminSession();
  });
} 