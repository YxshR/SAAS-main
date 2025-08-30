'use client'

import { motion } from 'framer-motion'
import { Check, CreditCard, Loader2, CheckCircle } from 'lucide-react'

interface PaymentProgressProps {
  currentStep: 'details' | 'processing' | 'status'
}

export function PaymentProgress({ currentStep }: PaymentProgressProps) {
  const steps = [
    {
      id: 'details',
      name: 'Payment Details',
      description: 'Enter your payment information',
      icon: CreditCard
    },
    {
      id: 'processing',
      name: 'Processing',
      description: 'Securely processing your payment',
      icon: Loader2
    },
    {
      id: 'status',
      name: 'Complete',
      description: 'Payment confirmation',
      icon: CheckCircle
    }
  ]

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : status === 'current' && step.id === 'processing' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  
                  {/* Pulse effect for current step */}
                  {status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-300"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                {/* Step Info */}
                <div className="mt-3 text-center">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className="text-xs text-gray-400 mt-1 max-w-24"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 mb-8">
                  <motion.div
                    className="h-0.5 bg-gray-200 relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <motion.div
                      className={`absolute inset-y-0 left-0 h-full transition-all duration-500 ${
                        getStepStatus(steps[index + 1].id) === 'completed' || 
                        (getStepStatus(steps[index + 1].id) === 'current' && status === 'completed')
                          ? 'bg-green-500 w-full'
                          : getStepStatus(steps[index + 1].id) === 'current'
                          ? 'bg-blue-500 w-1/2'
                          : 'bg-gray-200 w-0'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: getStepStatus(steps[index + 1].id) === 'completed' || 
                               (getStepStatus(steps[index + 1].id) === 'current' && status === 'completed')
                          ? '100%'
                          : getStepStatus(steps[index + 1].id) === 'current'
                          ? '50%'
                          : '0%'
                      }}
                      transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}