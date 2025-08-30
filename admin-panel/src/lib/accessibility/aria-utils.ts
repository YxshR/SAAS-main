/**
 * ARIA Utilities and Semantic Markup Helpers
 * Provides comprehensive ARIA support for screen reader compatibility
 */

export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-required'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-pressed'?: boolean | 'mixed';
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  role?: string;
}

/**
 * Apply ARIA attributes to an element
 */
export function setAriaAttributes(element: HTMLElement, attributes: AriaAttributes): void {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, String(value));
    }
  });
}

/**
 * Create accessible button with proper ARIA attributes
 */
export function createAccessibleButton(
  text: string,
  onClick: () => void,
  options: {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    disabled?: boolean;
    pressed?: boolean;
    expanded?: boolean;
    controls?: string;
    haspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  } = {}
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);

  const ariaAttributes: AriaAttributes = {
    'aria-label': options.ariaLabel,
    'aria-describedby': options.ariaDescribedBy,
    'aria-disabled': options.disabled,
    'aria-pressed': options.pressed,
    'aria-expanded': options.expanded,
    'aria-controls': options.controls,
    'aria-haspopup': options.haspopup
  };

  setAriaAttributes(button, ariaAttributes);

  if (options.disabled) {
    button.disabled = true;
  }

  return button;
}

/**
 * Create accessible form input with proper labeling
 */
export function createAccessibleInput(
  type: string,
  labelText: string,
  options: {
    id?: string;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    placeholder?: string;
    value?: string;
  } = {}
): { input: HTMLInputElement; label: HTMLLabelElement; container: HTMLDivElement } {
  const container = document.createElement('div');
  const input = document.createElement('input');
  const label = document.createElement('label');

  const inputId = options.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  input.type = type;
  input.id = inputId;
  input.placeholder = options.placeholder || '';
  input.value = options.value || '';

  label.htmlFor = inputId;
  label.textContent = labelText;

  const ariaAttributes: AriaAttributes = {
    'aria-required': options.required,
    'aria-invalid': options.invalid,
    'aria-describedby': options.describedBy
  };

  setAriaAttributes(input, ariaAttributes);

  container.appendChild(label);
  container.appendChild(input);

  return { input, label, container };
}

/**
 * Create accessible modal dialog
 */
export function createAccessibleModal(
  title: string,
  content: HTMLElement,
  options: {
    id?: string;
    describedBy?: string;
    modal?: boolean;
  } = {}
): HTMLDivElement {
  const modal = document.createElement('div');
  const titleElement = document.createElement('h2');
  const contentContainer = document.createElement('div');

  const modalId = options.id || `modal-${Math.random().toString(36).substr(2, 9)}`;
  const titleId = `${modalId}-title`;
  const contentId = options.describedBy || `${modalId}-content`;

  titleElement.id = titleId;
  titleElement.textContent = title;
  contentContainer.id = contentId;
  contentContainer.appendChild(content);

  modal.id = modalId;
  modal.appendChild(titleElement);
  modal.appendChild(contentContainer);

  const ariaAttributes: AriaAttributes = {
    role: 'dialog',
    'aria-labelledby': titleId,
    'aria-describedby': contentId
  };
  
  // Set aria-modal separately as it's not in the standard AriaAttributes type
  modal.setAttribute('aria-modal', String(options.modal !== false));

  setAriaAttributes(modal, ariaAttributes);

  return modal;
}

/**
 * Create accessible navigation menu
 */
export function createAccessibleMenu(
  items: Array<{ text: string; href?: string; onClick?: () => void; current?: boolean }>,
  options: {
    orientation?: 'horizontal' | 'vertical';
    label?: string;
  } = {}
): HTMLElement {
  const nav = document.createElement('nav');
  const list = document.createElement('ul');

  if (options.label) {
    nav.setAttribute('aria-label', options.label);
  }

  list.setAttribute('role', 'menubar');
  if (options.orientation) {
    list.setAttribute('aria-orientation', options.orientation);
  }

  items.forEach((item, index) => {
    const listItem = document.createElement('li');
    const menuItem = item.href 
      ? document.createElement('a') as HTMLAnchorElement
      : document.createElement('button');

    listItem.setAttribute('role', 'none');
    menuItem.setAttribute('role', 'menuitem');
    menuItem.textContent = item.text;
    menuItem.tabIndex = index === 0 ? 0 : -1;

    if (item.current) {
      menuItem.setAttribute('aria-current', 'page');
    }

    if (item.href && menuItem instanceof HTMLAnchorElement) {
      menuItem.href = item.href;
    }

    if (item.onClick) {
      menuItem.addEventListener('click', item.onClick);
    }

    listItem.appendChild(menuItem);
    list.appendChild(listItem);
  });

  nav.appendChild(list);
  return nav;
}

/**
 * Create accessible progress indicator
 */
export function createAccessibleProgress(
  value: number,
  max: number = 100,
  options: {
    label?: string;
    valueText?: string;
  } = {}
): HTMLDivElement {
  const container = document.createElement('div');
  const progressBar = document.createElement('div');

  const ariaAttributes: AriaAttributes = {
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuenow': value,
    'aria-valuetext': options.valueText || `${Math.round((value / max) * 100)}%`,
    'aria-label': options.label
  };

  setAriaAttributes(progressBar, ariaAttributes);

  container.appendChild(progressBar);
  return container;
}

/**
 * Create accessible tab panel system
 */
export function createAccessibleTabs(
  tabs: Array<{ label: string; content: HTMLElement; id?: string }>,
  options: {
    orientation?: 'horizontal' | 'vertical';
  } = {}
): { container: HTMLDivElement; tabList: HTMLDivElement; panels: HTMLDivElement[] } {
  const container = document.createElement('div');
  const tabList = document.createElement('div');
  const panels: HTMLDivElement[] = [];

  tabList.setAttribute('role', 'tablist');
  if (options.orientation) {
    tabList.setAttribute('aria-orientation', options.orientation);
  }

  tabs.forEach((tab, index) => {
    const tabButton = document.createElement('button');
    const panel = document.createElement('div');

    const tabId = tab.id || `tab-${index}`;
    const panelId = `panel-${index}`;

    // Tab button
    tabButton.id = tabId;
    tabButton.textContent = tab.label;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.tabIndex = index === 0 ? 0 : -1;

    // Panel
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = index !== 0;
    panel.appendChild(tab.content);

    tabList.appendChild(tabButton);
    panels.push(panel);
  });

  container.appendChild(tabList);
  panels.forEach(panel => container.appendChild(panel));

  return { container, tabList, panels };
}

/**
 * Create accessible alert/notification
 */
export function createAccessibleAlert(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options: {
    dismissible?: boolean;
    live?: 'polite' | 'assertive';
  } = {}
): HTMLDivElement {
  const alert = document.createElement('div');
  const messageElement = document.createElement('p');

  messageElement.textContent = message;
  alert.appendChild(messageElement);

  const ariaAttributes: AriaAttributes = {
    role: 'alert',
    'aria-live': options.live || (type === 'error' ? 'assertive' : 'polite'),
    'aria-atomic': true
  };

  setAriaAttributes(alert, ariaAttributes);

  if (options.dismissible) {
    const closeButton = createAccessibleButton('Close', () => {
      alert.remove();
    }, {
      ariaLabel: 'Close alert'
    });
    alert.appendChild(closeButton);
  }

  return alert;
}

/**
 * Update screen reader announcements
 */
export function updateLiveRegion(
  element: HTMLElement,
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
  element.textContent = message;
}

/**
 * Create accessible data table
 */
export function createAccessibleTable(
  headers: string[],
  rows: string[][],
  options: {
    caption?: string;
    sortable?: boolean;
  } = {}
): HTMLTableElement {
  const table = document.createElement('table');
  
  if (options.caption) {
    const caption = document.createElement('caption');
    caption.textContent = options.caption;
    table.appendChild(caption);
  }

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.scope = 'col';
    
    if (options.sortable) {
      th.setAttribute('aria-sort', 'none');
      th.tabIndex = 0;
      th.setAttribute('role', 'columnheader');
    }
    
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach(rowData => {
    const row = document.createElement('tr');
    rowData.forEach((cellData, index) => {
      const cell = document.createElement('td');
      cell.textContent = cellData;
      
      if (index === 0) {
        cell.scope = 'row';
      }
      
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}