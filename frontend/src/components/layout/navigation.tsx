'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { MobileNavigation } from '../navigation/mobile-navigation'
import { HamburgerButton } from '../navigation/hamburger-button'
import { 
  hoverAnimations,
  clickAnimations,
  durations,
  useReducedMotion
} from '@/lib/animations'

interface NavigationItem {
  href: string
  label: string
  icon: string
  requiresAuth?: boolean
  adminOnly?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    href: '/features',
    label: 'Features',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    requiresAuth: true
  },
  {
    href: '/data-visualizations',
    label: 'Charts',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    requiresAuth: false
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    requiresAuth: true
  },
  {
    href: '/summary',
    label: 'Summary',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    requiresAuth: true
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

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the onClose function to prevent infinite loops
  const handleMobileNavClose = useCallback(() => {
    setSidebarOpen(false)
  }, [setSidebarOpen])

  // Filter navigation items based on auth status
  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    return true
  })

  if (!mounted) return null

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={sidebarOpen} 
        onClose={handleMobileNavClose} 
      />

      {/* Hamburger Button */}
      <HamburgerButton
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden"
      />

      {/* Desktop Navigation (if needed as separate component) */}
      <nav className="hidden md:flex items-center space-x-6">
        {filteredItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href
          
          return (
            <motion.div
              key={item.href}
              whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
              whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
            >
              <Link
                href={item.href}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    layoutId="activeDesktopNavItem"
                    style={{ x: '-50%' }}
                    transition={{ duration: durations.fast }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </>
  )
}