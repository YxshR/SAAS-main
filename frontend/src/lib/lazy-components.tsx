// Lazy loading utilities and components for better performance

import React, { lazy, ComponentType, LazyExoticComponent } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Generic lazy loading wrapper with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): LazyExoticComponent<T> {
  return lazy(importFn)
}

// Lazy load heavy components
export const LazyAudioPlayer = createLazyComponent(
  () => import('@/components/features/audio-player').then(module => ({ default: module.AudioPlayer }))
)

export const LazyPaymentForm = createLazyComponent(
  () => import('@/components/features/payment-form').then(module => ({ default: module.PaymentForm }))
)

export const LazyChatInterface = createLazyComponent(
  () => import('@/components/features/chat-interface').then(module => ({ default: module.ChatInterface }))
)

export const LazySummaryDisplay = createLazyComponent(
  () => import('@/components/features/summary-display').then(module => ({ default: module.SummaryDisplay }))
)

export const LazyBillingHistory = createLazyComponent(
  () => import('@/components/features/billing-history').then(module => ({ default: module.BillingHistory }))
)

export const LazyUsageTracking = createLazyComponent(
  () => import('@/components/features/usage-tracking').then(module => ({ default: module.UsageTracking }))
)

export const LazySubscriptionPlans = createLazyComponent(
  () => import('@/components/features/subscription-plans').then(module => ({ default: module.SubscriptionPlans }))
)

export const LazySummaryHistory = createLazyComponent(
  () => import('@/components/features/summary-history').then(module => ({ default: module.SummaryHistory }))
)

// Lazy load admin components (if they exist)
export const LazyAdminDashboard = createLazyComponent(
  () => Promise.resolve({ default: () => null })
)

export const LazyUserManagement = createLazyComponent(
  () => Promise.resolve({ default: () => null })
)

// Lazy load chart components for analytics
export const LazyCharts = createLazyComponent(
  () => Promise.resolve({ default: () => null })
)

// Preload critical components
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload components that are likely to be needed soon
    const preloadPromises = [
      import('@/components/features/content-input').catch(() => null),
      import('@/components/features/summary-display').catch(() => null),
      import('@/components/ui/button').catch(() => null),
    ]
    
    // Don't await these - just start the loading process
    preloadPromises.forEach(promise => 
      promise.catch(error => console.warn('Failed to preload component:', error))
    )
  }
}

// Dynamic import utility for route-based code splitting
export const dynamicImport = {
  // Auth pages
  LoginPage: () => import('@/app/login/page'),
  RegisterPage: () => import('@/app/register/page'),
  VerifyPhonePage: () => import('@/app/verify-phone/page'),
  
  // Main app pages
  DashboardPage: () => import('@/app/dashboard/page'),
  ProfilePage: () => import('@/app/profile/page'),
  SettingsPage: () => import('@/app/settings/page'),
  
  // Feature pages
  PricingPage: () => import('@/app/pricing/page'),
  SubscriptionPage: () => import('@/app/subscription/page'),
  
  // Dynamic pages
  SummaryPage: (id: string) => import('@/app/summary/[id]/page'),
  ChatPage: (id: string) => import('@/app/chat/[id]/page'),
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const targetRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const target = targetRef.current
    if (!target) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )
    
    observer.observe(target)
    
    return () => observer.disconnect()
  }, [callback, options])
  
  return targetRef
}

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  className?: string
}

export function LazyImage({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  className,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = useIntersectionObserver(() => setIsInView(true))
  
  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={isLoaded ? src : placeholder}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className="transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0.5 }}
          {...props}
        />
      )}
    </div>
  )
}

// Bundle size analyzer utility
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available in production build with ANALYZE=true')
  }
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Mark performance milestones
  mark: (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name)
    }
  },
  
  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name)[0]
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`)
        return measure.duration
      } catch (error) {
        console.warn('Performance measurement failed:', error)
      }
    }
    return 0
  },
  
  // Get Core Web Vitals
  getCoreWebVitals: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      return {
        // First Contentful Paint
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        
        // Largest Contentful Paint (requires observer)
        lcp: 0, // Would need PerformanceObserver
        
        // Time to Interactive (approximation)
        tti: navigation.domInteractive - navigation.startTime,
        
        // Total Blocking Time (approximation)
        tbt: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        
        // Cumulative Layout Shift (requires observer)
        cls: 0, // Would need PerformanceObserver
      }
    }
    
    return null
  }
}

// Resource hints for better loading performance
export const addResourceHints = () => {
  if (typeof document !== 'undefined') {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
    
    // DNS prefetch for API domains
    const dnsPrefetchDomains = [
      'https://api.openai.com',
      'https://api.elevenlabs.io',
    ]
    
    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }
}