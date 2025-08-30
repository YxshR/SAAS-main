'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/providers/theme-provider'
import { useState, useEffect } from 'react'
import { initializeAccessibility } from '../lib/accessibility'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 401/403 errors
              if (error?.status === 401 || error?.status === 403) {
                return false
              }
              return failureCount < 3
            },
          },
        },
      })
  )

  useEffect(() => {
    // Initialize accessibility features for admin panel
    initializeAccessibility({
      enableHighContrast: true,
      enableFocusManagement: true,
      enableKeyboardNavigation: true,
      skipLinks: true
    })
  }, [])

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}