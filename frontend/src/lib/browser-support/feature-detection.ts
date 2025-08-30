// Feature detection utilities for graceful degradation

export interface BrowserCapabilities {
  cssGrid: boolean;
  flexbox: boolean;
  customProperties: boolean;
  transforms: boolean;
  animations: boolean;
  webAnimations: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  touchEvents: boolean;
  pointerEvents: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  fetch: boolean;
  es6: boolean;
  reducedMotion: boolean;
}

export function detectBrowserCapabilities(): BrowserCapabilities {
  if (typeof window === 'undefined') {
    // Server-side rendering - assume modern browser
    return {
      cssGrid: true,
      flexbox: true,
      customProperties: true,
      transforms: true,
      animations: true,
      webAnimations: true,
      intersectionObserver: true,
      resizeObserver: true,
      touchEvents: false,
      pointerEvents: true,
      localStorage: true,
      sessionStorage: true,
      fetch: true,
      es6: true,
      reducedMotion: false
    };
  }

  return {
    cssGrid: CSS.supports('display', 'grid'),
    flexbox: CSS.supports('display', 'flex'),
    customProperties: CSS.supports('color', 'var(--fake-var)'),
    transforms: CSS.supports('transform', 'translateX(1px)'),
    animations: CSS.supports('animation-name', 'test'),
    webAnimations: 'animate' in document.createElement('div'),
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    touchEvents: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pointerEvents: 'onpointerdown' in window,
    localStorage: (() => {
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        const test = '__sessionStorage_test__';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    fetch: 'fetch' in window,
    es6: (() => {
      try {
        // Test arrow functions
        new Function('() => {}');
        // Test template literals
        new Function('`template`');
        // Test const/let
        new Function('const test = 1');
        return true;
      } catch {
        return false;
      }
    })(),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
}

export function createFallbackStyles(capabilities: BrowserCapabilities): string {
  let fallbackCSS = '';

  // CSS Grid fallback
  if (!capabilities.cssGrid) {
    fallbackCSS += `
      .grid-fallback {
        display: flex;
        flex-wrap: wrap;
      }
      .grid-fallback > * {
        flex: 1 1 auto;
        min-width: 250px;
      }
    `;
  }

  // Flexbox fallback
  if (!capabilities.flexbox) {
    fallbackCSS += `
      .flex-fallback {
        display: block;
      }
      .flex-fallback::after {
        content: "";
        display: table;
        clear: both;
      }
      .flex-fallback > * {
        float: left;
        width: 50%;
      }
    `;
  }

  // Animation fallbacks
  if (!capabilities.animations || capabilities.reducedMotion) {
    fallbackCSS += `
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
  }

  // Transform fallbacks
  if (!capabilities.transforms) {
    fallbackCSS += `
      .transform-fallback {
        position: relative;
      }
      .transform-fallback.translate-x {
        left: 10px;
      }
      .transform-fallback.translate-y {
        top: 10px;
      }
    `;
  }

  return fallbackCSS;
}

export function applyFallbacks(capabilities: BrowserCapabilities): void {
  if (typeof document === 'undefined') return;

  // Apply fallback CSS
  const fallbackStyles = createFallbackStyles(capabilities);
  if (fallbackStyles) {
    const styleElement = document.createElement('style');
    styleElement.textContent = fallbackStyles;
    document.head.appendChild(styleElement);
  }

  // Add capability classes to body
  const bodyClasses = [];
  
  if (!capabilities.cssGrid) bodyClasses.push('no-css-grid');
  if (!capabilities.flexbox) bodyClasses.push('no-flexbox');
  if (!capabilities.customProperties) bodyClasses.push('no-custom-properties');
  if (!capabilities.transforms) bodyClasses.push('no-transforms');
  if (!capabilities.animations) bodyClasses.push('no-animations');
  if (capabilities.touchEvents) bodyClasses.push('touch-device');
  if (capabilities.reducedMotion) bodyClasses.push('reduced-motion');

  document.body.classList.add(...bodyClasses);
}

export function getAnimationConfig(capabilities: BrowserCapabilities) {
  if (!capabilities.animations || capabilities.reducedMotion) {
    return {
      duration: 0,
      easing: 'linear',
      disabled: true
    };
  }

  return {
    duration: capabilities.webAnimations ? 300 : 150, // Shorter for CSS-only
    easing: capabilities.webAnimations ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'ease-out',
    disabled: false
  };
}

export function createCompatibleEventListener(
  element: Element,
  eventType: string,
  handler: EventListener,
  capabilities: BrowserCapabilities
): () => void {
  // Use pointer events if available, otherwise fall back to mouse/touch
  if (eventType === 'click' && capabilities.pointerEvents) {
    element.addEventListener('pointerdown', handler);
    return () => element.removeEventListener('pointerdown', handler);
  }

  if (eventType === 'click' && capabilities.touchEvents) {
    element.addEventListener('touchstart', handler);
    element.addEventListener('click', handler);
    return () => {
      element.removeEventListener('touchstart', handler);
      element.removeEventListener('click', handler);
    };
  }

  element.addEventListener(eventType, handler);
  return () => element.removeEventListener(eventType, handler);
}

// Initialize browser capabilities on load
let browserCapabilities: BrowserCapabilities | null = null;

export function getBrowserCapabilities(): BrowserCapabilities {
  if (!browserCapabilities) {
    browserCapabilities = detectBrowserCapabilities();
    applyFallbacks(browserCapabilities);
  }
  return browserCapabilities;
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  getBrowserCapabilities();
}