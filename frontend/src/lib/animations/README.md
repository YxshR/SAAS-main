# Animation System Documentation

## Overview

This comprehensive animation system provides a complete solution for creating smooth, performant, and accessible animations in the premium UI/UX redesign. Built on top of Framer Motion, it offers pre-configured variants, performance optimizations, and accessibility features.

## Features

- 🎨 **Pre-built Animation Variants**: Fade, slide, scale, bounce, and more
- ⚡ **Performance Optimized**: GPU acceleration and frame rate monitoring
- ♿ **Accessibility First**: Reduced motion support and ARIA compliance
- 🎯 **Context Aware**: Different animations for buttons, cards, forms, etc.
- 🔧 **Highly Configurable**: Custom timing, easing, and animation sequences
- 📱 **Responsive**: Adaptive animations based on device capabilities

## Quick Start

```tsx
import { motion } from 'framer-motion'
import { fadeVariants, slideVariants, hoverAnimations } from '@/lib/animations'

// Basic fade animation
<motion.div
  variants={fadeVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Content here
</motion.div>

// Interactive card with hover effect
<motion.div
  whileHover={hoverAnimations.lift}
  whileTap={{ scale: 0.98 }}
>
  Interactive card
</motion.div>
```

## Core Components

### 1. Animation Variants (`animations.ts`)

Pre-built animation variants for common use cases:

```tsx
// Basic variants
fadeVariants      // Opacity transitions
slideVariants     // Position-based transitions
scaleVariants     // Size-based transitions
bounceVariants    // Spring-based transitions

// Directional variants
slideUpVariants
slideDownVariants
slideLeftVariants
slideRightVariants

// Interactive variants
hoverAnimations   // Hover effects
clickAnimations   // Click feedback
```

### 2. Animation Configuration (`animation-config.ts`)

Global configuration and management:

```tsx
import { animationManager, useAnimationConfig } from '@/lib/animations'

// Update global animation settings
animationManager.updateConfig({
  performanceMode: 'high', // 'high' | 'balanced' | 'low'
  respectReducedMotion: true
})

// Use in components
const { config, getVariants } = useAnimationConfig()
```

### 3. Animation Hooks (`animation-hooks.ts`)

Advanced hooks for complex animations:

```tsx
import { 
  useScrollAnimation, 
  useHoverAnimation, 
  useAnimationSequence 
} from '@/lib/animations'

// Scroll-triggered animations
const { ref, isInView } = useScrollAnimation(0.2)

// Complex animation sequences
const { playSequence } = useAnimationSequence()
```

### 4. Animation Utilities (`animation-utils.ts`)

Factory functions and utilities:

```tsx
import { createAnimationPreset, performanceAnimations } from '@/lib/animations'

// Create custom animations
const customFade = createAnimationPreset.fade(0.5, 0.1)
const customSlide = createAnimationPreset.slide('up', 30, 0.3)
```

## Animation Presets

### Basic Animations

```tsx
// Fade animations
const fadeIn = createAnimationPreset.fade()
const quickFade = createAnimationPreset.fade(durations.fast)

// Slide animations
const slideUp = createAnimationPreset.slide('up')
const slideLeft = createAnimationPreset.slide('left', 50)

// Scale animations
const scaleIn = createAnimationPreset.scale(0.8, 1)
const subtleScale = createAnimationPreset.scale(0.95, 1, durations.fast)
```

### Context-Specific Animations

```tsx
import { contextAnimations } from '@/lib/animations'

// Button animations
<motion.button
  whileHover={contextAnimations.button.primary.hover}
  whileTap={contextAnimations.button.primary.tap}
>
  Primary Button
</motion.button>

// Form field animations
<motion.input
  whileFocus={contextAnimations.form.field.focus}
  // Error state handled automatically
/>

// Card animations
<motion.div
  whileHover={contextAnimations.card.hover}
  whileTap={contextAnimations.card.tap}
>
  Interactive Card
</motion.div>
```

## Performance Optimization

### GPU Acceleration

All animations use GPU-accelerated properties:

```tsx
// Automatically applied to all animations
const performanceConfig = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  perspective: 1000
}
```

### Device Capability Detection

```tsx
import { performanceMonitor } from '@/lib/animations'

// Check device capabilities
const capabilities = performanceMonitor.getDeviceCapabilities()
// Returns: { tier: 'high' | 'medium' | 'low', renderer: string, hardwareAcceleration: boolean }

// Adaptive animations based on device
const shouldUseComplexAnimations = capabilities.tier !== 'low'
```

### Performance Monitoring

```tsx
// Track animation performance
const startTime = performance.now()
// ... animation code
performanceMonitor.trackAnimation('myAnimation', startTime)

// Monitor frame rate
performanceMonitor.monitorFrameRate((fps) => {
  console.log(`Current FPS: ${fps}`)
})
```

## Accessibility

### Reduced Motion Support

```tsx
import { useReducedMotion, accessibleAnimations } from '@/lib/animations'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()
  
  const variants = accessibleAnimations.respectReducedMotion(
    normalVariants,
    reducedVariants
  )(prefersReducedMotion)
  
  return (
    <motion.div variants={variants}>
      Content
    </motion.div>
  )
}
```

### Focus Management

```tsx
// Focus-visible animations for keyboard navigation
<motion.button
  whileFocus={accessibleAnimations.focusVisible}
>
  Accessible Button
</motion.button>
```

## Advanced Usage

### Animation Sequences

```tsx
import { useAnimationSequence } from '@/lib/animations'

function ComplexAnimation() {
  const { playSequence, isPlaying } = useAnimationSequence()
  
  const handleClick = () => {
    playSequence([
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1.1 },
      { scale: 1 }
    ])
  }
  
  return (
    <button onClick={handleClick} disabled={isPlaying}>
      Play Sequence
    </button>
  )
}
```

### Stagger Animations

```tsx
import { staggerContainer, staggerItem } from '@/lib/animations'

<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={staggerItem}
      custom={index}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Scroll-Triggered Animations

```tsx
import { useScrollAnimation } from '@/lib/animations'

function ScrollTriggeredElement() {
  const { ref, isInView } = useScrollAnimation(0.2)
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    >
      Scroll to reveal
    </motion.div>
  )
}
```

## Configuration Options

### Global Settings

```tsx
import { animationManager } from '@/lib/animations'

animationManager.updateConfig({
  enabled: true,                    // Enable/disable all animations
  respectReducedMotion: true,       // Respect user preferences
  performanceMode: 'balanced',      // 'high' | 'balanced' | 'low'
  globalDuration: 0.3,             // Default animation duration
  globalEasing: [0, 0, 0.2, 1]     // Default easing curve
})
```

### Performance Modes

- **High Performance**: All animations enabled, complex effects allowed
- **Balanced**: Standard animations with some optimizations
- **Low Performance**: Simplified animations, reduced effects

## Best Practices

1. **Use GPU-accelerated properties**: Transform and opacity when possible
2. **Respect user preferences**: Always check for reduced motion
3. **Optimize for mobile**: Use simpler animations on mobile devices
4. **Monitor performance**: Track animation performance in development
5. **Provide fallbacks**: Always have fallback animations for older browsers
6. **Use appropriate timing**: Follow material design timing guidelines
7. **Test accessibility**: Ensure animations work with screen readers

## Timing Guidelines

```tsx
export const durations = {
  micro: 0.1,    // Micro-interactions (hover states)
  fast: 0.15,    // Quick feedback (button presses)
  normal: 0.3,   // Standard transitions (page changes)
  slow: 0.5,     // Complex animations (modals)
  slower: 0.8    // Dramatic effects (page transitions)
}
```

## Easing Curves

```tsx
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],      // Standard material design
  easeOut: [0, 0, 0.2, 1],          // Deceleration
  easeIn: [0.4, 0, 1, 1],           // Acceleration
  bounce: [0.68, -0.55, 0.265, 1.55], // Playful bounce
  snappy: [0.25, 0.46, 0.45, 0.94], // Quick and snappy
  smooth: [0.25, 0.1, 0.25, 1],     // Smooth and natural
  elastic: [0.175, 0.885, 0.32, 1.275] // Elastic effect
}
```

## Testing

The animation system includes comprehensive tests:

```bash
npm test -- animations.test.ts
```

Tests cover:
- Animation variant structure
- Performance monitoring
- Accessibility features
- Configuration management
- Utility functions

## Examples

See `AnimationDemo.tsx` for a comprehensive example showcasing all animation features.

## Migration Guide

If migrating from a different animation system:

1. Replace direct Framer Motion imports with animation system imports
2. Use pre-built variants instead of custom ones where possible
3. Add performance monitoring to existing animations
4. Implement reduced motion support
5. Update timing to use standardized durations

## Troubleshooting

### Common Issues

1. **Animations not working**: Check if animations are enabled globally
2. **Poor performance**: Switch to lower performance mode or check device capabilities
3. **Accessibility issues**: Ensure reduced motion support is implemented
4. **Timing issues**: Use standardized durations and easing curves

### Debug Mode

Enable debug mode in development:

```tsx
import { debugUtils } from '@/lib/animations'

// Log animation performance
debugUtils.logPerformance('myAnimation', startTime)

// Add visual debugging
debugUtils.addDebugBorders(element)

// Track animation states
debugUtils.trackState('myAnimation', currentState)
```