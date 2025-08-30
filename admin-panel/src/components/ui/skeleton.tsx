'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

const Skeleton = ({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true,
  ...props 
}: SkeletonProps) => {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-md"
  };

  const skeletonAnimation = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { backgroundPosition: '200px 0' }
  };

  const contentAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <motion.div 
        className="space-y-2"
        variants={contentAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
            style={{ 
              width: width || '100%', 
              height: height || '1rem',
              backgroundSize: '400px 100%'
            }}
            variants={animate ? skeletonAnimation : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={animate ? { duration: 1.5, ease: 'linear', repeat: Infinity } : undefined}
            {...props}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ 
        width: width || '100%', 
        height: height || '1rem',
        backgroundSize: '400px 100%'
      }}
      variants={animate ? skeletonAnimation : undefined}
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      {...props}
    />
  );
};

export { Skeleton };