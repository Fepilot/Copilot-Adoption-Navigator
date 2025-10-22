/**
 * Telemetry tracking system for Plan-Execute-Evidence loop
 */

import { getDB } from './database-schema'
import type { EventType, RecommendationEvent } from './database-schema'

export interface TrackEventPayload {
  planRecommendationId?: string
  eventType: EventType
  eventData?: Record<string, any>
  recordedBy?: string
}

/**
 * Track an event in the Plan-Execute-Evidence loop
 */
export function track(eventType: EventType, payload: Omit<TrackEventPayload, 'eventType'>): RecommendationEvent | null {
  const { planRecommendationId, eventData, recordedBy } = payload

  if (!planRecommendationId) {
    console.warn('track() called without planRecommendationId')
    return null
  }

  const db = getDB()
  
  try {
    const event = db.createEvent({
      planRecommendationId,
      eventType,
      eventData,
      recordedBy,
    })

    // Update plan recommendation status based on event type
    if (eventType === 'STARTED') {
      db.updatePlanRecommendation(planRecommendationId, {
        startedAt: new Date().toISOString(),
      })
    } else if (eventType === 'MARKED_SUCCESS' || eventType === 'MARKED_FAIL') {
      db.updatePlanRecommendation(planRecommendationId, {
        completedAt: new Date().toISOString(),
      })
    }

    console.log(`[Telemetry] ${eventType}:`, { planRecommendationId, eventData })
    return event
  } catch (error) {
    console.error('[Telemetry] Failed to track event:', error)
    return null
  }
}

/**
 * Track multiple events at once
 */
export function trackBatch(events: TrackEventPayload[]): RecommendationEvent[] {
  return events
    .map(e => track(e.eventType, e))
    .filter((e): e is RecommendationEvent => e !== null)
}

/**
 * Get event history for a plan recommendation
 */
export function getEventHistory(planRecommendationId: string): RecommendationEvent[] {
  const db = getDB()
  return db.getEventsByPlanRecommendation(planRecommendationId)
}

/**
 * Get event counts by type
 */
export function getEventCounts(planRecommendationId: string): Record<EventType, number> {
  const events = getEventHistory(planRecommendationId)
  const counts: Record<string, number> = {}
  
  for (const event of events) {
    counts[event.eventType] = (counts[event.eventType] || 0) + 1
  }
  
  return counts as Record<EventType, number>
}

/**
 * Check if a recommendation has been started
 */
export function hasStarted(planRecommendationId: string): boolean {
  const events = getEventHistory(planRecommendationId)
  return events.some(e => e.eventType === 'STARTED')
}

/**
 * Check if a recommendation has been completed (success or fail)
 */
export function hasCompleted(planRecommendationId: string): boolean {
  const events = getEventHistory(planRecommendationId)
  return events.some(e => e.eventType === 'MARKED_SUCCESS' || e.eventType === 'MARKED_FAIL')
}

/**
 * Get engagement score based on event diversity
 */
export function getEngagementScore(planRecommendationId: string): number {
  const counts = getEventCounts(planRecommendationId)
  const eventTypes = Object.keys(counts).length
  const totalEvents = Object.values(counts).reduce((sum, count) => sum + count, 0)
  
  // Score: variety (0-50) + volume (0-50)
  const varietyScore = Math.min(eventTypes * 10, 50)
  const volumeScore = Math.min(totalEvents * 5, 50)
  
  return varietyScore + volumeScore
}
