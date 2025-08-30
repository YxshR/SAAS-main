'use client'

import React, { Suspense, ReactNode } from 'react'
import { ErrorBoundary } from './error-boundary'
import { LoadingSpinner } from './loading-spinner'

interface PerformanceWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  name?: string
}

// High-performance wrapper with error boundary and suspense
export function PerformanceWrapper({ 
  children, 
  fallback, 
  errorFallback,
  name = 'Component'
}: PerformanceWrapperProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="md" />
    </div>
  )

  return (
    <ErrorBoundary
      name={name}
      level="component"
      fallback={errorFallback}
    >
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Lazy loading wrapper for heavy components
interface LazyWrapperProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyWrapper({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  className 
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  )
}

// Memoized component wrapper
interface MemoWrapperProps {
  children: ReactNode
  deps?: any[]
}

export const MemoWrapper = React.memo<MemoWrapperProps>(({ children }) => {
  return <>{children}</>
})

MemoWrapper.displayName = 'MemoWrapper'

// Virtual scrolling wrapper for large lists
interface VirtualScrollProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => ReactNode
  className?: string
}

export function VirtualScroll({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  className 
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(startIndex, endIndex)
  
  return (
    <div 
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  )
}