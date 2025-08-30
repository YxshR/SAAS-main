'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { APP_CONFIG } from '@/lib/constants'
import { Breadcrumb } from '../navigation/breadcrumb'
import { 
  slideDownVariants, 
  fadeVariants, 
  hoverAnimations, 
  clickAnimations,
  durations,
  easings,
  useReducedMotion
} from '@/lib/animations'
import { 
  useKeyboardNavigation, 
  useFocusTrap, 
  useScreenReader,
  useAriaExpanded 
} from '@/hooks/use-accessibility'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const { toggleSidebar } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { announce } = useScreenReader()
  
  // Accessibility hooks
  const {
    isExpanded: isDropdownOpen,
    triggerRef: dropdownTriggerRef,
    contentRef: dropdownContentRef,
    toggle: toggleDropdown,
    collapse: closeDropdown
  } = useAriaExpanded(false)

  // Focus trap for dropdown
  const dropdownFocusTrapRef = useFocusTrap(isDropdownOpen, { autoFocus: true })

  // Keyboard navigation for dropdown
  const dropdownKeyboardRef = useKeyboardNavigation({
    onEscape: () => {
      closeDropdown()
      dropdownTriggerRef.current?.focus()
    },
    onArrowDown: () => {
      const firstItem = dropdownContentRef.current?.querySelector('a, button')
      if (firstItem instanceof HTMLElement) {
        firstItem.focus()
      }
    }
  })

  const handleLogout = () => {
    clearAuth()
    router.push('/')
    closeDropdown()
    announce('You have been signed out', 'polite')
  }

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, closeDropdown])

  // Navigation items
  const navigationItems = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : [])
  ]

  const userMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { href: '/subscription', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { href: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ]

  return (
    <motion.header 
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? durations.micro : durations.normal,
        ease: easings.easeOut 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
            whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={prefersReducedMotion ? {} : { rotate: 5 }}
                transition={{ duration: durations.fast }}
              >
                <span className="text-white font-bold text-sm">AI</span>
              </motion.div>
              <span className="text-xl font-semibold text-gray-900">
                {APP_CONFIG.APP_NAME}
              </span>
            </Link>
          </motion.div>

          {/* Center Section - Navigation and Breadcrumbs */}
          <div className="flex-1 flex items-center justify-center space-x-8">
            {/* Desktop Navigation */}
            <nav 
              className="hidden md:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md ${
                      pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        layoutId="activeNavItem"
                        transition={{ duration: durations.fast }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Breadcrumb Navigation - Show on authenticated pages */}
            {isAuthenticated && pathname !== '/' && (
              <div className="hidden lg:block">
                <Breadcrumb />
              </div>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.span 
                  className="hidden sm:block text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {user?.dailyTokens} tokens left
                </motion.span>
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    ref={dropdownTriggerRef as any}
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                    whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                    aria-label={`User menu for ${user?.email}`}
                    aria-haspopup="menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <motion.svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: durations.fast }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        ref={(el) => {
                          if (dropdownContentRef.current !== el) {
                            (dropdownContentRef as any).current = el
                          }
                          if (dropdownFocusTrapRef.current !== el) {
                            (dropdownFocusTrapRef as any).current = el
                          }
                          if (dropdownKeyboardRef.current !== el) {
                            (dropdownKeyboardRef as any).current = el
                          }
                        }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-200/50 backdrop-blur-sm"
                        variants={prefersReducedMotion ? fadeVariants : slideDownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: durations.fast }}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                      >
                        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium truncate">{user?.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user?.subscriptionStatus === 'premium' 
                                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free'} Plan
                            </span>
                          </div>
                        </div>
                        
                        {userMenuItems.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 rounded-md mx-2"
                              onClick={closeDropdown}
                              role="menuitem"
                              tabIndex={-1}
                            >
                              <svg 
                                className="w-4 h-4 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                              </svg>
                              <span>{item.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                        
                        <div className="border-t border-gray-100 mt-2">
                          <motion.button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50 rounded-md mx-2"
                            whileHover={prefersReducedMotion ? {} : { x: 2 }}
                            transition={{ duration: durations.micro }}
                            role="menuitem"
                            tabIndex={-1}
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                >
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -1 }}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                >
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
              whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
              aria-label="Toggle mobile menu"
              aria-expanded="false"
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={prefersReducedMotion ? {} : { rotate: 5 }}
                transition={{ duration: durations.fast }}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}