'use client';

import { useTheme, useDesignTokens, useReducedMotion } from '@/providers/theme-provider';
import { motion } from 'framer-motion';
import { getAnimationVariant } from '@/lib/theme-utils';

/**
 * Demo component to showcase the design system
 * This component demonstrates the usage of design tokens, theme provider, and animations
 */
export function ThemeDemo() {
  const { theme, toggleMode, toggleReducedMotion, toggleHighContrast } = useTheme();
  const tokens = useDesignTokens();
  const reducedMotion = useReducedMotion();

  const fadeInVariant = getAnimationVariant('fadeIn');
  const slideUpVariant = getAnimationVariant('slideUp');

  return (
    <motion.div
      initial={fadeInVariant.initial}
      animate={fadeInVariant.animate}
      className="p-8 space-y-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-4 gradient-text"
        >
          Admin Design System Demo
        </motion.h1>
        
        <motion.p
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.2 }}
          className="text-lg text-neutral-600 mb-8"
        >
          This demo showcases our premium design system with dynamic theming, animations, and accessibility features for the admin panel.
        </motion.p>

        {/* Theme Controls */}
        <motion.div
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.3 }}
          className="admin-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Theme Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleMode}
              className="admin-button-primary"
            >
              Switch to {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
            </button>
            <button
              onClick={toggleReducedMotion}
              className="admin-button-secondary"
            >
              {theme.reducedMotion ? 'Enable' : 'Disable'} Animations
            </button>
            <button
              onClick={toggleHighContrast}
              className="admin-button-secondary"
            >
              {theme.highContrast ? 'Disable' : 'Enable'} High Contrast
            </button>
          </div>
          <div className="mt-4 text-sm text-neutral-600">
            <p>Current mode: <strong>{theme.mode}</strong></p>
            <p>Reduced motion: <strong>{reducedMotion ? 'Yes' : 'No'}</strong></p>
            <p>High contrast: <strong>{theme.highContrast ? 'Yes' : 'No'}</strong></p>
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.4 }}
          className="admin-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Colors */}
            <div>
              <h3 className="font-medium mb-2">Primary</h3>
              <div className="space-y-1">
                {Object.entries(tokens.colors.primary).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <span>{shade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="font-medium mb-2">Secondary</h3>
              <div className="space-y-1">
                {Object.entries(tokens.colors.secondary).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <span>{shade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="font-medium mb-2">Semantic</h3>
              <div className="space-y-2">
                {Object.entries(tokens.colors.semantic).map(([name, scale]) => (
                  <div key={name}>
                    <h4 className="text-xs font-medium capitalize mb-1">{name}</h4>
                    <div className="flex gap-1">
                      {Object.entries(scale).slice(0, 5).map(([shade, color]) => (
                        <div
                          key={shade}
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color }}
                          title={`${name}-${shade}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral Colors */}
            <div>
              <h3 className="font-medium mb-2">Neutral</h3>
              <div className="space-y-1">
                {Object.entries(tokens.colors.neutral).slice(0, 8).map(([shade, color]) => (
                  <div
                    key={shade}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <span>{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Component Examples */}
        <motion.div
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.5 }}
          className="admin-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Component Examples</h2>
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="font-medium mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="admin-button-primary">Primary Button</button>
                <button className="admin-button-secondary">Secondary Button</button>
                <button className="admin-button-primary" disabled>Disabled Button</button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="font-medium mb-3">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="admin-badge-success">Success</span>
                <span className="admin-badge-warning">Warning</span>
                <span className="admin-badge-error">Error</span>
                <span className="admin-badge-info">Info</span>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="font-medium mb-3">Form Elements</h3>
              <div className="max-w-md space-y-3">
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="admin-input"
                />
                <select className="admin-input">
                  <option>Select an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea
                  placeholder="Enter message..."
                  className="admin-input"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animation Examples */}
        <motion.div
          initial={slideUpVariant.initial}
          animate={slideUpVariant.animate}
          transition={{ delay: 0.6 }}
          className="admin-card p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Animation Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={getAnimationVariant('scale').initial}
                animate={getAnimationVariant('scale').animate}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="admin-card p-4 cursor-pointer"
              >
                <h3 className="font-medium mb-2">Animated Card {i}</h3>
                <p className="text-sm text-neutral-600">
                  This card demonstrates hover and tap animations with proper easing curves.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}