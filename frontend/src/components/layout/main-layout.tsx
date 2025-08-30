'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useLayout } from '@/lib/hooks/use-layout'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { Navigation } from './navigation'
import { ContextualNavigation } from '../navigation/contextual-navigation'
import { ErrorBoundary } from '../ui/error-boundary'
import { initializeAccessibility } from '@/lib/accessibility/init'

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  showFooter = true, 
  showSidebar = true 
}: MainLayoutProps) {
  const { isAuthenticated } = useAuthStore()
  const { isMobile, sidebarCollapsed } = useLayout()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Initialize accessibility features
    initializeAccessibility({
      enableHighContrast: true,
      enableFocusManagement: true,
      enableKeyboardNavigation: true,
      skipLinks: true
    })
  }, [])

  const shouldShowSidebar = showSidebar && isAuthenticated && mounted
  const sidebarWidth = shouldShowSidebar ? (sidebarCollapsed ? 80 : 280) : 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navigation />
      
      <div className="flex flex-1 pt-16">
        {shouldShowSidebar && !isMobile && <Sidebar />}
        
        <main 
          id="main-content"
          role="main"
          tabIndex={-1}
          className={`flex-1 transition-all duration-300 ${
            shouldShowSidebar && !isMobile ? `ml-[${sidebarWidth}px]` : ''
          }`}
          style={{
            marginLeft: shouldShowSidebar && !isMobile ? `${sidebarWidth}px` : '0'
          }}
        >
          <ErrorBoundary>
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </ErrorBoundary>
        </main>
      </div>
      
      {showFooter && (
        <div 
          className={`transition-all duration-300 ${
            shouldShowSidebar && !isMobile ? `ml-[${sidebarWidth}px]` : ''
          }`}
          style={{
            marginLeft: shouldShowSidebar && !isMobile ? `${sidebarWidth}px` : '0'
          }}
        >
          <Footer />
        </div>
      )}
      
      {/* Contextual Navigation */}
      {isAuthenticated && <ContextualNavigation />}
    </div>
  )
}