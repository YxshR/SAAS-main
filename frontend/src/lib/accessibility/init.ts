/**
 * Accessibility Initialization
 * Simple wrapper for initializing accessibility features
 */

import { highContrastManager } from './high-contrast';
import { focusManager } from './focus-management';
import { createSkipLink, announceToScreenReader } from './keyboard-navigation';

export interface AccessibilityOptions {
  enableHighContrast?: boolean;
  enableFocusManagement?: boolean;
  enableKeyboardNavigation?: boolean;
  skipLinks?: boolean;
  enableLiveRegions?: boolean;
  enableAriaEnhancements?: boolean;
}

/**
 * Initialize accessibility features
 */
export function initializeAccessibility(options: AccessibilityOptions = {}): void {
  const {
    enableHighContrast = true,
    enableFocusManagement = true,
    enableKeyboardNavigation = true,
    skipLinks = true,
    enableLiveRegions = true,
    enableAriaEnhancements = true
  } = options;

  console.log('Initializing accessibility features...');

  // Add skip links to the page
  if (skipLinks) {
    addSkipLinksToPage();
  }

  // Initialize high contrast if system preference is set
  if (enableHighContrast) {
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

  console.log('Accessibility features initialized successfully');
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