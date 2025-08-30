'use client'

import React, { forwardRef, ReactNode, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { 
  ariaAttributes, 
  useFocusVisible, 
  useKeyboardNavigation, 
  trapFocus,
  generateId,
  ScreenReaderOnly
} from '@/lib/accessibility'

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    loadingText = 'Loading...',
    disabled,
    children, 
    className, 
    ...props 
  }, ref) => {
    const { isFocusVisible, ref: focusRef } = useFocusVisible()
    
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }
    
    return (
      <button
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
          if (focusRef && typeof focusRef === 'object' && 'current' in focusRef) {
            (focusRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
          }
        }}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? `${props.id}-loading` : undefined}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          isFocusVisible && 'ring-2 ring-offset-2',
          className
        )}
        {...props}
      >
        {loading && (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <ScreenReaderOnly>
              <span id={`${props.id}-loading`}>{loadingText}</span>
            </ScreenReaderOnly>
          </>
        )}
        {children}
      </button>
    )
  }
)
AccessibleButton.displayName = 'AccessibleButton'

// Accessible form field component
interface AccessibleFieldProps {
  label: string
  children: ReactNode
  error?: string
  help?: string
  required?: boolean
  className?: string
}

export function AccessibleField({ 
  label, 
  children, 
  error, 
  help, 
  required, 
  className 
}: AccessibleFieldProps) {
  const fieldId = generateId('field')
  const errorId = error ? generateId('error') : undefined
  const helpId = help ? generateId('help') : undefined
  
  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        'aria-invalid': !!error,
        'aria-required': required,
        'aria-describedby': [errorId, helpId].filter(Boolean).join(' ') || undefined,
      })}
      
      {help && (
        <p id={helpId} className="text-sm text-gray-600">
          {help}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Accessible modal/dialog component
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AccessibleModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  size = 'md'
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = generateId('modal-title')
  const contentId = generateId('modal-content')
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current)
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      
      return () => {
        cleanup()
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={contentId}
    >
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-auto',
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close dialog"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div id={contentId} className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Accessible tabs component
interface Tab {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

interface AccessibleTabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
  onTabChange?: (tabId: string) => void
}

export function AccessibleTabs({ 
  tabs, 
  defaultTab, 
  className, 
  onTabChange 
}: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  
  const { handleKeyDown } = useKeyboardNavigation(
    tabRefs.current.filter(Boolean) as HTMLButtonElement[],
    {
      orientation: 'horizontal',
      onSelect: (index) => {
        const tab = tabs[index]
        if (tab && !tab.disabled) {
          setActiveTab(tab.id)
          onTabChange?.(tab.id)
        }
      }
    }
  )
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }
  
  return (
    <div className={className}>
      <div 
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex border-b border-gray-200"
        onKeyDown={(e) => handleKeyDown(e.nativeEvent)}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          aria-hidden={activeTab !== tab.id}
          tabIndex={0}
          className={cn(
            'mt-4 focus:outline-none',
            activeTab !== tab.id && 'hidden'
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}

// Accessible alert component
interface AccessibleAlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function AccessibleAlert({ 
  type, 
  title, 
  children, 
  dismissible, 
  onDismiss, 
  className 
}: AccessibleAlertProps) {
  const alertId = generateId('alert')
  const titleId = title ? generateId('alert-title') : undefined
  
  const typeConfig = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  }
  
  const config = typeConfig[type]
  
  return (
    <div
      id={alertId}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-labelledby={titleId}
      className={cn(
        'rounded-md p-4 border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex">
        <div className={cn('flex-shrink-0', config.iconColor)}>
          {config.icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 id={titleId} className={cn('text-sm font-medium', config.textColor)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', config.textColor, title && 'mt-2')}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                config.textColor,
                'hover:bg-black/5 focus:ring-offset-' + config.bgColor.split('-')[1] + '-50'
              )}
              aria-label="Dismiss alert"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Accessible tooltip component
interface AccessibleTooltipProps {
  content: string
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function AccessibleTooltip({ 
  content, 
  children, 
  placement = 'top', 
  className 
}: AccessibleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipId = generateId('tooltip')
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg',
            placement === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            placement === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-2',
            placement === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-2',
            placement === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-2',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}