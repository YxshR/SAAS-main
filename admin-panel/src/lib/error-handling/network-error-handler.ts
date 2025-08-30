// import { toast } from 'sonner'; // TODO: Install sonner package

export interface NetworkError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
  retryCount?: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: NetworkError) => boolean;
}

export interface NetworkErrorHandlerConfig {
  showToast: boolean;
  logErrors: boolean;
  reportErrors: boolean;
  retryConfig?: RetryConfig;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry on network errors and 5xx server errors
    return !error.status || error.status >= 500;
  },
};

const DEFAULT_CONFIG: NetworkErrorHandlerConfig = {
  showToast: true,
  logErrors: true,
  reportErrors: true,
  retryConfig: DEFAULT_RETRY_CONFIG,
};

export class NetworkErrorHandler {
  private config: NetworkErrorHandlerConfig;

  constructor(config: Partial<NetworkErrorHandlerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async handleRequest<T>(
    requestFn: () => Promise<T>,
    options: Partial<NetworkErrorHandlerConfig> = {}
  ): Promise<T> {
    const config = { ...this.config, ...options };
    const retryConfig = config.retryConfig || DEFAULT_RETRY_CONFIG;

    let lastError: NetworkError = new Error('Unknown error') as NetworkError;
    let retryCount = 0;

    while (retryCount <= retryConfig.maxRetries) {
      try {
        const result = await requestFn();
        
        // If we had previous failures but this succeeded, show success message
        if (retryCount > 0 && config.showToast) {
          console.log('Connection restored: Your request was completed successfully.');
        }
        
        return result;
      } catch (error) {
        lastError = this.normalizeError(error);
        lastError.retryCount = retryCount;

        if (config.logErrors) {
          console.error(`Network request failed (attempt ${retryCount + 1}):`, lastError);
        }

        // Check if we should retry
        if (
          retryCount < retryConfig.maxRetries &&
          retryConfig.retryCondition?.(lastError)
        ) {
          const delay = this.calculateDelay(retryCount, retryConfig);
          
          if (config.showToast && retryCount === 0) {
            console.log(`Connection issue detected. Retrying... Attempt ${retryCount + 2} of ${retryConfig.maxRetries + 1}`);
          } else if (config.showToast) {
            console.log(`Retrying connection... Attempt ${retryCount + 2} of ${retryConfig.maxRetries + 1}`);
          }

          await this.delay(delay);
          retryCount++;
          continue;
        }

        // All retries exhausted or error not retryable
        break;
      }
    }

    // Handle final error
    this.handleFinalError(lastError, config);
    throw lastError;
  }

  private normalizeError(error: any): NetworkError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error (offline, DNS failure, etc.)
      const networkError = new Error('Network connection failed') as NetworkError;
      networkError.name = 'NetworkError';
      return networkError;
    }

    if (error.response) {
      // HTTP error response
      const httpError = new Error(
        error.response.statusText || `HTTP ${error.response.status}`
      ) as NetworkError;
      httpError.name = 'HTTPError';
      httpError.status = error.response.status;
      httpError.statusText = error.response.statusText;
      httpError.url = error.response.url;
      return httpError;
    }

    if (error instanceof Error) {
      return error as NetworkError;
    }

    // Unknown error type
    const unknownError = new Error('Unknown network error') as NetworkError;
    unknownError.name = 'UnknownError';
    return unknownError;
  }

  private calculateDelay(retryCount: number, config: RetryConfig): number {
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffFactor, retryCount);
    const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5); // Add jitter
    return Math.min(jitteredDelay, config.maxDelay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleFinalError(error: NetworkError, config: NetworkErrorHandlerConfig) {
    if (config.showToast) {
      // toast.dismiss('network-retry'); // TODO: Implement toast system
      
      const errorMessage = this.getErrorMessage(error);
      const errorDescription = this.getErrorDescription(error);

      console.error(`${errorMessage}: ${errorDescription}`);
    }

    if (config.reportErrors) {
      this.reportError(error);
    }
  }

  private getErrorMessage(error: NetworkError): string {
    if (!error.status) {
      return 'Connection failed';
    }

    switch (Math.floor(error.status / 100)) {
      case 4:
        if (error.status === 401) return 'Authentication required';
        if (error.status === 403) return 'Access denied';
        if (error.status === 404) return 'Resource not found';
        if (error.status === 429) return 'Too many requests';
        return 'Request failed';
      case 5:
        return 'Server error';
      default:
        return 'Network error';
    }
  }

  private getErrorDescription(error: NetworkError): string {
    if (!error.status) {
      return 'Please check your internet connection and try again.';
    }

    switch (Math.floor(error.status / 100)) {
      case 4:
        if (error.status === 401) return 'Please log in to continue.';
        if (error.status === 403) return 'You don\'t have permission to access this resource.';
        if (error.status === 404) return 'The requested resource could not be found.';
        if (error.status === 429) return 'Please wait a moment before trying again.';
        return 'There was a problem with your request.';
      case 5:
        return 'Our servers are experiencing issues. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  private reportError(error: NetworkError) {
    // Report to error tracking service
    console.error('Reporting network error:', {
      message: error.message,
      status: error.status,
      url: error.url,
      retryCount: error.retryCount,
      timestamp: new Date().toISOString(),
    });

    // In a real application, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: { retryCount: error.retryCount } });
  }
}

// Global instance
export const networkErrorHandler = new NetworkErrorHandler();

// Utility functions for common use cases
export const withNetworkErrorHandling = <T>(
  requestFn: () => Promise<T>,
  options?: Partial<NetworkErrorHandlerConfig>
): Promise<T> => {
  return networkErrorHandler.handleRequest(requestFn, options);
};

export const createNetworkErrorHandler = (
  config: Partial<NetworkErrorHandlerConfig>
) => {
  return new NetworkErrorHandler(config);
};

// React hook for network error handling
export const useNetworkErrorHandler = (
  config?: Partial<NetworkErrorHandlerConfig>
) => {
  const handler = new NetworkErrorHandler(config);
  
  return {
    handleRequest: <T>(requestFn: () => Promise<T>) => 
      handler.handleRequest(requestFn),
    
    handleError: (error: any) => {
      const normalizedError = handler['normalizeError'](error);
      handler['handleFinalError'](normalizedError, handler['config']);
    },
  };
};