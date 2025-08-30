/**
 * Keyboard Navigation Utilities
 * Provides comprehensive keyboard navigation support for interactive elements
 */

export interface KeyboardNavigationOptions {
  focusableSelector?: string;
  skipLinks?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export interface FocusableElement extends HTMLElement {
  tabIndex: number;
}

/**
 * Default focusable element selectors
 */
export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'details summary',
  'audio[controls]',
  'video[controls]'
].join(', ');

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(
  container: HTMLElement,
  selector: string = FOCUSABLE_SELECTORS
): FocusableElement[] {
  const elements = Array.from(
    container.querySelectorAll(selector)
  ) as FocusableElement[];
  
  return elements.filter(element => {
    // Check if element is visible and not disabled
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('disabled') &&
      element.tabIndex !== -1
    );
  });
}

/**
 * Create proper tab order for elements
 */
export function setTabOrder(elements: FocusableElement[], startIndex: number = 0): void {
  elements.forEach((element, index) => {
    element.tabIndex = startIndex + index;
  });
}

/**
 * Focus trap for modals and overlays
 */
export class FocusTrap {
  private container: HTMLElement;
  private focusableElements: FocusableElement[] = [];
  private firstElement: FocusableElement | null = null;
  private lastElement: FocusableElement | null = null;
  private previouslyFocused: HTMLElement | null = null;

  constructor(container: HTMLElement, options: KeyboardNavigationOptions = {}) {
    this.container = container;
    this.updateFocusableElements();
    
    if (options.autoFocus && this.firstElement) {
      this.previouslyFocused = document.activeElement as HTMLElement;
      this.firstElement.focus();
    }
  }

  private updateFocusableElements(): void {
    this.focusableElements = getFocusableElements(this.container);
    this.firstElement = this.focusableElements[0] || null;
    this.lastElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  public handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    this.updateFocusableElements();

    if (this.focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === this.firstElement) {
        event.preventDefault();
        this.lastElement?.focus();
      }
    } else {
      // Tab (forward)
      if (document.activeElement === this.lastElement) {
        event.preventDefault();
        this.firstElement?.focus();
      }
    }
  };

  public activate(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  public deactivate(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus to previously focused element
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }
}

/**
 * Skip link functionality
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
  
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return skipLink;
}

/**
 * Roving tabindex for component groups (like toolbars, menus)
 */
export class RovingTabIndex {
  private container: HTMLElement;
  private items: FocusableElement[];
  private currentIndex: number = 0;

  constructor(container: HTMLElement, itemSelector: string = '[role="menuitem"], [role="tab"], [role="option"]') {
    this.container = container;
    this.items = Array.from(container.querySelectorAll(itemSelector)) as FocusableElement[];
    this.init();
  }

  private init(): void {
    this.items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
      item.addEventListener('keydown', this.handleKeyDown);
      item.addEventListener('focus', () => this.setCurrentIndex(index));
    });
  }

  private setCurrentIndex(index: number): void {
    this.items[this.currentIndex].tabIndex = -1;
    this.currentIndex = index;
    this.items[this.currentIndex].tabIndex = 0;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    let newIndex = this.currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (this.currentIndex + 1) % this.items.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.items.length - 1;
        break;
      default:
        return;
    }

    this.setCurrentIndex(newIndex);
    this.items[newIndex].focus();
  };

  public destroy(): void {
    this.items.forEach(item => {
      item.removeEventListener('keydown', this.handleKeyDown);
    });
  }
}

/**
 * Announce content changes to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}