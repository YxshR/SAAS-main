'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface FieldError {
  field: string;
  message: string;
  type: string;
}

export interface FormValidationState {
  errors: Record<string, FieldError>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormValidationConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsOnSubmit?: boolean;
  animateErrors?: boolean;
  debounceMs?: number;
}

const DEFAULT_CONFIG: FormValidationConfig = {
  validateOnChange: true,
  validateOnBlur: true,
  showErrorsOnSubmit: true,
  animateErrors: true,
  debounceMs: 300,
};

export class FormValidator {
  private rules: Record<string, ValidationRule> = {};
  private config: FormValidationConfig;

  constructor(config: FormValidationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  addRule(field: string, rule: ValidationRule) {
    this.rules[field] = rule;
  }

  addRules(rules: Record<string, ValidationRule>) {
    this.rules = { ...this.rules, ...rules };
  }

  validateField(field: string, value: any): FieldError | null {
    const rule = this.rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return {
        field,
        message: rule.message || `${field} is required`,
        type: 'required',
      };
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    const stringValue = String(value);

    // Length validations
    if (rule.minLength && stringValue.length < rule.minLength) {
      return {
        field,
        message: rule.message || `${field} must be at least ${rule.minLength} characters`,
        type: 'minLength',
      };
    }

    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return {
        field,
        message: rule.message || `${field} must be no more than ${rule.maxLength} characters`,
        type: 'maxLength',
      };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return {
        field,
        message: rule.message || `${field} format is invalid`,
        type: 'pattern',
      };
    }

    // Email validation
    if (rule.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(stringValue)) {
        return {
          field,
          message: rule.message || 'Please enter a valid email address',
          type: 'email',
        };
      }
    }

    // Phone validation
    if (rule.phone) {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phonePattern.test(stringValue.replace(/[\s\-\(\)]/g, ''))) {
        return {
          field,
          message: rule.message || 'Please enter a valid phone number',
          type: 'phone',
        };
      }
    }

    // URL validation
    if (rule.url) {
      try {
        new URL(stringValue);
      } catch {
        return {
          field,
          message: rule.message || 'Please enter a valid URL',
          type: 'url',
        };
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return {
          field,
          message: customError,
          type: 'custom',
        };
      }
    }

    return null;
  }

  validateForm(data: Record<string, any>): Record<string, FieldError> {
    const errors: Record<string, FieldError> = {};

    Object.keys(this.rules).forEach(field => {
      const error = this.validateField(field, data[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }
}

export const useFormValidation = (
  initialData: Record<string, any> = {},
  rules: Record<string, ValidationRule> = {},
  config: FormValidationConfig = {}
) => {
  const [validator] = useState(() => {
    const v = new FormValidator(config);
    v.addRules(rules);
    return v;
  });

  const [state, setState] = useState<FormValidationState>({
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
  });

  const [data, setData] = useState(initialData);
  const [debounceTimeouts, setDebounceTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  const validateField = useCallback((field: string, value: any) => {
    const error = validator.validateField(field, value);
    
    setState(prev => {
      const newErrors = { ...prev.errors };
      
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }

      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });

    return error;
  }, [validator]);

  const validateForm = useCallback(() => {
    const errors = validator.validateForm(data);
    
    setState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));

    return Object.keys(errors).length === 0;
  }, [validator, data]);

  const setFieldValue = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Clear existing timeout
    if (debounceTimeouts[field]) {
      clearTimeout(debounceTimeouts[field]);
    }

    // Validate on change if enabled
    if (config.validateOnChange !== false) {
      if (config.debounceMs && config.debounceMs > 0) {
        const timeout = setTimeout(() => {
          validateField(field, value);
        }, config.debounceMs);

        setDebounceTimeouts(prev => ({ ...prev, [field]: timeout }));
      } else {
        validateField(field, value);
      }
    }
  }, [validateField, config.validateOnChange, config.debounceMs, debounceTimeouts]);

  const setFieldTouched = useCallback((field: string, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));

    // Validate on blur if enabled and field is touched
    if (config.validateOnBlur !== false && touched) {
      validateField(field, data[field]);
    }
  }, [validateField, config.validateOnBlur, data]);

  const handleSubmit = useCallback(async (onSubmit: (data: Record<string, any>) => Promise<void> | void) => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const isValid = validateForm();
      
      if (isValid) {
        await onSubmit(data);
      } else if (config.showErrorsOnSubmit !== false) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(rules).reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>);

        setState(prev => ({
          ...prev,
          touched: { ...prev.touched, ...allTouched },
        }));
      }
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [validateForm, data, config.showErrorsOnSubmit, rules]);

  const reset = useCallback((newData: Record<string, any> = {}) => {
    setData(newData);
    setState({
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
    });
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: { field, message, type: 'manual' },
      },
      isValid: false,
    }));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [debounceTimeouts]);

  return {
    data,
    errors: state.errors,
    touched: state.touched,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    clearErrors,
    setError,
  };
};

// Form field component with built-in error handling
interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: any;
  error?: FieldError;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled,
  className = '',
  children,
}) => {
  const hasError = error && touched;
  const isValid = touched && !error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {children || (
          <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : isValid
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            `}
          />
        )}
        
        {/* Status icon */}
        <AnimatePresence>
          {(hasError || isValid) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {hasError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 text-sm text-red-600"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Form error summary component
interface FormErrorSummaryProps {
  errors: Record<string, FieldError>;
  touched: Record<string, boolean>;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  touched,
  className = '',
}) => {
  const visibleErrors = Object.values(errors).filter(error => touched[error.field]);

  if (visibleErrors.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="space-y-1">
              {visibleErrors.map((error, index) => (
                <motion.li
                  key={error.field}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm text-red-700"
                >
                  • {error.message}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};