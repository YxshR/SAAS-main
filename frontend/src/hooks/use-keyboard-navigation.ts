'use client'

import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: (event: KeyboardEvent) => void
  trapFocus?: boolean
  autoFocus?: boolean
  enabled?: boolean
}

export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
    enabled = true
  } = options

  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]
  }, [containerRef])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return

    const { key, shiftKey } = event
    const focusableElements = getFocusableElements()
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    switch (key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault()
          onEscape()
        }
        break

      case 'Enter':
        if (onEnter) {
          event.preventDefault()
          onEnter()
        }
        break

      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault()
          onArrowUp()
        }
        break

      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault()
          onArrowDown()
        }
        break

      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault()
          onArrowLeft()
        }
        break

      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault()
          onArrowRight()
        }
        break

      case 'Tab':
        if (trapFocus && focusableElements.length > 0) {
          if (shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0) {
              event.preventDefault()
              focusableElements[focusableElements.length - 1].focus()
            }
          } else {
            // Tab (forward)
            if (currentIndex >= focusableElements.length - 1) {
              event.preventDefault()
              focusableElements[0].focus()
            }
          }
        }
        
        if (onTab) {
          onTab(event)
        }
        break
    }
  }, [
    enabled,
    containerRef,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus,
    getFocusableElements
  ])

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])

  // Handle auto focus
  useEffect(() => {
    if (!enabled || !autoFocus || !containerRef.current) return

    // Store the previously active element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Restore focus when component unmounts
    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [enabled, autoFocus, containerRef, getFocusableElements])

  // Utility functions
  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }, [getFocusableElements])

  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
    }
  }, [getFocusableElements])

  const focusNext = useCallback(() => {
    const focusableElements = getFocusableElements()
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    const nextIndex = (currentIndex + 1) % focusableElements.length
    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus()
    }
  }, [getFocusableElements])

  const focusPrevious = useCallback(() => {
    const focusableElements = getFocusableElements()
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    const previousIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
    if (focusableElements[previousIndex]) {
      focusableElements[previousIndex].focus()
    }
  }, [getFocusableElements])

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements
  }
}