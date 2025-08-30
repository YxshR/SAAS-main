'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressIndicatorProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  showValue?: boolean
  animated?: boolean
  className?: string
}

export function ProgressIndicator({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showValue = true,
  animated = true,
  className = ''
}: ProgressIndicatorProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(percentage), 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ 
            duration: animated ? 1.2 : 0,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </div>
      {showValue && (
        <motion.div 
          className="flex justify-between items-center mt-1 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </motion.div>
      )}
    </div>
  )
}