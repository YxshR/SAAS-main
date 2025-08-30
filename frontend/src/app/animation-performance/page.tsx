'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AnimationPerformanceDemo = dynamic(
  () => import('@/components/examples/AnimationPerformanceDemo').then(mod => ({ default: mod.AnimationPerformanceDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Animation Performance Demo</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default function AnimationPerformancePage() {
  return (
    <Suspense fallback={
      <div className="p-8 space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Animation Performance Demo</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AnimationPerformanceDemo />
    </Suspense>
  );
}