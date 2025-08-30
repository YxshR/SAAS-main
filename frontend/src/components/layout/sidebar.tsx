'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useLayout } from '@/lib/hooks/use-layout'
import { 
  slideRightVariants, 
  fadeVariants, 
  staggerContainer,
  staggerItem,
  hoverAnimations,
  clickAnimations,
  durations,
  easings,
  useReducedMotion
} from '@/lib/animations'

interface SidebarItem {
  href: string
  label: string
  icon: string
  badge?: string | number
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    badge: 'New'
  },
  {
    href: '/summary',
    label: 'Summary',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    children: [
      {
        href: '/summary/recent',
        label: 'Recent',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        href: '/summary/favorites',
        label: 'Favorites',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
      }
    ]
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    href: '/subscription',
    label: 'Subscription',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const { sidebarCollapsed, toggleSidebarCollapsed } = useLayout()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Load expanded items from localStorage
  useEffect(() => {
    setMounted(true)
    const savedExpanded = localStorage.getItem('sidebar-expanded')
    
    if (savedExpanded) {
      setExpandedItems(JSON.parse(savedExpanded))
    }
  }, [])

  // Save expanded items to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(expandedItems))
    }
  }, [expandedItems, mounted])

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isItemActive = (href: string, children?: SidebarItem[]) => {
    if (pathname === href) return true
    if (children) {
      return children.some(child => pathname === child.href)
    }
    return false
  }

  if (!mounted || !isAuthenticated) return null

  return (
    <motion.aside
      className={`fixed left-0 top-16 bottom-0 z-30 bg-white border-r border-gray-200 shadow-lg ${className}`}
      initial={{ x: -300 }}
      animate={{ 
        x: 0,
        width: sidebarCollapsed ? 80 : 280 
      }}
      transition={{ 
        duration: prefersReducedMotion ? durations.micro : durations.normal,
        ease: easings.easeOut 
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: durations.fast }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'} Plan
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={toggleSidebarCollapsed}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
            whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: durations.fast }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </motion.button>
        </div>

        {/* Navigation */}
        <motion.nav
          className="flex-1 overflow-y-auto py-4"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = isItemActive(item.href, item.children)
              const isExpanded = expandedItems.includes(item.href)
              const hasChildren = item.children && item.children.length > 0

              return (
                <motion.div
                  key={item.href}
                  variants={prefersReducedMotion ? {} : staggerItem}
                  custom={index}
                >
                  {/* Main Item */}
                  <div className="relative">
                    {hasChildren ? (
                      <motion.button
                        onClick={() => toggleExpanded(item.href)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                        whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                      >
                        <motion.div
                          className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-gradient-to-br from-blue-100 to-purple-100' 
                              : 'bg-gray-100'
                          }`}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                          transition={{ duration: durations.fast }}
                        >
                          <svg 
                            className={`w-4 h-4 ${
                              isActive ? 'text-blue-600' : 'text-gray-600'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                          {!sidebarCollapsed && (
                            <motion.div
                              className="flex-1 flex items-center justify-between"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: durations.fast }}
                            >
                              <span className="flex-1 text-left">{item.label}</span>
                              <div className="flex items-center space-x-2">
                                {item.badge && (
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                                <motion.svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: durations.fast }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </motion.svg>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <motion.div
                          className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-gradient-to-br from-blue-100 to-purple-100' 
                              : 'bg-gray-100'
                          }`}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                          transition={{ duration: durations.fast }}
                        >
                          <svg 
                            className={`w-4 h-4 ${
                              isActive ? 'text-blue-600' : 'text-gray-600'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                          {!sidebarCollapsed && (
                            <motion.div
                              className="flex-1 flex items-center justify-between"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: durations.fast }}
                            >
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Link>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                        layoutId="activeSidebarItem"
                        style={{ y: '-50%' }}
                        transition={{ duration: durations.fast }}
                      />
                    )}
                  </div>

                  {/* Children */}
                  <AnimatePresence>
                    {hasChildren && isExpanded && !sidebarCollapsed && (
                      <motion.div
                        className="ml-6 mt-1 space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: durations.normal }}
                      >
                        {item.children?.map((child, childIndex) => {
                          const isChildActive = pathname === child.href
                          
                          return (
                            <motion.div
                              key={child.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: childIndex * 0.05 }}
                            >
                              <Link
                                href={child.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                  isChildActive
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <div className={`p-1.5 rounded ${
                                  isChildActive ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                  <svg 
                                    className={`w-3 h-3 ${
                                      isChildActive ? 'text-blue-600' : 'text-gray-500'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={child.icon} />
                                  </svg>
                                </div>
                                <span className="flex-1">{child.label}</span>
                              </Link>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.nav>

        {/* Footer */}
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              className="p-4 border-t border-gray-200 bg-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: durations.fast }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium text-gray-900">2.1 GB / 5 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <motion.button
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                >
                  Upgrade Plan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}