'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendUp, Target, Users, Lightning, Trophy, DownloadSimple, ClipboardText } from 'phosphor-react'
import { getLeaderboardStats } from '@/app/lib/outcomes'
import type { LeaderboardStats } from '@/app/lib/outcomes'
import type { EvidenceScore } from '@/app/lib/database-schema'
import { getDB } from '@/app/lib/database-schema'
import type { PlanRecommendation, Feedback } from '@/app/lib/database-schema'

export default function EvidencePage() {
  const router = useRouter()
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [selectedRec, setSelectedRec] = useState<{ score: EvidenceScore; rec: PlanRecommendation; feedback: Feedback[] } | null>(null)
  const [loading, setLoading] = useState(true)

  const db = getDB()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const leaderboard = getLeaderboardStats()
    setStats(leaderboard)
    setLoading(false)
  }

  const handleViewDetails = (score: EvidenceScore) => {
    const rec = db.getPlanRecommendation(score.planRecommendationId)
    const feedback = rec ? db.getFeedbackByPlanRecommendation(rec.id) : []
    
    if (rec) {
      setSelectedRec({ score, rec, feedback })
    }
  }

  const handleExportEvidenceCard = (score: EvidenceScore) => {
    const rec = db.getPlanRecommendation(score.planRecommendationId)
    const feedback = rec ? db.getFeedbackByPlanRecommendation(rec.id) : []
    const events = rec ? db.getEventsByPlanRecommendation(rec.id) : []
    
    const evidenceCard = {
      metric: score.metric,
      scenario: score.scenario,
      recommendation: rec?.recommendation,
      baseline: score.baselineValue,
      final: score.finalValue,
      delta: score.delta,
      deltaPercent: score.deltaPercent,
      evidenceScore: score.evidenceScore,
      coverage: score.coverage,
      persistence: score.persistence,
      observationDays: score.observationDays,
      activities: events.map(e => ({
        type: e.eventType,
        date: e.recordedAt,
        data: e.eventData,
      })),
      quotes: feedback.filter(f => f.feedbackType === 'quote').map(f => f.feedbackText),
      nextSteps: rec?.resources || 'Continue monitoring and expanding adoption',
    }
    
    // Download as JSON (could be enhanced to PDF/PPTX)
    const blob = new Blob([JSON.stringify(evidenceCard, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evidence-card-${score.metric.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    alert('📊 Evidence Card exported! (JSON format - can be enhanced to PDF/PPTX)')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading evidence...</div>
      </div>
    )
  }

  if (!stats || stats.totalRecommendations === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Evidence</h1>
              </div>
              <button
                onClick={() => router.push('/plans')}
                className="inline-flex items-center px-4 py-2 bg-microsoft-blue text-white font-medium rounded-lg hover:bg-blue-600"
              >
                <ClipboardText size={20} className="mr-2" weight="fill" />
                View Plans
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <Trophy size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Evidence Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Complete some recommendations and capture metric snapshots to see evidence of success here.
            </p>
            <button
              onClick={() => router.push('/plans')}
              className="px-6 py-3 bg-microsoft-blue text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              View Plans
            </button>
          </div>
        </main>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Evidence & Outcomes</h1>
            </div>
            <button
              onClick={() => router.push('/plans')}
              className="inline-flex items-center px-4 py-2 bg-microsoft-blue text-white font-medium rounded-lg hover:bg-blue-600"
            >
              <ClipboardText size={20} className="mr-2" weight="fill" />
              View Plans
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Trophy size={32} weight="fill" />
              <div className="text-3xl font-bold">{stats.winRate.toFixed(0)}%</div>
            </div>
            <div className="text-sm opacity-90">Win Rate</div>
            <div className="text-xs opacity-75 mt-1">
              {stats.successfulRecommendations} of {stats.totalRecommendations} succeeded
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendUp size={32} weight="fill" />
              <div className="text-3xl font-bold">{stats.avgDelta.toFixed(1)}</div>
            </div>
            <div className="text-sm opacity-90">Avg Delta</div>
            <div className="text-xs opacity-75 mt-1">Average improvement</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users size={32} weight="fill" />
              <div className="text-3xl font-bold">{stats.avgCoverage.toFixed(0)}%</div>
            </div>
            <div className="text-sm opacity-90">Avg Coverage</div>
            <div className="text-xs opacity-75 mt-1">Audience reached</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Lightning size={32} weight="fill" />
              <div className="text-3xl font-bold">{stats.avgPersistence.toFixed(0)}%</div>
            </div>
            <div className="text-sm opacity-90">Avg Persistence</div>
            <div className="text-xs opacity-75 mt-1">Sustained impact</div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Performing Recommendations</h2>
          <div className="space-y-4">
            {stats.topRecommendations.map((score, index) => (
              <div
                key={score.planRecommendationId}
                className="border border-gray-200 rounded-lg p-4 hover:border-microsoft-blue hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewDetails(score)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-microsoft-blue text-xs font-semibold rounded-full">
                          {score.metric}
                        </span>
                        {score.success && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            ✓ SUCCESS
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{score.scenario}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Evidence Score</div>
                          <div className="font-bold text-microsoft-blue">{score.evidenceScore.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Delta</div>
                          <div className="font-bold text-gray-900">
                            {score.delta > 0 ? '+' : ''}{score.delta.toFixed(1)}
                            <span className="text-xs ml-1 text-gray-600">({score.deltaPercent.toFixed(0)}%)</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Coverage</div>
                          <div className="flex items-center space-x-1">
                            <div className="font-bold text-gray-900">{(score.coverage * 100).toFixed(0)}%</div>
                            {score.coverage < 0.3 && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded" title="Low coverage - consider logging activities">
                                ⚠️
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Duration</div>
                          <div className="font-bold text-gray-900">{score.observationDays} days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportEvidenceCard(score)
                    }}
                    className="ml-4 p-2 text-microsoft-blue hover:bg-blue-50 rounded-lg"
                    title="Export Evidence Card"
                  >
                    <DownloadSimple size={24} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Evidence Details Modal */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Evidence Details</h3>
              <button
                onClick={() => setSelectedRec(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Low Coverage Warning */}
              {selectedRec.score.coverage < 0.3 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-bold text-yellow-800 mb-1">Low Coverage Detected</h4>
                      <p className="text-sm text-yellow-700">
                        {selectedRec.score.coverage === 0 
                          ? "No engagement activities were tracked for this recommendation. The Evidence Score may not accurately reflect impact."
                          : `Only ${(selectedRec.score.coverage * 100).toFixed(0)}% coverage was achieved. Consider logging more engagement activities to strengthen evidence.`
                        }
                      </p>
                      <p className="text-xs text-yellow-600 mt-2">
                        💡 <strong>Tip:</strong> Go to the Plans page and use "Log Activity" to track outreach, events, and learning assignments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metric & Scenario */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-microsoft-blue text-sm font-semibold rounded-full">
                    {selectedRec.score.metric}
                  </span>
                  {selectedRec.score.success && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      ✓ SUCCESS
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedRec.score.scenario}</h4>
                <p className="text-gray-700">{selectedRec.rec.recommendation}</p>
              </div>

              {/* Before/After */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs font-semibold text-gray-500 mb-1">BASELINE</div>
                  <div className="text-3xl font-bold text-gray-900">{selectedRec.score.baselineValue}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs font-semibold text-green-600 mb-1">FINAL</div>
                  <div className="text-3xl font-bold text-green-700">{selectedRec.score.finalValue}</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-microsoft-blue">
                    {selectedRec.score.delta > 0 ? '+' : ''}{selectedRec.score.delta.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Delta ({selectedRec.score.deltaPercent.toFixed(0)}%)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{(selectedRec.score.coverage * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 mt-1">Coverage</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">{(selectedRec.score.persistence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600 mt-1">Persistence</div>
                </div>
              </div>

              {/* Evidence Score */}
              <div className="bg-gradient-to-r from-microsoft-blue to-purple-600 rounded-lg p-6 text-white text-center">
                <div className="text-sm opacity-90 mb-2">EVIDENCE SCORE</div>
                <div className="text-5xl font-bold">{selectedRec.score.evidenceScore.toFixed(2)}</div>
                <div className="text-xs opacity-75 mt-2">
                  Delta × Coverage × Persistence over {selectedRec.score.observationDays} days
                </div>
              </div>

              {/* Quotes */}
              {selectedRec.feedback.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">💬 Feedback & Quotes</h5>
                  <div className="space-y-3">
                    {selectedRec.feedback.map(fb => (
                      <div key={fb.id} className="bg-blue-50 border-l-4 border-microsoft-blue rounded p-4">
                        <p className="text-gray-700 italic">"{fb.feedbackText}"</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(fb.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">📋 Resources Used</h5>
                <p className="text-gray-700">{selectedRec.rec.resources}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => handleExportEvidenceCard(selectedRec.score)}
                className="px-4 py-2 bg-microsoft-blue text-white font-medium rounded-lg hover:bg-blue-600 inline-flex items-center"
              >
                <DownloadSimple size={20} className="mr-2" weight="bold" />
                Export Evidence Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
