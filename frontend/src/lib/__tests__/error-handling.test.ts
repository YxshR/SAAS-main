import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';

import {
  FormValidator,
  NetworkErrorHandler,
  handleApiError,
  withErrorHandling,
  reportError,
} from '../error-handling';

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe('FormValidator', () => {
  let validator: FormValidator;

  beforeEach(() => {
    validator = new FormValidator();
  });

  describe('required validation', () => {
    it('should validate required fields', () => {
      validator.addRule('email', { required: true });

      const error = validator.validateField('email', '');
      expect(error).toEqual({
        field: 'email',
        message: 'email is required',
        type: 'required',
      });

      const noError = validator.validateField('email', 'test@example.com');
      expect(noError).toBeNull();
    });

    it('should use custom required message', () => {
      validator.addRule('email', { 
        required: true, 
        message: 'Please enter your email address' 
      });

      const error = validator.validateField('email', '');
      expect(error?.message).toBe('Please enter your email address');
    });
  });

  describe('length validation', () => {
    it('should validate minimum length', () => {
      validator.addRule('password', { minLength: 8 });

      const error = validator.validateField('password', '123');
      expect(error).toEqual({
        field: 'password',
        message: 'password must be at least 8 characters',
        type: 'minLength',
      });

      const noError = validator.validateField('password', '12345678');
      expect(noError).toBeNull();
    });

    it('should validate maximum length', () => {
      validator.addRule('username', { maxLength: 20 });

      const error = validator.validateField('username', 'a'.repeat(25));
      expect(error).toEqual({
        field: 'username',
        message: 'username must be no more than 20 characters',
        type: 'maxLength',
      });

      const noError = validator.validateField('username', 'validusername');
      expect(noError).toBeNull();
    });
  });

  describe('email validation', () => {
    it('should validate email format', () => {
      validator.addRule('email', { email: true });

      const error = validator.validateField('email', 'invalid-email');
      expect(error).toEqual({
        field: 'email',
        message: 'Please enter a valid email address',
        type: 'email',
      });

      const noError = validator.validateField('email', 'test@example.com');
      expect(noError).toBeNull();
    });
  });

  describe('phone validation', () => {
    it('should validate phone format', () => {
      validator.addRule('phone', { phone: true });

      const error = validator.validateField('phone', 'invalid-phone');
      expect(error).toEqual({
        field: 'phone',
        message: 'Please enter a valid phone number',
        type: 'phone',
      });

      const noError = validator.validateField('phone', '+1234567890');
      expect(noError).toBeNull();
    });
  });

  describe('URL validation', () => {
    it('should validate URL format', () => {
      validator.addRule('website', { url: true });

      const error = validator.validateField('website', 'invalid-url');
      expect(error).toEqual({
        field: 'website',
        message: 'Please enter a valid URL',
        type: 'url',
      });

      const noError = validator.validateField('website', 'https://example.com');
      expect(noError).toBeNull();
    });
  });

  describe('pattern validation', () => {
    it('should validate against regex pattern', () => {
      validator.addRule('code', { pattern: /^[A-Z]{3}\d{3}$/ });

      const error = validator.validateField('code', 'invalid');
      expect(error).toEqual({
        field: 'code',
        message: 'code format is invalid',
        type: 'pattern',
      });

      const noError = validator.validateField('code', 'ABC123');
      expect(noError).toBeNull();
    });
  });

  describe('custom validation', () => {
    it('should run custom validation function', () => {
      validator.addRule('age', {
        custom: (value) => {
          const age = parseInt(value);
          if (age < 18) return 'Must be at least 18 years old';
          if (age > 120) return 'Age must be realistic';
          return null;
        },
      });

      const error1 = validator.validateField('age', '16');
      expect(error1?.message).toBe('Must be at least 18 years old');

      const error2 = validator.validateField('age', '150');
      expect(error2?.message).toBe('Age must be realistic');

      const noError = validator.validateField('age', '25');
      expect(noError).toBeNull();
    });
  });

  describe('form validation', () => {
    it('should validate entire form', () => {
      validator.addRules({
        email: { required: true, email: true },
        password: { required: true, minLength: 8 },
        age: { required: true },
      });

      const errors = validator.validateForm({
        email: 'invalid-email',
        password: '123',
        age: '',
      });

      expect(Object.keys(errors)).toHaveLength(3);
      expect(errors.email.type).toBe('email');
      expect(errors.password.type).toBe('minLength');
      expect(errors.age.type).toBe('required');
    });

    it('should return empty object for valid form', () => {
      validator.addRules({
        email: { required: true, email: true },
        password: { required: true, minLength: 8 },
      });

      const errors = validator.validateForm({
        email: 'test@example.com',
        password: 'validpassword',
      });

      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});

describe('NetworkErrorHandler', () => {
  let handler: NetworkErrorHandler;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    handler = new NetworkErrorHandler({
      showToast: false, // Disable toasts for testing
      logErrors: false, // Disable logging for testing
      reportErrors: false, // Disable reporting for testing
    });
    mockFetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should return result for successful request', async () => {
      const mockResult = { data: 'success' };
      mockFetch.mockResolvedValue(mockResult);

      const result = await handler.handleRequest(mockFetch);
      expect(result).toBe(mockResult);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('retry logic', () => {
    it('should retry on network errors', async () => {
      const networkError = new TypeError('fetch failed');
      mockFetch
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue({ data: 'success' });

      const result = await handler.handleRequest(mockFetch);
      expect(result).toEqual({ data: 'success' });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should retry on 5xx server errors', async () => {
      const serverError = {
        response: { status: 500, statusText: 'Internal Server Error' },
      };
      mockFetch
        .mockRejectedValueOnce(serverError)
        .mockResolvedValue({ data: 'success' });

      const result = await handler.handleRequest(mockFetch);
      expect(result).toEqual({ data: 'success' });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry on 4xx client errors', async () => {
      const clientError = {
        response: { status: 400, statusText: 'Bad Request' },
      };
      mockFetch.mockRejectedValue(clientError);

      await expect(handler.handleRequest(mockFetch)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should respect max retry limit', async () => {
      const networkError = new TypeError('fetch failed');
      mockFetch.mockRejectedValue(networkError);

      await expect(handler.handleRequest(mockFetch)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });
  });

  describe('error normalization', () => {
    it('should normalize network errors', async () => {
      const networkError = new TypeError('fetch failed');
      mockFetch.mockRejectedValue(networkError);

      try {
        await handler.handleRequest(mockFetch);
      } catch (error: any) {
        expect(error.name).toBe('NetworkError');
        expect(error.message).toBe('Network connection failed');
      }
    });

    it('should normalize HTTP errors', async () => {
      const httpError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          url: 'https://api.example.com/users',
        },
      };
      mockFetch.mockRejectedValue(httpError);

      try {
        await handler.handleRequest(mockFetch);
      } catch (error: any) {
        expect(error.name).toBe('HTTPError');
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.url).toBe('https://api.example.com/users');
      }
    });
  });
});

describe('handleApiError', () => {
  it('should handle HTTP 401 errors', () => {
    const error = {
      response: { status: 401, statusText: 'Unauthorized' },
    };

    const result = handleApiError(error);
    expect(result.type).toBe('authentication');
    expect(result.title).toBe('Authentication required');
  });

  it('should handle HTTP 403 errors', () => {
    const error = {
      response: { status: 403, statusText: 'Forbidden' },
    };

    const result = handleApiError(error);
    expect(result.type).toBe('authentication');
    expect(result.title).toBe('Authentication required');
    expect(result.message).toBe('Access denied');
  });

  it('should handle HTTP 404 errors', () => {
    const error = {
      response: { status: 404, statusText: 'Not Found' },
    };

    const result = handleApiError(error);
    expect(result.type).toBe('validation');
    expect(result.message).toBe('Resource not found');
  });

  it('should handle HTTP 5xx errors', () => {
    const error = {
      response: { status: 500, statusText: 'Internal Server Error' },
    };

    const result = handleApiError(error);
    expect(result.type).toBe('server');
    expect(result.title).toBe('Server error');
  });

  it('should handle network errors', () => {
    const error = { request: {} };

    const result = handleApiError(error);
    expect(result.type).toBe('network');
    expect(result.message).toBe('Unable to connect to the server');
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');

    const result = handleApiError(error);
    expect(result.type).toBe('server');
    expect(result.message).toBe('Unknown error');
  });
});

describe('withErrorHandling', () => {
  it('should return result for successful function', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const wrappedFn = withErrorHandling(mockFn);

    const result = await wrappedFn('arg1', 'arg2');
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should call error handler on error', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const errorHandler = jest.fn();
    const wrappedFn = withErrorHandling(mockFn, errorHandler);

    await expect(wrappedFn()).rejects.toThrow('Test error');
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it('should log error if no error handler provided', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = withErrorHandling(mockFn);

    await expect(wrappedFn()).rejects.toThrow('Test error');
    expect(consoleSpy).toHaveBeenCalledWith('Unhandled error:', error);

    consoleSpy.mockRestore();
  });
});

describe('reportError', () => {
  it('should log error to console', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    const context = { userId: '123', action: 'submit' };

    reportError(error, context);

    expect(consoleSpy).toHaveBeenCalledWith('Error reported:', error, context);
    consoleSpy.mockRestore();
  });

  it('should log detailed error info in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const error = new Error('Test error');
    const context = { userId: '123' };

    reportError(error, context);

    expect(consoleGroupSpy).toHaveBeenCalledWith('Error Details');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
    expect(consoleLogSpy).toHaveBeenCalledWith('Stack:', error.stack);
    expect(consoleLogSpy).toHaveBeenCalledWith('Context:', context);
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    // Restore
    process.env.NODE_ENV = originalEnv;
    consoleGroupSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });
});