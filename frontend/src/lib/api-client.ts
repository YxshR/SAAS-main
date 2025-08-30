/**
 * API Client with Backend Detection
 * Automatically routes requests to the active backend
 */

import { backendDetector } from './backend-detector';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private defaultTimeout = 30000; // 30 seconds

  /**
   * Make an API request to the active backend
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;
    
    // Get the current backend URL
    const baseUrl = backendDetector.getApiBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Set up abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Ignore JSON parsing errors for error responses
        }

        return {
          error: errorMessage,
        };
      }

      // Parse successful response
      const data = await response.json();
      return { data };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { error: 'Request timeout' };
        }
        
        // If it's a network error, try to detect a new backend
        if (error.message.includes('fetch')) {
          console.warn('Network error detected, refreshing backend detection...');
          await backendDetector.refresh();
        }

        return { error: error.message };
      }

      return { error: 'Unknown error occurred' };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Upload file
   */
  async upload<T = any>(
    endpoint: string,
    file: File,
    options: Omit<RequestOptions, 'body'> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...options.headers,
      },
    });
  }

  /**
   * Health check for current backend
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/api/health', { timeout: 5000 });
      return !response.error;
    } catch {
      return false;
    }
  }

  /**
   * Get current backend info
   */
  getCurrentBackendInfo() {
    const backend = backendDetector.getCurrentBackend();
    return {
      name: backend?.name || 'unknown',
      baseUrl: backendDetector.getApiBaseUrl(),
      status: backendDetector.getStatus(),
    };
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// React hook for API client
export function useApiClient() {
  return {
    apiClient,
    backendInfo: apiClient.getCurrentBackendInfo(),
    healthCheck: () => apiClient.healthCheck(),
  };
}

export default apiClient;