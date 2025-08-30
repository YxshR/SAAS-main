'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface AdminLayoutProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function AdminLayout({ children, requiredPermissions }: AdminLayoutProps) {
  return (
    <AuthGuard requiredPermissions={requiredPermissions}>
      <div className="flex h-screen bg-admin-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}