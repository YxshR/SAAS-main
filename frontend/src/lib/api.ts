import { API_CONFIG } from './constants'
import type { ApiResponse } from './types'

class ApiClient {
  private baseUrl: string
  private activeBackend: 'nodejs' | 'rust' = 'nodejs'

  constructor() {
    this.baseUrl = API_CONFIG.NODEJS_BASE_URL
    this.detectActiveBackend()
  }

  private async detectActiveBackend() {
    try {
      // Try Node.js backend first
      const nodeResponse = await fetch(`${API_CONFIG.NODEJS_BASE_URL}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      
      if (nodeResponse.ok) {
        this.activeBackend = 'nodejs'
        this.baseUrl = API_CONFIG.NODEJS_BASE_URL
        return
      }
    } catch {
      console.log('Node.js backend not available, trying Rust backend...')
    }

    try {
      // Try Rust backend
      const rustResponse = await fetch(`${API_CONFIG.RUST_BASE_URL}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      
      if (rustResponse.ok) {
        this.activeBackend = 'rust'
        this.baseUrl = API_CONFIG.RUST_BASE_URL
        return
      }
    } catch {
      console.error('Both backends are unavailable')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        return parsed.state?.accessToken || null
      }
    } catch (error) {
      console.error('Failed to get auth token:', error)
    }
    
    return null
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Getters
  getActiveBackend() {
    return this.activeBackend
  }

  getBaseUrl() {
    return this.baseUrl
  }
}

export const apiClient = new ApiClient()