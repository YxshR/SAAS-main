'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function UIComponentDemo() {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState('')
  const [inputSuccess, setInputSuccess] = useState(false)

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Simple validation demo
    if (value.length > 0 && value.length < 3) {
      setInputError('Must be at least 3 characters')
      setInputSuccess(false)
    } else if (value.length >= 3) {
      setInputError('')
      setInputSuccess(true)
    } else {
      setInputError('')
      setInputSuccess(false)
    }
  }

  const SearchIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  const HeartIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )

  const StarIcon = () => (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium UI Component Library
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhanced components with smooth animations, premium styling, and comprehensive functionality
          </p>
        </motion.div>

        {/* Button Showcase */}
        <Card variant="elevated" size="lg">
          <CardHeader>
            <CardTitle>Enhanced Button Components</CardTitle>
            <CardDescription>
              Multiple variants with animation states, loading indicators, and premium styling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Primary Variants</h4>
                <div className="space-y-3">
                  <Button variant="primary" size="sm">Small Primary</Button>
                  <Button variant="primary" size="md">Medium Primary</Button>
                  <Button variant="primary" size="lg">Large Primary</Button>
                  <Button variant="gradient" size="md">Gradient Button</Button>
                </div>
              </div>

              {/* Secondary & Outline */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Secondary & Outline</h4>
                <div className="space-y-3">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outlined</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              {/* Interactive States */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Interactive States</h4>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    loading={loading} 
                    onClick={handleButtonClick}
                  >
                    {loading ? 'Loading...' : 'Click to Load'}
                  </Button>
                  <Button variant="primary" icon={<HeartIcon />}>
                    With Icon
                  </Button>
                  <Button variant="outline" icon={<StarIcon />} iconPosition="right">
                    Icon Right
                  </Button>
                  <Button variant="primary" fullWidth>
                    Full Width Button
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Showcase */}
        <Card variant="elevated" size="lg">
          <CardHeader>
            <CardTitle>Enhanced Input Components</CardTitle>
            <CardDescription>
              Floating labels, validation states, icons, and smooth micro-animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Floating Label Inputs */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Floating Label Inputs</h4>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<SearchIcon />}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  helperText="Must be at least 8 characters"
                />
                <Input
                  label="Search"
                  value={inputValue}
                  onChange={handleInputChange}
                  error={inputError}
                  success={inputSuccess}
                  leftIcon={<SearchIcon />}
                  placeholder="Type to see validation"
                />
              </div>

              {/* Input Variants */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Input Variants</h4>
                <Input
                  label="Filled Input"
                  variant="filled"
                  placeholder="Filled variant"
                />
                <Input
                  label="Outlined Input"
                  variant="outlined"
                  placeholder="Outlined variant"
                  rightIcon={<HeartIcon />}
                />
                <Input
                  label="Default Input"
                  variant="default"
                  placeholder="Default variant"
                  floatingLabel={false}
                />
                <Input
                  label="Disabled Input"
                  placeholder="This is disabled"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Showcase */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Card Components</h2>
            <p className="text-lg text-gray-600">
              Multiple variants with hover effects, shadows, and content animations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card variant="default" interactive>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  A simple card with subtle hover effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a default card with interactive hover effects. Click to see the tap animation.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated" size="lg">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  Enhanced shadows and lift effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0 rating</span>
                </div>
                <p>This elevated card has enhanced shadow effects and smooth animations.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm" icon={<HeartIcon />}>
                  Like
                </Button>
              </CardFooter>
            </Card>

            {/* Gradient Card */}
            <Card variant="gradient" size="md">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>
                  Beautiful gradient background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card features a subtle gradient background that enhances on hover.</p>
              </CardContent>
              <CardFooter>
                <Button variant="gradient" size="sm">
                  Explore
                </Button>
              </CardFooter>
            </Card>

            {/* Loading Card */}
            <Card variant="elevated" loading>
              <CardContent>
                Loading content will be displayed here...
              </CardContent>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined" interactive>
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>
                  Clean outlined design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses a clean outlined design with interactive hover states.</p>
              </CardContent>
            </Card>

            {/* Filled Card */}
            <Card variant="filled" hover={false}>
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>
                  Subtle filled background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has a subtle filled background without hover effects.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Showcase */}
        <Card variant="gradient" size="xl">
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>
              Key features implemented in the enhanced UI component library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smooth Animations</h4>
                <p className="text-sm text-gray-600">Framer Motion powered animations with performance optimization</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  ♿
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Accessibility First</h4>
                <p className="text-sm text-gray-600">Respects reduced motion preferences and includes proper ARIA labels</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  🎨
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Premium Design</h4>
                <p className="text-sm text-gray-600">Modern gradients, shadows, and typography following design tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}