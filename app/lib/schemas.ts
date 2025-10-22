import { z } from 'zod'

// ============================================================================
// Rule Schemas
// ============================================================================

export const RuleSchema = z.object({
  id: z.string(),
  metric: z.string(),
  scenario: z.string(),
  recommendation: z.string(),
  resources: z.string(),
  target: z.string(),
  targetType: z.enum(['none', 'threshold', 'range', 'label']),
  targetValue: z.number().nullable().optional(),
  targetOperator: z.string().nullable().optional(),
  targetUnit: z.string().nullable().optional(),
  targetMin: z.number().nullable().optional(),
  targetMax: z.number().nullable().optional(),
  targetLabel: z.string().nullable().optional(),
})

export const RulesDataSchema = z.object({
  rules: z.array(RuleSchema),
  rulesByMetric: z.record(z.array(RuleSchema)),
  metadata: z.object({
    generatedAt: z.string(),
    source: z.string(),
    totalRules: z.number(),
    metrics: z.array(z.string()),
  }),
})

export type Rule = z.infer<typeof RuleSchema>
export type RulesData = z.infer<typeof RulesDataSchema>

// ============================================================================
// User Input Schemas
// ============================================================================

export const UserInputSchema = z.object({
  metric: z.string(),
  scenario: z.string(),
  value: z.union([z.number(), z.string()]),
  label: z.string().optional(),
})

export const UserInputsSchema = z.record(z.string(), UserInputSchema)

export type UserInput = z.infer<typeof UserInputSchema>
export type UserInputs = z.infer<typeof UserInputsSchema>

// ============================================================================
// Evaluation Result Schemas
// ============================================================================

export const TriggeredRecommendationSchema = z.object({
  ruleId: z.string(),
  metric: z.string(),
  scenario: z.string(),
  recommendation: z.string(),
  resources: z.string(),
  target: z.string(),
  userValue: z.union([z.number(), z.string()]),
  gap: z.number().nullable().optional(),
  gapPercent: z.number().nullable().optional(),
  effort: z.enum(['low', 'medium', 'high']).optional(),
})

export const EvaluationResultSchema = z.object({
  triggered: z.array(TriggeredRecommendationSchema),
  evaluatedAt: z.string(),
  totalInputs: z.number(),
  totalTriggered: z.number(),
})

export type TriggeredRecommendation = z.infer<typeof TriggeredRecommendationSchema>
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>

// ============================================================================
// Excel Export Schemas
// ============================================================================

export const ExcelRowSchema = z.object({
  metric: z.string(),
  scenario: z.string(),
  recommendation: z.string(),
  resources: z.string(),
  baselineMetric: z.union([z.number(), z.string()]).optional(),
  postMetric: z.union([z.number(), z.string()]).optional(),
  increase: z.union([z.number(), z.string()]).optional(),
  percentIncrease: z.union([z.number(), z.string()]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  target: z.string(),
  feedback: z.string().optional(),
})

export type ExcelRow = z.infer<typeof ExcelRowSchema>
