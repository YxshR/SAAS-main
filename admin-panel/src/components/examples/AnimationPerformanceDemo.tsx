'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePerformantAnimation } from '@/hooks/use-animation-performance';
import { AnimationDebugger } from '@/components/dev/animation-debugger';
import { getPerformanceAwareVariants } from '@/lib/optimized-motion-variants';

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
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Animation Type</label>
              <select
                value={animationType}
                onChange={(e) => setAnimationType(e.target.value as 'fade' | 'slide' | 'scale')}
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
                onChange={(e) => setItemCount(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{itemCount} items</span>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleStartAnimation}
                disabled={isAnimating || !shouldAnimate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isAnimating ? 'Animating...' : 'Start Animation'}
              </button>
            </div>
          </div>
          
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">FPS:</span> {metrics.fps.toFixed(1)}
              </div>
              <div>
                <span className="font-medium">Frame Time:</span> {metrics.frameTime.toFixed(2)}ms
              </div>
              <div>
                <span className="font-medium">Dropped Frames:</span> {metrics.droppedFrames}
              </div>
              <div>
                <span className="font-medium">Performance:</span> 
                <span className={`ml-1 ${
                  metrics.fps > 55 ? 'text-green-600' : 
                  metrics.fps > 30 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metrics.fps > 55 ? 'Excellent' : metrics.fps > 30 ? 'Good' : 'Poor'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: itemCount }).map((_, index) => (
            <motion.div
              key={index}
              variants={variants}
              initial="initial"
              animate={isAnimating ? "animate" : "initial"}
              transition={{ delay: index * 0.05 }}
              className="h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}