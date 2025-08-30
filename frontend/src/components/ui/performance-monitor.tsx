'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Zap, Clock, Wifi } from 'lucide-react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

interface NetworkInfo {
  effectiveType: string
  downlink: number
  rtt: number
}

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)

  useEffect(() => {
    // Get network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      })
    }

    // Web Vitals measurement
    const measureWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')
        
        getCLS((metric) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }))
        })
        
        getFID((metric) => {
          setMetrics(prev => ({ ...prev, fid: metric.value }))
        })
        
        getFCP((metric) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }))
        })
        
        getLCP((metric) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }))
        })
        
        getTTFB((metric) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }))
        })
      } catch (error) {
        console.warn('Web Vitals not available:', error)
      }
    }

    measureWebVitals()
  }, [])

  return { metrics, networkInfo }
}

// Performance score calculator
const getPerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 100
  
  // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
  if (metrics.fcp !== null) {
    if (metrics.fcp > 3000) score -= 20
    else if (metrics.fcp > 1800) score -= 10
  }
  
  // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
  if (metrics.lcp !== null) {
    if (metrics.lcp > 4000) score -= 25
    else if (metrics.lcp > 2500) score -= 15
  }
  
  // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
  if (metrics.fid !== null) {
    if (metrics.fid > 300) score -= 20
    else if (metrics.fid > 100) score -= 10
  }
  
  // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
  if (metrics.cls !== null) {
    if (metrics.cls > 0.25) score -= 25
    else if (metrics.cls > 0.1) score -= 15
  }
  
  return Math.max(0, score)
}

// Performance badge component
export const PerformanceBadge: React.FC<{
  show?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}> = ({ show = process.env.NODE_ENV === 'development', position = 'bottom-right' }) => {
  const { metrics, networkInfo } = usePerformanceMetrics()
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!show) return null
  
  const score = getPerformanceScore(metrics)
  const scoreColor = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red'
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center space-x-2 p-3 w-full text-left
            ${scoreColor === 'green' ? 'bg-green-50 text-green-700' : ''}
            ${scoreColor === 'yellow' ? 'bg-yellow-50 text-yellow-700' : ''}
            ${scoreColor === 'red' ? 'bg-red-50 text-red-700' : ''}
            hover:opacity-80 transition-opacity
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium">{score}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200"
            >
              <div className="p-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <MetricItem
                    icon={<Zap className="w-3 h-3" />}
                    label="FCP"
                    value={metrics.fcp}
                    unit="ms"
                    threshold={[1800, 3000]}
                  />
                  <MetricItem
                    icon={<Clock className="w-3 h-3" />}
                    label="LCP"
                    value={metrics.lcp}
                    unit="ms"
                    threshold={[2500, 4000]}
                  />
                  <MetricItem
                    icon={<Activity className="w-3 h-3" />}
                    label="FID"
                    value={metrics.fid}
                    unit="ms"
                    threshold={[100, 300]}
                  />
                  <MetricItem
                    icon={<Activity className="w-3 h-3" />}
                    label="CLS"
                    value={metrics.cls ? metrics.cls * 1000 : null}
                    unit=""
                    threshold={[100, 250]}
                  />
                </div>
                
                {networkInfo && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Wifi className="w-3 h-3" />
                      <span>{networkInfo.effectiveType}</span>
                      <span>•</span>
                      <span>{networkInfo.downlink}Mbps</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const MetricItem: React.FC<{
  icon: React.ReactNode
  label: string
  value: number | null
  unit: string
  threshold: [number, number] // [good, poor]
}> = ({ icon, label, value, unit, threshold }) => {
  if (value === null) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        {icon}
        <span>{label}: --</span>
      </div>
    )
  }
  
  const [good, poor] = threshold
  const color = value <= good ? 'text-green-600' : value <= poor ? 'text-yellow-600' : 'text-red-600'
  
  return (
    <div className={`flex items-center space-x-2 ${color}`}>
      {icon}
      <span>{label}: {Math.round(value)}{unit}</span>
    </div>
  )
}

// Performance monitoring hook for components
export const useComponentPerformance = (componentName: string) => {
  const [renderTime, setRenderTime] = useState<number | null>(null)
  const [renderCount, setRenderCount] = useState(0)
  
  const startTime = useCallback(() => {
    return performance.now()
  }, [])
  
  const endTime = useCallback((start: number) => {
    const end = performance.now()
    const duration = end - start
    setRenderTime(duration)
    setRenderCount(prev => prev + 1)
    
    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }, [componentName])
  
  return { renderTime, renderCount, startTime, endTime }
}

// Memory usage monitor
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)
  
  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        })
      }
    }
    
    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return memoryInfo
}

export default PerformanceBadge