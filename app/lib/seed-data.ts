/**
 * Seed data for Plan-Execute-Evidence demo
 */

import { getDB } from './database-schema'
import type { Plan, PlanRecommendation } from './database-schema'

export function seedMockData() {
  const db = getDB()
  const tenantId = 'demo-tenant-001'
  
  // Clear existing data
  db.clearAll()
  
  // Create plans
  const plan1 = db.createPlan({
    tenantId,
    name: 'Q4 2024 Adoption Boost',
    description: 'Increase active users and feature adoption across sales and engineering teams',
    status: 'in_progress',
    startDate: '2024-10-01',
    targetDate: '2024-12-31',
    createdBy: 'admin@example.com',
  })
  
  const plan2 = db.createPlan({
    tenantId,
    name: 'Regional Expansion Initiative',
    description: 'Address low adoption in EMEA and APAC regions',
    status: 'planned',
    startDate: '2024-11-01',
    targetDate: '2025-01-31',
    createdBy: 'admin@example.com',
  })
  
  const plan3 = db.createPlan({
    tenantId,
    name: 'Q3 2024 Pilot Program',
    description: 'Initial rollout with early adopters',
    status: 'done',
    startDate: '2024-07-01',
    targetDate: '2024-09-30',
    completedDate: '2024-09-28',
    createdBy: 'admin@example.com',
  })
  
  // Create plan recommendations for Plan 1 (In Progress)
  const rec1 = db.createPlanRecommendation({
    planId: plan1.id,
    recommendationId: 'rule-001',
    metric: 'Usage Summary',
    scenario: 'Low % active users',
    recommendation: 'Launch awareness campaign with weekly tips, success stories, and targeted outreach to non-users',
    resources: 'Email templates, Teams channels, lunch & learn sessions',
    priority: 1,
    startedAt: '2024-10-05',
  })
  
  const rec2 = db.createPlanRecommendation({
    planId: plan1.id,
    recommendationId: 'rule-007',
    metric: 'Feature Usage',
    scenario: 'Usage concentrated in few apps',
    recommendation: 'Create feature showcases highlighting underused Copilot capabilities across different Microsoft 365 apps',
    resources: 'Video tutorials, hands-on workshops, feature adoption tracking',
    priority: 2,
    startedAt: '2024-10-10',
  })
  
  const rec3 = db.createPlanRecommendation({
    planId: plan1.id,
    recommendationId: 'rule-012',
    metric: 'Usage Heatmap (by Group/Region)',
    scenario: 'Low adoption in specific teams',
    recommendation: 'Deploy champions network in low-adoption teams with dedicated training and support',
    resources: 'Champion toolkit, team-specific metrics, success stories',
    priority: 3,
  })
  
  // Create plan recommendations for Plan 3 (Completed)
  const rec4 = db.createPlanRecommendation({
    planId: plan3.id,
    recommendationId: 'rule-002',
    metric: 'Usage Summary',
    scenario: 'Low weekly actions',
    recommendation: 'Implement habit-forming prompts and contextual suggestions to increase daily engagement',
    resources: 'Desktop notifications, Teams bot reminders, usage dashboards',
    priority: 1,
    startedAt: '2024-07-15',
    completedAt: '2024-09-20',
  })
  
  const rec5 = db.createPlanRecommendation({
    planId: plan3.id,
    recommendationId: 'rule-015',
    metric: 'Copilot-Assisted Hours',
    scenario: 'Low assisted hours',
    recommendation: 'Run time-saving case studies and ROI workshops to demonstrate value',
    resources: 'ROI calculator, case study library, executive briefing decks',
    priority: 1,
    startedAt: '2024-07-20',
    completedAt: '2024-09-25',
  })
  
  // Events for rec1 (In Progress - Active)
  db.createEvent({
    planRecommendationId: rec1.id,
    eventType: 'ADDED_TO_PLAN',
    eventData: { addedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec1.id,
    eventType: 'STARTED',
    eventData: { startedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec1.id,
    eventType: 'OUTREACH_SENT',
    eventData: { channel: 'email', recipients: 245, campaign: 'Weekly Tips #1' },
  })
  
  db.createEvent({
    planRecommendationId: rec1.id,
    eventType: 'EVENT_HELD',
    eventData: { eventName: 'Copilot Lunch & Learn', attendees: 42 },
  })
  
  db.createEvent({
    planRecommendationId: rec1.id,
    eventType: 'CHECKPOINT_SNAPSHOT',
    eventData: { activeUsersPercent: 48, notes: '6% improvement in 2 weeks' },
  })
  
  // Events for rec2 (In Progress - Active)
  db.createEvent({
    planRecommendationId: rec2.id,
    eventType: 'ADDED_TO_PLAN',
    eventData: { addedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec2.id,
    eventType: 'STARTED',
    eventData: { startedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec2.id,
    eventType: 'LEARNING_ASSIGNED',
    eventData: { course: 'Copilot in Teams', assignedTo: 120 },
  })
  
  db.createEvent({
    planRecommendationId: rec2.id,
    eventType: 'EVENT_HELD',
    eventData: { eventName: 'Feature Showcase Webinar', attendees: 87 },
  })
  
  // Events for rec3 (Planned - Not Started)
  db.createEvent({
    planRecommendationId: rec3.id,
    eventType: 'ADDED_TO_PLAN',
    eventData: { addedBy: 'admin@example.com' },
  })
  
  // Events for rec4 (Completed - Success)
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'ADDED_TO_PLAN',
    eventData: { addedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'STARTED',
    eventData: { startedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'OUTREACH_SENT',
    eventData: { channel: 'teams', recipients: 180 },
  })
  
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'CHECKPOINT_SNAPSHOT',
    eventData: { weeklyActions: 5.2, notes: '2.2 increase from baseline' },
  })
  
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'CHECKPOINT_SNAPSHOT',
    eventData: { weeklyActions: 6.8, notes: 'Sustained growth' },
  })
  
  db.createEvent({
    planRecommendationId: rec4.id,
    eventType: 'MARKED_SUCCESS',
    eventData: { finalValue: 7.1, notes: '137% improvement over baseline' },
  })
  
  // Events for rec5 (Completed - Success)
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'ADDED_TO_PLAN',
    eventData: { addedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'STARTED',
    eventData: { startedBy: 'admin@example.com' },
  })
  
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'EVENT_HELD',
    eventData: { eventName: 'ROI Workshop', attendees: 35 },
  })
  
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'EVENT_HELD',
    eventData: { eventName: 'Executive Briefing', attendees: 12 },
  })
  
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'CHECKPOINT_SNAPSHOT',
    eventData: { assistedHoursPerWeek: 1.4, notes: '75% improvement' },
  })
  
  db.createEvent({
    planRecommendationId: rec5.id,
    eventType: 'MARKED_SUCCESS',
    eventData: { finalValue: 1.8, notes: '125% improvement, exceeded target' },
  })
  
  // Feedback for completed recommendations
  db.createFeedback({
    planRecommendationId: rec4.id,
    feedbackType: 'quote',
    feedbackText: 'The daily prompts really helped make Copilot part of my workflow. Now I use it without thinking!',
    sentiment: 'positive',
    submittedBy: 'user@example.com',
  })
  
  db.createFeedback({
    planRecommendationId: rec4.id,
    feedbackType: 'success',
    feedbackText: 'Saw 200% increase in weekly actions within our sales team after implementing the habit-forming prompts',
    sentiment: 'positive',
    submittedBy: 'manager@example.com',
  })
  
  db.createFeedback({
    planRecommendationId: rec5.id,
    feedbackType: 'quote',
    feedbackText: 'The ROI calculator opened my eyes - I\'m saving 2+ hours per week and the quality of my work has improved',
    sentiment: 'positive',
    submittedBy: 'engineer@example.com',
  })
  
  // Metric snapshots for Plan 3 (completed)
  db.createSnapshot({
    planId: plan3.id,
    metric: 'Usage Summary',
    snapshotType: 'baseline',
    value: 3,
    notes: 'Weekly actions baseline',
  })
  
  db.createSnapshot({
    planId: plan3.id,
    metric: 'Usage Summary',
    snapshotType: 'final',
    value: 7.1,
    notes: 'Weekly actions after 10 weeks',
  })
  
  db.createSnapshot({
    planId: plan3.id,
    metric: 'Copilot-Assisted Hours',
    snapshotType: 'baseline',
    value: 0.8,
    notes: 'Assisted hours baseline',
  })
  
  db.createSnapshot({
    planId: plan3.id,
    metric: 'Copilot-Assisted Hours',
    snapshotType: 'final',
    value: 1.8,
    notes: 'Assisted hours after 10 weeks',
  })
  
  // Metric snapshots for Plan 1 (in progress - checkpoints)
  db.createSnapshot({
    planId: plan1.id,
    metric: 'Usage Summary',
    snapshotType: 'baseline',
    value: 42,
    notes: 'Active users % baseline',
  })
  
  db.createSnapshot({
    planId: plan1.id,
    metric: 'Usage Summary',
    snapshotType: 'checkpoint',
    value: 48,
    notes: 'Active users % after 2 weeks',
  })
  
  db.createSnapshot({
    planId: plan1.id,
    metric: 'Feature Usage',
    snapshotType: 'baseline',
    value: 2,
    notes: 'Apps per week baseline',
  })
  
  console.log('✅ Seeded mock data:', {
    plans: 3,
    recommendations: 5,
    events: 23,
    feedback: 3,
    snapshots: 8,
  })
  
  return {
    plans: [plan1, plan2, plan3],
    recommendations: [rec1, rec2, rec3, rec4, rec5],
  }
}
