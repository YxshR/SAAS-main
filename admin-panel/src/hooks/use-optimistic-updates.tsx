'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  error?: string;
}

interface OptimisticAction<T> {
  id: string;
  optimisticData: T;
  rollbackData: T;
  promise: Promise<T>;
}

export const useOptimisticUpdates = <T,>(initialData: T) => {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
  });
  
  const actionsRef = useRef<Map<string, OptimisticAction<T>>>(new Map());

  const executeOptimistic = useCallback(
    async (
      id: string,
      optimisticData: T,
      asyncAction: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        rollbackDelay?: number;
      }
    ) => {
      const rollbackData = state.data;
      
      // Apply optimistic update immediately
      setState(prev => ({
        data: optimisticData,
        isOptimistic: true,
        error: undefined,
      }));

      const action: OptimisticAction<T> = {
        id,
        optimisticData,
        rollbackData,
        promise: asyncAction(),
      };

      actionsRef.current.set(id, action);

      try {
        const result = await action.promise;
        
        // Success - apply real data
        setState(prev => ({
          data: result,
          isOptimistic: false,
          error: undefined,
        }));
        
        actionsRef.current.delete(id);
        options?.onSuccess?.(result);
        
        return result;
      } catch (error) {
        // Error - rollback with animation
        const rollbackDelay = options?.rollbackDelay || 300;
        
        setState(prev => ({
          data: prev.data,
          isOptimistic: true,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));

        // Animate rollback after delay
        setTimeout(() => {
          setState({
            data: rollbackData,
            isOptimistic: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }, rollbackDelay);

        actionsRef.current.delete(id);
        options?.onError?.(error instanceof Error ? error : new Error('Unknown error'));
        
        throw error;
      }
    },
    [state.data]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: undefined }));
  }, []);

  const rollbackAction = useCallback((id: string) => {
    const action = actionsRef.current.get(id);
    if (action) {
      setState({
        data: action.rollbackData,
        isOptimistic: false,
        error: undefined,
      });
      actionsRef.current.delete(id);
    }
  }, []);

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    error: state.error,
    executeOptimistic,
    clearError,
    rollbackAction,
  };
};

// Optimistic UI Component Wrapper
interface OptimisticWrapperProps {
  children: React.ReactNode;
  isOptimistic: boolean;
  error?: string;
  className?: string;
}

export const OptimisticWrapper = ({ 
  children, 
  isOptimistic, 
  error, 
  className = '' 
}: OptimisticWrapperProps) => {
  const variants = {
    normal: {
      opacity: 1,
      scale: 1,
      filter: 'brightness(1)',
    },
    optimistic: {
      opacity: 0.7,
      scale: 0.98,
      filter: 'brightness(1.1)',
    },
    error: {
      opacity: 1,
      scale: 1,
      filter: 'brightness(1)',
      x: [0, -5, 5, -5, 5, 0],
    },
  };

  const getAnimationState = () => {
    if (error) return 'error';
    if (isOptimistic) return 'optimistic';
    return 'normal';
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={variants}
      animate={getAnimationState()}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
      
      {/* Optimistic indicator */}
      <AnimatePresence>
        {isOptimistic && (
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: 1,
              transition: {
                opacity: {
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 0.2,
                  ease: 'easeOut',
                },
              },
            }}
            exit={{ opacity: 0, scale: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Error indicator */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Optimistic Button Component
interface OptimisticButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  className?: string;
  disabled?: boolean;
  optimisticText?: string;
  errorText?: string;
}

export const OptimisticButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  optimisticText = 'Processing...',
  errorText = 'Try again',
}: OptimisticButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      await onClick();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
    normal: { scale: 1 },
    loading: { scale: 0.95 },
    error: { 
      scale: 1,
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4 }
    },
  };

  const getButtonState = () => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'normal';
  };

  const getButtonText = () => {
    if (error) return errorText;
    if (isLoading) return optimisticText;
    return children;
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      variants={buttonVariants}
      animate={getButtonState()}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={getButtonState()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {getButtonText()}
        </motion.span>
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-current opacity-10"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};