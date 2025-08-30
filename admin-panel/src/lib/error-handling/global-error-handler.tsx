'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
// import { toast } from 'sonner'; // TODO: Install sonner package or use alternative

export interface GlobalError {
  id: string;
  type: 'network' | 'application' | 'validation' | 'authentication' | 'authorization' | 'server';
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  retryable: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

interface GlobalErrorContextType {
  errors: GlobalError[];
  isOnline: boolean;
  addError: (error: Omit<GlobalError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  retryError: (id: string) => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | null>(null);

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};

interface GlobalErrorProviderProps {
  children: React.ReactNode;
  maxErrors?: number;
  autoRemoveDelay?: number;
}

export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({
  children,
  maxErrors = 5,
  autoRemoveDelay = 10000,
}) => {
  const [errors, setErrors] = useState<GlobalError[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Connection restored: You are back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      addError({
        type: 'network',
        title: 'Connection lost',
        message: 'You are currently offline. Some features may not work properly.',
        retryable: false,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check initial status
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      addError({
        type: 'application',
        title: 'Unexpected error',
        message: 'An unexpected error occurred. Please try refreshing the page.',
        details: event.reason?.message || String(event.reason),
        retryable: true,
        onRetry: () => typeof window !== 'undefined' && window.location.reload(),
      });
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      addError({
        type: 'application',
        title: 'JavaScript error',
        message: 'A JavaScript error occurred. Please try refreshing the page.',
        details: event.error?.message || event.message,
        retryable: true,
        onRetry: () => typeof window !== 'undefined' && window.location.reload(),
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    }
  }, []);

  const addError = (errorData: Omit<GlobalError, 'id' | 'timestamp'>) => {
    const error: GlobalError = {
      ...errorData,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setErrors(prev => {
      const newErrors = [error, ...prev].slice(0, maxErrors);
      return newErrors;
    });

    // Show toast notification
    const toastId = error.id;
    
    switch (error.type) {
      case 'network':
        console.error(`Network Error - ${error.title}: ${error.message}`);
        break;
      
      case 'authentication':
        console.error(`Authentication Error - ${error.title}: ${error.message}`);
        break;
      
      case 'authorization':
        console.error(`Authorization Error - ${error.title}: ${error.message}`);
        break;
      
      default:
        console.error(`Error - ${error.title}: ${error.message}`);
    }

    // Auto-remove error after delay
    if (autoRemoveDelay > 0) {
      setTimeout(() => {
        removeError(error.id);
      }, autoRemoveDelay);
    }
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
    // toast.dismiss(id); // TODO: Implement toast system
  };

  const clearErrors = () => {
    setErrors([]);
    // toast.dismiss(); // TODO: Implement toast system
  };

  const retryError = (id: string) => {
    const error = errors.find(e => e.id === id);
    if (error?.onRetry) {
      error.onRetry();
      removeError(id);
    }
  };

  const value: GlobalErrorContextType = {
    errors,
    isOnline,
    addError,
    removeError,
    clearErrors,
    retryError,
  };

  return (
    <GlobalErrorContext.Provider value={value}>
      {children}
      <GlobalErrorDisplay />
      <OfflineIndicator isOnline={isOnline} />
    </GlobalErrorContext.Provider>
  );
};

// Global error display component
const GlobalErrorDisplay: React.FC = () => {
  const { errors, removeError, retryError } = useGlobalError();
  const [isExpanded, setIsExpanded] = useState(false);

  if (errors.length === 0) return null;

  const criticalErrors = errors.filter(e => e.type === 'application' || e.type === 'server');
  const hasCriticalErrors = criticalErrors.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <motion.div
          layout
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div
            className={`p-4 cursor-pointer ${
              hasCriticalErrors ? 'bg-red-50 border-b border-red-200' : 'bg-yellow-50 border-b border-yellow-200'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${hasCriticalErrors ? 'text-red-500' : 'text-yellow-500'}`} />
                <span className="font-medium text-gray-900">
                  {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </motion.div>
            </div>
          </div>

          {/* Error list */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="max-h-64 overflow-y-auto">
                  {errors.map((error, index) => (
                    <motion.div
                      key={error.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {error.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {error.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {error.retryable && (
                              <button
                                onClick={() => retryError(error.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Retry
                              </button>
                            )}
                            <span className="text-xs text-gray-400">
                              {error.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeError(error.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Offline indicator component
interface OfflineIndicatorProps {
  isOnline: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="bg-red-600 text-white px-4 py-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                You are currently offline
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Error page components for different error types
export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl font-bold text-blue-600 mb-4"
        >
          404
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Page not found
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl font-bold text-red-600 mb-4"
        >
          500
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Server error
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8"
        >
          Something went wrong on our end. We&apos;re working to fix it.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
};

// Utility functions for common error scenarios
export const createNetworkError = (message?: string): Omit<GlobalError, 'id' | 'timestamp'> => ({
  type: 'network',
  title: 'Connection error',
  message: message || 'Unable to connect to the server. Please check your internet connection.',
  retryable: true,
});

export const createAuthError = (message?: string): Omit<GlobalError, 'id' | 'timestamp'> => ({
  type: 'authentication',
  title: 'Authentication required',
  message: message || 'Please log in to continue.',
  retryable: false,
});

export const createValidationError = (message: string): Omit<GlobalError, 'id' | 'timestamp'> => ({
  type: 'validation',
  title: 'Validation error',
  message,
  retryable: false,
});

export const createServerError = (message?: string): Omit<GlobalError, 'id' | 'timestamp'> => ({
  type: 'server',
  title: 'Server error',
  message: message || 'An error occurred on the server. Please try again later.',
  retryable: true,
  onRetry: () => typeof window !== 'undefined' && window.location.reload(),
});