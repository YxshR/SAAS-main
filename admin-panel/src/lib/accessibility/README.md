# Admin Panel Accessibility Implementation

This directory contains a comprehensive accessibility implementation specifically tailored for admin interfaces, ensuring WCAG 2.1 AA compliance across all administrative functions.

## Admin-Specific Features

### ✅ Data Table Accessibility
- **Sortable Headers**: Proper ARIA sort states and keyboard navigation
- **Filterable Content**: Accessible search and filter controls
- **Bulk Actions**: Keyboard accessible selection and batch operations
- **Inline Editing**: Accessible edit-in-place functionality
- **Pagination**: Screen reader friendly pagination controls

### ✅ Dashboard Accessibility
- **Interactive Charts**: Accessible data visualizations with proper descriptions
- **Real-time Updates**: Live region announcements for dynamic data
- **Metric Cards**: Properly labeled statistics and KPIs
- **Quick Actions**: Keyboard accessible admin shortcuts

### ✅ Form Management
- **Complex Forms**: Multi-step forms with proper navigation
- **Validation**: Comprehensive error handling and announcements
- **Field Dependencies**: Accessible conditional field display
- **File Uploads**: Accessible drag-and-drop with keyboard alternatives

### ✅ User Management
- **User Lists**: Accessible user tables with search and filtering
- **Role Management**: Clear role assignment interfaces
- **Permission Controls**: Accessible permission matrices
- **Bulk Operations**: Keyboard accessible bulk user actions

## Implementation Examples

### Accessible Data Table
```typescript
import { useRovingTabIndex, useScreenReader } from '@/hooks/use-accessibility'

function UserTable({ users, onSort, onEdit, onDelete }) {
  const tableRef = useRovingTabIndex('[role="row"]')
  const { announce } = useScreenReader()

  const handleSort = (column, direction) => {
    onSort(column, direction)
    announce(`Table sorted by ${column} ${direction}`, 'polite')
  }

  return (
    <table ref={tableRef} role="table" aria-label="User management table">
      <caption>
        User Management - {users.length} users total
      </caption>
      <thead>
        <tr>
          <th 
            scope="col" 
            aria-sort="none"
            role="columnheader"
            tabIndex={0}
            onClick={() => handleSort('name', 'asc')}
            onKeyDown={(e) => e.key === 'Enter' && handleSort('name', 'asc')}
          >
            Name
          </th>
          <th scope="col" aria-sort="none" role="columnheader">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id} role="row" tabIndex={index === 0 ? 0 : -1}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button 
                aria-label={`Edit ${user.name}`}
                onClick={() => onEdit(user.id)}
              >
                Edit
              </button>
              <button 
                aria-label={`Delete ${user.name}`}
                onClick={() => onDelete(user.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Accessible Dashboard Widget
```typescript
import { useLiveRegion } from '@/hooks/use-accessibility'

function MetricCard({ title, value, change, trend }) {
  const { ref: liveRegionRef, announce } = useLiveRegion('polite')

  useEffect(() => {
    if (value !== previousValue) {
      announce(`${title} updated to ${value}`)
    }
  }, [value, title, announce])

  return (
    <div 
      role="region" 
      aria-labelledby={`${title}-heading`}
      className="metric-card"
    >
      <h3 id={`${title}-heading`}>{title}</h3>
      <div 
        aria-live="polite" 
        aria-atomic="true"
        ref={liveRegionRef}
      >
        <span className="metric-value" aria-label={`Current value: ${value}`}>
          {value}
        </span>
        <span 
          className={`metric-change ${trend}`}
          aria-label={`Change: ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}%`}
        >
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  )
}
```

### Accessible Chart Component
```typescript
function AccessibleChart({ data, title, description }) {
  const chartId = useId()
  const descriptionId = `${chartId}-description`

  return (
    <div role="img" aria-labelledby={chartId} aria-describedby={descriptionId}>
      <h3 id={chartId}>{title}</h3>
      <div id={descriptionId} className="sr-only">
        {description}
      </div>
      
      {/* Chart visualization */}
      <svg>
        {/* Chart elements */}
      </svg>
      
      {/* Data table fallback */}
      <details>
        <summary>View data table</summary>
        <table>
          <caption>Data for {title}</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
```

### Accessible Form with Validation
```typescript
import { useFormAccessibility } from '@/hooks/use-accessibility'

function UserForm({ user, onSubmit }) {
  const { 
    formRef, 
    handleValidationErrors, 
    setFieldError, 
    clearFieldError 
  } = useFormAccessibility()

  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    if (!value.trim()) {
      setFieldError(name, `${name} is required`)
      setErrors(prev => ({ ...prev, [name]: `${name} is required` }))
    } else {
      clearFieldError(name)
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    // Validate all fields
    const validationErrors = []
    Object.entries(data).forEach(([key, value]) => {
      if (!value.trim()) {
        validationErrors.push({ field: key, message: `${key} is required` })
      }
    })

    if (validationErrors.length > 0) {
      handleValidationErrors(validationErrors)
      return
    }

    onSubmit(data)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>User Information</legend>
        
        <div className="form-group">
          <label htmlFor="name">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user?.name}
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            onBlur={(e) => validateField('name', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user?.email}
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            onBlur={(e) => validateField('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">
            Role
          </label>
          <select id="role" name="role" defaultValue={user?.role}>
            <option value="">Select a role</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit">
          {user ? 'Update User' : 'Create User'}
        </button>
        <button type="button" onClick={() => history.back()}>
          Cancel
        </button>
      </div>
    </form>
  )
}
```

## Admin-Specific Keyboard Shortcuts

### Global Admin Shortcuts
- `Alt + D` - Go to Dashboard
- `Alt + U` - Go to User Management
- `Alt + S` - Go to Settings
- `Alt + A` - Go to Analytics
- `Ctrl + K` - Open command palette
- `Ctrl + /` - Show keyboard shortcuts

### Data Table Shortcuts
- `Arrow Keys` - Navigate between cells
- `Enter` - Edit cell (if editable)
- `Escape` - Cancel edit
- `Space` - Select/deselect row
- `Ctrl + A` - Select all rows
- `Delete` - Delete selected rows (with confirmation)

### Chart Interactions
- `Tab` - Navigate to chart
- `Arrow Keys` - Navigate data points
- `Enter` - Show data point details
- `T` - Switch to table view

## Testing Admin Accessibility

### Automated Tests
```typescript
// Test data table accessibility
test('should make data tables accessible', async ({ page }) => {
  await page.goto('/admin/users')
  
  // Check table structure
  const table = page.locator('table')
  await expect(table).toHaveAttribute('role', 'table')
  
  // Check headers
  const headers = table.locator('th')
  for (const header of await headers.all()) {
    await expect(header).toHaveAttribute('scope', 'col')
  }
  
  // Check sortable headers
  const sortableHeaders = table.locator('[aria-sort]')
  for (const header of await sortableHeaders.all()) {
    await header.click()
    await expect(header).not.toHaveAttribute('aria-sort', 'none')
  }
})

// Test form validation
test('should handle form validation accessibly', async ({ page }) => {
  await page.goto('/admin/users/new')
  
  // Submit empty form
  await page.click('button[type="submit"]')
  
  // Check for error messages
  const errorMessages = page.locator('[role="alert"], [aria-invalid="true"]')
  await expect(errorMessages.first()).toBeVisible()
  
  // Check focus management
  const firstInvalidField = page.locator('[aria-invalid="true"]').first()
  await expect(firstInvalidField).toBeFocused()
})
```

### Manual Testing Checklist

#### Data Tables
- [ ] Headers have proper scope attributes
- [ ] Sortable columns announce sort state
- [ ] Row selection is keyboard accessible
- [ ] Bulk actions work with keyboard
- [ ] Pagination is screen reader friendly

#### Forms
- [ ] All fields have proper labels
- [ ] Required fields are marked
- [ ] Validation errors are announced
- [ ] Focus moves to first error
- [ ] Multi-step forms have progress indicators

#### Charts and Visualizations
- [ ] Charts have text alternatives
- [ ] Data is available in table format
- [ ] Interactive elements are keyboard accessible
- [ ] Changes are announced to screen readers

#### Navigation
- [ ] Admin navigation is properly labeled
- [ ] Breadcrumbs show current location
- [ ] Skip links work for admin sections
- [ ] Keyboard shortcuts are documented

## Performance Considerations

### Large Data Sets
- **Virtual Scrolling**: Accessible virtual scrolling for large tables
- **Progressive Loading**: Announce loading states
- **Debounced Search**: Accessible search with loading indicators
- **Pagination**: Efficient pagination with proper announcements

### Real-time Updates
- **Live Regions**: Appropriate use of polite vs assertive announcements
- **Rate Limiting**: Prevent announcement spam
- **User Control**: Allow users to pause/resume updates
- **Focus Preservation**: Maintain focus during updates

## Admin Theme Support

### High Contrast Admin Themes
```css
/* Admin-specific high contrast styles */
.high-contrast .bg-admin-surface {
  background-color: var(--hc-background) !important;
}

.high-contrast .text-admin-text-primary {
  color: var(--hc-foreground) !important;
}

.high-contrast .bg-admin-primary {
  background-color: var(--hc-accent) !important;
  color: var(--hc-background) !important;
}

/* Data table enhancements */
.high-contrast table {
  border: 2px solid var(--hc-border) !important;
}

.high-contrast th,
.high-contrast td {
  border: 1px solid var(--hc-border) !important;
}

.high-contrast [aria-sort="ascending"]::after {
  content: " ↑";
  color: var(--hc-accent) !important;
}

.high-contrast [aria-sort="descending"]::after {
  content: " ↓";
  color: var(--hc-accent) !important;
}
```

## Compliance for Admin Interfaces

This admin implementation specifically addresses:

- **Section 508 1194.22**: Federal accessibility requirements for admin systems
- **WCAG 2.1 AA**: All admin functions meet AA compliance
- **EN 301 549**: European accessibility standard for administrative interfaces
- **ADA Title II**: Public sector accessibility requirements

## Resources for Admin Accessibility

- [GSA Section 508 Guidelines](https://www.section508.gov/)
- [Admin Interface Accessibility Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Data Table Accessibility](https://webaim.org/techniques/tables/data)
- [Form Accessibility](https://webaim.org/techniques/forms/)
- [Chart Accessibility](https://accessibility.blog.gov.uk/2016/09/26/creating-accessible-charts/)