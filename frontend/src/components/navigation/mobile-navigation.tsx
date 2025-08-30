'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
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

interface NavigationItem {
  href: string
  label: string
  icon: string
  requiresAuth?: boolean
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    requiresAuth: true
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    requiresAuth: true,
    badge: 'New'
  },
  {
    href: '/summary',
    label: 'Summary',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    requiresAuth: true
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    requiresAuth: true
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    requiresAuth: true
  }
]

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const prefersReducedMotion = useReducedMotion()
  const menuRef = useRef<HTMLDivElement>(null)

  // Filter navigation items based on auth status
  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    return true
  })

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname]) // Remove onClose from dependencies to prevent infinite loop

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen]) // Remove onClose from dependencies

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector('button') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          variants={prefersReducedMotion ? fadeVariants : fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: durations.fast }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Mobile Menu */}
          <motion.div
            ref={menuRef}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl"
            variants={prefersReducedMotion ? fadeVariants : slideRightVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: durations.normal, ease: easings.easeOut }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <motion.h2
                  className="text-lg font-semibold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Navigation
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                  aria-label="Close navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* User Info */}
              {isAuthenticated && user && (
                <motion.div
                  className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-600">User Account</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Items */}
              <motion.div
                className="flex-1 overflow-y-auto py-6"
                variants={prefersReducedMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <div className="px-3 space-y-1">
                  {filteredItems.map((item, index) => {
                    const isActive = pathname === item.href

                    return (
                      <motion.div
                        key={item.href}
                        variants={prefersReducedMotion ? {} : staggerItem}
                        custom={index}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isActive
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          onClick={onClose}
                        >
                          <motion.div
                            className={`p-2 rounded-lg ${isActive
                                ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                                : 'bg-gray-100'
                              }`}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                            transition={{ duration: durations.fast }}
                          >
                            <svg
                              className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          </motion.div>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <motion.span
                              className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              {item.badge}
                            </motion.span>
                          )}
                          {isActive && (
                            <motion.div
                              className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Footer Actions */}
              <motion.div
                className="p-6 border-t border-gray-200 bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">Quick Actions</p>
                    <div className="flex space-x-2">
                      <motion.button
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                        whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                      >
                        Support
                      </motion.button>
                      <motion.button
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                      >
                        Upgrade
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block w-full px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full px-4 py-2 text-center border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}