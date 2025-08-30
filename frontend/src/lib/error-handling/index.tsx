import React from 'react';
import { ErrorBoundary } from './error-boundary';

// Error Boundary Components
export {
  ErrorBoundary,
  AnimationErrorBoundary,
  useErrorHandler,
} from './error-boundary';

// Network Error Handling
export {
  NetworkErrorHandler,
  networkErrorHandler,
  withNetworkErrorHandling,
  createNetworkErrorHandler,
  useNetworkErrorHandler,
  type NetworkError,
  type RetryConfig,
  type NetworkErrorHandlerConfig,
} from './network-error-handler';

// Form Validation
export {
  FormValidator,
  useFormValidation,
  FormField,
  FormErrorSummary,
  type ValidationRule,
  type FieldError,
  type FormValidationState,
  type FormValidationConfig,
} from './form-validation';

// Global Error Handling
export {
  GlobalErrorProvider,
  useGlobalError,
  NotFoundPage,
  ServerErrorPage,
  createNetworkError,
  createAuthError,
  createValidationError,
  createServerError,
  type GlobalError,
} from './global-error-handler';

// Import error creators for local use
import {
  createNetworkError as _createNetworkError,
  createAuthError as _createAuthError,
  createValidationError as _createValidationError,
  createServerError as _createServerError,
} from './global-error-handler';

// Utility functions for common error scenarios
export const handleApiError = (error: any) => {
  if (error.response) {
    // HTTP error response
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (Math.floor(status / 100)) {
      case 4:
        if (status === 401) return _createAuthError(message);
        if (status === 403) return _createAuthError('Access denied');
        if (status === 404) return _createValidationError('Resource not found');
        return _createValidationError(message || 'Request failed');
      case 5:
        return _createServerError(message);
      default:
        return _createNetworkError(message);
    }
  } else if (error.request) {
    // Network error
    return _createNetworkError('Unable to connect to the server');
  } else {
    // Other error
    return _createServerError(error.message || 'An unexpected error occurred');
  }
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: any) => void
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Unhandled error:', error);
      }
      throw error;
    }
  };
};

// Error reporting utilities
export const reportError = (error: Error, context?: Record<string, any>) => {
  console.error('Error reported:', error, context);
  
  // In a real application, you would send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: context });
  
  // For development, log to console with additional context
  if (process.env.NODE_ENV === 'development') {
    console.group('Error Details');
    console.error('Error:', error);
    console.log('Stack:', error.stack);
    console.log('Context:', context);
    console.groupEnd();
  }
};

// Error boundary HOC
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<any>
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback ? React.createElement(fallback) : undefined}>
      <Component {...props} />
    </ErrorBoundary>
  );
};