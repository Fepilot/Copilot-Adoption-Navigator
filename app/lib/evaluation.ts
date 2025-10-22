import type { Rule, UserInput, TriggeredRecommendation, EvaluationResult } from './schemas'

/**
 * Evaluate user inputs against rules and return triggered recommendations
 * NEW: Each metric section feeds ALL scenarios for that metric
 */
export function evaluateRules(
  rules: Rule[],
  userInputs: Record<string, UserInput>
): EvaluationResult {
  const triggered: TriggeredRecommendation[] = []

  // Group rules by metric
  const rulesByMetric = new Map<string, Rule[]>()
  for (const rule of rules) {
    const existing = rulesByMetric.get(rule.metric) || []
    existing.push(rule)
    rulesByMetric.set(rule.metric, existing)
  }

  // For each metric, get all inputs that belong to it
  const inputsByMetric = new Map<string, Record<string, any>>()
  for (const [inputKey, userInput] of Object.entries(userInputs)) {
    const metric = userInput.metric
    if (!inputsByMetric.has(metric)) {
      inputsByMetric.set(metric, {})
    }
    const fieldKey = inputKey.split(':')[1] // Extract field key (e.g., 'activeUsersPercent')
    inputsByMetric.get(metric)![fieldKey] = userInput.value
  }

  // Evaluate ALL rules for each metric against its input set
  for (const metric of Array.from(rulesByMetric.keys())) {
    const metricRules = rulesByMetric.get(metric)!
    const metricInputs = inputsByMetric.get(metric)
    if (!metricInputs || Object.keys(metricInputs).length === 0) {
      continue
    }

    for (const rule of metricRules) {
      // Map rule scenario to corresponding input field
      const relevantValue = getRelevantInputValue(rule, metricInputs)
      
      if (relevantValue === undefined) {
        continue
      }

      // Check if rule is triggered
      const isTriggered = checkRuleTrigger(rule, relevantValue)

      if (isTriggered) {
        const gap = calculateGap(rule, relevantValue)
        const gapPercent = calculateGapPercent(rule, relevantValue)

        triggered.push({
          ruleId: rule.id,
          metric: rule.metric,
          scenario: rule.scenario,
          recommendation: rule.recommendation,
          resources: rule.resources,
          target: rule.target,
          userValue: relevantValue,
          gap,
          gapPercent,
          effort: estimateEffort(gap, gapPercent),
        })
      }
    }
  }

  return {
    triggered,
    evaluatedAt: new Date().toISOString(),
    totalInputs: Object.keys(userInputs).length,
    totalTriggered: triggered.length,
  }
}

/**
 * Map rule scenarios to corresponding input field values
 */
function getRelevantInputValue(rule: Rule, metricInputs: Record<string, any>): number | string | undefined {
  const scenario = rule.scenario.toLowerCase()
  
  // Map scenario keywords to input field keys
  if (scenario.includes('active users') || scenario.includes('activation')) {
    return metricInputs.activeUsersPercent
  }
  if (scenario.includes('weekly actions') || scenario.includes('actions')) {
    return metricInputs.weeklyActions
  }
  if (scenario.includes('trend') || scenario.includes('pattern')) {
    return metricInputs.trendPattern || metricInputs.workPatternChange
  }
  if (scenario.includes('non-users')) {
    return metricInputs.nonUsersPercent
  }
  if (scenario.includes('low users')) {
    return metricInputs.lowUsersPercent
  }
  if (scenario.includes('habitual')) {
    return metricInputs.habitualUsersPercent
  }
  if (scenario.includes('power users')) {
    return metricInputs.powerUsersPercent
  }
  if (scenario.includes('weeks') || scenario.includes('habit formation')) {
    return metricInputs.weeksToHabit
  }
  if (scenario.includes('adoption speed') || scenario.includes('ramp')) {
    return metricInputs.adoptionSpeed
  }
  if (scenario.includes('apps') || scenario.includes('feature diversity')) {
    return metricInputs.appsPerWeek
  }
  if (scenario.includes('lowest feature') || scenario.includes('feature usage')) {
    return metricInputs.lowestFeatureUsage
  }
  if (scenario.includes('low adoption teams') || scenario.includes('heatmap')) {
    return metricInputs.lowAdoptionTeamsPercent
  }
  if (scenario.includes('regional') || scenario.includes('geography')) {
    return metricInputs.regionalVariance
  }
  if (scenario.includes('assisted hours') || scenario.includes('copilot-assisted')) {
    return metricInputs.assistedHoursPerWeek
  }
  if (scenario.includes('hours difference') || scenario.includes('gap between')) {
    return metricInputs.hoursDeltaBetweenUsers
  }
  if (scenario.includes('feature-to-pattern') || scenario.includes('mapping')) {
    return metricInputs.featureMappingStatus
  }
  
  // Default: return the first available input value
  const values = Object.values(metricInputs)
  return values.length > 0 ? values[0] : undefined
}

/**
 * Check if a rule should be triggered based on user input
 */
function checkRuleTrigger(rule: Rule, userValue: number | string): boolean {
  // Label-based targets (text matching) - check these first since your targets contain labels
  if (rule.targetType === 'label') {
    if (typeof userValue === 'string' && rule.targetLabel) {
      return userValue.toLowerCase().includes(rule.targetLabel.toLowerCase())
    }
    // For label targets, also show if ANY input provided (to show all relevant recommendations)
    return typeof userValue === 'string' ? userValue.trim().length > 0 : true
  }

  // If no target defined, show all recommendations when user provides input
  if (rule.targetType === 'none') {
    return typeof userValue === 'string' ? userValue.trim().length > 0 : true
  }

  // Convert value to number for numeric comparisons
  const numValue = typeof userValue === 'number' ? userValue : parseFloat(String(userValue))
  if (isNaN(numValue)) {
    return false
  }

  // Threshold-based targets
  if (rule.targetType === 'threshold' && rule.targetValue !== null && rule.targetValue !== undefined && rule.targetOperator) {
    return evaluateThreshold(numValue, rule.targetOperator, rule.targetValue)
  }

  // Range-based targets
  if (rule.targetType === 'range' && rule.targetMin !== null && rule.targetMin !== undefined && rule.targetMax !== null && rule.targetMax !== undefined) {
    return numValue < rule.targetMin || numValue > rule.targetMax
  }

  return false
}

/**
 * Evaluate threshold condition
 */
function evaluateThreshold(value: number, operator: string, target: number): boolean {
  switch (operator) {
    case '<':
      return value < target
    case '<=':
      return value <= target
    case '>':
      return value > target
    case '>=':
      return value >= target
    case '=':
    case '==':
      return value === target
    case '!=':
      return value !== target
    default:
      return false
  }
}

/**
 * Calculate absolute gap between user value and target
 */
function calculateGap(rule: Rule, userValue: number | string): number | null {
  const numValue = typeof userValue === 'number' ? userValue : parseFloat(String(userValue))
  if (isNaN(numValue)) {
    return null
  }

  if (rule.targetType === 'threshold' && rule.targetValue !== null && rule.targetValue !== undefined) {
    return Math.abs(numValue - rule.targetValue)
  }

  if (rule.targetType === 'range' && rule.targetMin !== null && rule.targetMin !== undefined && rule.targetMax !== null && rule.targetMax !== undefined) {
    if (numValue < rule.targetMin) {
      return rule.targetMin - numValue
    }
    if (numValue > rule.targetMax) {
      return numValue - rule.targetMax
    }
  }

  return null
}

/**
 * Calculate percentage gap between user value and target
 */
function calculateGapPercent(rule: Rule, userValue: number | string): number | null {
  const numValue = typeof userValue === 'number' ? userValue : parseFloat(String(userValue))
  if (isNaN(numValue)) {
    return null
  }

  if (rule.targetType === 'threshold' && rule.targetValue !== null && rule.targetValue !== undefined && rule.targetValue !== 0) {
    return ((numValue - rule.targetValue) / rule.targetValue) * 100
  }

  if (rule.targetType === 'range' && rule.targetMin !== null && rule.targetMin !== undefined && rule.targetMax !== null && rule.targetMax !== undefined) {
    const rangeMid = (rule.targetMin + rule.targetMax) / 2
    if (rangeMid !== 0) {
      return ((numValue - rangeMid) / rangeMid) * 100
    }
  }

  return null
}

/**
 * Estimate effort required based on gap size
 */
function estimateEffort(
  gap: number | null | undefined,
  gapPercent: number | null | undefined
): 'low' | 'medium' | 'high' {
  if (gap === null || gap === undefined) {
    return 'medium'
  }

  if (gapPercent !== null && gapPercent !== undefined) {
    const absGapPercent = Math.abs(gapPercent)
    if (absGapPercent < 10) return 'low'
    if (absGapPercent < 30) return 'medium'
    return 'high'
  }

  if (gap < 10) return 'low'
  if (gap < 50) return 'medium'
  return 'high'
}
