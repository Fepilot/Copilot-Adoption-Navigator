'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash, Calendar, Target, CheckCircle, ChartBar, X, Trophy } from 'phosphor-react'
import { getDB } from '@/app/lib/database-schema'
import type { Plan, PlanRecommendation, PlanStatus } from '@/app/lib/database-schema'
import { getEventHistory, track } from '@/app/lib/telemetry'
import { seedMockData } from '@/app/lib/seed-data'

export default function PlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [planRecs, setPlanRecs] = useState<PlanRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [activityModal, setActivityModal] = useState<{ open: boolean; rec: PlanRecommendation | null }>({ open: false, rec: null })
  const [activityForm, setActivityForm] = useState({ outreachCount: '', eventAttendees: '', learningUsers: '', audienceSize: '' })
  
  const db = getDB()
  const tenantId = 'demo-tenant-001'

  useEffect(() => {
    loadPlans()
  }, [])

  useEffect(() => {
    if (selectedPlan) {
      loadPlanRecommendations(selectedPlan.id)
    }
  }, [selectedPlan])

  const loadPlans = () => {
    const allPlans = db.getPlansByTenant(tenantId)
    setPlans(allPlans)
    
    // Auto-select first plan if available
    if (allPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(allPlans[0])
    }
    
    setLoading(false)
  }

  const loadPlanRecommendations = (planId: string) => {
    const recs = db.getPlanRecommendationsByPlan(planId)
    setPlanRecs(recs)
  }

  const handleLoadSampleData = () => {
    seedMockData()
    loadPlans()
    alert('✅ Sample data loaded! Explore the plans and recommendations.')
  }

  const handleCreatePlan = () => {
    const name = prompt('Enter plan name:')
    if (!name) return

    const newPlan = db.createPlan({
      tenantId,
      name,
      description: '',
      status: 'planned',
      createdBy: 'user@example.com',
    })

    setPlans([...plans, newPlan])
    setSelectedPlan(newPlan)
  }

  const handleUpdatePlanStatus = (planId: string, status: PlanStatus) => {
    db.updatePlan(planId, { status })
    loadPlans()
    if (selectedPlan?.id === planId) {
      setSelectedPlan({ ...selectedPlan, status })
    }
  }

  const handleDeletePlan = (planId: string) => {
    if (!confirm('Delete this plan?')) return
    db.deletePlan(planId)
    loadPlans()
    if (selectedPlan?.id === planId) {
      setSelectedPlan(plans.length > 1 ? plans[0] : null)
    }
  }

  const getRecommendationsByStatus = () => {
    const planned = planRecs.filter(r => !r.startedAt && !r.completedAt)
    const inProgress = planRecs.filter(r => r.startedAt && !r.completedAt)
    const done = planRecs.filter(r => r.completedAt)
    
    return { planned, inProgress, done }
  }

  const getEventCount = (recId: string) => {
    const events = getEventHistory(recId)
    return events.length
  }

  const handleOpenActivityLog = (rec: PlanRecommendation) => {
    setActivityModal({ open: true, rec })
    setActivityForm({ outreachCount: '', eventAttendees: '', learningUsers: '', audienceSize: '' })
  }

  const handleLogActivity = () => {
    if (!activityModal.rec) return

    const { outreachCount, eventAttendees, learningUsers, audienceSize } = activityForm
    const recId = activityModal.rec.id

    // Track outreach if provided
    if (outreachCount && parseInt(outreachCount) > 0) {
      track('OUTREACH_SENT', {
        planRecommendationId: recId,
        eventData: {
          count: parseInt(outreachCount),
          audienceSize: parseInt(audienceSize) || 1000,
          recordedBy: 'user@example.com',
        },
      })
    }

    // Track events if provided
    if (eventAttendees && parseInt(eventAttendees) > 0) {
      track('EVENT_HELD', {
        planRecommendationId: recId,
        eventData: {
          attendees: parseInt(eventAttendees),
          audienceSize: parseInt(audienceSize) || 1000,
          recordedBy: 'user@example.com',
        },
      })
    }

    // Track learning if provided
    if (learningUsers && parseInt(learningUsers) > 0) {
      track('LEARNING_ASSIGNED', {
        planRecommendationId: recId,
        eventData: {
          users: parseInt(learningUsers),
          audienceSize: parseInt(audienceSize) || 1000,
          recordedBy: 'user@example.com',
        },
      })
    }

    setActivityModal({ open: false, rec: null })
    loadPlanRecommendations(activityModal.rec.planId)
    alert('✅ Activities logged successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading plans...</div>
      </div>
    )
  }

  const { planned, inProgress, done } = selectedPlan ? getRecommendationsByStatus() : { planned: [], inProgress: [], done: [] }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-microsoft-blue hover:text-blue-700"
              >
                <ArrowLeft className="mr-2" size={20} />
                Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Adoption Plans</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/evidence')}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
              >
                <Trophy size={20} className="mr-2" weight="fill" />
                View Evidence
              </button>
              {plans.length === 0 && (
                <button
                  onClick={handleLoadSampleData}
                  className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
                >
                  Load Sample Data
                </button>
              )}
              <button
                onClick={handleCreatePlan}
                className="inline-flex items-center px-4 py-2 bg-microsoft-blue text-white font-medium rounded-lg hover:bg-blue-600"
              >
                <Plus size={20} className="mr-2" weight="bold" />
                New Plan
              </button>
            </div>
          </div>
        </div>
      </header>

      {plans.length === 0 ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <Target size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Plans Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first adoption plan or load sample data to see how the Plan-Execute-Evidence loop works.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLoadSampleData}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
              >
                Load Sample Data
              </button>
              <button
                onClick={handleCreatePlan}
                className="px-6 py-3 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                Create Plan
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Plan Selector */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedPlan?.id === plan.id
                      ? 'border-microsoft-blue bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{plan.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        plan.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                        plan.status === 'done' ? 'bg-blue-100 text-blue-700' :
                        plan.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {plan.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Details & Kanban */}
          {selectedPlan && (
            <>
              {/* Plan Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlan.name}</h2>
                    {selectedPlan.description && (
                      <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {selectedPlan.startDate && (
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          Start: {new Date(selectedPlan.startDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedPlan.targetDate && (
                        <div className="flex items-center">
                          <Target size={16} className="mr-1" />
                          Target: {new Date(selectedPlan.targetDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedPlan.completedDate && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" weight="fill" />
                          Completed: {new Date(selectedPlan.completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedPlan.status}
                      onChange={(e) => handleUpdatePlanStatus(selectedPlan.id, e.target.value as PlanStatus)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-microsoft-blue"
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => handleDeletePlan(selectedPlan.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete plan"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Planned Column */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>📋 Planned</span>
                    <span className="text-sm font-normal text-gray-500">{planned.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {planned.map(rec => (
                      <div key={rec.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-microsoft-blue mb-2">{rec.metric}</div>
                        <div className="text-sm font-medium text-gray-900 mb-2">{rec.scenario}</div>
                        <div className="text-xs text-gray-600 mb-3 line-clamp-2">{rec.recommendation}</div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Added {new Date(rec.addedAt).toLocaleDateString()}</span>
                          {rec.priority && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                              P{rec.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {planned.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-8">
                        No planned items
                      </div>
                    )}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>🚀 In Progress</span>
                    <span className="text-sm font-normal text-gray-500">{inProgress.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {inProgress.map(rec => {
                      const eventCount = getEventCount(rec.id)
                      return (
                        <div key={rec.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow border-l-4 border-microsoft-blue">
                          <div className="text-xs font-semibold text-microsoft-blue mb-2">{rec.metric}</div>
                          <div className="text-sm font-medium text-gray-900 mb-2">{rec.scenario}</div>
                          <div className="text-xs text-gray-600 mb-3 line-clamp-2">{rec.recommendation}</div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-500">Started {rec.startedAt ? new Date(rec.startedAt).toLocaleDateString() : 'N/A'}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                              {eventCount} events
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenActivityLog(rec)}
                            className="w-full flex items-center justify-center px-3 py-1.5 bg-microsoft-blue text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
                          >
                            <ChartBar size={14} className="mr-1" weight="bold" />
                            Log Activity
                          </button>
                        </div>
                      )
                    })}
                    {inProgress.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-8">
                        No active items
                      </div>
                    )}
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>✅ Done</span>
                    <span className="text-sm font-normal text-gray-500">{done.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {done.map(rec => {
                      const eventCount = getEventCount(rec.id)
                      return (
                        <div key={rec.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow border-l-4 border-microsoft-green">
                          <div className="text-xs font-semibold text-microsoft-green mb-2">{rec.metric}</div>
                          <div className="text-sm font-medium text-gray-900 mb-2">{rec.scenario}</div>
                          <div className="text-xs text-gray-600 mb-3 line-clamp-2">{rec.recommendation}</div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Completed {rec.completedAt ? new Date(rec.completedAt).toLocaleDateString() : 'N/A'}</span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                              {eventCount} events
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    {done.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-8">
                        No completed items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Activity Log Modal */}
      {activityModal.open && activityModal.rec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Log Activity</h2>
              <button
                onClick={() => setActivityModal({ open: false, rec: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-900 mb-1">{activityModal.rec.scenario}</div>
                <div className="text-xs text-gray-600">{activityModal.rec.metric}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Audience Size
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📧 Outreach Sent (emails, messages)
                      </label>
                      <input
                        type="number"
                        value={activityForm.outreachCount}
                        onChange={(e) => setActivityForm({ ...activityForm, outreachCount: e.target.value })}
                        placeholder="e.g., 500"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue"
                      />
                      <p className="mt-1 text-xs text-gray-500">Number of users who received outreach</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎯 Event Attendees
                      </label>
                      <input
                        type="number"
                        value={activityForm.eventAttendees}
                        onChange={(e) => setActivityForm({ ...activityForm, eventAttendees: e.target.value })}
                        placeholder="e.g., 120"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue"
                      />
                      <p className="mt-1 text-xs text-gray-500">Number of users who attended events</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📚 Learning Assigned
                      </label>
                      <input
                        type="number"
                        value={activityForm.learningUsers}
                        onChange={(e) => setActivityForm({ ...activityForm, learningUsers: e.target.value })}
                        placeholder="e.g., 200"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-microsoft-blue"
                      />
                      <p className="mt-1 text-xs text-gray-500">Number of users assigned learning paths</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <strong>💡 Tip:</strong> These activities contribute to the <strong>Coverage</strong> metric in your Evidence Score.
                    Higher coverage = stronger proof your recommendation worked!
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setActivityModal({ open: false, rec: null })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogActivity}
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
