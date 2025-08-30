import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export function ChartCard({ title, description, children, className = '', actions }: ChartCardProps) {
  return (
    <div className={`admin-card p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-admin-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-admin-text-secondary mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}