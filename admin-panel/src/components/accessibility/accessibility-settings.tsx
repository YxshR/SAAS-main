/**
 * Accessibility Settings Component
 * Provides user controls for accessibility features
 */

'use client'

import React from 'react'
import { useHighContrast, useScreenReader } from '../../hooks/use-accessibility'

export function AccessibilitySettings() {
  const {
    isEnabled,
    currentTheme,
    availableThemes,
    enableHighContrast,
    disableHighContrast,
    toggleHighContrast
  } = useHighContrast()
  
  const { announce } = useScreenReader()

  const handleThemeChange = (theme: string) => {
    if (theme === '') {
      disableHighContrast()
      announce('High contrast mode disabled')
    } else {
      enableHighContrast(theme)
      announce(`High contrast mode enabled with ${theme} theme`)
    }
  }

  const handleReducedMotionToggle = () => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const newValue = !prefersReducedMotion
    
    // Add or remove reduced motion class
    if (newValue) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
      announce('Reduced motion enabled')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
      announce('Reduced motion disabled')
    }
  }

  const handleFontSizeIncrease = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const newSize = Math.min(currentSize * 1.1, 24) // Max 24px
    document.documentElement.style.fontSize = `${newSize}px`
    announce(`Font size increased to ${Math.round(newSize)}px`)
  }

  const handleFontSizeDecrease = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const newSize = Math.max(currentSize * 0.9, 12) // Min 12px
    document.documentElement.style.fontSize = `${newSize}px`
    announce(`Font size decreased to ${Math.round(newSize)}px`)
  }

  const handleFontSizeReset = () => {
    document.documentElement.style.fontSize = '16px'
    announce('Font size reset to default')
  }

  return (
    <div className="bg-admin-surface rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6 text-admin-text-primary">Accessibility Settings</h2>
      
      {/* High Contrast Mode */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-admin-text-primary">High Contrast Mode</h3>
        <p className="text-sm text-admin-text-secondary mb-4">
          Improve visibility with high contrast colors
        </p>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="contrast-theme"
              value=""
              checked={!isEnabled}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="mr-3"
            />
            <span className="text-admin-text-primary">Off</span>
          </label>
          
          {availableThemes.map((theme) => (
            <label key={theme} className="flex items-center">
              <input
                type="radio"
                name="contrast-theme"
                value={theme}
                checked={isEnabled && currentTheme === theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="mr-3"
              />
              <span className="capitalize text-admin-text-primary">{theme} Theme</span>
            </label>
          ))}
        </div>
      </div>

      {/* Font Size Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-admin-text-primary">Font Size</h3>
        <p className="text-sm text-admin-text-secondary mb-4">
          Adjust text size for better readability
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleFontSizeDecrease}
            aria-label="Decrease font size"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-admin-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          >
            A-
          </button>
          <button
            onClick={handleFontSizeReset}
            aria-label="Reset font size to default"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-admin-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          >
            Reset
          </button>
          <button
            onClick={handleFontSizeIncrease}
            aria-label="Increase font size"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-admin-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
          >
            A+
          </button>
        </div>
      </div>

      {/* Motion Preferences */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-admin-text-primary">Motion</h3>
        <p className="text-sm text-admin-text-secondary mb-4">
          Reduce animations and transitions
        </p>
        
        <button
          onClick={handleReducedMotionToggle}
          aria-label="Toggle reduced motion"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-admin-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
        >
          Toggle Reduced Motion
        </button>
      </div>

      {/* Keyboard Navigation Info */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-admin-text-primary">Keyboard Navigation</h3>
        <div className="text-sm text-admin-text-secondary space-y-2">
          <p><kbd className="px-2 py-1 bg-gray-100 rounded text-admin-text-primary">Tab</kbd> - Navigate forward</p>
          <p><kbd className="px-2 py-1 bg-gray-100 rounded text-admin-text-primary">Shift + Tab</kbd> - Navigate backward</p>
          <p><kbd className="px-2 py-1 bg-gray-100 rounded text-admin-text-primary">Enter</kbd> - Activate buttons and links</p>
          <p><kbd className="px-2 py-1 bg-gray-100 rounded text-admin-text-primary">Escape</kbd> - Close modals and menus</p>
          <p><kbd className="px-2 py-1 bg-gray-100 rounded text-admin-text-primary">Arrow Keys</kbd> - Navigate within components</p>
        </div>
      </div>

      {/* Screen Reader Info */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-admin-text-primary">Screen Reader Support</h3>
        <p className="text-sm text-admin-text-secondary">
          This application includes comprehensive screen reader support with ARIA labels, 
          live regions for dynamic content, and semantic markup throughout.
        </p>
      </div>
    </div>
  )
}