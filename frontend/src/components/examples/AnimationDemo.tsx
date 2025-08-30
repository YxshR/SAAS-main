'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  fadeVariants, 
  slideVariants, 
  scaleVariants, 
  bounceVariants,
  bounceIntensityVariants,
  bounceTransitions,
  advancedVariants,
  hoverAnimations,
  clickAnimations,
  staggerContainer,
  staggerItem,
  useReducedMotion
} from '@/lib/animations'


export default function AnimationDemo() {
  const [showElements, setShowElements] = useState(true)
  const [selectedAnimation, setSelectedAnimation] = useState<'fade' | 'slide' | 'scale' | 'bounce' | 'advanced'>('fade')
  const [bounceIntensity, setBounceIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium')
  const [showPerformanceInfo, setShowPerformanceInfo] = useState(false)
  
  // Use enhanced animation hooks
  const prefersReducedMotion = useReducedMotion()

  const getVariants = () => {
    switch (selectedAnimation) {
      case 'fade': return fadeVariants
      case 'slide': return slideVariants
      case 'scale': return scaleVariants
      case 'bounce': return bounceIntensityVariants[bounceIntensity]
      case 'advanced': return advancedVariants.elastic
      default: return fadeVariants
    }
  }

  const getTransition = () => {
    if (selectedAnimation === 'bounce') {
      return bounceTransitions[bounceIntensity]
    }
    return undefined
  }

  const handleSequenceDemo = () => {
    // Animation sequence demo - placeholder
    console.log('Animation sequence demo')
  }

  const demoItems = [
    'Animation Item 1',
    'Animation Item 2', 
    'Animation Item 3',
    'Animation Item 4'
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Animation System Demo</h1>
      
      {/* Animation Controls */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setShowElements(!showElements)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showElements ? 'Hide' : 'Show'} Elements
        </button>
        
        <select
          value={selectedAnimation}
          onChange={(e) => setSelectedAnimation(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="fade">Fade Animation</option>
          <option value="slide">Slide Animation</option>
          <option value="scale">Scale Animation</option>
          <option value="bounce">Bounce Animation</option>
          <option value="advanced">Advanced Animation</option>
        </select>

        {selectedAnimation === 'bounce' && (
          <select
            value={bounceIntensity}
            onChange={(e) => setBounceIntensity(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="subtle">Subtle Bounce</option>
            <option value="medium">Medium Bounce</option>
            <option value="strong">Strong Bounce</option>
          </select>
        )}

        <button
          onClick={handleSequenceDemo}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Play Sequence
        </button>

        <button
          onClick={() => setShowPerformanceInfo(!showPerformanceInfo)}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {showPerformanceInfo ? 'Hide' : 'Show'} Performance Info
        </button>
      </div>

      {/* Basic Animation Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Animations</h2>
          <AnimatePresence mode="wait">
            {showElements && (
              <motion.div
                key={selectedAnimation}
                variants={getVariants()}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={getTransition()}
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-medium mb-2">
                  {selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} Animation
                </h3>
                <p>This element demonstrates the {selectedAnimation} animation variant.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover and Click Animations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Interactive Animations</h2>
          <motion.div
            whileHover={hoverAnimations.lift}
            whileTap={clickAnimations.tap}
            className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg cursor-pointer"
          >
            <h3 className="text-lg font-medium mb-2">Hover & Click Me</h3>
            <p>This card has hover lift effect and tap feedback.</p>
          </motion.div>
        </div>
      </div>

      {/* Stagger Animation Example */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Stagger Animation</h2>
        <AnimatePresence>
          {showElements && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {demoItems.map((item, index) => (
                <motion.div
                  key={item}
                  variants={staggerItem}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-full h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded mb-3"></div>
                  <h3 className="font-medium text-gray-900">{item}</h3>
                  <p className="text-sm text-gray-600">Staggered animation item {index + 1}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button Examples */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Button Animations</h2>
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium"
          >
            Scale Button
          </motion.button>
          
          <motion.button
            whileHover={hoverAnimations.glow}
            whileTap={clickAnimations.ripple}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium"
          >
            Glow Button
          </motion.button>
          
          <motion.button
            whileHover={hoverAnimations.rotate}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium"
          >
            Rotate Button
          </motion.button>
        </div>
      </div>

      {/* Enhanced Performance Info */}
      {showPerformanceInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Enhanced Animation System Status</h2>
          
          {/* Accessibility Status */}
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">♿ Accessibility Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Reduced Motion Preference:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  prefersReducedMotion ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {prefersReducedMotion ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Fallback Animations:</span>
                <span className="ml-2 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {prefersReducedMotion ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✨ Enhanced Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GPU-accelerated animations with fallbacks</li>
                <li>• Automatic reduced motion detection</li>
                <li>• Real-time performance monitoring</li>
                <li>• Device capability-based optimization</li>
                <li>• Advanced bounce intensity controls</li>
                <li>• Animation sequence management</li>
                <li>• Elastic and morphing animations</li>
                <li>• Magnetic interaction effects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎯 Performance Optimizations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Transform and opacity for GPU acceleration</li>
                <li>• Backface visibility hidden for 3D transforms</li>
                <li>• Will-change properties for optimization hints</li>
                <li>• Automatic device capability detection</li>
                <li>• Animation queuing with performance throttling</li>
                <li>• Reduced motion fallback animations</li>
                <li>• Frame rate monitoring and adjustment</li>
                <li>• Memory-efficient animation cleanup</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Animation System Features */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Base Animation System Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🎨 Animation Variants</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fade with custom timing</li>
              <li>• Multi-directional slides</li>
              <li>• Scale with intensity control</li>
              <li>• Bounce with physics</li>
              <li>• Advanced elastic effects</li>
              <li>• Morphing animations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">⚡ Performance</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• GPU acceleration</li>
              <li>• Device capability detection</li>
              <li>• Performance monitoring</li>
              <li>• Automatic optimization</li>
              <li>• Memory management</li>
              <li>• Frame rate tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">♿ Accessibility</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Reduced motion detection</li>
              <li>• Fallback animations</li>
              <li>• ARIA compliance</li>
              <li>• Keyboard navigation</li>
              <li>• Screen reader support</li>
              <li>• High contrast mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}