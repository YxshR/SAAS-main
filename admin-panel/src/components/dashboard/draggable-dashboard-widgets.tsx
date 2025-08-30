'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { AdvancedInteractiveChart } from '../charts/advanced-interactive-chart'

interface Widget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'text'
  title: string
  data?: any
  config?: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  isResizable?: boolean
}

interface DraggableDashboardWidgetsProps {
  initialWidgets: Widget[]
  onWidgetsChange?: (widgets: Widget[]) => void
  gridSize?: number
  className?: string
}

const WIDGET_TYPES = {
  chart: {
    icon: '📊',
    name: 'Chart',
    defaultSize: { width: 400, height: 300 }
  },
  metric: {
    icon: '📈',
    name: 'Metric',
    defaultSize: { width: 200, height: 150 }
  },
  table: {
    icon: '📋',
    name: 'Table',
    defaultSize: { width: 500, height: 300 }
  },
  text: {
    icon: '📝',
    name: 'Text',
    defaultSize: { width: 300, height: 200 }
  }
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  widget: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    }
  },
  dragging: {
    scale: 1.05,
    rotate: 2,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
  }
}

export function DraggableDashboardWidgets({
  initialWidgets,
  onWidgetsChange,
  gridSize = 20,
  className = ''
}: DraggableDashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [isAddingWidget, setIsAddingWidget] = useState(false)

  const handleDragEnd = useCallback((result: DropResult) => {
    setDraggedWidget(null)
    
    if (!result.destination) return

    const newWidgets = Array.from(widgets)
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1)
    newWidgets.splice(result.destination.index, 0, reorderedWidget)

    setWidgets(newWidgets)
    onWidgetsChange?.(newWidgets)
  }, [widgets, onWidgetsChange])

  const handleDragStart = useCallback((start: any) => {
    setDraggedWidget(start.draggableId)
  }, [])

  const addWidget = useCallback((type: keyof typeof WIDGET_TYPES) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${WIDGET_TYPES[type].name}`,
      position: { x: 0, y: 0 },
      size: WIDGET_TYPES[type].defaultSize,
      isResizable: true,
      data: type === 'chart' ? generateSampleChartData() : undefined,
      config: type === 'chart' ? generateSampleChartConfig() : undefined
    }

    const updatedWidgets = [...widgets, newWidget]
    setWidgets(updatedWidgets)
    onWidgetsChange?.(updatedWidgets)
    setIsAddingWidget(false)
  }, [widgets, onWidgetsChange])

  const removeWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId)
    setWidgets(updatedWidgets)
    onWidgetsChange?.(updatedWidgets)
  }, [widgets, onWidgetsChange])

  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>) => {
    const updatedWidgets = widgets.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    )
    setWidgets(updatedWidgets)
    onWidgetsChange?.(updatedWidgets)
  }, [widgets, onWidgetsChange])

  const renderWidget = (widget: Widget, isDragging: boolean) => {
    const baseClasses = `
      bg-white rounded-lg border border-gray-200 overflow-hidden
      ${isDragging ? 'shadow-2xl' : 'shadow-sm hover:shadow-md'}
      transition-shadow duration-200
    `

    switch (widget.type) {
      case 'chart':
        return (
          <div className={baseClasses}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{widget.title}</h3>
              <button
                onClick={() => removeWidget(widget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {widget.data && widget.config && (
                <AdvancedInteractiveChart
                  data={widget.data}
                  configs={widget.config}
                  title=""
                  height={200}
                  enableCustomization={false}
                />
              )}
            </div>
          </div>
        )

      case 'metric':
        return (
          <div className={baseClasses}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">{widget.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {widget.data?.value || '0'}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{widget.data?.change || '0'}% from last month
                </p>
              </div>
              <button
                onClick={() => removeWidget(widget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )

      case 'table':
        return (
          <div className={baseClasses}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{widget.title}</h3>
              <button
                onClick={() => removeWidget(widget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Value</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(widget.data?.rows || []).map((row: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{row.name}</td>
                        <td className="py-2">{row.value}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            row.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className={baseClasses}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{widget.title}</h3>
              <button
                onClick={() => removeWidget(widget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {widget.data?.content || 'This is a text widget. Click to edit the content.'}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Add Widget Button */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setIsAddingWidget(!isAddingWidget)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Widget</span>
        </button>

        <AnimatePresence>
          {isAddingWidget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <p className="text-sm text-gray-600 mb-3">Choose a widget type:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(WIDGET_TYPES).map(([type, config]) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addWidget(type as keyof typeof WIDGET_TYPES)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">{config.icon}</div>
                    <div className="text-xs text-gray-700">{config.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Widgets Grid */}
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="dashboard-widgets">
          {(provided, snapshot) => (
            <motion.div
              ref={provided.innerRef}
              {...provided.droppableProps}
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
              className={`
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
                ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                transition-colors duration-200 rounded-lg p-4
              `}
            >
              <AnimatePresence>
                {widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                        }}
                      >
                        <motion.div
                          variants={ANIMATION_VARIANTS.widget}
                          animate={snapshot.isDragging ? ANIMATION_VARIANTS.dragging : ANIMATION_VARIANTS.widget.visible}
                          layout
                        >
                          {renderWidget(widget, snapshot.isDragging)}
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>

      {widgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <div className="text-4xl mb-4">📊</div>
          <p>No widgets yet. Click &quot;Add Widget&quot; to get started!</p>
        </motion.div>
      )}
    </div>
  )
}

// Helper functions for sample data
function generateSampleChartData() {
  return [
    { name: 'Jan', value: 400, sales: 240 },
    { name: 'Feb', value: 300, sales: 139 },
    { name: 'Mar', value: 200, sales: 980 },
    { name: 'Apr', value: 278, sales: 390 },
    { name: 'May', value: 189, sales: 480 },
    { name: 'Jun', value: 239, sales: 380 }
  ]
}

function generateSampleChartConfig() {
  return [
    {
      type: 'line' as const,
      dataKey: 'value',
      color: '#3b82f6',
      name: 'Revenue',
      strokeWidth: 2,
      gradient: true
    },
    {
      type: 'line' as const,
      dataKey: 'sales',
      color: '#10b981',
      name: 'Sales',
      strokeWidth: 2,
      gradient: false
    }
  ]
}