/**
 * Seed rules data - used as fallback if CSV parsing fails
 */
export const seedRules = {
  rules: [
    {
      id: 'seed-1',
      metric: 'Usage Summary',
      scenario: 'Low % active users',
      recommendation: 'Run a Copilot Awareness Campaign (kick-off email, manager comms, quick start guides).',
      resources: 'Copilot Success Kit; Get Started with Copilot',
      target: '< 50%',
      targetType: 'threshold' as const,
      targetValue: 50,
      targetOperator: '<',
      targetUnit: '%',
    },
    {
      id: 'seed-2',
      metric: 'Usage Summary',
      scenario: 'Low weekly actions',
      recommendation: 'Launch an 11×20 Copilot Actions Challenge (target: 11 actions/week, 20 users reach power-user status).',
      resources: 'Copilot Success Kit; Prompt-a-thon Guide; Great Copilot Journey',
      target: '< 11',
      targetType: 'threshold' as const,
      targetValue: 11,
      targetOperator: '<',
      targetUnit: 'actions/week',
    },
    {
      id: 'seed-3',
      metric: 'Feature Usage',
      scenario: 'Usage concentrated in few apps',
      recommendation: 'Run an Office Suite Copilot Day (short demos for Word, Excel, PowerPoint, Outlook).',
      resources: 'Word Copilot Guide; Copilot Video Tutorials',
      target: '< 3',
      targetType: 'threshold' as const,
      targetValue: 3,
      targetOperator: '<',
      targetUnit: 'apps',
    },
  ],
  rulesByMetric: {
    'Usage Summary': [
      {
        id: 'seed-1',
        metric: 'Usage Summary',
        scenario: 'Low % active users',
        recommendation: 'Run a Copilot Awareness Campaign (kick-off email, manager comms, quick start guides).',
        resources: 'Copilot Success Kit; Get Started with Copilot',
        target: '< 50%',
        targetType: 'threshold' as const,
        targetValue: 50,
        targetOperator: '<',
        targetUnit: '%',
      },
    ],
  },
  metadata: {
    generatedAt: new Date().toISOString(),
    source: 'seed',
    totalRules: 3,
    metrics: ['Usage Summary', 'Feature Usage'],
  },
}
