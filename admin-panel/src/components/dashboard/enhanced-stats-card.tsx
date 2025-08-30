'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { AnimatedCounter } from './animated-counter'
import { ProgressIndicator } from './progress-indicator'

interface EnhancedStatsCardProps {
  title: string
  value: number
  previousValue?: number
  target?: number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  showProgress?: boolean
  animated?: boolean
  onClick?: () => void
  className?: string
}

export function EnhancedStatsCard({
  title,
  value,
  previousValue,
  target,
  icon,
  trend,
  trendValue,
  color = 'blue',
  showProgress = false,
  animated = true,
  onClick,
  className = ''
}: EnhancedStatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      accent: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      accent: 'text-green-600',
      border: 'border-green-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      accent: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      accent: 'text-red-600',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      accent: 'text-purple-600',
      border: 'border-purple-200'
    }
  }

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  }

  const classes = colorClasses[color]

  return (
    <motion.div
      className={`
        bg-white rounded-lg border-2 ${classes.border} p-6 cursor-pointer
        ${onClick ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={onClick ? { 
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="text-3xl font-bold text-gray-900">
            <AnimatedCounter 
              value={value} 
              duration={animated ? 1.5 : 0}
            />
          </div>
        </div>
        
        {icon && (
          <motion.div
            className={`p-3 rounded-lg ${classes.bg}`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`h-8 w-8 ${classes.icon}`}>
              {icon}
            </div>
          </motion.div>
        )}
      </div>

      {/* Trend indicator */}
      {trend && trendValue && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center space-x-1 mb-3 ${trendClasses[trend]}`}
        >
          <motion.span
            animate={{ 
              rotate: trend === 'up' ? 0 : trend === 'down' ? 180 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="text-lg"
          >
            {trendIcons[trend]}
          </motion.span>
          <span className="text-sm font-medium">{trendValue}</span>
        </motion.div>
      )}

      {/* Progress indicator */}
      {showProgress && target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progress to target</span>
            <span className="text-xs font-medium text-gray-700">
              {Math.round((value / target) * 100)}%
            </span>
          </div>
          <ProgressIndicator
            value={value}
            max={target}
            color={color}
            size="sm"
            showValue={false}
            animated={animated}
          />
        </motion.div>
      )}

      {/* Comparison with previous value */}
      {previousValue !== undefined && previousValue !== value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">vs. previous</span>
            <div className={`flex items-center space-x-1 ${
              value > previousValue ? 'text-green-600' : 
              value < previousValue ? 'text-red-600' : 'text-gray-600'
            }`}>
              <span>
                {value > previousValue ? '+' : value < previousValue ? '-' : ''}
                {Math.abs(value - previousValue).toLocaleString()}
              </span>
              <span>
                ({value > previousValue ? '+' : value < previousValue ? '-' : ''}
                {Math.abs(((value - previousValue) / previousValue) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}