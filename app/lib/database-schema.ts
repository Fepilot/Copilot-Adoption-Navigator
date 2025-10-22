/**
 * Database Schema for Plan-Execute-Evidence Loop
 * 
 * This implements a lightweight in-memory database with localStorage persistence
 * for tracking recommendation plans, execution, and evidence of success.
 */

import { z } from 'zod'

// ============================================================================
// PLANS - Track adoption initiatives
// ============================================================================

export const PlanStatusEnum = z.enum(['planned', 'in_progress', 'done', 'archived'])
export type PlanStatus = z.infer<typeof PlanStatusEnum>

export const PlanSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: PlanStatusEnum,
  startDate: z.string().optional(), // ISO date
  targetDate: z.string().optional(), // ISO date
  completedDate: z.string().optional(), // ISO date
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().optional(),
})

export type Plan = z.infer<typeof PlanSchema>

// ============================================================================
// PLAN_RECOMMENDATIONS - Link recommendations to plans
// ============================================================================

export const PlanRecommendationSchema = z.object({
  id: z.string(),
  planId: z.string(),
  recommendationId: z.string(), // ruleId from the rule
  metric: z.string(),
  scenario: z.string(),
  recommendation: z.string(),
  resources: z.string(),
  priority: z.number().optional(), // 1-5
  addedAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
})

export type PlanRecommendation = z.infer<typeof PlanRecommendationSchema>

// ============================================================================
// RECOMMENDATION_EVENTS - Track execution activities
// ============================================================================

export const EventTypeEnum = z.enum([
  'ADDED_TO_PLAN',
  'STARTED',
  'OUTREACH_SENT',
  'EVENT_HELD',
  'LEARNING_ASSIGNED',
  'CHECKPOINT_SNAPSHOT',
  'FEEDBACK_GIVEN',
  'MARKED_SUCCESS',
  'MARKED_FAIL',
])

export type EventType = z.infer<typeof EventTypeEnum>

export const RecommendationEventSchema = z.object({
  id: z.string(),
  planRecommendationId: z.string(),
  eventType: EventTypeEnum,
  eventData: z.record(z.any()).optional(), // JSON payload
  recordedAt: z.string(),
  recordedBy: z.string().optional(),
})

export type RecommendationEvent = z.infer<typeof RecommendationEventSchema>

// ============================================================================
// FEEDBACK - Qualitative insights
// ============================================================================

export const FeedbackSchema = z.object({
  id: z.string(),
  planRecommendationId: z.string(),
  feedbackType: z.enum(['success', 'challenge', 'suggestion', 'quote']),
  feedbackText: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  submittedAt: z.string(),
  submittedBy: z.string().optional(),
})

export type Feedback = z.infer<typeof FeedbackSchema>

// ============================================================================
// METRIC_SNAPSHOTS - Pre/post metric values
// ============================================================================

export const MetricSnapshotSchema = z.object({
  id: z.string(),
  planId: z.string(),
  metric: z.string(),
  snapshotType: z.enum(['baseline', 'checkpoint', 'final']),
  value: z.union([z.number(), z.string()]),
  recordedAt: z.string(),
  notes: z.string().optional(),
})

export type MetricSnapshot = z.infer<typeof MetricSnapshotSchema>

// ============================================================================
// EVIDENCE SCORE - Calculated outcomes
// ============================================================================

export const EvidenceScoreSchema = z.object({
  planRecommendationId: z.string(),
  metric: z.string(),
  scenario: z.string(),
  
  // Pre/post values
  baselineValue: z.union([z.number(), z.string()]),
  finalValue: z.union([z.number(), z.string()]),
  
  // Outcomes
  delta: z.number(), // Absolute change
  deltaPercent: z.number(), // Percentage change
  
  // Evidence components
  coverage: z.number(), // % of target audience reached (0-1)
  persistence: z.number(), // Weeks sustained (decay factor)
  
  // Computed score
  evidenceScore: z.number(), // delta × coverage × persistence
  
  // Success flag
  success: z.boolean(),
  winRate: z.number(), // % of similar recommendations that succeeded
  
  observationDays: z.number(),
  calculatedAt: z.string(),
})

export type EvidenceScore = z.infer<typeof EvidenceScoreSchema>

// ============================================================================
// IN-MEMORY DATABASE
// ============================================================================

export class InMemoryDB {
  private plans: Map<string, Plan> = new Map()
  private planRecommendations: Map<string, PlanRecommendation> = new Map()
  private events: Map<string, RecommendationEvent> = new Map()
  private feedback: Map<string, Feedback> = new Map()
  private snapshots: Map<string, MetricSnapshot> = new Map()

  constructor() {
    this.loadFromLocalStorage()
  }

  // Plans
  createPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Plan {
    const newPlan: Plan = {
      ...plan,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.plans.set(newPlan.id, newPlan)
    this.saveToLocalStorage()
    return newPlan
  }

  getPlan(id: string): Plan | undefined {
    return this.plans.get(id)
  }

  getPlansByTenant(tenantId: string): Plan[] {
    return Array.from(this.plans.values()).filter(p => p.tenantId === tenantId)
  }

  updatePlan(id: string, updates: Partial<Plan>): Plan | undefined {
    const plan = this.plans.get(id)
    if (!plan) return undefined
    const updated = { ...plan, ...updates, updatedAt: new Date().toISOString() }
    this.plans.set(id, updated)
    this.saveToLocalStorage()
    return updated
  }

  deletePlan(id: string): boolean {
    const deleted = this.plans.delete(id)
    if (deleted) this.saveToLocalStorage()
    return deleted
  }

  // Plan Recommendations
  createPlanRecommendation(rec: Omit<PlanRecommendation, 'id' | 'addedAt'>): PlanRecommendation {
    const newRec: PlanRecommendation = {
      ...rec,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    }
    this.planRecommendations.set(newRec.id, newRec)
    this.saveToLocalStorage()
    return newRec
  }

  getPlanRecommendation(id: string): PlanRecommendation | undefined {
    return this.planRecommendations.get(id)
  }

  getPlanRecommendationsByPlan(planId: string): PlanRecommendation[] {
    return Array.from(this.planRecommendations.values()).filter(pr => pr.planId === planId)
  }

  updatePlanRecommendation(id: string, updates: Partial<PlanRecommendation>): PlanRecommendation | undefined {
    const rec = this.planRecommendations.get(id)
    if (!rec) return undefined
    const updated = { ...rec, ...updates }
    this.planRecommendations.set(id, updated)
    this.saveToLocalStorage()
    return updated
  }

  // Events
  createEvent(event: Omit<RecommendationEvent, 'id' | 'recordedAt'>): RecommendationEvent {
    const newEvent: RecommendationEvent = {
      ...event,
      id: crypto.randomUUID(),
      recordedAt: new Date().toISOString(),
    }
    this.events.set(newEvent.id, newEvent)
    this.saveToLocalStorage()
    return newEvent
  }

  getEventsByPlanRecommendation(planRecommendationId: string): RecommendationEvent[] {
    return Array.from(this.events.values()).filter(e => e.planRecommendationId === planRecommendationId)
  }

  getAllEvents(): RecommendationEvent[] {
    return Array.from(this.events.values())
  }

  // Feedback
  createFeedback(fb: Omit<Feedback, 'id' | 'submittedAt'>): Feedback {
    const newFeedback: Feedback = {
      ...fb,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    }
    this.feedback.set(newFeedback.id, newFeedback)
    this.saveToLocalStorage()
    return newFeedback
  }

  getFeedbackByPlanRecommendation(planRecommendationId: string): Feedback[] {
    return Array.from(this.feedback.values()).filter(f => f.planRecommendationId === planRecommendationId)
  }

  // Snapshots
  createSnapshot(snapshot: Omit<MetricSnapshot, 'id' | 'recordedAt'>): MetricSnapshot {
    const newSnapshot: MetricSnapshot = {
      ...snapshot,
      id: crypto.randomUUID(),
      recordedAt: new Date().toISOString(),
    }
    this.snapshots.set(newSnapshot.id, newSnapshot)
    this.saveToLocalStorage()
    return newSnapshot
  }

  getSnapshotsByPlan(planId: string): MetricSnapshot[] {
    return Array.from(this.snapshots.values()).filter(s => s.planId === planId)
  }

  // Persistence
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('copilot_nav_plans', JSON.stringify(Array.from(this.plans.entries())))
      localStorage.setItem('copilot_nav_plan_recs', JSON.stringify(Array.from(this.planRecommendations.entries())))
      localStorage.setItem('copilot_nav_events', JSON.stringify(Array.from(this.events.entries())))
      localStorage.setItem('copilot_nav_feedback', JSON.stringify(Array.from(this.feedback.entries())))
      localStorage.setItem('copilot_nav_snapshots', JSON.stringify(Array.from(this.snapshots.entries())))
    } catch (err) {
      console.warn('Failed to save to localStorage:', err)
    }
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return
    try {
      const plans = localStorage.getItem('copilot_nav_plans')
      const recs = localStorage.getItem('copilot_nav_plan_recs')
      const events = localStorage.getItem('copilot_nav_events')
      const feedback = localStorage.getItem('copilot_nav_feedback')
      const snapshots = localStorage.getItem('copilot_nav_snapshots')

      if (plans) this.plans = new Map(JSON.parse(plans))
      if (recs) this.planRecommendations = new Map(JSON.parse(recs))
      if (events) this.events = new Map(JSON.parse(events))
      if (feedback) this.feedback = new Map(JSON.parse(feedback))
      if (snapshots) this.snapshots = new Map(JSON.parse(snapshots))
    } catch (err) {
      console.warn('Failed to load from localStorage:', err)
    }
  }

  // Utility
  clearAll() {
    this.plans.clear()
    this.planRecommendations.clear()
    this.events.clear()
    this.feedback.clear()
    this.snapshots.clear()
    this.saveToLocalStorage()
  }
}

// Singleton instance
let dbInstance: InMemoryDB | null = null

export function getDB(): InMemoryDB {
  if (!dbInstance) {
    dbInstance = new InMemoryDB()
  }
  return dbInstance
}
