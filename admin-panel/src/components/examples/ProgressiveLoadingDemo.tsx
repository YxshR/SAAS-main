'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressiveImage } from '../ui/progressive-image';
import { 
  CardSkeleton, 
  ChartSkeleton, 
  StatsSkeleton, 
  useContentReplacement 
} from '../ui/skeleton-components';
import { 
  LazySection, 
  LazyGrid, 
  LazyChart,
  withLazyLoading 
} from '../ui/lazy-component';
import { 
  useOptimisticUpdates, 
  OptimisticWrapper, 
  OptimisticButton 
} from '../../hooks/use-optimistic-updates';
import { 
  useProgressiveLoading,
  resourcePreloader 
} from '../../lib/progressive-loading';

// Heavy component to demonstrate lazy loading
const HeavyDataVisualization = withLazyLoading(() => {
  const [data, setData] = useState<number[]>([]);
  
  useEffect(() => {
    // Simulate heavy data processing
    const generateData = () => {
      const newData = Array.from({ length: 100 }, () => Math.random() * 100);
      setData(newData);
    };
    
    const timer = setTimeout(generateData, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Heavy Data Visualization</h3>
      <div className="h-64 flex items-end space-x-1">
        {data.map((value, index) => (
          <motion.div
            key={index}
            className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${value}%` }}
            transition={{ duration: 0.5, delay: index * 0.01 }}
          />
        ))}
      </div>
    </div>
  );
});

const ProgressiveLoadingDemo = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [mockData, setMockData] = useState<any[]>([]);
  const { replaceContent } = useContentReplacement();
  
  // Optimistic updates demo
  const { 
    data: optimisticData, 
    isOptimistic, 
    error, 
    executeOptimistic 
  } = useOptimisticUpdates({ count: 0, items: [] as Array<{ id: number; title: string; description: string }> });

  // Progressive loading demo
  const { 
    isLoading: progressiveLoading, 
    progress, 
    startLoading, 
    updateProgress, 
    finishLoading 
  } = useProgressiveLoading('demo-component');

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      startLoading();
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(i);
      }
      
      setMockData(Array.from({ length: 12 }, (_, i) => ({
        id: i,
        title: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
        image: `https://picsum.photos/300/200?random=${i}`,
      })));
      
      setIsDataLoading(false);
      finishLoading(true);
    };

    loadData();
  }, [startLoading, updateProgress, finishLoading]);

  // Preload images
  useEffect(() => {
    mockData.forEach((item) => {
      resourcePreloader.preloadImage(item.image, 'medium');
    });
  }, [mockData]);

  const handleOptimisticUpdate = async () => {
    const newItem = { id: Date.now(), title: 'New Item', description: 'Added optimistically' };
    
    await executeOptimistic(
      'add-item',
      { 
        ...optimisticData, 
        count: optimisticData.count + 1,
        items: [...optimisticData.items, newItem]
      },
      () => new Promise((resolve, reject) => {
        // Simulate API call with 30% chance of failure
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve({ 
              count: optimisticData.count + 1,
              items: [...optimisticData.items, { ...newItem, id: Math.random() }]
            });
          } else {
            reject(new Error('Failed to add item'));
          }
        }, 1500);
      }),
      {
        onSuccess: (data) => console.log('Item added successfully:', data),
        onError: (error) => console.error('Failed to add item:', error),
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Progressive Loading Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Demonstrating skeleton screens, progressive image loading, optimistic updates, 
          and lazy loading with smooth animations.
        </p>
      </div>

      {/* Progressive Loading Progress */}
      {progressiveLoading && (
        <motion.div
          className="w-full bg-gray-200 rounded-full h-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Skeleton Screens Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Skeleton Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {replaceContent(
            isDataLoading,
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>,
            mockData.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                className="p-6 border rounded-lg bg-white dark:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Action
                  </button>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Secondary
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Progressive Image Loading */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Progressive Image Loading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockData.slice(0, 8).map((item) => (
            <motion.div
              key={item.id}
              className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: item.id * 0.05 }}
            >
              <ProgressiveImage
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48"
              />
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Optimistic Updates Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Optimistic Updates</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <OptimisticButton
              onClick={handleOptimisticUpdate}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              optimisticText="Adding..."
              errorText="Retry"
            >
              Add Item Optimistically
            </OptimisticButton>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Count: {optimisticData.count} | Items: {optimisticData.items.length}
            </span>
          </div>
          
          <OptimisticWrapper isOptimistic={isOptimistic} error={error}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optimisticData.items.map((item: any) => (
                <motion.div
                  key={item.id}
                  className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </OptimisticWrapper>
          
          {error && (
            <motion.div
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lazy Loading Demo */}
      <LazySection
        title="Lazy Loaded Section"
        description="This section loads when it comes into view"
        loadingText="Loading heavy content..."
      >
        <div className="space-y-8">
          <LazyGrid columns={3} loadingItems={6}>
            {mockData.map((item) => (
              <motion.div
                key={item.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ProgressiveImage
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={150}
                  className="w-full h-32 mb-3 rounded"
                />
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </LazyGrid>

          <LazyChart title="Performance Metrics">
            <HeavyDataVisualization />
          </LazyChart>
        </div>
      </LazySection>

      {/* Stats Demo */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Loading States</h2>
        {replaceContent(
          isDataLoading,
          <StatsSkeleton />,
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Items', value: mockData.length, icon: '📊' },
              { label: 'Loading Time', value: `${progress}%`, icon: '⚡' },
              { label: 'Optimistic Updates', value: optimisticData.count, icon: '🚀' },
              { label: 'Images Loaded', value: mockData.length, icon: '🖼️' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 border rounded-lg bg-white dark:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProgressiveLoadingDemo;