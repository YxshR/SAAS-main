'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePerformantAnimation } from '@/hooks/use-animation-performance';
import { AnimationDebugger, AnimationPerformanceChart } from '@/components/dev/animation-debugger';
import { 
  optimizedFadeVariants, 
  optimizedSlideVariants, 
  optimizedScaleVariants,
  getPerformanceAwareVariants 
} from '@/lib/optimized-motion-variants';

export function AnimationPerformanceDemo() {
  const [animationType, setAnimationType] = useState<'fade' | 'slide' | 'scale'>('fade');
  const [itemCount, setItemCount] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);

  const { ref, startAnimation, stopAnimation, metrics, shouldAnimate } = usePerformantAnimation(
    'demo-animation',
    'medium',
    'transform'
  );

  const handleStartAnimation = () => {
    if (startAnimation()) {
      setIsAnimating(true);
      setTimeout(() => {
        stopAnimation();
        setIsAnimating(false);
      }, 3000);
    }
  };

  const variants = getPerformanceAwareVariants(animationType);

  return (
    <div className="p-8 space-y-8">
      <AnimationDebugger />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Animation Performance Demo</h1>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Animation Type</label>
              <select
                value={animationType}
                onChange={(e) => setAnimationType(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="scale">Scale</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Item Count</label>
              <input
                type="range"
                min="5"
                max="50"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{itemCount} items</span>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleStartAnimation}
                disabled={isAnimating || !shouldAnimate}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnimating ? 'Animating...' : 'Start Animation'}
              </button>
            </div>
          </div>
          
          {!shouldAnimate && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Performance is poor. Animations are disabled to maintain smooth experience.
            </div>
          )}
        </div>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current FPS:</span>
                <span className={`font-mono ${metrics.fps >= 55 ? 'text-green-600' : metrics.fps >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {metrics.fps}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average FPS:</span>
                <span className="font-mono">{metrics.averageFps}</span>
              </div>
              <div className="flex justify-between">
                <span>Frame Time:</span>
                <span className="font-mono">{metrics.frameTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Dropped Frames:</span>
                <span className={`font-mono ${metrics.droppedFrames > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.droppedFrames}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Performance Status:</span>
                <span className={`font-semibold ${metrics.isPerformant ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.isPerformant ? 'Good' : 'Poor'}
                </span>
              </div>
            </div>
          </div>
          
          <AnimationPerformanceChart />
        </div>
        
        {/* Animation Demo Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Animation Demo</h3>
          
          <motion.div
            ref={ref}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
          >
            {Array.from({ length: itemCount }, (_, i) => (
              <motion.div
                key={i}
                variants={variants}
                className="h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold"
              >
                {i + 1}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* GPU Acceleration Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">GPU Acceleration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Device Capabilities</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>WebGL Support:</span>
                  <span className="font-mono">✓</span>
                </li>
                <li className="flex justify-between">
                  <span>will-change Support:</span>
                  <span className="font-mono">✓</span>
                </li>
                <li className="flex justify-between">
                  <span>3D Transform Support:</span>
                  <span className="font-mono">✓</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optimization Status</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>GPU Acceleration:</span>
                  <span className="font-mono text-green-600">Enabled</span>
                </li>
                <li className="flex justify-between">
                  <span>Animation Priority:</span>
                  <span className="font-mono">Medium</span>
                </li>
                <li className="flex justify-between">
                  <span>Performance Mode:</span>
                  <span className="font-mono">Adaptive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Usage Instructions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Instructions</h3>
          <div className="space-y-2 text-sm">
            <p>• Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Shift+A</kbd> to toggle the animation debugger</p>
            <p>• Adjust item count to see how performance changes with more animations</p>
            <p>• Try different animation types to compare GPU-accelerated vs. fallback animations</p>
            <p>• Monitor the FPS chart to see real-time performance impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}