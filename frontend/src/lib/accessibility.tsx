// Accessibility utilities and ARIA helpers

import { useEffect, useState, useRef } from 'react'

// ARIA live region utilities
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus management utilities
export const focusElement = (selector: string | HTMLElement) => {
  const element = typeof selector === 'string' 
    ? document.querySelector(selector) as HTMLElement
    : selector

  if (element) {
    element.focus()
    return true
  }
  return false
}

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)

  // Focus first element
  firstElement?.focus()

  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean
    orientation?: 'horizontal' | 'vertical'
    onSelect?: (index: number) => void
  } = {}
) => {
  const { loop = true, orientation = 'vertical', onSelect } = options
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        setCurrentIndex(prev => {
          const next = prev + 1
          if (next >= items.length) {
            return loop ? 0 : prev
          }
          return next
        })
        break

      case prevKey:
        e.preventDefault()
        setCurrentIndex(prev => {
          const next = prev - 1
          if (next < 0) {
            return loop ? items.length - 1 : prev
          }
          return next
        })
        break

      case 'Home':
        e.preventDefault()
        setCurrentIndex(0)
        break

      case 'End':
        e.preventDefault()
        setCurrentIndex(items.length - 1)
        break

      case 'Enter':
      case ' ':
        e.preventDefault()
        onSelect?.(currentIndex)
        break
    }
  }

  useEffect(() => {
    items[currentIndex]?.focus()
  }, [currentIndex, items])

  return { currentIndex, handleKeyDown }
}

import React from 'react'

// Skip link component
export const SkipLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
  >
    {children}
  </a>
)

// Screen reader only text
export const ScreenReaderOnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

// Accessible form utilities
export const generateId = (prefix: string = 'field') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const getAriaDescribedBy = (ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(Boolean)
  return validIds.length > 0 ? validIds.join(' ') : undefined
}

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

export const meetsWCAGContrast = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// Reduced motion utilities
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// High contrast mode detection
export const useHighContrast = (): boolean => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersHighContrast(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersHighContrast
}

// Focus visible utilities
export const useFocusVisible = () => {
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let hadKeyboardEvent = false

    const onKeyDown = () => {
      hadKeyboardEvent = true
    }

    const onMouseDown = () => {
      hadKeyboardEvent = false
    }

    const onFocus = () => {
      setIsFocusVisible(hadKeyboardEvent)
    }

    const onBlur = () => {
      setIsFocusVisible(false)
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('mousedown', onMouseDown, true)
    element.addEventListener('focus', onFocus)
    element.addEventListener('blur', onBlur)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('mousedown', onMouseDown, true)
      element.removeEventListener('focus', onFocus)
      element.removeEventListener('blur', onBlur)
    }
  }, [])

  return { isFocusVisible, ref }
}

// ARIA attributes helpers
export const ariaAttributes = {
  // Button attributes
  button: (props: {
    pressed?: boolean
    expanded?: boolean
    disabled?: boolean
    describedBy?: string
    labelledBy?: string
  }) => ({
    role: 'button',
    'aria-pressed': props.pressed,
    'aria-expanded': props.expanded,
    'aria-disabled': props.disabled,
    'aria-describedby': props.describedBy,
    'aria-labelledby': props.labelledBy,
  }),

  // Dialog attributes
  dialog: (props: {
    labelledBy?: string
    describedBy?: string
    modal?: boolean
  }) => ({
    role: 'dialog',
    'aria-labelledby': props.labelledBy,
    'aria-describedby': props.describedBy,
    'aria-modal': props.modal,
  }),

  // Menu attributes
  menu: (props: {
    orientation?: 'horizontal' | 'vertical'
    labelledBy?: string
  }) => ({
    role: 'menu',
    'aria-orientation': props.orientation,
    'aria-labelledby': props.labelledBy,
  }),

  menuItem: (props: {
    disabled?: boolean
    selected?: boolean
  }) => ({
    role: 'menuitem',
    'aria-disabled': props.disabled,
    'aria-selected': props.selected,
  }),

  // Tab attributes
  tabList: (props: {
    labelledBy?: string
    orientation?: 'horizontal' | 'vertical'
  }) => ({
    role: 'tablist',
    'aria-labelledby': props.labelledBy,
    'aria-orientation': props.orientation,
  }),

  tab: (props: {
    selected?: boolean
    controls?: string
    disabled?: boolean
  }) => ({
    role: 'tab',
    'aria-selected': props.selected,
    'aria-controls': props.controls,
    'aria-disabled': props.disabled,
    tabIndex: props.selected ? 0 : -1,
  }),

  tabPanel: (props: {
    labelledBy?: string
    hidden?: boolean
  }) => ({
    role: 'tabpanel',
    'aria-labelledby': props.labelledBy,
    'aria-hidden': props.hidden,
    tabIndex: 0,
  }),

  // Form attributes
  textbox: (props: {
    invalid?: boolean
    required?: boolean
    describedBy?: string
    labelledBy?: string
    placeholder?: string
  }) => ({
    'aria-invalid': props.invalid,
    'aria-required': props.required,
    'aria-describedby': props.describedBy,
    'aria-labelledby': props.labelledBy,
    'aria-placeholder': props.placeholder,
  }),

  // Status and alert attributes
  status: (props: {
    live?: 'polite' | 'assertive'
    atomic?: boolean
  }) => ({
    role: 'status',
    'aria-live': props.live || 'polite',
    'aria-atomic': props.atomic,
  }),

  alert: (props: {
    live?: 'polite' | 'assertive'
    atomic?: boolean
  }) => ({
    role: 'alert',
    'aria-live': props.live || 'assertive',
    'aria-atomic': props.atomic,
  }),
}

// Accessibility testing utilities
export const accessibilityTests = {
  // Check if element has accessible name
  hasAccessibleName: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      (element as HTMLInputElement).placeholder
    )
  },

  // Check if interactive element is keyboard accessible
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute('tabindex')
    return (
      element.tagName === 'BUTTON' ||
      element.tagName === 'A' ||
      element.tagName === 'INPUT' ||
      element.tagName === 'SELECT' ||
      element.tagName === 'TEXTAREA' ||
      (tabIndex !== null && tabIndex !== '-1')
    )
  },

  // Check if form field has proper labeling
  hasProperLabeling: (element: HTMLInputElement): boolean => {
    const id = element.id
    const hasLabel = id && document.querySelector(`label[for="${id}"]`)
    const hasAriaLabel = element.getAttribute('aria-label')
    const hasAriaLabelledBy = element.getAttribute('aria-labelledby')

    return !!(hasLabel || hasAriaLabel || hasAriaLabelledBy)
  },
}

// Accessibility announcement hook
export const useAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }

  return { announce }
}