/**
 * Accessibility Provider Component
 * Initializes and manages accessibility features across the application
 */

'use client'

import React, { useEffect, useRef } from 'react'
import { initializeAccessibility } from '../../lib/accessibility'

interface AccessibilityProviderProps {
  children: React.ReactNode
  options?: {
    enableHighContrast?: boolean
    enableFocusManagement?: boolean
    enableKeyboardNavigation?: boolean
    skipLinks?: boolean
    enableLiveRegions?: boolean
    enableAriaEnhancements?: boolean
  }
}

export function AccessibilityProvider({ 
  children, 
  options = {} 
}: AccessibilityProviderProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      // Initialize accessibility features
      initializeAccessibility({
        enableHighContrast: true,
        enableFocusManagement: true,
        enableKeyboardNavigation: true,
        skipLinks: true,
        enableLiveRegions: true,
        enableAriaEnhancements: true,
        ...options
      })

      initialized.current = true

      // Add page load announcement
      const announcePageLoad = () => {
        const title = document.title
        const liveRegion = document.getElementById('aria-live-polite')
        if (liveRegion) {
          setTimeout(() => {
            liveRegion.textContent = `Page loaded: ${title}`
          }, 1000)
        }
      }

      // Announce page load after a short delay
      setTimeout(announcePageLoad, 500)
    }

    // Cleanup function
    return () => {
      const observer = (window as any).__a11yObserver
      if (observer) {
        observer.disconnect()
        delete (window as any).__a11yObserver
      }
    }
  }, [options])

  // Add global keyboard event handlers
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Alt + 1: Skip to main content
      if (event.altKey && event.key === '1') {
        event.preventDefault()
        const mainContent = document.querySelector('main, [role="main"], #main-content')
        if (mainContent instanceof HTMLElement) {
          mainContent.focus()
          mainContent.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Alt + 2: Skip to navigation
      if (event.altKey && event.key === '2') {
        event.preventDefault()
        const navigation = document.querySelector('nav, [role="navigation"]')
        if (navigation instanceof HTMLElement) {
          const firstLink = navigation.querySelector('a, button')
          if (firstLink instanceof HTMLElement) {
            firstLink.focus()
          }
        }
      }

      // Alt + 3: Skip to search
      if (event.altKey && event.key === '3') {
        event.preventDefault()
        const search = document.querySelector('[role="search"], input[type="search"]')
        if (search instanceof HTMLElement) {
          search.focus()
        }
      }

      // Ctrl + / or Cmd + /: Show keyboard shortcuts
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        showKeyboardShortcuts()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  return <>{children}</>
}

/**
 * Show keyboard shortcuts modal
 */
function showKeyboardShortcuts() {
  const existingModal = document.getElementById('keyboard-shortcuts-modal')
  if (existingModal) {
    existingModal.remove()
  }

  const modal = document.createElement('div')
  modal.id = 'keyboard-shortcuts-modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'shortcuts-title')
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'

  const content = document.createElement('div')
  content.className = 'bg-admin-surface rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto border border-gray-200'

  const title = document.createElement('h2')
  title.id = 'shortcuts-title'
  title.textContent = 'Keyboard Shortcuts'
  title.className = 'text-xl font-semibold mb-4 text-admin-text-primary'

  const shortcuts = [
    { key: 'Tab', description: 'Navigate forward through interactive elements' },
    { key: 'Shift + Tab', description: 'Navigate backward through interactive elements' },
    { key: 'Enter', description: 'Activate buttons and links' },
    { key: 'Space', description: 'Activate buttons and checkboxes' },
    { key: 'Escape', description: 'Close modals and menus' },
    { key: 'Arrow Keys', description: 'Navigate within components' },
    { key: 'Alt + 1', description: 'Skip to main content' },
    { key: 'Alt + 2', description: 'Skip to navigation' },
    { key: 'Alt + 3', description: 'Skip to search' },
    { key: 'Ctrl/Cmd + /', description: 'Show this help dialog' }
  ]

  const list = document.createElement('ul')
  list.className = 'space-y-2 mb-4'

  shortcuts.forEach(shortcut => {
    const item = document.createElement('li')
    item.className = 'flex justify-between items-center'
    
    const keyElement = document.createElement('kbd')
    keyElement.textContent = shortcut.key
    keyElement.className = 'px-2 py-1 bg-gray-100 rounded text-sm font-mono text-admin-text-primary'
    
    const description = document.createElement('span')
    description.textContent = shortcut.description
    description.className = 'text-sm text-admin-text-secondary ml-4 flex-1'
    
    item.appendChild(keyElement)
    item.appendChild(description)
    list.appendChild(item)
  })

  const closeButton = document.createElement('button')
  closeButton.textContent = 'Close'
  closeButton.className = 'w-full bg-admin-primary text-white py-2 px-4 rounded hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary'
  closeButton.addEventListener('click', () => modal.remove())

  content.appendChild(title)
  content.appendChild(list)
  content.appendChild(closeButton)
  modal.appendChild(content)

  document.body.appendChild(modal)

  // Focus the close button
  closeButton.focus()

  // Close on escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      modal.remove()
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)

  // Close on backdrop click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove()
    }
  })
}