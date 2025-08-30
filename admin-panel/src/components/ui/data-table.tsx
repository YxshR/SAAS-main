import { ReactNode } from 'react'

interface Column {
  key: string
  header: string
  render?: (value: any, row: any) => ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: any) => void
  className?: string
}

export function DataTable({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No data available',
  onRowClick,
  className = ''
}: DataTableProps) {
  if (loading) {
    return (
      <div className={`admin-card ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"></div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={`admin-card ${className}`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-admin-text-secondary">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`admin-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                  className={column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <svg className="h-4 w-4 text-admin-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={index}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}