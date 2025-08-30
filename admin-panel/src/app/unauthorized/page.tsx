import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background">
      <div className="max-w-md w-full text-center">
        <div className="admin-card p-8">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-admin-warning mb-4" />
          <h1 className="text-2xl font-bold text-admin-text-primary mb-2">
            Access Denied
          </h1>
          <p className="text-admin-text-secondary mb-6">
            You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard" className="block admin-button-primary">
              Go to Dashboard
            </Link>
            <Link href="/login" className="block admin-button-secondary">
              Sign In Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}