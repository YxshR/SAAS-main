/**
 * Focus Management System
 * Provides comprehensive focus management for modals, dynamic content, and complex interactions
 */

import { getFocusableElements, FocusableElement, FocusTrap } from './keyboard-navigation';

export interface FocusManagerOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
  preventScroll?: boolean;
  focusableSelector?: string;
}

/**
 * Focus stack for managing nested focus contexts
 */
class FocusStack {
  private stack: Array<{
    element: HTMLElement;
    previousFocus: HTMLElement | null;
    trap?: FocusTrap;
  }> = [];

  public push(element: HTMLElement, previousFocus: HTMLElement | null, trap?: FocusTrap): void {
    this.stack.push({ element, previousFocus, trap });
  }

  public pop(): { element: HTMLElement; previousFocus: HTMLElement | null; trap?: FocusTrap } | null {
    return this.stack.pop() || null;
  }

  public peek(): { element: HTMLElement; previousFocus: HTMLElement | null; trap?: FocusTrap } | null {
    return this.stack[this.stack.length - 1] || null;
  }

  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  public clear(): void {
    // Deactivate all traps
    this.stack.forEach(item => {
      if (item.trap) {
        item.trap.deactivate();
      }
    });
    this.stack = [];
  }
}

/**
 * Global focus manager
 */
export class FocusManager {
  private focusStack = new FocusStack();
  private observers: Array<(event: FocusEvent) => void> = [];
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    if (typeof window !== "undefined" && "MutationObserver" in window) {
      this.mutationObserver = new MutationObserver(this.handleDOMChanges);
      this.init();
    }
  }

  private init(): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // Listen for focus events globally
    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('focusout', this.handleFocusOut);

    // Start observing DOM changes
    if (this.mutationObserver) {
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tabindex', 'disabled', 'aria-hidden']
      });
    }
  }

  private handleFocusIn = (event: FocusEvent): void => {
    this.notifyObservers(event);
  };

  private handleFocusOut = (event: FocusEvent): void => {
    this.notifyObservers(event);
  };

  private handleDOMChanges = (mutations: MutationRecord[]): void => {
    // Check if any focusable elements were added or removed
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        // Handle added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.handleNewFocusableElements(element);
          }
        });
      }
    });
  };

  private handleNewFocusableElements(element: HTMLElement): void {
    // If the element or its children are focusable, update focus management
    const focusableElements = getFocusableElements(element);
    if (focusableElements.length > 0) {
      // Update current focus trap if active
      const current = this.focusStack.peek();
      if (current && current.trap) {
        // Trap will update its focusable elements automatically
      }
    }
  }

  /**
   * Set focus to an element with options
   */
  public setFocus(
    element: HTMLElement | string,
    options: {
      preventScroll?: boolean;
      selectText?: boolean;
    } = {}
  ): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }

    const targetElement = typeof element === 'string' 
      ? document.getElementById(element) || document.querySelector(element)
      : element;

    if (!targetElement) {
      console.warn('Focus target not found:', element);
      return false;
    }

    try {
      if (options.selectText && targetElement instanceof HTMLInputElement) {
        targetElement.select();
      } else {
        targetElement.focus({ preventScroll: options.preventScroll });
      }
      return true;
    } catch (error) {
      console.warn('Failed to set focus:', error);
      return false;
    }
  }

  /**
   * Manage focus for modal dialogs
   */
  public manageModalFocus(
    modal: HTMLElement,
    options: FocusManagerOptions = {}
  ): () => void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return () => {};
    }

    const previousFocus = document.activeElement as HTMLElement;
    
    // Create focus trap
    const trap = new FocusTrap(modal, {
      autoFocus: options.autoFocus !== false,
      trapFocus: options.trapFocus !== false
    });

    // Add to focus stack
    this.focusStack.push(modal, previousFocus, trap);

    // Activate trap
    trap.activate();

    // Set initial focus if requested
    if (options.autoFocus !== false) {
      const focusableElements = getFocusableElements(modal);
      if (focusableElements.length > 0) {
        this.setFocus(focusableElements[0], { preventScroll: options.preventScroll });
      }
    }

    // Return cleanup function
    return () => {
      this.releaseModalFocus();
    };
  }

  /**
   * Release modal focus management
   */
  public releaseModalFocus(): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const current = this.focusStack.pop();
    if (!current) return;

    // Deactivate trap
    if (current.trap) {
      current.trap.deactivate();
    }

    // Restore previous focus
    if (current.previousFocus && document.contains(current.previousFocus)) {
      this.setFocus(current.previousFocus);
    }
  }

  /**
   * Manage focus for dynamic content
   */
  public manageDynamicContent(
    container: HTMLElement,
    options: {
      announceChanges?: boolean;
      focusFirstNew?: boolean;
      preserveTabOrder?: boolean;
    } = {}
  ): void {
    if (options.announceChanges) {
      // Announce content changes to screen readers
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
    }

    if (options.focusFirstNew) {
      // Focus the first new focusable element
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length > 0) {
        this.setFocus(focusableElements[0]);
      }
    }

    if (options.preserveTabOrder) {
      // Ensure proper tab order for new elements
      this.updateTabOrder(container);
    }
  }

  /**
   * Update tab order for elements
   */
  public updateTabOrder(container: HTMLElement): void {
    const focusableElements = getFocusableElements(container);
    
    focusableElements.forEach((element, index) => {
      // Only set tabindex if it's not already explicitly set
      if (!element.hasAttribute('tabindex') || element.tabIndex === -1) {
        element.tabIndex = 0;
      }
    });
  }

  /**
   * Handle focus for single-page application navigation
   */
  public handleSPANavigation(
    newPage: HTMLElement,
    options: {
      focusHeading?: boolean;
      announceNavigation?: boolean;
      skipLinks?: boolean;
    } = {}
  ): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (options.announceNavigation) {
      // Announce page change
      const pageTitle = document.title;
      this.announceToScreenReader(`Navigated to ${pageTitle}`, 'assertive');
    }

    if (options.focusHeading) {
      // Focus the main heading
      const heading = newPage.querySelector('h1, h2, [role="heading"]') as HTMLElement;
      if (heading) {
        // Make heading focusable temporarily
        const originalTabIndex = heading.tabIndex;
        heading.tabIndex = -1;
        this.setFocus(heading);
        
        // Restore original tabindex after focus
        setTimeout(() => {
          if (originalTabIndex === -1) {
            heading.removeAttribute('tabindex');
          } else {
            heading.tabIndex = originalTabIndex;
          }
        }, 100);
      }
    }

    if (options.skipLinks) {
      // Add skip links for new page
      this.addSkipLinks(newPage);
    }
  }

  /**
   * Add skip links to a page
   */
  private addSkipLinks(container: HTMLElement): void {
    const existingSkipLinks = container.querySelector('.skip-links');
    if (existingSkipLinks) return;

    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.setAttribute('aria-label', 'Skip links');

    // Find main content areas
    const mainContent = container.querySelector('main, [role="main"], #main-content');
    const navigation = container.querySelector('nav, [role="navigation"]');
    const search = container.querySelector('[role="search"], .search');

    if (mainContent) {
      const skipLink = this.createSkipLink('main-content', 'Skip to main content');
      skipLinksContainer.appendChild(skipLink);
    }

    if (navigation) {
      const skipLink = this.createSkipLink('navigation', 'Skip to navigation');
      skipLinksContainer.appendChild(skipLink);
    }

    if (search) {
      const skipLink = this.createSkipLink('search', 'Skip to search');
      skipLinksContainer.appendChild(skipLink);
    }

    if (skipLinksContainer.children.length > 0) {
      container.insertBefore(skipLinksContainer, container.firstChild);
    }
  }

  /**
   * Create a skip link
   */
  private createSkipLink(targetId: string, text: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = text;
    link.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
    
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        this.setFocus(target);
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });

    return link;
  }

  /**
   * Announce message to screen readers
   */
  private announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  /**
   * Handle focus for form validation
   */
  public handleFormValidation(
    form: HTMLFormElement,
    errors: Array<{ field: string; message: string }>
  ): void {
    if (errors.length === 0) return;

    // Focus first invalid field
    const firstError = errors[0];
    const field = form.querySelector(`[name="${firstError.field}"]`) as HTMLElement;
    
    if (field) {
      this.setFocus(field);
      
      // Announce error to screen readers
      this.announceToScreenReader(
        `Form validation failed. ${firstError.message}`,
        'assertive'
      );
    }
  }

  /**
   * Add focus observer
   */
  public addObserver(callback: (event: FocusEvent) => void): void {
    this.observers.push(callback);
  }

  /**
   * Remove focus observer
   */
  public removeObserver(callback: (event: FocusEvent) => void): void {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notify observers
   */
  private notifyObservers(event: FocusEvent): void {
    this.observers.forEach(callback => callback(event));
  }

  /**
   * Get currently focused element
   */
  public getCurrentFocus(): HTMLElement | null {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return null;
    }
    return document.activeElement as HTMLElement;
  }

  /**
   * Check if element is currently focused
   */
  public isFocused(element: HTMLElement): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }
    return document.activeElement === element;
  }

  /**
   * Check if focus is within container
   */
  public isFocusWithin(container: HTMLElement): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }
    const activeElement = document.activeElement;
    return activeElement ? container.contains(activeElement) : false;
  }

  /**
   * Cleanup and destroy
   */
  public destroy(): void {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      document.removeEventListener('focusin', this.handleFocusIn);
      document.removeEventListener('focusout', this.handleFocusOut);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.focusStack.clear();
    this.observers = [];
  }
}

/**
 * Global focus manager instance
 */
export const focusManager = new FocusManager();

/**
 * React hook for focus management (if using React)
 * Note: This is implemented in the hooks file instead
 */