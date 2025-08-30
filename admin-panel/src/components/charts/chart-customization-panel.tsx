'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdvancedInteractiveChart } from './advanced-interactive-chart'

interface ChartCustomizationConfig {
  type: 'line' | 'area' | 'bar' | 'scatter' | 'pie'
  dataKey: string
  color: string
  name: string
  strokeWidth?: number
  fillOpacity?: number
  gradient?: boolean
  showDots?: boolean
  curved?: boolean
}

interface ChartStyle {
  backgroundColor: string
  borderColor: string
  borderRadius: number
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  padding: number
}

interface ChartCustomizationPanelProps {
  data: any[]
  initialConfigs: ChartCustomizationConfig[]
  initialStyle?: Partial<ChartStyle>
  onConfigChange?: (configs: ChartCustomizationConfig[]) => void
  onStyleChange?: (style: ChartStyle) => void
  className?: string
}

const CHART_TYPES = [
  { value: 'line', label: 'Line Chart', icon: '📈' },
  { value: 'area', label: 'Area Chart', icon: '📊' },
  { value: 'bar', label: 'Bar Chart', icon: '📊' },
  { value: 'scatter', label: 'Scatter Plot', icon: '⚪' },
  { value: 'pie', label: 'Pie Chart', icon: '🥧' }
]

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
]

const SHADOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' }
]

const ANIMATION_VARIANTS = {
  panel: {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      transition: { duration: 0.2 }
    }
  },
  section: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  },
  preview: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  }
}

export function ChartCustomizationPanel({
  data,
  initialConfigs,
  initialStyle = {},
  onConfigChange,
  onStyleChange,
  className = ''
}: ChartCustomizationPanelProps) {
  const [configs, setConfigs] = useState<ChartCustomizationConfig[]>(initialConfigs)
  const [style, setStyle] = useState<ChartStyle>({
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadow: 'sm',
    padding: 24,
    ...initialStyle
  })
  const [activeTab, setActiveTab] = useState<'data' | 'style' | 'animation'>('data')
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    onConfigChange?.(configs)
    setPreviewKey(prev => prev + 1)
  }, [configs, onConfigChange])

  useEffect(() => {
    onStyleChange?.(style)
    setPreviewKey(prev => prev + 1)
  }, [style, onStyleChange])

  const updateConfig = useCallback((index: number, updates: Partial<ChartCustomizationConfig>) => {
    setConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, ...updates } : config
    ))
  }, [])

  const addDataSeries = useCallback(() => {
    const availableKeys = Object.keys(data[0] || {}).filter(key => 
      !configs.some(config => config.dataKey === key)
    )
    
    if (availableKeys.length > 0) {
      const newConfig: ChartCustomizationConfig = {
        type: 'line',
        dataKey: availableKeys[0],
        color: PRESET_COLORS[configs.length % PRESET_COLORS.length],
        name: availableKeys[0].charAt(0).toUpperCase() + availableKeys[0].slice(1),
        strokeWidth: 2,
        fillOpacity: 0.6,
        gradient: false,
        showDots: true,
        curved: true
      }
      setConfigs(prev => [...prev, newConfig])
    }
  }, [data, configs])

  const removeDataSeries = useCallback((index: number) => {
    setConfigs(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateStyle = useCallback((updates: Partial<ChartStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }))
  }, [])

  const renderDataTab = () => (
    <motion.div variants={ANIMATION_VARIANTS.section} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Data Series</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addDataSeries}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Series
        </motion.button>
      </div>

      <div className="space-y-4">
        {configs.map((config, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{config.name}</h4>
              {configs.length > 1 && (
                <button
                  onClick={() => removeDataSeries(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => updateConfig(index, { type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CHART_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Key
                </label>
                <select
                  value={config.dataKey}
                  onChange={(e) => updateConfig(index, { dataKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(data[0] || {}).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={config.color}
                    onChange={(e) => updateConfig(index, { color: e.target.value })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex space-x-1">
                    {PRESET_COLORS.slice(0, 5).map(color => (
                      <button
                        key={color}
                        onClick={() => updateConfig(index, { color })}
                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig(index, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {(config.type === 'line' || config.type === 'area') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Width
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={config.strokeWidth || 2}
                    onChange={(e) => updateConfig(index, { strokeWidth: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{config.strokeWidth || 2}px</span>
                </div>
              )}

              {config.type === 'area' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fill Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.fillOpacity || 0.6}
                    onChange={(e) => updateConfig(index, { fillOpacity: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{Math.round((config.fillOpacity || 0.6) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.gradient || false}
                  onChange={(e) => updateConfig(index, { gradient: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Gradient</span>
              </label>

              {config.type === 'line' && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.showDots || false}
                    onChange={(e) => updateConfig(index, { showDots: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Dots</span>
                </label>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderStyleTab = () => (
    <motion.div variants={ANIMATION_VARIANTS.section} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Chart Style</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.backgroundColor}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Color
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={style.borderColor}
              onChange={(e) => updateStyle({ borderColor: e.target.value })}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={style.borderColor}
              onChange={(e) => updateStyle({ borderColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Radius
          </label>
          <input
            type="range"
            min="0"
            max="24"
            value={style.borderRadius}
            onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{style.borderRadius}px</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shadow
          </label>
          <select
            value={style.shadow}
            onChange={(e) => updateStyle({ shadow: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SHADOW_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Padding
          </label>
          <input
            type="range"
            min="8"
            max="48"
            value={style.padding}
            onChange={(e) => updateStyle({ padding: parseInt(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{style.padding}px</span>
        </div>
      </div>
    </motion.div>
  )

  const getShadowClass = (shadow: string) => {
    switch (shadow) {
      case 'sm': return 'shadow-sm'
      case 'md': return 'shadow-md'
      case 'lg': return 'shadow-lg'
      case 'xl': return 'shadow-xl'
      default: return ''
    }
  }

  return (
    <div className={`flex space-x-6 ${className}`}>
      {/* Customization Panel */}
      <motion.div
        variants={ANIMATION_VARIANTS.panel}
        initial="hidden"
        animate="visible"
        className="w-96 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'data', label: 'Data', icon: '📊' },
              { id: 'style', label: 'Style', icon: '🎨' },
              { id: 'animation', label: 'Animation', icon: '✨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'data' && renderDataTab()}
            {activeTab === 'style' && renderStyleTab()}
            {activeTab === 'animation' && (
              <motion.div variants={ANIMATION_VARIANTS.section}>
                <p className="text-gray-500 text-center py-8">
                  Animation settings coming soon...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Live Preview */}
      <motion.div
        variants={ANIMATION_VARIANTS.preview}
        initial="hidden"
        animate="visible"
        className="flex-1"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          <p className="text-sm text-gray-600">Changes are applied in real-time</p>
        </div>

        <div
          key={previewKey}
          className={`border ${getShadowClass(style.shadow)}`}
          style={{
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            borderRadius: `${style.borderRadius}px`,
            padding: `${style.padding}px`
          }}
        >
          <AdvancedInteractiveChart
            data={data}
            configs={configs}
            title="Preview Chart"
            height={400}
            enableCustomization={false}
            enableAnimation={true}
          />
        </div>
      </motion.div>
    </div>
  )
}