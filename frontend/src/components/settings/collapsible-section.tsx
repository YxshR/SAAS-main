'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { collapseVariants, fadeVariants } from '@/lib/animations'

interface CollapsibleSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export function CollapsibleSection({
  title,
  description,
  icon,
  children,
  defaultExpanded = false,
  className = ''
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const prefersReducedMotion = useReducedMotion()

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const headerVariants = prefersReducedMotion ? fadeVariants : {
    collapsed: {
      borderRadius: '0.5rem',
      transition: { duration: 0.2 }
    },
    expanded: {
      borderRadius: '0.5rem 0.5rem 0 0',
      transition: { duration: 0.2 }
    }
  }

  const iconVariants = prefersReducedMotion ? {
    collapsed: { rotate: 0 },
    expanded: { rotate: 0 },
    hover: { scale: 1 }
  } : {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
    hover: { scale: 1.1 }
  }

  const contentVariants = prefersReducedMotion ? fadeVariants : {
    collapsed: {
      height: 0,
      opacity: 0,
      paddingTop: 0,
      paddingBottom: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0 },
        padding: { duration: 0.3 }
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      paddingTop: '1.5rem',
      paddingBottom: '1.5rem',
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 },
        padding: { duration: 0.3 }
      }
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <motion.button
        className={`w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors ${
          isExpanded 
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200' 
            : 'bg-white hover:bg-gray-50'
        }`}
        onClick={toggleExpanded}
        variants={headerVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        whileHover={!prefersReducedMotion ? { backgroundColor: isExpanded ? undefined : '#f9fafb' } : undefined}
        whileTap={!prefersReducedMotion ? { scale: 0.995 } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div
                className="w-5 h-5 text-blue-600"
                whileHover={!prefersReducedMotion ? 'hover' : undefined}
                variants={prefersReducedMotion ? {} : { hover: { scale: 1.1, rotate: 5 } }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          <motion.div
            className="flex items-center space-x-2"
            variants={iconVariants}
            animate={isExpanded ? 'expanded' : 'collapsed'}
            whileHover={!prefersReducedMotion ? 'hover' : undefined}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm text-gray-500">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="px-6 bg-white border-t border-gray-100"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}