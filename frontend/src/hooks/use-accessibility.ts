/**
 * React Hooks for Accessibility Features
 * Provides easy-to-use React hooks for accessibility functionality
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { focusManager } from '../lib/accessibility/focus-management';
import { highContrastManager } from '../lib/accessibility/high-contrast';
import { FocusTrap, RovingTabIndex, announceToScreenReader, getFocusableElements } from '../lib/accessibility/keyboard-navigation';
import type { FocusManagerOptions } from '../lib/accessibility/focus-management';
import type { HighContrastColors } from '../lib/accessibility/high-contrast';

/**
 * Hook for managing focus in modals and overlays
 */
export function useFocusManagement(
  options: FocusManagerOptions = {}
) {
  const ref = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (options.trapFocus) {
      cleanupRef.current = focusManager.manageModalFocus(element, options);
    } else if (options.autoFocus) {
      focusManager.setFocus(element);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [options.trapFocus, options.autoFocus, options.preventScroll]);

  return ref;
}

/**
 * Hook for managing high contrast mode
 */
export function useHighContrast() {
  const [isEnabled, setIsEnabled] = useState(highContrastManager.isHighContrastEnabled());
  const [currentTheme, setCurrentTheme] = useState(highContrastManager.getCurrentTheme());

  useEffect(() => {
    const handleChange = (enabled: boolean, theme: string | null) => {
      setIsEnabled(enabled);
      setCurrentTheme(theme);
    };

    highContrastManager.addObserver(handleChange);

    return () => {
      highContrastManager.removeObserver(handleChange);
    };
  }, []);

  const enableHighContrast = useCallback((theme: string = 'dark') => {
    highContrastManager.enableHighContrast(theme);
  }, []);

  const disableHighContrast = useCallback(() => {
    highContrastManager.disableHighContrast();
  }, []);

  const toggleHighContrast = useCallback((theme: string = 'dark') => {
    highContrastManager.toggleHighContrast(theme);
  }, []);

  return {
    isEnabled,
    currentTheme,
    availableThemes: highContrastManager.getAvailableThemes(),
    enableHighContrast,
    disableHighContrast,
    toggleHighContrast
  };
}

/**
 * Hook for keyboard navigation with roving tabindex
 */
export function useRovingTabIndex(itemSelector?: string) {
  const containerRef = useRef<HTMLElement>(null);
  const rovingTabIndexRef = useRef<RovingTabIndex | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    rovingTabIndexRef.current = new RovingTabIndex(container, itemSelector);

    return () => {
      if (rovingTabIndexRef.current) {
        rovingTabIndexRef.current.destroy();
        rovingTabIndexRef.current = null;
      }
    };
  }, [itemSelector]);

  return containerRef;
}

/**
 * Hook for focus trap functionality
 */
export function useFocusTrap(active: boolean = false, options: { autoFocus?: boolean } = {}) {
  const ref = useRef<HTMLElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !active) {
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }
      return;
    }

    trapRef.current = new FocusTrap(element, options);
    trapRef.current.activate();

    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }
    };
  }, [active, options.autoFocus]);

  return ref;
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const announce = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    announceToScreenReader(message, priority);
  }, []);

  return { announce };
}

/**
 * Hook for managing ARIA live regions
 */
export function useLiveRegion(priority: 'polite' | 'assertive' = 'polite') {
  const ref = useRef<HTMLElement>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', 'true');
    element.className = 'sr-only';
  }, [priority]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !message) return;

    element.textContent = message;

    // Clear message after announcement
    const timer = setTimeout(() => {
      setMessage('');
      element.textContent = '';
    }, 1000);

    return () => clearTimeout(timer);
  }, [message]);

  const announce = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  return { ref, announce };
}

/**
 * Hook for managing form accessibility
 */
export function useFormAccessibility() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleValidationErrors = useCallback((
    errors: Array<{ field: string; message: string }>
  ) => {
    const form = formRef.current;
    if (!form) return;

    focusManager.handleFormValidation(form, errors);
  }, []);

  const setFieldError = useCallback((fieldName: string, errorMessage: string) => {
    const form = formRef.current;
    if (!form) return;

    const field = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      
      // Create or update error message
      let errorElement = form.querySelector(`#${fieldName}-error`);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldName}-error`;
        errorElement.className = 'error-message sr-only';
        field.parentNode?.appendChild(errorElement);
      }
      
      errorElement.textContent = errorMessage;
      field.setAttribute('aria-describedby', `${fieldName}-error`);
    }
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    const form = formRef.current;
    if (!form) return;

    const field = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    if (field) {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
      
      const errorElement = form.querySelector(`#${fieldName}-error`);
      if (errorElement) {
        errorElement.remove();
      }
    }
  }, []);

  return {
    formRef,
    handleValidationErrors,
    setFieldError,
    clearFieldError
  };
}

/**
 * Hook for managing dynamic content accessibility
 */
export function useDynamicContent() {
  const containerRef = useRef<HTMLElement>(null);

  const manageDynamicContent = useCallback((options: {
    announceChanges?: boolean;
    focusFirstNew?: boolean;
    preserveTabOrder?: boolean;
  } = {}) => {
    const container = containerRef.current;
    if (!container) return;

    focusManager.manageDynamicContent(container, options);
  }, []);

  return { containerRef, manageDynamicContent };
}

/**
 * Hook for keyboard event handling
 */
export function useKeyboardNavigation(handlers: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onTab?: (event: KeyboardEvent) => void;
} = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          handlers.onEscape?.();
          break;
        case 'Enter':
          handlers.onEnter?.();
          break;
        case 'ArrowUp':
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          handlers.onArrowDown?.();
          break;
        case 'ArrowLeft':
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          handlers.onArrowRight?.();
          break;
        case 'Home':
          handlers.onHome?.();
          break;
        case 'End':
          handlers.onEnd?.();
          break;
        case 'Tab':
          handlers.onTab?.(event);
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);

  return ref;
}

/**
 * Hook for managing component focus state
 */
export function useFocusState() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => {
      setIsFocused(true);
      // Check if focus is from keyboard
      setIsFocusVisible(document.body.classList.contains('keyboard-navigation'));
    };

    const handleBlur = () => {
      setIsFocused(false);
      setIsFocusVisible(false);
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { ref, isFocused, isFocusVisible };
}

/**
 * Hook for managing ARIA expanded state
 */
export function useAriaExpanded(initialExpanded: boolean = false) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    
    if (trigger) {
      trigger.setAttribute('aria-expanded', String(isExpanded));
      
      if (content && !content.id) {
        content.id = `content-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      if (content?.id) {
        trigger.setAttribute('aria-controls', content.id);
      }
    }
    
    if (content) {
      content.hidden = !isExpanded;
    }
  }, [isExpanded]);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    isExpanded,
    triggerRef,
    contentRef,
    toggle,
    expand,
    collapse
  };
}