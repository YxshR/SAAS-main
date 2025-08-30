import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: ReactNode
  className?: string
}

export function StatsCard({ title, value, change, icon, className = '' }: StatsCardProps) {
  const changeColorClass = change ? {
    increase: 'text-admin-success',
    decrease: 'text-admin-error',
    neutral: 'text-admin-text-secondary'
  }[change.type] : ''

  return (
    <div className={`admin-card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-admin-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-admin-text-primary mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColorClass}`}>
              {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-admin-text-muted">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}