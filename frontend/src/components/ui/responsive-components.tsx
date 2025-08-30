'use client'

import React, { ReactNode } from 'react'
import { 
  useBreakpoint, 
  useDeviceType, 
  useOrientation, 
  useResponsiveValue,
  getResponsiveColumns,
  getResponsiveFontSize,
  getResponsiveSpacing
} from '@/lib/responsive-utils'
import { cn } from '@/lib/utils'

// Responsive container component
interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
}

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = 'xl',
  padding = true 
}: ResponsiveContainerProps) {
  const breakpoint = useBreakpoint()
  const spacingClass = padding ? getResponsiveSpacing(breakpoint) : ''
  
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }
  
  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      spacingClass,
      className
    )}>
      {children}
    </div>
  )
}

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  columns?: Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  gap?: string
}

export function ResponsiveGrid({ 
  children, 
  className, 
  columns,
  gap = 'gap-4'
}: ResponsiveGridProps) {
  const breakpoint = useBreakpoint()
  
  const defaultColumns = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  }
  
  const columnConfig = { ...defaultColumns, ...columns }
  const currentColumns = useResponsiveValue(columnConfig) || 1
  
  return (
    <div className={cn(
      'grid',
      `grid-cols-${currentColumns}`,
      gap,
      className
    )}>
      {children}
    </div>
  )
}

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode
  className?: string
  sizes?: Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'
}

export function ResponsiveText({ 
  children, 
  className, 
  sizes,
  as: Component = 'p'
}: ResponsiveTextProps) {
  const breakpoint = useBreakpoint()
  
  const defaultSizes = {
    base: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  }
  
  const sizeConfig = { ...defaultSizes, ...sizes }
  const currentSize = useResponsiveValue(sizeConfig) || 'text-base'
  
  return (
    <Component className={cn(currentSize, className)}>
      {children}
    </Component>
  )
}

// Device-specific rendering
interface DeviceSpecificProps {
  mobile?: ReactNode
  tablet?: ReactNode
  desktop?: ReactNode
  fallback?: ReactNode
}

export function DeviceSpecific({ mobile, tablet, desktop, fallback }: DeviceSpecificProps) {
  const { deviceType } = useDeviceType()
  
  switch (deviceType) {
    case 'mobile':
      return <>{mobile || fallback}</>
    case 'tablet':
      return <>{tablet || fallback}</>
    case 'desktop':
      return <>{desktop || fallback}</>
    default:
      return <>{fallback}</>
  }
}

// Orientation-specific rendering
interface OrientationSpecificProps {
  portrait?: ReactNode
  landscape?: ReactNode
  fallback?: ReactNode
}

export function OrientationSpecific({ portrait, landscape, fallback }: OrientationSpecificProps) {
  const { orientation } = useOrientation()
  
  if (orientation === 'portrait') {
    return <>{portrait || fallback}</>
  }
  
  if (orientation === 'landscape') {
    return <>{landscape || fallback}</>
  }
  
  return <>{fallback}</>
}

// Responsive image component
interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  className,
  ...props 
}: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      className={cn('w-full h-auto', className)}
      {...props}
    />
  )
}

// Responsive navigation component
interface ResponsiveNavProps {
  children: ReactNode
  mobileMenu?: ReactNode
  className?: string
}

export function ResponsiveNav({ children, mobileMenu, className }: ResponsiveNavProps) {
  const { isMobile } = useDeviceType()
  
  if (isMobile && mobileMenu) {
    return <nav className={className}>{mobileMenu}</nav>
  }
  
  return <nav className={className}>{children}</nav>
}

// Responsive modal/dialog
interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function ResponsiveModal({ isOpen, onClose, children, className }: ResponsiveModalProps) {
  const { isMobile } = useDeviceType()
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn(
        'relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto',
        isMobile ? 'w-full max-w-sm' : 'w-full max-w-md',
        className
      )}>
        {children}
      </div>
    </div>
  )
}

// Responsive sidebar
interface ResponsiveSidebarProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ResponsiveSidebar({ children, isOpen, onClose, className }: ResponsiveSidebarProps) {
  const { isMobile } = useDeviceType()
  
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <aside className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}>
          {children}
        </aside>
      </>
    )
  }
  
  return (
    <aside className={cn('w-64 bg-white shadow-lg', className)}>
      {children}
    </aside>
  )
}

// Responsive table wrapper
interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full">
        {children}
      </table>
    </div>
  )
}

// Responsive card grid
interface ResponsiveCardGridProps {
  children: ReactNode
  className?: string
  minCardWidth?: string
}

export function ResponsiveCardGrid({ 
  children, 
  className, 
  minCardWidth = '280px' 
}: ResponsiveCardGridProps) {
  return (
    <div 
      className={cn('grid gap-4', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`
      }}
    >
      {children}
    </div>
  )
}

// Responsive spacing component
interface ResponsiveSpacingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function ResponsiveSpacing({ size = 'md', className }: ResponsiveSpacingProps) {
  const breakpoint = useBreakpoint()
  
  const spacingMap = {
    sm: {
      base: 'h-2',
      sm: 'h-3',
      md: 'h-4',
      lg: 'h-5',
      xl: 'h-6',
      '2xl': 'h-8'
    },
    md: {
      base: 'h-4',
      sm: 'h-6',
      md: 'h-8',
      lg: 'h-10',
      xl: 'h-12',
      '2xl': 'h-16'
    },
    lg: {
      base: 'h-6',
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-16',
      xl: 'h-20',
      '2xl': 'h-24'
    },
    xl: {
      base: 'h-8',
      sm: 'h-12',
      md: 'h-16',
      lg: 'h-20',
      xl: 'h-24',
      '2xl': 'h-32'
    }
  }
  
  const currentSpacing = useResponsiveValue(spacingMap[size]) || spacingMap[size].base
  
  return <div className={cn(currentSpacing, className)} />
}