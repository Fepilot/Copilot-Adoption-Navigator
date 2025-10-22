// Sample data for quick testing
// NEW STRUCTURE: One entry per input field (matches new inputs page structure)
export const sampleInputs = {
  // Usage Summary
  'Usage Summary:activeUsersPercent': {
    metric: 'Usage Summary',
    scenario: 'activeUsersPercent',
    value: 42,
  },
  'Usage Summary:weeklyActions': {
    metric: 'Usage Summary',
    scenario: 'weeklyActions',
    value: 3,
  },
  
  // Usage Trends Over Time
  'Usage Trends Over Time:trendPattern': {
    metric: 'Usage Trends Over Time',
    scenario: 'trendPattern',
    value: 'Drop or plateau',
  },
  
  // Usage Thresholds (Tiers)
  'Usage Thresholds (Tiers):nonUsersPercent': {
    metric: 'Usage Thresholds (Tiers)',
    scenario: 'nonUsersPercent',
    value: 25,
  },
  'Usage Thresholds (Tiers):lowUsersPercent': {
    metric: 'Usage Thresholds (Tiers)',
    scenario: 'lowUsersPercent',
    value: 20,
  },
  'Usage Thresholds (Tiers):habitualUsersPercent': {
    metric: 'Usage Thresholds (Tiers)',
    scenario: 'habitualUsersPercent',
    value: 40,
  },
  'Usage Thresholds (Tiers):powerUsersPercent': {
    metric: 'Usage Thresholds (Tiers)',
    scenario: 'powerUsersPercent',
    value: 15,
  },
  
  // Usage Since Activation
  'Usage Since Activation:weeksToHabit': {
    metric: 'Usage Since Activation',
    scenario: 'weeksToHabit',
    value: 6,
  },
  'Usage Since Activation:adoptionSpeed': {
    metric: 'Usage Since Activation',
    scenario: 'adoptionSpeed',
    value: 'Slow ramp',
  },
  
  // Feature Usage
  'Feature Usage:appsPerWeek': {
    metric: 'Feature Usage',
    scenario: 'appsPerWeek',
    value: 2,
  },
  'Feature Usage:lowestFeatureUsage': {
    metric: 'Feature Usage',
    scenario: 'lowestFeatureUsage',
    value: 0.5,
  },
  
  // Usage Heatmap (by Group/Region)
  'Usage Heatmap (by Group/Region):lowAdoptionTeamsPercent': {
    metric: 'Usage Heatmap (by Group/Region)',
    scenario: 'lowAdoptionTeamsPercent',
    value: 35,
  },
  'Usage Heatmap (by Group/Region):regionalVariance': {
    metric: 'Usage Heatmap (by Group/Region)',
    scenario: 'regionalVariance',
    value: 'Significant',
  },
  
  // Copilot-Assisted Hours
  'Copilot-Assisted Hours:assistedHoursPerWeek': {
    metric: 'Copilot-Assisted Hours',
    scenario: 'assistedHoursPerWeek',
    value: 0.8,
  },
  'Copilot-Assisted Hours:hoursDeltaBetweenUsers': {
    metric: 'Copilot-Assisted Hours',
    scenario: 'hoursDeltaBetweenUsers',
    value: 3.5,
  },
  
  // Work Patterns
  'Work Patterns:workPatternChange': {
    metric: 'Work Patterns',
    scenario: 'workPatternChange',
    value: 'No visible change',
  },
  
  // Mapping Features to Work Patterns
  'Mapping Features to Work Patterns:featureMappingStatus': {
    metric: 'Mapping Features to Work Patterns',
    scenario: 'featureMappingStatus',
    value: 'Needs guidance',
  },
}
