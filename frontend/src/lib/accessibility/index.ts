/**
 * Accessibility Library
 * Comprehensive accessibility support for keyboard navigation, ARIA, high contrast, and focus management
 */

// Keyboard Navigation
export {
  getFocusableElements,
  setTabOrder,
  FocusTrap,
  RovingTabIndex,
  createSkipLink,
  announceToScreenReader,
  FOCUSABLE_SELECTORS
} from './keyboard-navigation';

export type {
  KeyboardNavigationOptions,
  FocusableElement
} from './keyboard-navigation';

// ARIA Utilities
export {
  setAriaAttributes,
  createAccessibleButton,
  createAccessibleInput,
  createAccessibleModal,
  createAccessibleMenu,
  createAccessibleProgress,
  createAccessibleTabs,
  createAccessibleAlert,
  updateLiveRegion,
  createAccessibleTable
} from './aria-utils';

export type {
  AriaAttributes
} from './aria-utils';

// High Contrast Support
export {
  HighContrastManager,
  createHighContrastToggle,
  highContrastManager,
  HIGH_CONTRAST_THEMES
} from './high-contrast';

export type {
  HighContrastColors
} from './high-contrast';

// Focus Management
export {
  FocusManager,
  focusManager
} from './focus-management';

export type {
  FocusManagerOptions
} from './focus-management';

// Note: initializeAccessibility is available from ./init.ts
// This avoids circular import issues and keeps the main index clean



/**
 * Accessibility testing utilities
 */
export const a11yTest = {
  /**
   * Check if element has proper ARIA labels
   */
  checkAriaLabels(element: HTMLElement): boolean {
    const interactiveElements = element.querySelectorAll('button, [role="button"], a, input, select, textarea');
    let hasIssues = false;

    interactiveElements.forEach((el: Element) => {
      const hasLabel = el.hasAttribute('aria-label') || 
                      el.hasAttribute('aria-labelledby') || 
                      el.textContent?.trim() ||
                      (el instanceof HTMLInputElement && el.labels?.length);
      
      if (!hasLabel) {
        console.warn('Element missing accessible label:', el);
        hasIssues = true;
      }
    });

    return !hasIssues;
  },

  /**
   * Check keyboard navigation
   */
  checkKeyboardNavigation(container: HTMLElement): boolean {
    // Import getFocusableElements locally to avoid circular imports
    const { getFocusableElements } = require('./keyboard-navigation');
    const focusableElements = getFocusableElements(container);
    let hasIssues = false;

    focusableElements.forEach((el: HTMLElement) => {
      if (el.tabIndex < 0 && !el.hasAttribute('aria-hidden')) {
        console.warn('Focusable element with negative tabindex:', el);
        hasIssues = true;
      }
    });

    return !hasIssues;
  },

  /**
   * Check color contrast (basic check)
   */
  checkColorContrast(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const backgroundColor = style.backgroundColor;
    const color = style.color;

    // Basic check - in a real implementation, you'd calculate actual contrast ratios
    if (backgroundColor === 'rgba(0, 0, 0, 0)' && color === 'rgb(255, 255, 255)') {
      console.warn('Potential contrast issue:', element);
      return false;
    }

    return true;
  },

  /**
   * Run comprehensive accessibility audit
   */
  auditPage(): {
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    colorContrast: boolean;
    headingStructure: boolean;
    landmarks: boolean;
  } {
    const results = {
      ariaLabels: this.checkAriaLabels(document.body),
      keyboardNavigation: this.checkKeyboardNavigation(document.body),
      colorContrast: this.checkColorContrast(document.body),
      headingStructure: this.checkHeadingStructure(),
      landmarks: this.checkLandmarks()
    };

    console.log('Accessibility Audit Results:', results);
    return results;
  },

  /**
   * Check heading structure
   */
  checkHeadingStructure(): boolean {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let hasIssues = false;
    let previousLevel = 0;

    headings.forEach((heading: Element) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > previousLevel + 1) {
        console.warn('Heading level skipped:', heading);
        hasIssues = true;
      }
      
      previousLevel = level;
    });

    // Check for h1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      console.warn('No h1 element found on page');
      hasIssues = true;
    } else if (h1Count > 1) {
      console.warn('Multiple h1 elements found on page');
      hasIssues = true;
    }

    return !hasIssues;
  },

  /**
   * Check for proper landmarks
   */
  checkLandmarks(): boolean {
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      header: document.querySelectorAll('header, [role="banner"]').length,
      footer: document.querySelectorAll('footer, [role="contentinfo"]').length
    };

    let hasIssues = false;

    if (landmarks.main === 0) {
      console.warn('No main landmark found');
      hasIssues = true;
    } else if (landmarks.main > 1) {
      console.warn('Multiple main landmarks found');
      hasIssues = true;
    }

    return !hasIssues;
  }
};