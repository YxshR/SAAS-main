/**
 * Backend Detection and Connection Management for Admin Panel
 * Automatically detects which backend is running and connects to it
 */

import React from 'react';

interface BackendConfig {
  name: string;
  baseUrl: string;
  port: number;
  healthEndpoint: string;
}

interface BackendStatus {
  backend: string | null;
  port: number | null;
  status: 'running' | 'stopped' | 'unhealthy';
  lastChecked: Date;
}

class BackendDetector {
  private backends: BackendConfig[] = [
    {
      name: 'nodejs',
      baseUrl: process.env.NEXT_PUBLIC_NODEJS_API_URL || 'http://localhost:8000',
      port: 8000,
      healthEndpoint: '/api/health'
    },
    {
      name: 'rust',
      baseUrl: process.env.NEXT_PUBLIC_RUST_API_URL || 'http://localhost:8001',
      port: 8001,
      healthEndpoint: '/api/health'
    }
  ];

  private currentBackend: BackendConfig | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private listeners: ((status: BackendStatus) => void)[] = [];

  constructor() {
    this.detectActiveBackend();
    this.startHealthChecking();
  }

  /**
   * Add a listener for backend status changes
   */
  onStatusChange(callback: (status: BackendStatus) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(status: BackendStatus) {
    this.listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in backend status listener:', error);
      }
    });
  }

  /**
   * Check if a backend is healthy
   */
  private async checkBackendHealth(backend: BackendConfig): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${backend.baseUrl}${backend.healthEndpoint}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect which backend is currently active
   */
  async detectActiveBackend(): Promise<BackendConfig | null> {
    const preferredBackend = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'nodejs';
    
    // First try the preferred backend
    const preferred = this.backends.find(b => b.name === preferredBackend);
    if (preferred && await this.checkBackendHealth(preferred)) {
      this.currentBackend = preferred;
      this.notifyListeners({
        backend: preferred.name,
        port: preferred.port,
        status: 'running',
        lastChecked: new Date()
      });
      return preferred;
    }

    // Try other backends
    for (const backend of this.backends) {
      if (backend.name !== preferredBackend) {
        if (await this.checkBackendHealth(backend)) {
          this.currentBackend = backend;
          this.notifyListeners({
            backend: backend.name,
            port: backend.port,
            status: 'running',
            lastChecked: new Date()
          });
          return backend;
        }
      }
    }

    // No backend is running
    this.currentBackend = null;
    this.notifyListeners({
      backend: null,
      port: null,
      status: 'stopped',
      lastChecked: new Date()
    });
    return null;
  }

  /**
   * Get the current active backend
   */
  getCurrentBackend(): BackendConfig | null {
    return this.currentBackend;
  }

  /**
   * Get the base URL for API calls
   */
  getApiBaseUrl(): string {
    if (this.currentBackend) {
      return this.currentBackend.baseUrl;
    }
    
    // Fallback to preferred backend URL
    const preferredBackend = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'nodejs';
    const fallback = this.backends.find(b => b.name === preferredBackend);
    return fallback?.baseUrl || 'http://localhost:8000';
  }

  /**
   * Start periodic health checking
   */
  private startHealthChecking() {
    // Check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      if (this.currentBackend) {
        const isHealthy = await this.checkBackendHealth(this.currentBackend);
        if (!isHealthy) {
          console.warn(`Backend ${this.currentBackend.name} became unhealthy, detecting new backend...`);
          await this.detectActiveBackend();
        }
      } else {
        // Try to detect a backend if none is currently active
        await this.detectActiveBackend();
      }
    }, 30000);
  }

  /**
   * Stop health checking
   */
  stopHealthChecking() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Force refresh backend detection
   */
  async refresh(): Promise<BackendConfig | null> {
    return await this.detectActiveBackend();
  }

  /**
   * Get current backend status
   */
  getStatus(): BackendStatus {
    return {
      backend: this.currentBackend?.name || null,
      port: this.currentBackend?.port || null,
      status: this.currentBackend ? 'running' : 'stopped',
      lastChecked: new Date()
    };
  }
}

// Singleton instance
export const backendDetector = new BackendDetector();

// React hook for using backend detector
export function useBackendDetector() {
  const [status, setStatus] = React.useState<BackendStatus>(backendDetector.getStatus());

  React.useEffect(() => {
    const unsubscribe = backendDetector.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  return {
    status,
    currentBackend: backendDetector.getCurrentBackend(),
    apiBaseUrl: backendDetector.getApiBaseUrl(),
    refresh: () => backendDetector.refresh(),
  };
}

export default backendDetector;