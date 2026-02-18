/**
 * Security wrapper component for zero-trust architecture
 * Implements security checks and monitoring
 */

import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SecurityWrapperProps {
  children: ReactNode;
}

export default function SecurityWrapper({ children }: SecurityWrapperProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for localStorage availability
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
    } catch (e) {
      console.error('localStorage is not available');
      // Could redirect to error page or show warning
    }

    // Monitor for suspicious activity
    const handleStorageChange = (e: StorageEvent) => {
      // Log storage changes from other tabs/windows for security monitoring
      if (e.key?.startsWith('devlog_')) {
        console.warn('Storage modified from external source:', e.key);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check for browser security features
    if (!window.crypto || !window.crypto.getRandomValues) {
      console.error('Web Crypto API not available - security features disabled');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
