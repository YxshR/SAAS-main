/**
 * Accessibility Library Unit Tests
 */

import { 
  getFocusableElements, 
  setAriaAttributes, 
  a11yTest,
  initializeAccessibility 
} from '../accessibility'

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('Accessibility Library', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('getFocusableElements', () => {
    test('should find focusable elements', () => {
      document.body.innerHTML = `
        <div>
          <button>Button 1</button>
          <a href="#">Link 1</a>
          <input type="text" />
          <button disabled>Disabled Button</button>
          <div tabindex="0">Focusable Div</div>
          <div tabindex="-1">Non-focusable Div</div>
        </div>
      `

      const focusableElements = getFocusableElements(document.body)
      expect(focusableElements).toHaveLength(4) // button, link, input, focusable div
    })

    test('should exclude hidden elements', () => {
      document.body.innerHTML = `
        <div>
          <button>Visible Button</button>
          <button style="display: none">Hidden Button</button>
          <button style="visibility: hidden">Invisible Button</button>
        </div>
      `

      const focusableElements = getFocusableElements(document.body)
      expect(focusableElements).toHaveLength(1)
    })
  })

  describe('setAriaAttributes', () => {
    test('should set ARIA attributes on element', () => {
      const element = document.createElement('div')
      
      setAriaAttributes(element, {
        'aria-label': 'Test Label',
        'aria-expanded': true,
        'aria-hidden': false,
        role: 'button'
      })

      expect(element.getAttribute('aria-label')).toBe('Test Label')
      expect(element.getAttribute('aria-expanded')).toBe('true')
      expect(element.getAttribute('aria-hidden')).toBe('false')
      expect(element.getAttribute('role')).toBe('button')
    })

    test('should skip undefined values', () => {
      const element = document.createElement('div')
      
      setAriaAttributes(element, {
        'aria-label': 'Test Label',
        'aria-expanded': undefined,
        'aria-hidden': null
      })

      expect(element.getAttribute('aria-label')).toBe('Test Label')
      expect(element.hasAttribute('aria-expanded')).toBe(false)
      expect(element.hasAttribute('aria-hidden')).toBe(false)
    })
  })

  describe('a11yTest', () => {
    test('should check ARIA labels', () => {
      document.body.innerHTML = `
        <div>
          <button>Labeled Button</button>
          <button aria-label="ARIA Labeled Button"></button>
          <button></button>
          <input type="text" />
          <label for="test-input">Test Input</label>
          <input type="text" id="test-input" />
        </div>
      `

      const result = a11yTest.checkAriaLabels(document.body)
      expect(result).toBe(false) // Should fail due to unlabeled button and input
    })

    test('should check keyboard navigation', () => {
      document.body.innerHTML = `
        <div>
          <button>Button 1</button>
          <button tabindex="-1">Button 2</button>
          <button tabindex="0">Button 3</button>
        </div>
      `

      const result = a11yTest.checkKeyboardNavigation(document.body)
      expect(result).toBe(false) // Should fail due to negative tabindex without aria-hidden
    })

    test('should check heading structure', () => {
      document.body.innerHTML = `
        <div>
          <h1>Main Heading</h1>
          <h2>Subheading</h2>
          <h3>Sub-subheading</h3>
        </div>
      `

      const result = a11yTest.checkHeadingStructure()
      expect(result).toBe(true) // Should pass with proper hierarchy
    })

    test('should fail with skipped heading levels', () => {
      document.body.innerHTML = `
        <div>
          <h1>Main Heading</h1>
          <h3>Skipped h2</h3>
        </div>
      `

      const result = a11yTest.checkHeadingStructure()
      expect(result).toBe(false) // Should fail due to skipped h2
    })

    test('should check landmarks', () => {
      document.body.innerHTML = `
        <div>
          <main>Main content</main>
          <nav>Navigation</nav>
        </div>
      `

      const result = a11yTest.checkLandmarks()
      expect(result).toBe(true) // Should pass with main landmark
    })

    test('should fail without main landmark', () => {
      document.body.innerHTML = `
        <div>
          <nav>Navigation</nav>
        </div>
      `

      const result = a11yTest.checkLandmarks()
      expect(result).toBe(false) // Should fail without main landmark
    })

    test('should run comprehensive audit', () => {
      document.body.innerHTML = `
        <div>
          <h1>Main Heading</h1>
          <main>
            <button>Accessible Button</button>
            <nav>Navigation</nav>
          </main>
        </div>
      `

      const results = a11yTest.auditPage()
      
      expect(results).toHaveProperty('ariaLabels')
      expect(results).toHaveProperty('keyboardNavigation')
      expect(results).toHaveProperty('colorContrast')
      expect(results).toHaveProperty('headingStructure')
      expect(results).toHaveProperty('landmarks')
      
      expect(results.headingStructure).toBe(true)
      expect(results.landmarks).toBe(true)
    })
  })

  describe('initializeAccessibility', () => {
    test('should initialize accessibility features', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      initializeAccessibility({
        enableHighContrast: true,
        enableFocusManagement: true,
        enableKeyboardNavigation: true,
        skipLinks: true
      })

      expect(consoleSpy).toHaveBeenCalledWith('High contrast support enabled')
      expect(consoleSpy).toHaveBeenCalledWith('Focus management enabled')
      
      consoleSpy.mockRestore()
    })

    test('should add skip links to page', () => {
      document.body.innerHTML = `
        <div>
          <main id="main-content">Main content</main>
          <nav id="navigation">Navigation</nav>
        </div>
      `

      initializeAccessibility({ skipLinks: true })

      const skipLinks = document.querySelector('.skip-links')
      expect(skipLinks).toBeTruthy()
      
      const skipLinksCount = skipLinks?.querySelectorAll('a').length
      expect(skipLinksCount).toBeGreaterThan(0)
    })

    test('should add live regions', () => {
      initializeAccessibility({ enableLiveRegions: true })

      const politeRegion = document.getElementById('aria-live-polite')
      const assertiveRegion = document.getElementById('aria-live-assertive')

      expect(politeRegion).toBeTruthy()
      expect(assertiveRegion).toBeTruthy()
      expect(politeRegion?.getAttribute('aria-live')).toBe('polite')
      expect(assertiveRegion?.getAttribute('aria-live')).toBe('assertive')
    })

    test('should enhance existing elements', () => {
      document.body.innerHTML = `
        <div>
          <button></button>
          <input type="text" placeholder="Enter text" />
          <img />
          <main>Main content</main>
          <nav>Navigation</nav>
        </div>
      `

      initializeAccessibility({ enableAriaEnhancements: true })

      const button = document.querySelector('button')
      const input = document.querySelector('input')
      const img = document.querySelector('img')
      const main = document.querySelector('main')
      const nav = document.querySelector('nav')

      // Check that elements were enhanced
      expect(input?.getAttribute('aria-label')).toBe('Enter text')
      expect(img?.hasAttribute('alt')).toBe(true)
      expect(main?.getAttribute('role')).toBe('main')
      expect(nav?.getAttribute('aria-label')).toBeTruthy()
    })
  })

  describe('Accessibility Styles', () => {
    test('should add accessibility styles to page', () => {
      initializeAccessibility()

      const styleElement = document.getElementById('accessibility-styles')
      expect(styleElement).toBeTruthy()
      expect(styleElement?.textContent).toContain('.sr-only')
      expect(styleElement?.textContent).toContain('.skip-links')
    })
  })

  describe('Keyboard Navigation Enhancement', () => {
    test('should add keyboard navigation classes', () => {
      initializeAccessibility({ enableKeyboardNavigation: true })

      // Simulate Tab key press
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      document.dispatchEvent(tabEvent)

      expect(document.body.classList.contains('keyboard-navigation')).toBe(true)

      // Simulate mouse down
      const mouseEvent = new MouseEvent('mousedown')
      document.dispatchEvent(mouseEvent)

      expect(document.body.classList.contains('keyboard-navigation')).toBe(false)
    })

    test('should handle Escape key for modals', () => {
      document.body.innerHTML = `
        <div role="dialog" aria-modal="true">
          <button class="close-button">Close</button>
        </div>
      `

      initializeAccessibility({ enableKeyboardNavigation: true })

      const closeButton = document.querySelector('.close-button') as HTMLButtonElement
      const clickSpy = jest.spyOn(closeButton, 'click')

      // Simulate Escape key press
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)

      expect(clickSpy).toHaveBeenCalled()
      clickSpy.mockRestore()
    })
  })
})