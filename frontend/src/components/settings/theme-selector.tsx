'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { fadeVariants, scaleVariants } from '@/lib/animations'

interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
  }
  preview: React.ReactNode
}

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (themeId: string) => void
  showLivePreview?: boolean
}

export function ThemeSelector({ 
  currentTheme, 
  onThemeChange, 
  showLivePreview = true 
}: ThemeSelectorProps) {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const themes: Theme[] = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937'
      },
      preview: (
        <div className="w-full h-16 rounded-lg bg-white border border-gray-200 p-3 space-y-2">
          <div className="h-2 bg-blue-500 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          <div className="h-2 bg-gray-200 rounded w-2/3"></div>
        </div>
      )
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes for low-light environments',
      colors: {
        primary: '#60a5fa',
        secondary: '#a78bfa',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb'
      },
      preview: (
        <div className="w-full h-16 rounded-lg bg-gray-900 border border-gray-700 p-3 space-y-2">
          <div className="h-2 bg-blue-400 rounded w-3/4"></div>
          <div className="h-2 bg-gray-600 rounded w-1/2"></div>
          <div className="h-2 bg-gray-700 rounded w-2/3"></div>
        </div>
      )
    },
    {
      id: 'system',
      name: 'System',
      description: 'Automatically match your system preference',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937'
      },
      preview: (
        <div className="w-full h-16 rounded-lg bg-gradient-to-r from-white to-gray-900 border border-gray-300 p-3 space-y-2">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-3/4"></div>
          <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-600 rounded w-1/2"></div>
          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-2/3"></div>
        </div>
      )
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum contrast for better accessibility',
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#ffffff',
        surface: '#000000',
        text: '#000000'
      },
      preview: (
        <div className="w-full h-16 rounded-lg bg-white border-2 border-black p-3 space-y-2">
          <div className="h-2 bg-black rounded w-3/4"></div>
          <div className="h-2 bg-gray-800 rounded w-1/2"></div>
          <div className="h-2 bg-gray-600 rounded w-2/3"></div>
        </div>
      )
    }
  ]

  const cardVariants = prefersReducedMotion ? fadeVariants : {
    idle: {
      scale: 1,
      y: 0,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    },
    selected: {
      scale: 1.02,
      y: -1,
      boxShadow: '0 0 0 2px #3b82f6, 0 10px 15px -3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  const checkmarkVariants = prefersReducedMotion ? fadeVariants : {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -90
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
        delay: 0.1
      }
    }
  }

  const previewVariants = prefersReducedMotion ? fadeVariants : {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId)
    setPreviewTheme(null)
  }

  const handleThemePreview = (themeId: string) => {
    if (showLivePreview) {
      setPreviewTheme(themeId)
    }
  }

  const handlePreviewEnd = () => {
    setPreviewTheme(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Theme</h3>
        <p className="text-sm text-gray-600">
          Choose how the interface looks and feels. {showLivePreview && 'Hover to preview.'}
        </p>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const isSelected = currentTheme === theme.id
          const isPreviewing = previewTheme === theme.id
          
          return (
            <motion.button
              key={theme.id}
              className={`relative p-4 rounded-lg border-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
              onMouseEnter={() => handleThemePreview(theme.id)}
              onMouseLeave={handlePreviewEnd}
              variants={cardVariants}
              animate={
                isSelected 
                  ? 'selected' 
                  : isPreviewing 
                    ? 'hover' 
                    : 'idle'
              }
              whileHover={!isSelected && !prefersReducedMotion ? 'hover' : undefined}
              whileTap={!prefersReducedMotion ? 'tap' : undefined}
            >
              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Theme preview */}
              <div className="mb-3">
                {theme.preview}
              </div>

              {/* Theme info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>

              {/* Color palette */}
              <div className="flex space-x-2 mt-3">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.background }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: theme.colors.surface }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Live Preview */}
      <AnimatePresence>
        {showLivePreview && previewTheme && (
          <motion.div
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
            variants={previewVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Previewing: {themes.find(t => t.id === previewTheme)?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Click to apply this theme
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom theme option */}
      <motion.div
        className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center"
        whileHover={!prefersReducedMotion ? { borderColor: '#6b7280', backgroundColor: '#f9fafb' } : undefined}
        transition={{ duration: 0.2 }}
      >
        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h4 className="font-medium text-gray-900 mb-1">Create Custom Theme</h4>
        <p className="text-sm text-gray-600">
          Design your own color scheme and layout preferences
        </p>
        <motion.button
          className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
          whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
          onClick={() => {
            // TODO: Implement custom theme creator
            console.log('Open custom theme creator')
          }}
        >
          Coming Soon
        </motion.button>
      </motion.div>
    </div>
  )
}