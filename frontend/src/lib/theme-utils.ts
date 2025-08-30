/**
 * Theme utilities for working with design tokens
 */

import { designTokens } from './design-tokens';

// CSS custom property helpers
export const cssVar = (property: string) => `var(--${property})`;

// Color helpers
export const getColor = (color: string, shade?: string | number) => {
  if (shade) {
    return cssVar(`color-${color}-${shade}`);
  }
  return cssVar(`color-${color}`);
};

// Spacing helpers
export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return cssVar(`spacing-${size}`);
};

// Animation helpers
export const getDuration = (duration: keyof typeof designTokens.animations.duration) => {
  return cssVar(`duration-${duration}`);
};

export const getEasing = (easing: keyof typeof designTokens.animations.easing) => {
  return cssVar(`easing-${easing}`);
};

// Shadow helpers
export const getShadow = (shadow: keyof typeof designTokens.shadows) => {
  return cssVar(`shadow-${shadow}`);
};

// Border radius helpers
export const getRadius = (radius: keyof typeof designTokens.borderRadius) => {
  return cssVar(`radius-${radius}`);
};

// Responsive helpers
export const breakpoint = (size: keyof typeof designTokens.breakpoints) => {
  return designTokens.breakpoints[size];
};

// Media query helpers
export const mediaQuery = (size: keyof typeof designTokens.breakpoints) => {
  return `@media (min-width: ${breakpoint(size)})`;
};

// Animation variant helpers for Framer Motion
export const getAnimationVariant = (variant: keyof typeof designTokens.animations.variants) => {
  return designTokens.animations.variants[variant];
};

// Theme-aware class name helpers
export const themeClass = (lightClass: string, darkClass: string) => {
  return `${lightClass} dark:${darkClass}`;
};

// Semantic color helpers
export const semanticColors = {
  success: (shade: number = 500) => getColor('success', shade),
  warning: (shade: number = 500) => getColor('warning', shade),
  error: (shade: number = 500) => getColor('error', shade),
  info: (shade: number = 500) => getColor('info', shade),
};

// Component state helpers
export const stateColors = {
  default: getColor('neutral', 500),
  hover: getColor('neutral', 600),
  active: getColor('neutral', 700),
  disabled: getColor('neutral', 300),
  focus: getColor('primary', 500),
};

// Typography helpers
export const typography = {
  fontFamily: {
    sans: designTokens.typography.fontFamily.sans.join(', '),
    serif: designTokens.typography.fontFamily.serif.join(', '),
    mono: designTokens.typography.fontFamily.mono.join(', '),
  },
  fontSize: designTokens.typography.fontSize,
  fontWeight: designTokens.typography.fontWeight,
  lineHeight: designTokens.typography.lineHeight,
};

// Layout helpers
export const layout = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: `0 ${getSpacing(4)}`,
  },
  grid: {
    gap: getSpacing(4),
    columns: {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
    },
  },
};

// Animation presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.3 },
  },
};

// Component style presets
export const componentStyles = {
  button: {
    base: {
      padding: `${getSpacing(2)} ${getSpacing(4)}`,
      borderRadius: getRadius('md'),
      fontWeight: '500',
      transition: `all ${getDuration('standard')} ${getEasing('easeOut')}`,
      cursor: 'pointer',
      border: 'none',
    },
    primary: {
      background: getColor('primary', 500),
      color: getColor('neutral', 0),
    },
    secondary: {
      background: getColor('neutral', 100),
      color: getColor('neutral', 900),
      border: `1px solid ${getColor('neutral', 200)}`,
    },
  },
  card: {
    base: {
      background: getColor('neutral', 0),
      borderRadius: getRadius('lg'),
      boxShadow: getShadow('base'),
      border: `1px solid ${getColor('neutral', 200)}`,
      transition: `all ${getDuration('standard')} ${getEasing('easeOut')}`,
    },
  },
  input: {
    base: {
      width: '100%',
      padding: `${getSpacing(3)} ${getSpacing(3)}`,
      border: `1px solid ${getColor('neutral', 300)}`,
      borderRadius: getRadius('md'),
      background: getColor('neutral', 0),
      color: getColor('neutral', 900),
      transition: `all ${getDuration('standard')} ${getEasing('easeOut')}`,
    },
  },
};