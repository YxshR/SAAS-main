'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/lib/animation-hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Content Creator',
    company: 'TechReview',
    avatar: '👩‍💻',
    content: 'This tool has revolutionized how I consume educational content. I can now get through 10x more videos and articles in the same time, with better retention.',
    rating: 5,
    highlight: 'revolutionized how I consume educational content'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Research Analyst',
    company: 'DataCorp',
    avatar: '👨‍🔬',
    content: 'The AI-powered summaries are incredibly accurate. I use it daily for market research and it saves me hours of reading through lengthy reports.',
    rating: 5,
    highlight: 'saves me hours of reading'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Student',
    company: 'MIT',
    avatar: '👩‍🎓',
    content: 'Perfect for studying! The chat feature helps me understand complex topics by asking follow-up questions. My grades have improved significantly.',
    rating: 5,
    highlight: 'My grades have improved significantly'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Product Manager',
    company: 'StartupXYZ',
    avatar: '👨‍💼',
    content: 'I stay updated with industry trends by summarizing dozens of articles daily. The timestamp navigation for videos is a game-changer.',
    rating: 5,
    highlight: 'timestamp navigation for videos is a game-changer'
  },
  {
    id: 5,
    name: 'Priya Patel',
    role: 'Journalist',
    company: 'NewsDaily',
    avatar: '👩‍📰',
    content: 'As a journalist, I need to process information quickly. This tool helps me identify key points instantly and verify facts with source citations.',
    rating: 5,
    highlight: 'identify key points instantly'
  },
  {
    id: 6,
    name: 'Alex Thompson',
    role: 'Developer',
    company: 'CodeCraft',
    avatar: '👨‍💻',
    content: 'The text-to-speech feature is amazing for multitasking. I can listen to summaries while coding, making me more productive than ever.',
    rating: 5,
    highlight: 'making me more productive than ever'
  }
]

export function TestimonialsCarousel() {
  const { ref: sectionRef, isInView: sectionInView } = useScrollAnimation(0.1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(1)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          ref={sectionRef as any}
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            Loved by thousands of users
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            See what our community says about transforming their content consumption experience
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Main Testimonial Display */}
          <div className="relative h-80 mb-8 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="text-center p-8">
                    {/* Avatar and Info */}
                    <motion.div 
                      className="flex flex-col items-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                      <div className="text-4xl mb-3">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-gray-600">
                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                      </p>
                    </motion.div>

                    {/* Rating */}
                    <motion.div 
                      className="flex justify-center mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="text-yellow-400 text-xl"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: 0.5 + i * 0.1,
                            type: "spring",
                            stiffness: 500
                          }}
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Testimonial Content */}
                    <motion.blockquote 
                      className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      "                      &ldquo;{testimonials[currentIndex].content}&rdquo;"
                    </motion.blockquote>

                    {/* Highlight */}
                    <motion.div
                      className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      "                      &ldquo;{testimonials[currentIndex].highlight}&rdquo;"
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Previous Button */}
            <motion.button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: index === currentIndex ? 1.25 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Auto-play Indicator */}
          <motion.div 
            className="flex items-center justify-center space-x-2 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={isAutoPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isAutoPlaying ? Infinity : 0, ease: "linear" }}
            >
              {isAutoPlaying ? '⏯️' : '⏸️'}
            </motion.div>
            <span>
              {isAutoPlaying ? 'Auto-playing testimonials' : 'Auto-play paused'}
            </span>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: isAutoPlaying ? '100%' : '0%' }}
              transition={{ 
                duration: isAutoPlaying ? 4 : 0,
                ease: "linear",
                repeat: isAutoPlaying ? Infinity : 0
              }}
            />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { number: '10,000+', label: 'Happy Users', icon: '👥' },
            { number: '500,000+', label: 'Content Summarized', icon: '📄' },
            { number: '4.9/5', label: 'Average Rating', icon: '⭐' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-6"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}