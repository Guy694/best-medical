"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionManager } from '../lib/sessionTimeout';

export function useAuth(requiredRole = null) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = sessionManager.getSession();
      
      if (!userData || sessionManager.isSessionExpired()) {
        // No user or session expired
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        
        // Redirect to login if required role is specified
        if (requiredRole) {
          router.push('/login');
        }
        return;
      }

      // User is authenticated and session is valid
      setUser(userData);
      setIsAuthenticated(true);
      
      // Check role permission
      if (requiredRole && userData.role !== requiredRole) {
        // User doesn't have required role, redirect to appropriate page
        if (userData.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'STAFF') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/history');
        }
        return;
      }
      
      setLoading(false);
    };

    checkAuth();

    // Setup session monitoring
    sessionManager.initializeSession();
    sessionManager.setupActivityListeners();

    // Check session status periodically
    const interval = setInterval(() => {
      if (sessionManager.isSessionExpired()) {
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      sessionManager.stopSessionMonitoring();
    };
  }, []); // Remove dependencies to prevent re-renders

  const logout = () => {
    sessionManager.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateActivity = () => {
    sessionManager.updateActivity();
  };

  const getRemainingTime = () => {
    return sessionManager.getRemainingTime();
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    updateActivity,
    getRemainingTime
  };
}

// Hook specifically for pages that require authentication
export function useRequireAuth(requiredRole = null) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionManager.getSession();
    
    if (!userData || sessionManager.isSessionExpired()) {
      setLoading(false);
      if (requiredRole) {
        router.push('/login');
      }
      return;
    }

    if (requiredRole && userData.role !== requiredRole) {
      // Redirect based on actual role
      if (userData.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (userData.role === 'STAFF') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/history');
      }
      return;
    }

    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  }, []);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      LoadingComponent: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
          </div>
        </div>
      )
    };
  }

  return {
    user,
    loading: false,
    isAuthenticated,
    LoadingComponent: null
  };
}

// Hook for admin-only pages
export function useAdminAuth() {
  return useRequireAuth('ADMIN');
}

// Hook for staff-only pages
export function useStaffAuth() {
  return useRequireAuth('STAFF');
}

// Hook for customer-only pages
export function useCustomerAuth() {
  return useRequireAuth('CUSTOMER');
}