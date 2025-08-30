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

import { createSkipLink, getFocusableElements } from './keyboard-navigation';

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

/**
 * Initialize accessibility features
 */
export function initializeAccessibility(options: {
  enableHighContrast?: boolean;
  enableFocusManagement?: boolean;
  enableKeyboardNavigation?: boolean;
  skipLinks?: boolean;
  enableLiveRegions?: boolean;
  enableAriaEnhancements?: boolean;
} = {}): void {
  const {
    enableHighContrast = true,
    enableFocusManagement = true,
    enableKeyboardNavigation = true,
    skipLinks = true,
    enableLiveRegions = true,
    enableAriaEnhancements = true
  } = options;

  // Add skip links to the page
  if (skipLinks) {
    addSkipLinksToPage();
  }

  // Initialize high contrast if system preference is set
  if (enableHighContrast) {
    // High contrast manager is automatically initialized
    console.log('High contrast support enabled');
  }

  // Focus management is automatically initialized
  if (enableFocusManagement) {
    console.log('Focus management enabled');
  }

  // Add global keyboard navigation enhancements
  if (enableKeyboardNavigation) {
    enhanceKeyboardNavigation();
  }

  // Add live regions for dynamic content announcements
  if (enableLiveRegions) {
    addGlobalLiveRegions();
  }

  // Enhance existing elements with ARIA attributes
  if (enableAriaEnhancements) {
    enhanceExistingElements();
  }

  // Add accessibility CSS classes
  addAccessibilityStyles();

  // Initialize accessibility monitoring
  initializeAccessibilityMonitoring();
}

/**
 * Add skip links to the current page
 */
function addSkipLinksToPage(): void {
  const existingSkipLinks = document.querySelector('.skip-links');
  if (existingSkipLinks) return;

  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.className = 'skip-links';
  skipLinksContainer.setAttribute('aria-label', 'Skip navigation links');

  // Find main content areas
  const mainContent = document.querySelector('main, [role="main"], #main-content, .main-content');
  const navigation = document.querySelector('nav, [role="navigation"], .navigation');
  const search = document.querySelector('[role="search"], .search, input[type="search"]');

  if (mainContent) {
    if (!mainContent.id) {
      mainContent.id = 'main-content';
    }
    const skipLink = createSkipLink(mainContent.id, 'Skip to main content');
    skipLinksContainer.appendChild(skipLink);
  }

  if (navigation) {
    if (!navigation.id) {
      navigation.id = 'navigation';
    }
    const skipLink = createSkipLink(navigation.id, 'Skip to navigation');
    skipLinksContainer.appendChild(skipLink);
  }

  if (search) {
    if (!search.id) {
      search.id = 'search';
    }
    const skipLink = createSkipLink(search.id, 'Skip to search');
    skipLinksContainer.appendChild(skipLink);
  }

  if (skipLinksContainer.children.length > 0) {
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  }
}

/**
 * Enhance keyboard navigation globally
 */
function enhanceKeyboardNavigation(): void {
  // Add escape key handler for modals
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Close any open modals or overlays
      const openModal = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (openModal) {
        const closeButton = openModal.querySelector('[aria-label*="close"], [aria-label*="Close"], .close-button');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      }
    }
  });

  // Enhance focus visibility
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * Add accessibility-related CSS classes and styles
 */
function addAccessibilityStyles(): void {
  const styleId = 'accessibility-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Screen reader only content */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .sr-only:focus,
    .sr-only:active {
      position: static;
      width: auto;
      height: auto;
      padding: inherit;
      margin: inherit;
      overflow: visible;
      clip: auto;
      white-space: inherit;
    }

    /* Skip links */
    .skip-links {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
    }

    .skip-links a {
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 0 0 4px 4px;
      font-weight: bold;
      transition: top 0.3s;
    }

    .skip-links a:focus {
      top: 0;
    }

    /* Enhanced focus visibility for keyboard navigation */
    .keyboard-navigation *:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }

    .keyboard-navigation button:focus,
    .keyboard-navigation [role="button"]:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }

    .keyboard-navigation a:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      * {
        text-shadow: none !important;
        box-shadow: none !important;
      }
    }

    /* Focus indicators for interactive elements */
    button:focus-visible,
    [role="button"]:focus-visible,
    a:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    [tabindex]:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    /* Ensure sufficient color contrast for links */
    a {
      text-decoration: underline;
    }

    a:hover,
    a:focus {
      text-decoration: none;
    }

    /* Loading and busy states */
    [aria-busy="true"] {
      cursor: wait;
    }

    /* Invalid form fields */
    [aria-invalid="true"] {
      border-color: #dc3545;
    }

    /* Required form fields */
    [aria-required="true"]::after {
      content: " *";
      color: #dc3545;
    }

    /* Progress indicators */
    [role="progressbar"] {
      background-color: #e9ecef;
      border-radius: 0.25rem;
      overflow: hidden;
    }

    /* Status indicators */
    [role="status"],
    [role="alert"] {
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      margin-bottom: 1rem;
    }

    [role="alert"] {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    /* Tooltip positioning */
    [role="tooltip"] {
      position: absolute;
      z-index: 1000;
      padding: 0.5rem;
      background: #000;
      color: #fff;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      max-width: 200px;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Add global live regions for announcements
 */
function addGlobalLiveRegions(): void {
  // Add polite live region
  if (!document.getElementById('aria-live-polite')) {
    const politeRegion = document.createElement('div');
    politeRegion.id = 'aria-live-polite';
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.className = 'sr-only';
    document.body.appendChild(politeRegion);
  }

  // Add assertive live region
  if (!document.getElementById('aria-live-assertive')) {
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'aria-live-assertive';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    document.body.appendChild(assertiveRegion);
  }
}

/**
 * Enhance existing elements with proper ARIA attributes
 */
function enhanceExistingElements(): void {
  // Enhance buttons without proper labels
  const unlabeledButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  unlabeledButtons.forEach((button: Element) => {
    if (button instanceof HTMLElement && !button.textContent?.trim()) {
      // Try to find an icon or image for context
      const icon = button.querySelector('svg, img, i[class*="icon"]');
      if (icon) {
        button.setAttribute('aria-label', 'Button');
      }
    }
  });

  // Enhance form inputs without labels
  const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  unlabeledInputs.forEach((input: Element) => {
    if (input instanceof HTMLInputElement && !input.labels?.length) {
      const placeholder = input.placeholder;
      if (placeholder) {
        input.setAttribute('aria-label', placeholder);
      }
    }
  });

  // Enhance images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  imagesWithoutAlt.forEach((img: Element) => {
    if (img instanceof HTMLImageElement) {
      img.setAttribute('alt', '');
    }
  });

  // Add role to main content areas
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Enhance navigation elements
  const navElements = document.querySelectorAll('nav:not([aria-label]):not([aria-labelledby])');
  navElements.forEach((nav: Element, index: number) => {
    if (nav instanceof HTMLElement) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
}

/**
 * Initialize accessibility monitoring
 */
function initializeAccessibilityMonitoring(): void {
  // Monitor for new elements and enhance them
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            enhanceNewElement(element);
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Store observer for cleanup
  (window as any).__a11yObserver = observer;
}

/**
 * Enhance newly added elements
 */
function enhanceNewElement(element: HTMLElement): void {
  // Enhance buttons
  if (element.tagName === 'BUTTON' && !element.hasAttribute('aria-label') && !element.textContent?.trim()) {
    const icon = element.querySelector('svg, img, i[class*="icon"]');
    if (icon) {
      element.setAttribute('aria-label', 'Button');
    }
  }

  // Enhance inputs
  if (element.tagName === 'INPUT' && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
    const input = element as HTMLInputElement;
    if (input.placeholder && !input.labels?.length) {
      input.setAttribute('aria-label', input.placeholder);
    }
  }

  // Enhance images
  if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
    element.setAttribute('alt', '');
  }

  // Recursively enhance child elements
  const childButtons = element.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  const childInputs = element.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  const childImages = element.querySelectorAll('img:not([alt])');

  childButtons.forEach((button: Element) => {
    if (button instanceof HTMLElement && !button.textContent?.trim()) {
      const icon = button.querySelector('svg, img, i[class*="icon"]');
      if (icon) {
        button.setAttribute('aria-label', 'Button');
      }
    }
  });

  childInputs.forEach((input: Element) => {
    if (input instanceof HTMLInputElement && input.placeholder && !input.labels?.length) {
      input.setAttribute('aria-label', input.placeholder);
    }
  });

  childImages.forEach((img: Element) => {
    if (img instanceof HTMLImageElement) {
      img.setAttribute('alt', '');
    }
  });
}

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
    if (typeof window === 'undefined') return false;
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