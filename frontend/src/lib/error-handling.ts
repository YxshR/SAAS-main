// Error types and utilities for comprehensive error handling

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
  requestId?: string
  statusCode?: number
}

export class CustomError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: any
  public readonly timestamp: string
  public readonly requestId?: string

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details?: any,
    requestId?: string
  ) {
    super(message)
    this.name = 'CustomError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
    this.requestId = requestId
  }
}

// Specific error classes
export class NetworkError extends CustomError {
  constructor(message: string = 'Network connection failed', details?: any) {
    super(message, 'NETWORK_ERROR', 0, details)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404)
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT', 429)
  }
}

export class ServerError extends CustomError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 'SERVER_ERROR', 500, details)
  }
}

// Error classification utility
export function classifyError(error: unknown): CustomError {
  if (error instanceof CustomError) {
    return error
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message)
    }

    // Validation errors
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return new ValidationError(error.message)
    }

    return new CustomError(error.message, 'UNKNOWN_ERROR', 500)
  }

  if (typeof error === 'string') {
    return new CustomError(error, 'STRING_ERROR', 500)
  }

  return new CustomError('An unknown error occurred', 'UNKNOWN_ERROR', 500, error)
}

// User-friendly error messages
export function getUserFriendlyMessage(error: CustomError): string {
  const messages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Please log in to continue.',
    AUTHORIZATION_ERROR: 'You don\'t have permission to perform this action.',
    NOT_FOUND: 'The requested resource could not be found.',
    RATE_LIMIT: 'You\'re making requests too quickly. Please wait a moment and try again.',
    SERVER_ERROR: 'We\'re experiencing technical difficulties. Please try again later.',
    UNKNOWN_ERROR: 'Something unexpected happened. Please try again.'
  }

  return messages[error.code] || error.message || messages.UNKNOWN_ERROR
}

// Error reporting utility
export function reportError(error: CustomError, context?: Record<string, any>) {
  const errorReport = {
    ...error,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    timestamp: new Date().toISOString()
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Report:', errorReport)
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // Placeholder for error tracking service integration
    // Example: Sentry, LogRocket, Bugsnag, etc.
    try {
      // window.errorTracker?.captureException(error, { extra: errorReport })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }
}

// Retry utility for failed operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxAttempts) {
        break
      }

      // Don't retry certain error types
      if (error instanceof ValidationError || 
          error instanceof AuthenticationError || 
          error instanceof AuthorizationError ||
          error instanceof NotFoundError) {
        break
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(backoffMultiplier, attempt - 1))
      )
    }
  }

  throw lastError!
}

// Circuit breaker pattern for external services
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new ServerError('Service temporarily unavailable')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    }
  }
}