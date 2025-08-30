'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

import {
  ErrorBoundary,
  AnimationErrorBoundary,
  useFormValidation,
  FormField,
  FormErrorSummary,
  useGlobalError,
  useNetworkErrorHandler,
  withNetworkErrorHandling,
} from '../../lib/error-handling';

// Component that intentionally throws an error for testing
const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error from ErrorThrowingComponent');
  }
  return <div className="p-4 bg-green-50 rounded-lg">Component loaded successfully!</div>;
};

// Animation component that might fail
const AnimationComponent: React.FC<{ shouldFail: boolean }> = ({ shouldFail }) => {
  if (shouldFail) {
    throw new Error('Animation failed to render');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-blue-50 rounded-lg"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 bg-blue-500 rounded-full mx-auto"
      />
      <p className="text-center mt-2">Animated component working!</p>
    </motion.div>
  );
};

// Form validation demo
const FormValidationDemo: React.FC = () => {
  const {
    data,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
  } = useFormValidation(
    { email: '', password: '', age: '', website: '' },
    {
      email: { 
        required: true, 
        email: true, 
        message: 'Please enter a valid email address' 
      },
      password: { 
        required: true, 
        minLength: 8, 
        message: 'Password must be at least 8 characters long' 
      },
      age: { 
        required: true,
        custom: (value) => {
          const age = parseInt(value);
          if (isNaN(age)) return 'Age must be a number';
          if (age < 18) return 'Must be at least 18 years old';
          if (age > 120) return 'Please enter a realistic age';
          return null;
        }
      },
      website: { 
        url: true, 
        message: 'Please enter a valid website URL' 
      },
    }
  );

  const onSubmit = async (formData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Form Validation Demo</h3>
      
      <FormErrorSummary errors={errors} touched={touched} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={data.email}
          error={errors.email}
          touched={touched.email}
          onChange={(value) => setFieldValue('email', value)}
          onBlur={() => setFieldTouched('email')}
        />
        
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={data.password}
          error={errors.password}
          touched={touched.password}
          onChange={(value) => setFieldValue('password', value)}
          onBlur={() => setFieldTouched('password')}
        />
        
        <FormField
          name="age"
          label="Age"
          type="number"
          placeholder="Enter your age"
          value={data.age}
          error={errors.age}
          touched={touched.age}
          onChange={(value) => setFieldValue('age', value)}
          onBlur={() => setFieldTouched('age')}
        />
        
        <FormField
          name="website"
          label="Website (Optional)"
          type="url"
          placeholder="https://example.com"
          value={data.website}
          error={errors.website}
          touched={touched.website}
          onChange={(value) => setFieldValue('website', value)}
          onBlur={() => setFieldTouched('website')}
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`
            px-6 py-2 rounded-lg font-medium transition-colors duration-200
            ${isValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Form'
          )}
        </button>
        
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Network error handling demo
const NetworkErrorDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { handleRequest } = useNetworkErrorHandler();

  const simulateNetworkRequest = async (shouldFail: boolean) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await handleRequest(async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (shouldFail) {
          throw new Error('Network request failed');
        }
        
        return { data: 'Request successful!' };
      });
      
      setResult(response.data);
    } catch (error) {
      setResult('Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Network Error Handling Demo</h3>
      
      <div className="flex gap-4">
        <button
          onClick={() => simulateNetworkRequest(false)}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Successful Request'}
        </button>
        
        <button
          onClick={() => simulateNetworkRequest(true)}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Failed Request'}
        </button>
      </div>
      
      {result && (
        <div className={`p-4 rounded-lg ${
          result.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
};

// Global error demo
const GlobalErrorDemo: React.FC = () => {
  const { addError, clearErrors, errors, isOnline } = useGlobalError();

  const triggerError = (type: 'network' | 'authentication' | 'validation' | 'server') => {
    switch (type) {
      case 'network':
        addError({
          type: 'network',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          retryable: true,
          onRetry: () => console.log('Retrying network request...'),
        });
        break;
      
      case 'authentication':
        addError({
          type: 'authentication',
          title: 'Authentication Required',
          message: 'Your session has expired. Please log in again.',
          retryable: false,
        });
        break;
      
      case 'validation':
        addError({
          type: 'validation',
          title: 'Validation Error',
          message: 'The data you entered is invalid. Please check and try again.',
          retryable: false,
        });
        break;
      
      case 'server':
        addError({
          type: 'server',
          title: 'Server Error',
          message: 'An internal server error occurred. Please try again later.',
          retryable: true,
          onRetry: () => console.log('Retrying server request...'),
        });
        break;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Global Error Handling Demo</h3>
      
      <div className="flex items-center gap-2 mb-4">
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-red-500" />
            <span className="text-red-700">Offline</span>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => triggerError('network')}
          className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition-colors duration-200"
        >
          Network Error
        </button>
        
        <button
          onClick={() => triggerError('authentication')}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors duration-200"
        >
          Auth Error
        </button>
        
        <button
          onClick={() => triggerError('validation')}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors duration-200"
        >
          Validation Error
        </button>
        
        <button
          onClick={() => triggerError('server')}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors duration-200"
        >
          Server Error
        </button>
      </div>
      
      <button
        onClick={clearErrors}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
      >
        Clear All Errors ({errors.length})
      </button>
    </div>
  );
};

// Main demo component
export const ErrorHandlingDemo: React.FC = () => {
  const [showErrorComponent, setShowErrorComponent] = useState(false);
  const [showAnimationError, setShowAnimationError] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Comprehensive Error Handling Demo
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This demo showcases all the error handling features including error boundaries, 
          form validation, network error handling, and global error management.
        </p>
      </div>

      {/* Error Boundary Demo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Error Boundary Demo</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setShowErrorComponent(!showErrorComponent)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                showErrorComponent
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {showErrorComponent ? 'Hide Error Component' : 'Show Error Component'}
            </button>
          </div>
          
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={showErrorComponent} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Animation Error Boundary Demo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Animation Error Boundary Demo</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setShowAnimationError(!showAnimationError)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                showAnimationError
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {showAnimationError ? 'Fix Animation' : 'Break Animation'}
            </button>
          </div>
          
          <AnimationErrorBoundary>
            <AnimationComponent shouldFail={showAnimationError} />
          </AnimationErrorBoundary>
        </div>
      </div>

      {/* Form Validation Demo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <FormValidationDemo />
      </div>

      {/* Network Error Demo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <NetworkErrorDemo />
      </div>

      {/* Global Error Demo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <GlobalErrorDemo />
      </div>
    </div>
  );
};