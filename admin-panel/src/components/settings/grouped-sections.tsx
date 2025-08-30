'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Section {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultExpanded?: boolean
}

interface GroupedSectionsProps {
  sections: Section[]
  allowMultipleExpanded?: boolean
}

export function GroupedSections({ sections, allowMultipleExpanded = true }: GroupedSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultExpanded).map(s => s.id))
  )

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId)
      } else {
        if (!allowMultipleExpanded) {
          newExpanded.clear()
        }
        newExpanded.add(sectionId)
      }
      
      return newExpanded
    })
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const isExpanded = expandedSections.has(section.id)
        const Icon = section.icon

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Section Header */}
            <motion.button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-admin-accent focus:ring-inset"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="flex items-center space-x-3">
                {Icon && (
                  <div className="p-2 bg-admin-accent/10 rounded-lg">
                    <Icon className="h-5 w-5 text-admin-accent" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-admin-text-primary">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-admin-text-secondary mt-1">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronRightIcon className="h-5 w-5 text-admin-text-secondary" />
              </motion.div>
            </motion.button>

            {/* Section Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2, delay: 0.1 }
                  }}
                  className="border-t border-gray-200"
                >
                  <div className="px-6 py-6">
                    {section.children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

// Utility component for creating consistent section layouts
export function SectionContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  )
}

// Utility component for form fields within sections
export function SectionField({ 
  label, 
  description, 
  children, 
  required = false 
}: { 
  label: string
  description?: string
  children: React.ReactNode
  required?: boolean 
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-admin-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-admin-text-secondary">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}