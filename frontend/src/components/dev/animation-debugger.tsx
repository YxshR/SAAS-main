'use client';

import React, { useState, useEffect } from 'react';
import { useAnimationPerformance } from '@/hooks/use-animation-performance';
import { priorityManager, type PerformanceMetrics } from '@/lib/animation-performance';

interface AnimationDebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function AnimationDebugger({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right' 
}: AnimationDebuggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState(0);
  const metrics = useAnimationPerformance();

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setActiveAnimations(priorityManager.getActiveAnimationsCount());
    }, 100);

    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] bg-black/90 text-white p-4 rounded-lg font-mono text-xs backdrop-blur-sm border border-gray-700`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Animation Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getPerformanceColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg FPS:</span>
          <span className={getPerformanceColor(metrics.averageFps)}>{metrics.averageFps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span>{metrics.frameTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Dropped:</span>
          <span className={metrics.droppedFrames > 0 ? 'text-red-500' : 'text-green-500'}>
            {metrics.droppedFrames}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Active Anims:</span>
          <span>{activeAnimations}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Performance:</span>
          <span className={metrics.isPerformant ? 'text-green-500' : 'text-red-500'}>
            {metrics.isPerformant ? 'Good' : 'Poor'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Press Ctrl+Shift+A to toggle
        </div>
      </div>
    </div>
  );
}

export function AnimationPerformanceChart() {
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const metrics = useAnimationPerformance();

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, metrics];
      return newHistory.slice(-60); // Keep last 60 data points
    });
  }, [metrics]);

  const maxFps = Math.max(...history.map(m => m.fps), 60);
  const chartHeight = 100;

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-2">FPS History</h3>
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="absolute inset-0">
          {/* Grid lines */}
          {[0, 30, 60].map(fps => (
            <line
              key={fps}
              x1="0"
              y1={chartHeight - (fps / maxFps) * chartHeight}
              x2="100%"
              y2={chartHeight - (fps / maxFps) * chartHeight}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* FPS line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            points={history
              .map((m, i) => 
                `${(i / (history.length - 1)) * 100},${chartHeight - (m.fps / maxFps) * chartHeight}`
              )
              .join(' ')}
          />
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          <span>{maxFps}</span>
          <span>30</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}