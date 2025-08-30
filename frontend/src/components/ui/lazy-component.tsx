'use client';

import { 
  lazy, 
  Suspense, 
  useState, 
  useEffect, 
  useRef, 
  ComponentType,
  ReactNode 
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  animationDelay?: number;
  onLoad?: () => void;
}

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P & { lazyProps?: Omit<LazyComponentProps, 'children'> }) => {
    const { lazyProps, ...componentProps } = props;
    
    return (
      <LazyComponentWrapper {...lazyProps}>
        <Suspense fallback={fallback || <Skeleton className="h-32" />}>
          <LazyComponent {...componentProps as any} />
        </Suspense>
      </LazyComponentWrapper>
    );
  };
};

// Lazy component wrapper with intersection observer
export const LazyComponentWrapper = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = '',
  animationDelay = 0,
  onLoad,
}: LazyComponentProps) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsInView(true);
            if (triggerOnce) {
              setHasLoaded(true);
              observer.disconnect();
            }
            onLoad?.();
          }, animationDelay);
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, animationDelay, onLoad]);

  const shouldRender = isInView || hasLoaded;

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const exitVariant = {
    opacity: 0,
    y: -20,
    scale: 0.95,
  };

  return (
    <div ref={elementRef} className={className}>
      <AnimatePresence mode="wait">
        {shouldRender ? (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={exitVariant}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback || <Skeleton className="h-32" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lazy section component for heavy content sections
interface LazySectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  skeletonHeight?: string;
  loadingText?: string;
}

export const LazySection = ({
  children,
  title,
  description,
  className = '',
  skeletonHeight = 'h-64',
  loadingText = 'Loading content...',
}: LazySectionProps) => {
  const fallback = (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div className="space-y-2">
          <Skeleton variant="text" height="2rem" width="40%" />
          {description && <Skeleton variant="text" lines={2} />}
        </div>
      )}
      <Skeleton className={skeletonHeight} />
      <div className="text-center text-sm text-gray-500 mt-4">
        {loadingText}
      </div>
    </div>
  );

  return (
    <LazyComponentWrapper
      fallback={fallback}
      className={className}
      animationDelay={100}
    >
      {children}
    </LazyComponentWrapper>
  );
};

// Lazy grid component for heavy lists
interface LazyGridProps {
  children: ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
  itemHeight?: string;
  loadingItems?: number;
}

export const LazyGrid = ({
  children,
  columns = 3,
  gap = 'gap-6',
  className = '',
  itemHeight = 'h-48',
  loadingItems = 6,
}: LazyGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const fallback = (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} ${gap} ${className}`}>
      {Array.from({ length: loadingItems }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Skeleton className={itemHeight} />
        </motion.div>
      ))}
    </div>
  );

  return (
    <LazyComponentWrapper
      fallback={fallback}
      className={className}
      animationDelay={150}
    >
      <motion.div
        className={`grid ${gridCols[columns as keyof typeof gridCols]} ${gap}`}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {children}
      </motion.div>
    </LazyComponentWrapper>
  );
};

// Lazy chart component for heavy data visualizations
interface LazyChartProps {
  children: ReactNode;
  title?: string;
  className?: string;
  height?: string;
}

export const LazyChart = ({
  children,
  title,
  className = '',
  height = 'h-96',
}: LazyChartProps) => {
  const fallback = (
    <div className={`p-6 border rounded-lg bg-white dark:bg-gray-800 ${className}`}>
      <div className="space-y-4">
        {title && <Skeleton variant="text" height="1.5rem" width="40%" />}
        <div className={`${height} flex items-end space-x-2`}>
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-200 to-blue-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 80 + 20}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            />
          ))}
        </div>
        <div className="text-center text-sm text-gray-500">
          Loading chart data...
        </div>
      </div>
    </div>
  );

  return (
    <LazyComponentWrapper
      fallback={fallback}
      className={className}
      animationDelay={200}
    >
      {children}
    </LazyComponentWrapper>
  );
};

// Hook for programmatic lazy loading
export const useLazyLoading = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return { isInView, hasLoaded, elementRef };
};