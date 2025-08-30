'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LazyLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

// Default loading component
const DefaultLoader = ({ className = '' }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex items-center justify-center p-8 ${className}`}
  >
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-blue-600" />
      </motion.div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </motion.div>
)

// Skeleton loader for different content types
export const SkeletonLoader = ({ 
  type = 'default',
  className = '' 
}: { 
  type?: 'card' | 'list' | 'text' | 'default'
  className?: string 
}) => {
  const skeletons = {
    card: (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
      </div>
    ),
    list: (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    text: (
      <div className={`animate-pulse space-y-2 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-4 rounded w-full"></div>
        ))}
        <div className="bg-gray-200 h-4 rounded w-2/3"></div>
      </div>
    ),
    default: <DefaultLoader className={className} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {skeletons[type]}
    </motion.div>
  )
}

// Lazy loader component
export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback,
  className = '' 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultLoader className={className} />}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc)
  
  return (props: P) => (
    <LazyLoader fallback={fallback}>
      <LazyComponent {...(props as any)} />
    </LazyLoader>
  )
}

// Hook for intersection observer based lazy loading
export const useLazyLoad = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true)
          setHasLoaded(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, hasLoaded, options])

  return { isIntersecting, hasLoaded }
}

// Lazy image component
export const LazyImage: React.FC<{
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  onLoad,
  onError 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)
  const { isIntersecting } = useLazyLoad(imgRef)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isIntersecting && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {isIntersecting && (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <motion.img
            src={hasError ? placeholder : src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
          />
        </>
      )}
    </div>
  )
}

export default LazyLoader