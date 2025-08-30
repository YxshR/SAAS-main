'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { fadeVariants, slideVariants } from '@/lib/animations'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface TabbedInterfaceProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function TabbedInterface({ tabs, defaultTab, className = '' }: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const prefersReducedMotion = useReducedMotion()

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab)
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabVariants = prefersReducedMotion ? fadeVariants : {
    inactive: {
      color: '#6b7280',
      borderBottomColor: 'transparent',
      y: 0,
      transition: { duration: 0.2 }
    },
    active: {
      color: '#3b82f6',
      borderBottomColor: '#3b82f6',
      y: -1,
      transition: { duration: 0.2 }
    },
    hover: {
      color: '#374151',
      y: -1,
      transition: { duration: 0.15 }
    }
  }

  const indicatorVariants = prefersReducedMotion ? {} : {
    animate: {
      x: `${activeTabIndex * 100}%`,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  }

  const contentVariants = prefersReducedMotion ? fadeVariants : {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="relative">
        <nav className="flex space-x-8 border-b border-gray-200" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`relative py-4 px-1 text-sm font-medium border-b-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === tab.id ? 'active' : 'inactive'}
              whileHover={activeTab !== tab.id && !prefersReducedMotion ? 'hover' : undefined}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.icon && (
                <motion.span
                  className="w-4 h-4"
                  animate={activeTab === tab.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.icon}
                </motion.span>
              )}
              <span>{tab.label}</span>
              
              {/* Active tab indicator */}
              {activeTab === tab.id && !prefersReducedMotion && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  layoutId="activeTabIndicator"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sliding indicator for reduced motion fallback */}
        {prefersReducedMotion && (
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 rounded-full transition-all duration-200"
            style={{
              left: `${(activeTabIndex / tabs.length) * 100}%`,
              width: `${100 / tabs.length}%`
            }}
          />
        )}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="focus:outline-none"
          >
            {activeTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}