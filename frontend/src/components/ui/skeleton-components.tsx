'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './skeleton';

// Card Skeleton
export const CardSkeleton = ({ className }: { className?: string }) => (
  <motion.div 
    className={`p-6 border rounded-lg bg-white dark:bg-gray-800 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="space-y-4">
      <Skeleton variant="text" height="1.5rem" width="60%" />
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="rounded" width="80px" height="32px" />
        <Skeleton variant="rounded" width="80px" height="32px" />
      </div>
    </div>
  </motion.div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <Skeleton variant="text" height="1rem" />
      </td>
    ))}
  </motion.tr>
);

// Chart Skeleton
export const ChartSkeleton = ({ className }: { className?: string }) => (
  <motion.div 
    className={`p-6 border rounded-lg bg-white dark:bg-gray-800 ${className}`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <div className="space-y-4">
      <Skeleton variant="text" height="1.5rem" width="40%" />
      <div className="h-64 flex items-end space-x-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={`${Math.random() * 80 + 20}%`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// Dashboard Stats Skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <motion.div
        key={index}
        className="p-6 border rounded-lg bg-white dark:bg-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="space-y-3">
          <Skeleton variant="circular" width="48px" height="48px" />
          <Skeleton variant="text" height="2rem" width="80%" />
          <Skeleton variant="text" height="1rem" width="60%" />
        </div>
      </motion.div>
    ))}
  </div>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton variant="text" height="1rem" width="25%" />
        <Skeleton variant="rounded" height="40px" width="100%" />
      </div>
    ))}
    <div className="flex space-x-4">
      <Skeleton variant="rounded" width="120px" height="40px" />
      <Skeleton variant="rounded" width="80px" height="40px" />
    </div>
  </motion.div>
);

// Navigation Skeleton
export const NavigationSkeleton = () => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-2">
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton variant="text" height="1rem" width="60%" />
      </div>
    ))}
  </motion.div>
);

// Content Replacement Hook
export const useContentReplacement = () => {
  const replaceContent = (
    isLoading: boolean,
    skeleton: React.ReactNode,
    content: React.ReactNode
  ) => (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { replaceContent };
};