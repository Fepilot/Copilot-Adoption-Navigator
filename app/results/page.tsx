'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, DownloadSimple, Funnel, SortAscending, Plus, Play, CheckCircle, XCircle, ChatCircle, Kanban, ChartBar, X, Lightbulb } from 'phosphor-react'
import { useAdoptionStore } from '@/app/lib/store'
import { generateExcelReport, downloadExcel } from '@/app/lib/excel'
import { getDB } from '@/app/lib/database-schema'
import { track } from '@/app/lib/telemetry'
import { getActivityTemplate, calculateCoverageFromActivities } from '@/app/lib/activity-templates'
import type { ActivityTemplate } from '@/app/lib/activity-templates'

export default function ResultsPage() {
  const router = useRouter()
  const { results } = useAdoptionStore()
  const [filterMetric, setFilterMetric] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'gap' | 'effort'>('gap')
  const [downloading, setDownloading] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; recId: string | null }>({ open: false, recId: null })
  const [feedbackText, setFeedbackText] = useState('')
  const [actionStates, setActionStates] = useState<Record<string, { inPlan?: boolean; started?: boolean; completed?: 'success' | 'fail' }>>({})
  const [activityModal, setActivityModal] = useState<{ open: boolean; rec: any | null; template: ActivityTemplate | null }>({ open: false, rec: null, template: null })
  const [activityForm, setActivityForm] = useState<{ audienceSize: string; activities: Record<string, string> }>({ audienceSize: '', activities: {} })

  const db = getDB()
  const tenantId = 'demo-tenant-001'

  const handleAddToPlan = async (rec: any) => {
    // Create or get active plan
    let activePlans = db.getPlansByTenant(tenantId).filter(p => p.status === 'in_progress')
    let activePlan = activePlans[0]
    
    if (!activePlan) {
      activePlan = db.createPlan({
        tenantId,
        name: `Adoption Plan ${new Date().toLocaleDateString()}`,
        description: 'Auto-generated plan from recommendations',
        status: 'in_progress',
        createdBy: 'user@example.com',
      })
    }
    
    // Add recommendation to plan
    const planRec = db.createPlanRecommendation({
      planId: activePlan.id,
      recommendationId: rec.ruleId,
      metric: rec.metric,
      scenario: rec.scenario,
      recommendation: rec.recommendation,
      resources: rec.resources,
    })
    
    // Track event
    track('ADDED_TO_PLAN', { planRecommendationId: planRec.id, eventData: { addedBy: 'user@example.com' } })
    
    // Update state
    setActionStates(prev => ({ ...prev, [rec.ruleId]: { ...prev[rec.ruleId], inPlan: true } }))
    
    alert(`Added to plan: ${activePlan.name}`)
  }

  const handleStart = (rec: any) => {
    const planRecs = Array.from(db['planRecommendations'].values()).filter(pr => pr.recommendationId === rec.ruleId)
    const planRec = planRecs[0]
    
    if (planRec) {
      // Create baseline snapshot when starting
      const baselineValue = prompt(`Enter the current (baseline) value for ${rec.metric}:`, rec.currentValue || '0')
      
      if (baselineValue !== null) {
        db.createSnapshot({
          planId: planRec.planId,
          metric: rec.metric,
          snapshotType: 'baseline',
          value: isNaN(Number(baselineValue)) ? baselineValue : Number(baselineValue),
        })
        
        track('STARTED', { planRecommendationId: planRec.id, eventData: { startedBy: 'user@example.com', baselineValue } })
        setActionStates(prev => ({ ...prev, [rec.ruleId]: { ...prev[rec.ruleId], started: true } }))
        alert('Recommendation started! Baseline captured. Track your progress in the Plans page.')
      }
    } else {
      alert('Please add to plan first')
    }
  }

  const handleMarkSuccess = (rec: any) => {
    const planRecs = Array.from(db['planRecommendations'].values()).filter(pr => pr.recommendationId === rec.ruleId)
    const planRec = planRecs[0]
    
    if (planRec) {
      // Create baseline snapshot if it doesn't exist
      const existingSnapshots = db.getSnapshotsByPlan(planRec.planId)
      const hasBaseline = existingSnapshots.some(s => s.metric === rec.metric && s.snapshotType === 'baseline')
      
      if (!hasBaseline) {
        // Use the current input value as baseline
        const baselineValue = rec.currentValue || rec.value || 0
        db.createSnapshot({
          planId: planRec.planId,
          metric: rec.metric,
          snapshotType: 'baseline',
          value: baselineValue,
        })
      }
      
      // Create final snapshot (prompt user for final value)
      const finalValue = prompt(`Enter the final value for ${rec.metric} after implementing this recommendation:`, rec.currentValue || '0')
      
      if (finalValue !== null) {
        db.createSnapshot({
          planId: planRec.planId,
          metric: rec.metric,
          snapshotType: 'final',
          value: isNaN(Number(finalValue)) ? finalValue : Number(finalValue),
        })
        
        track('MARKED_SUCCESS', { planRecommendationId: planRec.id, eventData: { markedBy: 'user@example.com', finalValue } })
        setActionStates(prev => ({ ...prev, [rec.ruleId]: { ...prev[rec.ruleId], completed: 'success' } }))
        alert('🎉 Success recorded! View evidence in the Evidence page.')
      }
    } else {
      alert('Please add to plan first')
    }
  }

  const handleMarkFail = (rec: any) => {
    const planRecs = Array.from(db['planRecommendations'].values()).filter(pr => pr.recommendationId === rec.ruleId)
    const planRec = planRecs[0]
    
    if (planRec) {
      track('MARKED_FAIL', { planRecommendationId: planRec.id, eventData: { markedBy: 'user@example.com' } })
      setActionStates(prev => ({ ...prev, [rec.ruleId]: { ...prev[rec.ruleId], completed: 'fail' } }))
      alert('Marked as didn\'t help. Your feedback helps improve recommendations.')
    } else {
      alert('Please add to plan first')
    }
  }

  const handleOpenFeedback = (recId: string) => {
    setFeedbackModal({ open: true, recId })
    setFeedbackText('')
  }

  const handleSubmitFeedback = () => {
    if (!feedbackModal.recId || !feedbackText.trim()) return
    
    const planRecs = Array.from(db['planRecommendations'].values()).filter(pr => pr.recommendationId === feedbackModal.recId)
    const planRec = planRecs[0]
    
    if (planRec) {
      db.createFeedback({
        planRecommendationId: planRec.id,
        feedbackType: 'suggestion',
        feedbackText: feedbackText.trim(),
        sentiment: 'neutral',
        submittedBy: 'user@example.com',
      })
      
      track('FEEDBACK_GIVEN', { planRecommendationId: planRec.id, eventData: { feedback: feedbackText.trim() } })
      
      setFeedbackModal({ open: false, recId: null })
      setFeedbackText('')
      alert('Thank you for your feedback!')
    }
  }

  const handleOpenActivityLog = (rec: any) => {
    const template = getActivityTemplate(rec.recommendation)
    setActivityModal({ open: true, rec, template })
    setActivityForm({ audienceSize: template.sampleData.audienceSize.toString(), activities: {} })
  }

  const handleLoadSampleActivities = () => {
    if (!activityModal.template) return
    const sample = activityModal.template.sampleData
    setActivityForm({
      audienceSize: sample.audienceSize.toString(),
      activities: Object.fromEntries(
        Object.entries(sample.activities).map(([k, v]) => [k, v.toString()])
      ),
    })
  }

  const handleLogActivities = () => {
    if (!activityModal.rec) return

    const planRecs = Array.from(db['planRecommendations'].values()).filter(pr => pr.recommendationId === activityModal.rec.ruleId)
    const planRec = planRecs[0]

    if (!planRec) {
      alert('Please add to plan first')
      return
    }

    const audienceSize = parseInt(activityForm.audienceSize) || 1000
    const activities: Record<string, number> = {}

    // Convert string inputs to numbers
    Object.entries(activityForm.activities).forEach(([key, value]) => {
      const num = parseInt(value)
      if (!isNaN(num) && num > 0) {
        activities[key] = num
      }
    })

    if (Object.keys(activities).length === 0) {
      alert('Please enter at least one activity')
      return
    }

    // Track all activities as events
    Object.entries(activities).forEach(([activityType, count]) => {
      track('OUTREACH_SENT', {
        planRecommendationId: planRec.id,
        eventData: {
          activityType,
          count,
          audienceSize,
          recordedBy: 'user@example.com',
        },
      })
    })

    setActivityModal({ open: false, rec: null, template: null })
    alert(`✅ ${Object.keys(activities).length} activities logged successfully!`)
  }

  if (!results || results.triggered.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Copilot Adoption Navigator</h1>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Found</h2>
          <p className="text-gray-600 mb-8">
            Based on your inputs, all metrics are within target ranges. Great job!
          </p>
          <button
            onClick={() => router.push('/inputs')}
            className="inline-flex items-center px-6 py-3 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Inputs
          </button>
        </main>
      </div>
    )
  }

  const metrics = Array.from(new Set(results.triggered.map((r) => r.metric)))
  
  const filtered =
    filterMetric === 'all'
      ? results.triggered
      : results.triggered.filter((r) => r.metric === filterMetric)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'gap') {
      const gapA = Math.abs(a.gap || 0)
      const gapB = Math.abs(b.gap || 0)
      return gapB - gapA
    } else {
      const effortOrder = { high: 3, medium: 2, low: 1 }
      return effortOrder[b.effort || 'medium'] - effortOrder[a.effort || 'medium']
    }
  })

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const buffer = await generateExcelReport(results.triggered)
      downloadExcel(buffer)
    } catch (error) {
      console.error('Error downloading Excel:', error)
      alert('Failed to download Excel report')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Recommendations</h1>
          <button
            onClick={() => router.push('/inputs')}
            className="flex items-center text-microsoft-blue hover:text-blue-700"
          >
            <ArrowLeft className="mr-2" size={20} />
            Edit Inputs
          </button>
        </div>
      </header>

      {/* Summary Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <span className="text-3xl font-bold text-microsoft-blue">
                  {results.triggered.length}
                </span>
                <span className="ml-2 text-gray-600">Recommendations</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  Based on {results.totalInputs} inputs
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/plans')}
                className="flex items-center px-6 py-2 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Kanban className="mr-2" size={20} weight="bold" />
                View Plans
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center px-6 py-2 bg-microsoft-green text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <DownloadSimple className="mr-2" size={20} weight="bold" />
                {downloading ? 'Downloading...' : 'Download Excel'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Funnel size={20} className="text-gray-500" />
              <select
                value={filterMetric}
                onChange={(e) => setFilterMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-microsoft-blue"
              >
                <option value="all">All Metrics</option>
                {metrics.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <SortAscending size={20} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'gap' | 'effort')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-microsoft-blue"
              >
                <option value="gap">Sort by Gap</option>
                <option value="effort">Sort by Effort</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {sorted.map((rec, index) => (
            <div
              key={rec.ruleId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-microsoft-blue text-xs font-semibold rounded-full">
                      {rec.metric}
                    </span>
                    {rec.effort && (
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          rec.effort === 'high'
                            ? 'bg-red-100 text-red-700'
                            : rec.effort === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {rec.effort.toUpperCase()} EFFORT
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.scenario}</h3>
                </div>
                <div className="text-right ml-4">
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">Your Value</div>
                    <div className="text-2xl font-bold text-gray-900">{rec.userValue}</div>
                  </div>
                  {rec.target && (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs font-medium text-gray-600 mb-1">Target</div>
                      <div className="text-sm font-semibold text-microsoft-blue">{rec.target}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Action:</h4>
                <p className="text-gray-700">{rec.recommendation}</p>
              </div>

              {rec.resources && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Resources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.resources.split(';').map((resource, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                      >
                        {resource.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rec.gap !== null && rec.gap !== undefined && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-sm text-gray-600">
                    Gap to target: <span className="font-semibold">{rec.gap.toFixed(1)}</span>
                    {rec.gapPercent && (
                      <span className="ml-2">
                        ({rec.gapPercent > 0 ? '+' : ''}
                        {rec.gapPercent.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddToPlan(rec)}
                    disabled={actionStates[rec.ruleId]?.inPlan}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      actionStates[rec.ruleId]?.inPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-microsoft-blue text-white hover:bg-blue-600'
                    }`}
                  >
                    <Plus size={16} className="mr-1" weight="bold" />
                    {actionStates[rec.ruleId]?.inPlan ? 'In Plan' : 'Add to Plan'}
                  </button>
                  
                  <button
                    onClick={() => handleStart(rec)}
                    disabled={!actionStates[rec.ruleId]?.inPlan || actionStates[rec.ruleId]?.started}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      actionStates[rec.ruleId]?.started
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : actionStates[rec.ruleId]?.inPlan
                        ? 'bg-microsoft-green text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Play size={16} className="mr-1" weight="fill" />
                    {actionStates[rec.ruleId]?.started ? 'Started' : 'Start'}
                  </button>

                  <button
                    onClick={() => handleOpenActivityLog(rec)}
                    disabled={!actionStates[rec.ruleId]?.started}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      actionStates[rec.ruleId]?.started
                        ? 'bg-purple-50 text-purple-700 border border-purple-300 hover:bg-purple-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChartBar size={16} className="mr-1" weight="bold" />
                    Log Activities
                  </button>
                  
                  <button
                    onClick={() => handleMarkSuccess(rec)}
                    disabled={!actionStates[rec.ruleId]?.started || actionStates[rec.ruleId]?.completed === 'success'}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      actionStates[rec.ruleId]?.completed === 'success'
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : actionStates[rec.ruleId]?.started
                        ? 'bg-green-50 text-microsoft-green border border-microsoft-green hover:bg-green-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle size={16} className="mr-1" weight="fill" />
                    {actionStates[rec.ruleId]?.completed === 'success' ? 'Success!' : 'Mark Success'}
                  </button>
                  
                  <button
                    onClick={() => handleMarkFail(rec)}
                    disabled={!actionStates[rec.ruleId]?.started || actionStates[rec.ruleId]?.completed === 'fail'}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      actionStates[rec.ruleId]?.completed === 'fail'
                        ? 'bg-red-100 text-red-700 cursor-not-allowed'
                        : actionStates[rec.ruleId]?.started
                        ? 'bg-red-50 text-microsoft-orange border border-microsoft-orange hover:bg-red-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <XCircle size={16} className="mr-1" weight="fill" />
                    {actionStates[rec.ruleId]?.completed === 'fail' ? 'Marked' : 'Didn\'t Help'}
                  </button>
                  
                  <button
                    onClick={() => handleOpenFeedback(rec.ruleId)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                  >
                    <ChatCircle size={16} className="mr-1" weight="fill" />
                    Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What worked? What didn't? Any suggestions?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue focus:border-transparent resize-none"
              rows={5}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setFeedbackModal({ open: false, recId: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 text-sm font-medium bg-microsoft-blue text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {activityModal.open && activityModal.rec && activityModal.template && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Log Activities</h2>
              <button
                onClick={() => setActivityModal({ open: false, rec: null, template: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-900 mb-1">{activityModal.rec.scenario}</div>
                <div className="text-xs text-gray-600 mb-2">{activityModal.rec.metric}</div>
                <div className="text-xs text-gray-700 italic">{activityModal.rec.recommendation}</div>
              </div>

              {/* Load Sample Button */}
              <div className="mb-6 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb size={20} className="text-purple-700" weight="fill" />
                  <span className="text-sm font-medium text-gray-900">Not sure what to enter?</span>
                </div>
                <button
                  onClick={handleLoadSampleActivities}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
                >
                  Load Sample Activities
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Total Audience Size
                  </label>
                  <input
                    type="number"
                    value={activityForm.audienceSize}
                    onChange={(e) => setActivityForm({ ...activityForm, audienceSize: e.target.value })}
                    placeholder="e.g., 1000 users"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue"
                  />
                  <p className="mt-1 text-xs text-gray-500">Total number of users in your target audience</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Activities Performed</h3>
                  <div className="space-y-3">
                    {activityModal.template.activities.map((activity) => (
                      <div key={activity.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {activity.icon} {activity.label}
                        </label>
                        <input
                          type="number"
                          value={activityForm.activities[activity.id] || ''}
                          onChange={(e) => setActivityForm({
                            ...activityForm,
                            activities: { ...activityForm.activities, [activity.id]: e.target.value }
                          })}
                          placeholder={activity.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue"
                        />
                        <p className="mt-1 text-xs text-gray-500">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coverage Preview */}
                {Object.values(activityForm.activities).some(v => v && parseInt(v) > 0) && activityForm.audienceSize && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">📊 Coverage Preview</h4>
                    {(() => {
                      const activities = Object.fromEntries(
                        Object.entries(activityForm.activities)
                          .filter(([_, v]) => v && parseInt(v) > 0)
                          .map(([k, v]) => [k, parseInt(v)])
                      )
                      const audienceSize = parseInt(activityForm.audienceSize) || 1000
                      const { coverage, breakdown, totalReached } = calculateCoverageFromActivities(activities, audienceSize)
                      
                      return (
                        <>
                          <div className="text-2xl font-bold text-green-700 mb-2">
                            {(coverage * 100).toFixed(1)}% Coverage
                          </div>
                          <div className="text-xs text-gray-700 whitespace-pre-line">{breakdown}</div>
                          <div className="mt-3 p-3 bg-white rounded border border-green-300">
                            <p className="text-xs text-gray-700">
                              <strong>How this helps:</strong> {activityModal.template.explanation}
                            </p>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <strong>💡 Tip:</strong> These activities contribute to the <strong>Coverage</strong> metric in your Evidence Score.
                    Higher coverage = stronger proof your recommendation worked!
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setActivityModal({ open: false, rec: null, template: null })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogActivities}
                  className="px-4 py-2 bg-microsoft-blue text-white font-medium rounded-lg hover:bg-blue-600"
                >
                  Log Activities
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
