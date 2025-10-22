'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Lightbulb } from 'phosphor-react'
import { useAdoptionStore } from '@/app/lib/store'
import { evaluateRules } from '@/app/lib/evaluation'
import { sampleInputs } from '@/app/lib/sample-data'
import type { RulesData, UserInput } from '@/app/lib/schemas'

export default function InputsPage() {
  const router = useRouter()
  const { inputs, setInput, setResults, clearInputs } = useAdoptionStore()
  const [rulesData, setRulesData] = useState<RulesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load rules data
    import('@/app/data/rules.json')
      .then((data) => {
        setRulesData(data as RulesData)
        setLoading(false)
      })
      .catch(() => {
        // Fallback to seed data
        import('@/app/data/rules.seed').then(({ seedRules }) => {
          setRulesData(seedRules as RulesData)
          setLoading(false)
        })
      })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rulesData) return

    // Evaluate rules against inputs
    const results = evaluateRules(rulesData.rules, inputs)
    setResults(results)
    
    // Navigate to results
    router.push('/results')
  }

  const loadSampleData = () => {
    // Load all sample inputs into the store
    Object.entries(sampleInputs).forEach(([key, input]) => {
      setInput(key, input)
    })
  }

  const resetData = () => {
    // Clear all inputs from the store
    clearInputs()
  }

  const getHelperText = (rule: any): string => {
    const target = rule.target || ''
    
    // Generate helpful examples based on scenario and target
    if (rule.scenario.toLowerCase().includes('active users') || rule.scenario.toLowerCase().includes('utilization')) {
      return `e.g., 42% (target: ${target})`
    }
    if (rule.scenario.toLowerCase().includes('weekly actions')) {
      return `e.g., 3 actions/week (target: ${target})`
    }
    if (rule.scenario.toLowerCase().includes('apps')) {
      return `e.g., 2 apps (target: ${target})`
    }
    if (rule.scenario.toLowerCase().includes('hours')) {
      return `e.g., 0.8 hours (target: ${target})`
    }
    if (rule.scenario.toLowerCase().includes('trend') || rule.scenario.toLowerCase().includes('plateau') || rule.scenario.toLowerCase().includes('spike')) {
      return `Select trend: ${target}`
    }
    if (rule.scenario.toLowerCase().includes('feature')) {
      return `e.g., 0.5% usage (target: ${target})`
    }
    if (target) {
      return `Target: ${target}`
    }
    return 'Enter value'
  }

  if (loading || !rulesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  // Define input fields per metric (ONE section per metric)
  const metricInputConfig: Record<string, Array<{ key: string; label: string; type: 'number' | 'text'; helper: string }>> = {
    'Usage Summary': [
      { key: 'activeUsersPercent', label: '% Active users', type: 'number', helper: 'e.g., 42% (target: 95/100%)' },
      { key: 'weeklyActions', label: 'Avg weekly actions per user', type: 'number', helper: 'e.g., 3 (target: 11/week)' },
    ],
    'Usage Trends Over Time': [
      { key: 'trendPattern', label: 'Trend pattern', type: 'text', helper: 'e.g., Drop or plateau, Spike after plateau, Growth tapering, Keep momentum' },
    ],
    'Usage Thresholds (Tiers)': [
      { key: 'nonUsersPercent', label: '% Non-users', type: 'number', helper: 'e.g., 25% (target: reduce by 20-30%)' },
      { key: 'lowUsersPercent', label: '% Low users', type: 'number', helper: 'e.g., 20% (target: reduce by 10-15%)' },
      { key: 'habitualUsersPercent', label: '% Habitual users', type: 'number', helper: 'e.g., 40% (target: increase 10-20%)' },
      { key: 'powerUsersPercent', label: '% Power users', type: 'number', helper: 'e.g., 15% (target: increase 2-5%)' },
    ],
    'Usage Since Activation': [
      { key: 'weeksToHabit', label: 'Weeks to create habit', type: 'number', helper: 'e.g., 6 weeks (target: 9-12 weeks)' },
      { key: 'adoptionSpeed', label: 'Adoption speed', type: 'text', helper: 'e.g., Slow ramp, Fast early adoption' },
    ],
    'Feature Usage': [
      { key: 'appsPerWeek', label: 'Apps per user/week', type: 'number', helper: 'e.g., 2 (target: 3+ apps/week)' },
      { key: 'lowestFeatureUsage', label: 'Lowest feature usage %', type: 'number', helper: 'e.g., 0.5% (goal: no feature at 0-1%)' },
    ],
    'Usage Heatmap (by Group/Region)': [
      { key: 'lowAdoptionTeamsPercent', label: '% Teams with low adoption', type: 'number', helper: 'e.g., 35% (target: reduce by 30-40%)' },
      { key: 'regionalVariance', label: 'Regional differences', type: 'text', helper: 'e.g., Significant, Minimal, None' },
    ],
    'Copilot-Assisted Hours': [
      { key: 'assistedHoursPerWeek', label: 'Assisted hours/week', type: 'number', helper: 'e.g., 0.8 (target: 2 hours/week)' },
      { key: 'hoursDeltaBetweenUsers', label: 'Hours difference (high vs low users)', type: 'number', helper: 'e.g., 3.5 (target: <2 hours)' },
    ],
    'Work Patterns': [
      { key: 'workPatternChange', label: 'Work pattern change observed', type: 'text', helper: 'e.g., No visible change, Positive change, Unexpected patterns' },
    ],
    'Mapping Features to Work Patterns': [
      { key: 'featureMappingStatus', label: 'Feature-to-pattern mapping', type: 'text', helper: 'e.g., Needs guidance, In progress, Well-aligned' },
    ],
  }

  const metrics = Object.keys(metricInputConfig)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Copilot Adoption Navigator</h1>
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-microsoft-blue hover:text-blue-700"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Your Metrics</h2>
          <p className="text-gray-600 mb-4">
            Provide your Copilot usage data for each category. Each metric section feeds ALL related scenarios.
          </p>
          
          {/* Sample Data Button */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Lightbulb size={24} className="text-microsoft-blue mt-1" weight="fill" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Try Sample Data</h3>
                  <p className="text-sm text-gray-600">
                    Not sure what to enter? Load sample metrics to see how the tool works.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="px-4 py-2 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                >
                  Load Sample Data
                </button>
                <button
                  type="button"
                  onClick={resetData}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {metrics.map((metric) => {
              const fields = metricInputConfig[metric]
              
              return (
                <div key={metric} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{metric}</h3>
                  
                  <div className="space-y-4">
                    {fields.map((field) => {
                      const inputKey = `${metric}:${field.key}`
                      const currentValue = inputs[inputKey]?.value || ''

                      return (
                        <div key={field.key} className="bg-gray-50 rounded-lg p-4">
                          <label className="block mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {field.label}
                            </span>
                          </label>
                          
                          <input
                            type={field.type}
                            step="any"
                            value={currentValue}
                            onChange={(e) => {
                              const value =
                                field.type === 'text'
                                  ? e.target.value
                                  : parseFloat(e.target.value) || 0
                              
                              setInput(inputKey, {
                                metric,
                                scenario: field.key,
                                value,
                              })
                            }}
                            placeholder={field.helper}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-microsoft-blue focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-gray-500">{field.helper}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
              >
                Generate Recommendations
                <ArrowRight className="ml-2" size={20} weight="bold" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
