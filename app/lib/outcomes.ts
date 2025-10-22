/**
 * Outcomes calculation engine for Evidence Scores
 */

import { getDB } from './database-schema'
import type { EvidenceScore, MetricSnapshot, PlanRecommendation } from './database-schema'

/**
 * Success thresholds per metric type
 * Defines minimum improvement required to consider recommendation successful
 */
const SUCCESS_THRESHOLDS: Record<string, { deltaPercent?: number; absoluteDelta?: number }> = {
  'Usage Summary': { deltaPercent: 10 }, // 10% improvement
  'Usage Trends Over Time': { deltaPercent: 15 },
  'Usage Thresholds (Tiers)': { deltaPercent: 5 },
  'Usage Since Activation': { deltaPercent: 8 },
  'Feature Usage': { deltaPercent: 12 },
  'Usage Heatmap (by Group/Region)': { deltaPercent: 10 },
  'Copilot-Assisted Hours': { deltaPercent: 20 },
  'Work Patterns': { deltaPercent: 5 },
  'Mapping Features to Work Patterns': { deltaPercent: 10 },
}

/**
 * Calculate delta between baseline and final values
 */
function calculateDelta(baseline: number | string, final: number | string): { delta: number; deltaPercent: number } {
  // Handle numeric values
  if (typeof baseline === 'number' && typeof final === 'number') {
    const delta = final - baseline
    const deltaPercent = baseline !== 0 ? (delta / baseline) * 100 : 0
    return { delta, deltaPercent }
  }

  // Handle text values (qualitative improvement assumed if changed positively)
  if (typeof baseline === 'string' && typeof final === 'string') {
    const improved = final.toLowerCase() !== baseline.toLowerCase()
    return {
      delta: improved ? 1 : 0,
      deltaPercent: improved ? 100 : 0,
    }
  }

  return { delta: 0, deltaPercent: 0 }
}

/**
 * Calculate coverage: % of target audience reached
 * Based on outreach events and engagement
 * If no events exist, auto-estimate based on whether recommendation was completed
 */
function calculateCoverage(planRecommendationId: string): number {
  const db = getDB()
  const events = db.getEventsByPlanRecommendation(planRecommendationId)
  const rec = db.getPlanRecommendation(planRecommendationId)
  
  // Count engagement events with audience data
  const engagementEvents = events.filter(e => 
    (e.eventType === 'OUTREACH_SENT' || 
     e.eventType === 'EVENT_HELD' || 
     e.eventType === 'LEARNING_ASSIGNED') &&
    e.eventData?.audienceSize
  )
  
  if (engagementEvents.length > 0) {
    // Calculate coverage from actual tracked events
    let totalReached = 0
    let totalAudience = 0
    
    for (const event of engagementEvents) {
      const audienceSize = event.eventData?.audienceSize || 1000
      const reached = event.eventData?.count || event.eventData?.attendees || event.eventData?.users || 0
      
      totalReached += reached
      totalAudience = Math.max(totalAudience, audienceSize) // Use the largest audience size
    }
    
    return totalAudience > 0 ? Math.min(totalReached / totalAudience, 1.0) : 0
  }
  
  // AUTO-ESTIMATION: No events tracked, but recommendation was completed
  // Assume modest coverage based on completion status
  if (rec?.completedAt) {
    // If marked as success/fail but no activities logged, assume 30% coverage
    // This represents "we tried it, but didn't formally track activities"
    return 0.30
  }
  
  // No events and not completed = 0% coverage
  return 0
}

/**
 * Calculate persistence: weeks sustained with decay
 * Checks checkpoint snapshots and recent activity
 */
function calculatePersistence(planRecommendationId: string, observationDays: number): number {
  const db = getDB()
  const events = db.getEventsByPlanRecommendation(planRecommendationId)
  
  // Count checkpoint snapshots
  const checkpoints = events.filter(e => e.eventType === 'CHECKPOINT_SNAPSHOT')
  
  if (checkpoints.length === 0) {
    // No checkpoints: assume decay after 2 weeks
    const weeks = observationDays / 7
    return Math.max(1.0 - (weeks - 2) * 0.1, 0.3)
  }
  
  // With checkpoints: persistence based on checkpoint frequency
  const weeks = observationDays / 7
  const checkpointFrequency = checkpoints.length / weeks
  
  // Ideal: 1 checkpoint per week = 1.0 persistence
  return Math.min(checkpointFrequency, 1.0)
}

/**
 * Calculate Evidence Score for a plan recommendation
 */
export function calculateEvidenceScore(
  planRecommendationId: string,
  baselineValue: number | string,
  finalValue: number | string,
  metric: string,
  scenario: string
): EvidenceScore {
  const db = getDB()
  const rec = db.getPlanRecommendation(planRecommendationId)
  
  if (!rec) {
    throw new Error(`Plan recommendation ${planRecommendationId} not found`)
  }

  // Calculate deltas
  const { delta, deltaPercent } = calculateDelta(baselineValue, finalValue)
  
  // Calculate components
  const coverage = calculateCoverage(planRecommendationId)
  const observationDays = rec.startedAt
    ? Math.floor((new Date().getTime() - new Date(rec.startedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const persistence = calculatePersistence(planRecommendationId, observationDays)
  
  // Evidence Score = delta × coverage × persistence
  const evidenceScore = Math.abs(delta) * coverage * persistence
  
  // Determine success
  const threshold = SUCCESS_THRESHOLDS[metric] || { deltaPercent: 10 }
  const success = threshold.deltaPercent
    ? deltaPercent >= threshold.deltaPercent
    : threshold.absoluteDelta
    ? Math.abs(delta) >= threshold.absoluteDelta
    : false
  
  // Calculate win rate (placeholder - would query historical data)
  const winRate = success ? 0.75 : 0.25
  
  return {
    planRecommendationId,
    metric,
    scenario,
    baselineValue,
    finalValue,
    delta,
    deltaPercent,
    coverage,
    persistence,
    evidenceScore,
    success,
    winRate,
    observationDays,
    calculatedAt: new Date().toISOString(),
  }
}

/**
 * Get Evidence Scores for all completed recommendations in a plan
 */
export function getEvidenceScoresForPlan(planId: string): EvidenceScore[] {
  const db = getDB()
  const planRecs = db.getPlanRecommendationsByPlan(planId)
  const snapshots = db.getSnapshotsByPlan(planId)
  const scores: EvidenceScore[] = []
  
  for (const rec of planRecs) {
    if (!rec.completedAt) continue
    
    // Find baseline and final snapshots for this recommendation's metric
    const baselineSnapshot = snapshots.find(
      s => s.metric === rec.metric && s.snapshotType === 'baseline'
    )
    const finalSnapshot = snapshots.find(
      s => s.metric === rec.metric && s.snapshotType === 'final'
    )
    
    if (baselineSnapshot && finalSnapshot) {
      try {
        const score = calculateEvidenceScore(
          rec.id,
          baselineSnapshot.value,
          finalSnapshot.value,
          rec.metric,
          rec.scenario
        )
        scores.push(score)
      } catch (error) {
        console.error('Failed to calculate evidence score:', error)
      }
    }
  }
  
  return scores
}

/**
 * Get leaderboard stats across all recommendations
 */
export interface LeaderboardStats {
  totalRecommendations: number
  successfulRecommendations: number
  winRate: number
  avgDelta: number
  avgCoverage: number
  avgPersistence: number
  topRecommendations: EvidenceScore[]
}

export function getLeaderboardStats(): LeaderboardStats {
  const db = getDB()
  const allRecs = Array.from(db['planRecommendations'].values())
  const completedRecs = allRecs.filter(r => r.completedAt)
  
  // Calculate evidence scores for all completed recommendations
  const scores: EvidenceScore[] = []
  
  for (const rec of completedRecs) {
    // Find associated plan and snapshots
    const plan = db.getPlan(rec.planId)
    if (!plan) continue
    
    const snapshots = db.getSnapshotsByPlan(plan.id)
    const baselineSnapshot = snapshots.find(
      s => s.metric === rec.metric && s.snapshotType === 'baseline'
    )
    const finalSnapshot = snapshots.find(
      s => s.metric === rec.metric && s.snapshotType === 'final'
    )
    
    if (baselineSnapshot && finalSnapshot) {
      try {
        const score = calculateEvidenceScore(
          rec.id,
          baselineSnapshot.value,
          finalSnapshot.value,
          rec.metric,
          rec.scenario
        )
        scores.push(score)
      } catch (error) {
        // Skip if calculation fails
      }
    }
  }
  
  const successfulCount = scores.filter(s => s.success).length
  const avgDelta = scores.length > 0
    ? scores.reduce((sum, s) => sum + s.delta, 0) / scores.length
    : 0
  const avgCoverage = scores.length > 0
    ? scores.reduce((sum, s) => sum + s.coverage, 0) / scores.length
    : 0
  const avgPersistence = scores.length > 0
    ? scores.reduce((sum, s) => sum + s.persistence, 0) / scores.length
    : 0
  
  // Top 10 by evidence score
  const topRecommendations = scores
    .sort((a, b) => b.evidenceScore - a.evidenceScore)
    .slice(0, 10)
  
  return {
    totalRecommendations: scores.length,
    successfulRecommendations: successfulCount,
    winRate: scores.length > 0 ? (successfulCount / scores.length) * 100 : 0,
    avgDelta,
    avgCoverage: avgCoverage * 100,
    avgPersistence: avgPersistence * 100,
    topRecommendations,
  }
}
