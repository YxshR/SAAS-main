# Accessibility Implementation

This directory contains a comprehensive accessibility implementation that ensures WCAG 2.1 AA compliance across the application.

## Features Implemented

### ✅ Keyboard Navigation
- **Proper Tab Order**: All interactive elements are keyboard accessible with logical tab order
- **Focus Management**: Advanced focus management for modals, dynamic content, and complex interactions
- **Focus Trapping**: Modal dialogs trap focus within their boundaries
- **Roving Tab Index**: Efficient navigation within component groups (menus, toolbars, tabs)
- **Skip Links**: Quick navigation to main content areas
- **Keyboard Shortcuts**: Global shortcuts for common actions (Alt+1 for main content, Ctrl+/ for help)

### ✅ ARIA Labels and Semantic Markup
- **Comprehensive ARIA Support**: Full implementation of ARIA attributes for screen reader compatibility
- **Semantic HTML**: Proper use of semantic elements (main, nav, header, footer, section, article)
- **Live Regions**: Dynamic content announcements for screen readers
- **Accessible Forms**: Proper labeling, validation, and error handling
- **Accessible Tables**: Headers, captions, and proper table structure
- **Accessible Modals**: Proper dialog implementation with focus management

### ✅ High Contrast Mode Support
- **Multiple Themes**: Dark, light, and yellow high contrast themes
- **System Integration**: Respects user's system preferences
- **Dynamic Switching**: Runtime theme switching with proper announcements
- **Enhanced Visibility**: Improved borders, focus indicators, and color adjustments
- **Animation Overrides**: Disables animations in high contrast mode for better performance

### ✅ Focus Management System
- **Modal Focus Management**: Automatic focus trapping and restoration for dialogs
- **Dynamic Content Focus**: Proper focus handling for dynamically added content
- **SPA Navigation**: Focus management for single-page application navigation
- **Form Validation Focus**: Automatic focus on first invalid field
- **Focus Stack**: Nested focus context management

## Implementation Details

### Core Components

#### 1. Keyboard Navigation (`keyboard-navigation.ts`)
```typescript
// Get all focusable elements
const focusableElements = getFocusableElements(container)

// Create focus trap for modal
const trap = new FocusTrap(modal, { autoFocus: true })
trap.activate()

// Roving tab index for menus
const rovingTabIndex = new RovingTabIndex(menu, '[role="menuitem"]')
```

#### 2. ARIA Utilities (`aria-utils.ts`)
```typescript
// Set ARIA attributes
setAriaAttributes(element, {
  'aria-label': 'Close dialog',
  'aria-expanded': false,
  'aria-controls': 'menu-content'
})

// Create accessible button
const button = createAccessibleButton('Save', handleSave, {
  ariaLabel: 'Save document',
  disabled: false
})
```

#### 3. High Contrast Manager (`high-contrast.ts`)
```typescript
// Enable high contrast mode
highContrastManager.enableHighContrast('dark')

// Listen for changes
highContrastManager.addObserver((enabled, theme) => {
  console.log(`High contrast ${enabled ? 'enabled' : 'disabled'}: ${theme}`)
})
```

#### 4. Focus Manager (`focus-management.ts`)
```typescript
// Manage modal focus
const cleanup = focusManager.manageModalFocus(modal, {
  autoFocus: true,
  restoreFocus: true
})

// Handle SPA navigation
focusManager.handleSPANavigation(newPage, {
  focusHeading: true,
  announceNavigation: true
})
```

### React Integration

#### Hooks (`use-accessibility.ts`)
```typescript
// Focus management hook
const modalRef = useFocusManagement({ trapFocus: true, autoFocus: true })

// High contrast hook
const { isEnabled, enableHighContrast, disableHighContrast } = useHighContrast()

// Screen reader announcements
const { announce } = useScreenReader()
announce('Form saved successfully', 'polite')

// Keyboard navigation
const containerRef = useKeyboardNavigation({
  onEscape: () => closeModal(),
  onEnter: () => submitForm()
})
```

#### Components
```typescript
// Accessibility Provider
<AccessibilityProvider>
  <App />
</AccessibilityProvider>

// Accessibility Settings
<AccessibilitySettings />

// Development Testing
<AccessibilityTester />
```

### CSS Classes and Styles

#### Screen Reader Only Content
```css
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
```

#### Skip Links
```css
.skip-links a {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
}

.skip-links a:focus {
  top: 0;
}
```

#### Keyboard Navigation
```css
.keyboard-navigation *:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

#### High Contrast Mode
```css
.high-contrast {
  background-color: var(--hc-background) !important;
  color: var(--hc-foreground) !important;
}

.high-contrast button {
  background-color: var(--hc-primary) !important;
  color: var(--hc-background) !important;
  border: 2px solid var(--hc-border) !important;
}
```

## Testing

### Automated Testing
- **Unit Tests**: Comprehensive test coverage for all accessibility utilities
- **Integration Tests**: End-to-end accessibility testing with Playwright
- **Visual Regression**: Automated testing of high contrast modes
- **Performance Tests**: Animation performance monitoring

### Manual Testing Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] Screen reader announcements are appropriate
- [ ] High contrast mode works correctly
- [ ] Skip links function properly
- [ ] Form validation is accessible
- [ ] Modal focus management works
- [ ] Dynamic content is announced

### Testing Tools
```typescript
// Run accessibility audit
const results = a11yTest.auditPage()
console.log(results) // { ariaLabels: true, keyboardNavigation: true, ... }

// Check specific elements
const hasProperLabels = a11yTest.checkAriaLabels(container)
const hasKeyboardAccess = a11yTest.checkKeyboardNavigation(container)
```

## Usage Examples

### Basic Setup
```typescript
import { initializeAccessibility } from '@/lib/accessibility'

// Initialize all accessibility features
initializeAccessibility({
  enableHighContrast: true,
  enableFocusManagement: true,
  enableKeyboardNavigation: true,
  skipLinks: true,
  enableLiveRegions: true,
  enableAriaEnhancements: true
})
```

### Modal Implementation
```typescript
import { useFocusManagement, useKeyboardNavigation } from '@/hooks/use-accessibility'

function Modal({ isOpen, onClose, children }) {
  const modalRef = useFocusManagement({ 
    trapFocus: isOpen, 
    autoFocus: isOpen 
  })
  
  const keyboardRef = useKeyboardNavigation({
    onEscape: onClose
  })

  return isOpen ? (
    <div 
      ref={(el) => {
        modalRef.current = el
        keyboardRef.current = el
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose} aria-label="Close modal">×</button>
    </div>
  ) : null
}
```

### Form Accessibility
```typescript
import { useFormAccessibility } from '@/hooks/use-accessibility'

function ContactForm() {
  const { formRef, handleValidationErrors, setFieldError } = useFormAccessibility()

  const handleSubmit = (data) => {
    const errors = validateForm(data)
    if (errors.length > 0) {
      handleValidationErrors(errors)
      return
    }
    // Submit form
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          aria-required="true"
        />
      </div>
      <button type="submit">Send Message</button>
    </form>
  )
}
```

### High Contrast Settings
```typescript
import { useHighContrast } from '@/hooks/use-accessibility'

function AccessibilitySettings() {
  const { 
    isEnabled, 
    currentTheme, 
    availableThemes, 
    enableHighContrast, 
    disableHighContrast 
  } = useHighContrast()

  return (
    <div>
      <h3>High Contrast Mode</h3>
      <label>
        <input 
          type="radio" 
          name="contrast" 
          value="" 
          checked={!isEnabled}
          onChange={() => disableHighContrast()}
        />
        Off
      </label>
      {availableThemes.map(theme => (
        <label key={theme}>
          <input 
            type="radio" 
            name="contrast" 
            value={theme}
            checked={isEnabled && currentTheme === theme}
            onChange={() => enableHighContrast(theme)}
          />
          {theme} Theme
        </label>
      ))}
    </div>
  )
}
```

## Browser Support

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Screen Readers**: NVDA, JAWS, VoiceOver, TalkBack
- **Keyboard Navigation**: All modern browsers
- **High Contrast**: Windows High Contrast, macOS Increase Contrast

## Performance Considerations

- **Lazy Loading**: Accessibility features are loaded on demand
- **Event Delegation**: Efficient event handling for large DOMs
- **Debounced Updates**: Optimized for dynamic content changes
- **Memory Management**: Proper cleanup of event listeners and observers

## Compliance

This implementation meets or exceeds:
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines Level AA
- **Section 508**: US Federal accessibility requirements
- **ADA**: Americans with Disabilities Act compliance
- **EN 301 549**: European accessibility standard

## Development Tools

### Accessibility Tester (Development Only)
```typescript
import { AccessibilityTester } from '@/components/accessibility/accessibility-tester'

// Add to your development environment
<AccessibilityTester />
```

### Console Commands
```javascript
// Run accessibility audit in browser console
window.a11yTest.auditPage()

// Check specific element
window.a11yTest.checkAriaLabels(document.querySelector('.my-component'))

// Enable high contrast mode
window.highContrastManager.enableHighContrast('dark')
```

## Contributing

When adding new components or features:

1. **Use Semantic HTML**: Start with proper semantic elements
2. **Add ARIA Attributes**: Use the provided utilities for consistent implementation
3. **Test Keyboard Navigation**: Ensure all functionality is keyboard accessible
4. **Test with Screen Readers**: Verify announcements and navigation
5. **Test High Contrast**: Ensure visibility in all contrast modes
6. **Add Tests**: Include accessibility tests for new features

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Accessibility Developer Tools](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb)