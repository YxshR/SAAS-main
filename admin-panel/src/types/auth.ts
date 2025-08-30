export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  permissions: AdminPermission[]
  lastLogin?: Date
  createdAt: Date
}

export interface AdminPermission {
  id: string
  name: string
  resource: string
  action: 'read' | 'write' | 'delete' | 'manage'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  user: AdminUser
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}