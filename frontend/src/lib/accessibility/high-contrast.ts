/**
 * High Contrast Mode Support
 * Provides comprehensive high contrast theme support with appropriate color adjustments
 */

export interface HighContrastColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  focus: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  disabled: string;
  link: string;
  linkVisited: string;
  linkHover: string;
}

/**
 * High contrast color schemes
 */
export const HIGH_CONTRAST_THEMES: Record<string, HighContrastColors> = {
  dark: {
    background: '#000000',
    foreground: '#ffffff',
    primary: '#ffffff',
    secondary: '#cccccc',
    accent: '#ffff00',
    border: '#ffffff',
    focus: '#ffff00',
    error: '#ff6b6b',
    warning: '#ffd93d',
    success: '#51cf66',
    info: '#74c0fc',
    disabled: '#666666',
    link: '#74c0fc',
    linkVisited: '#da77f2',
    linkHover: '#91a7ff'
  },
  light: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#000000',
    secondary: '#333333',
    accent: '#0066cc',
    border: '#000000',
    focus: '#0066cc',
    error: '#d63031',
    warning: '#e17055',
    success: '#00b894',
    info: '#0984e3',
    disabled: '#999999',
    link: '#0066cc',
    linkVisited: '#6c5ce7',
    linkHover: '#0052a3'
  },
  yellow: {
    background: '#ffff00',
    foreground: '#000000',
    primary: '#000000',
    secondary: '#333333',
    accent: '#0000ff',
    border: '#000000',
    focus: '#0000ff',
    error: '#cc0000',
    warning: '#ff6600',
    success: '#006600',
    info: '#0066cc',
    disabled: '#666666',
    link: '#0000ff',
    linkVisited: '#800080',
    linkHover: '#000080'
  }
};

/**
 * High contrast mode manager
 */
export class HighContrastManager {
  private currentTheme: string | null = null;
  private mediaQuery: MediaQueryList | undefined;
  private styleElement: HTMLStyleElement | null = null;
  private observers: Array<(enabled: boolean, theme: string | null) => void> = [];

  constructor() {
    // Only initialize if we're in the browser
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-contrast: high)');
      this.init();
    }
  }

  private init(): void {
    // Only proceed if we have mediaQuery (browser environment)
    if (!this.mediaQuery) return;

    // Listen for system preference changes
    this.mediaQuery.addEventListener('change', this.handleSystemPreferenceChange);

    // Check for saved user preference
    const savedTheme = localStorage.getItem('high-contrast-theme');
    if (savedTheme && HIGH_CONTRAST_THEMES[savedTheme]) {
      this.enableHighContrast(savedTheme);
    } else if (this.mediaQuery.matches) {
      // Use system preference
      this.enableHighContrast('dark');
    }

    // Create style element for dynamic styles
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'high-contrast-styles';
    document.head.appendChild(this.styleElement);
  }

  private handleSystemPreferenceChange = (event: MediaQueryListEvent): void => {
    if (event.matches && !this.currentTheme) {
      this.enableHighContrast('dark');
    } else if (!event.matches && this.currentTheme && !localStorage.getItem('high-contrast-theme')) {
      this.disableHighContrast();
    }
  };

  /**
   * Enable high contrast mode with specified theme
   */
  public enableHighContrast(theme: string): void {
    if (!HIGH_CONTRAST_THEMES[theme]) {
      console.warn(`High contrast theme "${theme}" not found`);
      return;
    }

    this.currentTheme = theme;
    const colors = HIGH_CONTRAST_THEMES[theme];

    // Apply CSS custom properties
    this.applyCSSVariables(colors);

    // Apply additional styles
    this.applyHighContrastStyles(colors);

    // Add high contrast class to body
    document.body.classList.add('high-contrast', `high-contrast-${theme}`);

    // Save preference
    localStorage.setItem('high-contrast-theme', theme);

    // Notify observers
    this.notifyObservers(true, theme);
  }

  /**
   * Disable high contrast mode
   */
  public disableHighContrast(): void {
    this.currentTheme = null;

    // Remove CSS custom properties
    this.removeCSSVariables();

    // Remove high contrast classes
    document.body.classList.remove('high-contrast');
    document.body.className = document.body.className.replace(/high-contrast-\w+/g, '');

    // Clear saved preference
    localStorage.removeItem('high-contrast-theme');

    // Clear dynamic styles
    if (this.styleElement) {
      this.styleElement.textContent = '';
    }

    // Notify observers
    this.notifyObservers(false, null);
  }

  /**
   * Toggle high contrast mode
   */
  public toggleHighContrast(theme: string = 'dark'): void {
    if (this.currentTheme) {
      this.disableHighContrast();
    } else {
      this.enableHighContrast(theme);
    }
  }

  /**
   * Get current high contrast state
   */
  public isHighContrastEnabled(): boolean {
    return this.currentTheme !== null;
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): string | null {
    return this.currentTheme;
  }

  /**
   * Get available themes
   */
  public getAvailableThemes(): string[] {
    return Object.keys(HIGH_CONTRAST_THEMES);
  }

  /**
   * Apply CSS custom properties for high contrast colors
   */
  private applyCSSVariables(colors: HighContrastColors): void {
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--hc-${key}`, value);
    });
  }

  /**
   * Remove CSS custom properties
   */
  private removeCSSVariables(): void {
    const root = document.documentElement;
    
    Object.keys(HIGH_CONTRAST_THEMES.dark).forEach(key => {
      root.style.removeProperty(`--hc-${key}`);
    });
  }

  /**
   * Apply additional high contrast styles
   */
  private applyHighContrastStyles(colors: HighContrastColors): void {
    if (!this.styleElement) return;

    const styles = `
      .high-contrast {
        /* Base styles */
        background-color: ${colors.background} !important;
        color: ${colors.foreground} !important;
      }

      .high-contrast *:not(svg):not(path):not(circle):not(rect):not(line):not(polygon) {
        background-color: inherit !important;
        color: inherit !important;
        border-color: ${colors.border} !important;
      }

      /* Enhanced contrast for specific elements */
      .high-contrast .bg-white,
      .high-contrast .bg-gray-50,
      .high-contrast .bg-gray-100 {
        background-color: ${colors.background} !important;
      }

      .high-contrast .text-gray-600,
      .high-contrast .text-gray-700,
      .high-contrast .text-gray-800,
      .high-contrast .text-gray-900 {
        color: ${colors.foreground} !important;
      }

      .high-contrast .border-gray-200,
      .high-contrast .border-gray-300 {
        border-color: ${colors.border} !important;
      }

      /* Focus styles */
      .high-contrast *:focus,
      .high-contrast *:focus-visible {
        outline: 3px solid ${colors.focus} !important;
        outline-offset: 2px !important;
      }

      /* Button styles */
      .high-contrast button,
      .high-contrast [role="button"] {
        background-color: ${colors.primary} !important;
        color: ${colors.background} !important;
        border: 2px solid ${colors.border} !important;
      }

      .high-contrast button:hover,
      .high-contrast [role="button"]:hover {
        background-color: ${colors.accent} !important;
        color: ${colors.background} !important;
      }

      .high-contrast button:disabled,
      .high-contrast [role="button"][aria-disabled="true"] {
        background-color: ${colors.disabled} !important;
        color: ${colors.background} !important;
        opacity: 0.6 !important;
      }

      /* Link styles */
      .high-contrast a,
      .high-contrast [role="link"] {
        color: ${colors.link} !important;
        text-decoration: underline !important;
      }

      .high-contrast a:visited {
        color: ${colors.linkVisited} !important;
      }

      .high-contrast a:hover,
      .high-contrast a:focus {
        color: ${colors.linkHover} !important;
        background-color: ${colors.accent} !important;
      }

      /* Form elements */
      .high-contrast input,
      .high-contrast textarea,
      .high-contrast select {
        background-color: ${colors.background} !important;
        color: ${colors.foreground} !important;
        border: 2px solid ${colors.border} !important;
      }

      .high-contrast input:focus,
      .high-contrast textarea:focus,
      .high-contrast select:focus {
        border-color: ${colors.focus} !important;
        box-shadow: 0 0 0 2px ${colors.focus} !important;
      }

      /* Status colors */
      .high-contrast .error,
      .high-contrast [aria-invalid="true"] {
        color: ${colors.error} !important;
        border-color: ${colors.error} !important;
      }

      .high-contrast .warning {
        color: ${colors.warning} !important;
        border-color: ${colors.warning} !important;
      }

      .high-contrast .success {
        color: ${colors.success} !important;
        border-color: ${colors.success} !important;
      }

      .high-contrast .info {
        color: ${colors.info} !important;
        border-color: ${colors.info} !important;
      }

      /* Remove shadows and gradients */
      .high-contrast * {
        box-shadow: none !important;
        text-shadow: none !important;
        background-image: none !important;
      }

      /* Ensure sufficient contrast for icons */
      .high-contrast svg,
      .high-contrast img {
        filter: contrast(1000%) !important;
      }

      /* Modal and overlay styles */
      .high-contrast [role="dialog"],
      .high-contrast .modal {
        background-color: ${colors.background} !important;
        border: 3px solid ${colors.border} !important;
      }

      /* Table styles */
      .high-contrast table {
        border-collapse: collapse !important;
      }

      .high-contrast th,
      .high-contrast td {
        border: 1px solid ${colors.border} !important;
        padding: 8px !important;
      }

      .high-contrast th {
        background-color: ${colors.primary} !important;
        color: ${colors.background} !important;
      }

      /* Progress and loading indicators */
      .high-contrast [role="progressbar"] {
        background-color: ${colors.disabled} !important;
        border: 1px solid ${colors.border} !important;
      }

      .high-contrast [role="progressbar"] > * {
        background-color: ${colors.accent} !important;
      }

      /* Enhanced visibility for interactive elements */
      .high-contrast [role="tab"] {
        border: 2px solid ${colors.border} !important;
        background-color: ${colors.background} !important;
      }

      .high-contrast [role="tab"][aria-selected="true"] {
        background-color: ${colors.accent} !important;
        color: ${colors.background} !important;
      }

      .high-contrast [role="menuitem"]:hover,
      .high-contrast [role="menuitem"]:focus {
        background-color: ${colors.accent} !important;
        color: ${colors.background} !important;
      }

      /* Card and panel enhancements */
      .high-contrast .card,
      .high-contrast .panel,
      .high-contrast [role="region"] {
        border: 2px solid ${colors.border} !important;
        background-color: ${colors.background} !important;
      }

      /* Dropdown and select enhancements */
      .high-contrast select,
      .high-contrast [role="listbox"] {
        border: 2px solid ${colors.border} !important;
        background-color: ${colors.background} !important;
      }

      .high-contrast option:hover,
      .high-contrast [role="option"]:hover {
        background-color: ${colors.accent} !important;
        color: ${colors.background} !important;
      }

      /* Animation and transition overrides for high contrast */
      .high-contrast * {
        transition: none !important;
        animation: none !important;
      }

      /* Ensure text remains readable in all states */
      .high-contrast .text-blue-600,
      .high-contrast .text-purple-600,
      .high-contrast .text-green-600,
      .high-contrast .text-red-600,
      .high-contrast .text-yellow-600 {
        color: ${colors.foreground} !important;
      }

      /* High contrast mode indicator */
      .high-contrast::before {
        content: "High Contrast Mode Active";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: ${colors.accent};
        color: ${colors.background};
        text-align: center;
        padding: 4px;
        font-size: 12px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
      }
    `;

    this.styleElement.textContent = styles;
  }

  /**
   * Add observer for high contrast changes
   */
  public addObserver(callback: (enabled: boolean, theme: string | null) => void): void {
    this.observers.push(callback);
  }

  /**
   * Remove observer
   */
  public removeObserver(callback: (enabled: boolean, theme: string | null) => void): void {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notify all observers of changes
   */
  private notifyObservers(enabled: boolean, theme: string | null): void {
    this.observers.forEach(callback => callback(enabled, theme));
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemPreferenceChange);
    }
    
    if (this.styleElement) {
      this.styleElement.remove();
    }

    this.observers = [];
  }
}

/**
 * Create high contrast toggle component
 */
export function createHighContrastToggle(manager: HighContrastManager): HTMLDivElement {
  const container = document.createElement('div');
  const label = document.createElement('label');
  const select = document.createElement('select');
  const offOption = document.createElement('option');

  // Setup elements
  label.textContent = 'High Contrast Mode:';
  label.htmlFor = 'high-contrast-select';
  
  select.id = 'high-contrast-select';
  select.setAttribute('aria-label', 'Select high contrast theme');

  offOption.value = '';
  offOption.textContent = 'Off';
  select.appendChild(offOption);

  // Add theme options
  manager.getAvailableThemes().forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    select.appendChild(option);
  });

  // Set current value
  select.value = manager.getCurrentTheme() || '';

  // Handle changes
  select.addEventListener('change', () => {
    if (select.value) {
      manager.enableHighContrast(select.value);
    } else {
      manager.disableHighContrast();
    }
  });

  // Update when manager changes
  manager.addObserver((enabled, theme) => {
    select.value = theme || '';
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}

/**
 * Global high contrast manager instance
 */
export const highContrastManager = new HighContrastManager();