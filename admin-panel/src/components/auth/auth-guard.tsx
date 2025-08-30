'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function AuthGuard({ children, requiredPermissions = [] }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Check permissions if required
    if (requiredPermissions.length > 0 && user) {
      const hasPermission = requiredPermissions.every(permission =>
        user.permissions.some(p => p.name === permission)
      )
      
      if (!hasPermission) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router, requiredPermissions])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-accent mx-auto"></div>
          <p className="mt-4 text-admin-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}