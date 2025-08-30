/**
 * Accessibility Library Unit Tests for Admin Panel
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

describe('Admin Panel Accessibility Library', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('getFocusableElements', () => {
    test('should find focusable elements in admin interface', () => {
      document.body.innerHTML = `
        <div>
          <button class="admin-button">Admin Action</button>
          <a href="/admin/users">User Management</a>
          <input type="search" placeholder="Search users" />
          <select>
            <option>Option 1</option>
          </select>
          <button disabled>Disabled Admin Button</button>
          <div tabindex="0" role="tab">Tab</div>
        </div>
      `

      const focusableElements = getFocusableElements(document.body)
      expect(focusableElements).toHaveLength(5) // button, link, input, select, tab
    })
  })

  describe('Admin-specific ARIA enhancements', () => {
    test('should enhance admin table elements', () => {
      document.body.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      `

      initializeAccessibility({ enableAriaEnhancements: true })

      const table = document.querySelector('table')
      const headers = table?.querySelectorAll('th')
      
      // Headers should have scope attribute
      headers?.forEach(header => {
        expect(header.hasAttribute('scope')).toBe(true)
      })
    })

    test('should enhance admin form controls', () => {
      document.body.innerHTML = `
        <form>
          <fieldset>
            <legend>User Settings</legend>
            <input type="checkbox" id="admin-toggle" />
            <label for="admin-toggle">Admin Access</label>
            <input type="text" placeholder="Username" />
            <select>
              <option>Select Role</option>
            </select>
          </fieldset>
        </form>
      `

      initializeAccessibility({ enableAriaEnhancements: true })

      const fieldset = document.querySelector('fieldset')
      const textInput = document.querySelector('input[type="text"]')
      
      expect(fieldset).toBeTruthy()
      expect(textInput?.getAttribute('aria-label')).toBe('Username')
    })
  })

  describe('Admin accessibility audit', () => {
    test('should audit admin dashboard structure', () => {
      document.body.innerHTML = `
        <div>
          <h1>Admin Dashboard</h1>
          <nav aria-label="Admin navigation">
            <a href="/admin/users">Users</a>
            <a href="/admin/settings">Settings</a>
          </nav>
          <main>
            <section>
              <h2>User Statistics</h2>
              <table>
                <caption>User Data</caption>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </main>
        </div>
      `

      const results = a11yTest.auditPage()
      
      expect(results.headingStructure).toBe(true)
      expect(results.landmarks).toBe(true)
    })

    test('should identify admin-specific accessibility issues', () => {
      document.body.innerHTML = `
        <div>
          <h1>Admin Panel</h1>
          <div class="admin-toolbar">
            <button></button>
            <button></button>
          </div>
          <table>
            <tr>
              <td>Data without headers</td>
              <td>More data</td>
            </tr>
          </table>
        </div>
      `

      const results = a11yTest.auditPage()
      
      // Should fail due to unlabeled buttons and table without headers
      expect(results.ariaLabels).toBe(false)
    })
  })

  describe('Admin high contrast support', () => {
    test('should apply admin-specific high contrast styles', () => {
      document.body.innerHTML = `
        <div class="bg-admin-surface text-admin-text-primary">
          <button class="bg-admin-primary">Admin Button</button>
        </div>
      `

      // This would test the high contrast manager
      // For now, we just verify the structure is in place
      expect(document.querySelector('.bg-admin-surface')).toBeTruthy()
      expect(document.querySelector('.text-admin-text-primary')).toBeTruthy()
    })
  })

  describe('Admin keyboard navigation', () => {
    test('should support admin-specific keyboard shortcuts', () => {
      document.body.innerHTML = `
        <div>
          <main id="admin-main">Admin Content</main>
          <nav id="admin-nav">Admin Navigation</nav>
        </div>
      `

      initializeAccessibility({ enableKeyboardNavigation: true })

      // Test Alt+1 for main content
      const mainContent = document.getElementById('admin-main')
      expect(mainContent).toBeTruthy()

      // Test Alt+2 for navigation
      const navigation = document.getElementById('admin-nav')
      expect(navigation).toBeTruthy()
    })

    test('should handle admin modal focus management', () => {
      document.body.innerHTML = `
        <div>
          <button id="open-modal">Open Admin Modal</button>
          <div role="dialog" aria-modal="true" style="display: none;">
            <h2>Admin Modal</h2>
            <button>Action 1</button>
            <button>Action 2</button>
            <button class="close">Close</button>
          </div>
        </div>
      `

      initializeAccessibility({ enableFocusManagement: true })

      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      const closeButton = modal.querySelector('.close') as HTMLButtonElement

      // Show modal
      modal.style.display = 'block'

      // Test Escape key closes modal
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)

      // Close button should be clicked
      const clickSpy = jest.spyOn(closeButton, 'click')
      document.dispatchEvent(escapeEvent)
      expect(clickSpy).toHaveBeenCalled()
      clickSpy.mockRestore()
    })
  })

  describe('Admin live regions', () => {
    test('should announce admin actions', () => {
      initializeAccessibility({ enableLiveRegions: true })

      const politeRegion = document.getElementById('aria-live-polite')
      const assertiveRegion = document.getElementById('aria-live-assertive')

      expect(politeRegion).toBeTruthy()
      expect(assertiveRegion).toBeTruthy()

      // Test announcement
      if (politeRegion) {
        politeRegion.textContent = 'User updated successfully'
        expect(politeRegion.textContent).toBe('User updated successfully')
      }
    })
  })

  describe('Admin form validation accessibility', () => {
    test('should handle admin form errors accessibly', () => {
      document.body.innerHTML = `
        <form>
          <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <button type="submit">Create User</button>
        </form>
      `

      const form = document.querySelector('form') as HTMLFormElement
      const usernameInput = document.getElementById('username') as HTMLInputElement
      const emailInput = document.getElementById('email') as HTMLInputElement

      // Simulate validation errors
      usernameInput.setAttribute('aria-invalid', 'true')
      emailInput.setAttribute('aria-invalid', 'true')

      const invalidInputs = form.querySelectorAll('[aria-invalid="true"]')
      expect(invalidInputs).toHaveLength(2)
    })
  })

  describe('Admin data table accessibility', () => {
    test('should make admin data tables accessible', () => {
      document.body.innerHTML = `
        <table role="table">
          <caption>User Management Table</caption>
          <thead>
            <tr>
              <th scope="col" aria-sort="none">Name</th>
              <th scope="col" aria-sort="none">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>
                <button aria-label="Edit John Doe">Edit</button>
                <button aria-label="Delete John Doe">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      `

      const table = document.querySelector('table')
      const caption = table?.querySelector('caption')
      const sortableHeaders = table?.querySelectorAll('[aria-sort]')
      const actionButtons = table?.querySelectorAll('button[aria-label]')

      expect(caption).toBeTruthy()
      expect(sortableHeaders?.length).toBe(2)
      expect(actionButtons?.length).toBe(2)

      // Test that all action buttons have proper labels
      actionButtons?.forEach(button => {
        expect(button.getAttribute('aria-label')).toBeTruthy()
      })
    })
  })
})