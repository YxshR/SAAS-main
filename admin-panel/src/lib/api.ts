'use client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get auth token from localStorage
    const token = localStorage.getItem('admin_access_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle token expiration
          localStorage.removeItem('admin_access_token')
          localStorage.removeItem('admin_refresh_token')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Authentication required')
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request('/api/admin/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async logout() {
    return this.request('/api/admin/auth/logout', {
      method: 'POST',
    })
  }

  // User management endpoints
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/api/admin/users${query ? `?${query}` : ''}`)
  }

  async getUser(userId: string) {
    return this.request(`/api/admin/users/${userId}`)
  }

  async updateUser(userId: string, data: any) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(userId: string) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Analytics endpoints
  async getDashboardStats() {
    return this.request('/api/admin/analytics/dashboard')
  }

  async getAnalytics(params?: { startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    
    const query = searchParams.toString()
    return this.request(`/api/admin/analytics${query ? `?${query}` : ''}`)
  }

  // System endpoints
  async getSystemHealth() {
    return this.request('/api/admin/system/health')
  }

  async getSystemSettings() {
    return this.request('/api/admin/system/settings')
  }

  async updateSystemSettings(settings: any) {
    return this.request('/api/admin/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)