import { describe, it, expect } from 'vitest'
import { evaluateRules } from '@/app/lib/evaluation'
import type { Rule, UserInput } from '@/app/lib/schemas'

describe('Rule Evaluation', () => {
  describe('Threshold Evaluation', () => {
    it('should trigger rule when value is below threshold', () => {
      const rules: Rule[] = [
        {
          id: 'test-1',
          metric: 'Usage Summary',
          scenario: 'Low active users',
          recommendation: 'Run awareness campaign',
          resources: 'Link',
          target: '< 50%',
          targetType: 'threshold',
          targetValue: 50,
          targetOperator: '<',
          targetUnit: '%',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Usage Summary:Low active users': {
          metric: 'Usage Summary',
          scenario: 'Low active users',
          value: 30,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered).toHaveLength(1)
      expect(result.triggered[0].ruleId).toBe('test-1')
      expect(result.triggered[0].userValue).toBe(30)
      expect(result.triggered[0].gap).toBe(20)
    })

    it('should NOT trigger when value meets threshold', () => {
      const rules: Rule[] = [
        {
          id: 'test-2',
          metric: 'Usage Summary',
          scenario: 'High adoption',
          recommendation: 'Maintain momentum',
          resources: 'Link',
          target: '> 80%',
          targetType: 'threshold',
          targetValue: 80,
          targetOperator: '>',
          targetUnit: '%',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Usage Summary:High adoption': {
          metric: 'Usage Summary',
          scenario: 'High adoption',
          value: 85,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered).toHaveLength(0)
    })
  })

  describe('Range Evaluation', () => {
    it('should trigger when value is outside range', () => {
      const rules: Rule[] = [
        {
          id: 'test-3',
          metric: 'Feature Usage',
          scenario: 'App breadth',
          recommendation: 'Expand usage',
          resources: 'Link',
          target: '3-5 apps',
          targetType: 'range',
          targetMin: 3,
          targetMax: 5,
          targetUnit: 'apps',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Feature Usage:App breadth': {
          metric: 'Feature Usage',
          scenario: 'App breadth',
          value: 2,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered).toHaveLength(1)
      expect(result.triggered[0].gap).toBe(1)
    })

    it('should NOT trigger when value is within range', () => {
      const rules: Rule[] = [
        {
          id: 'test-4',
          metric: 'Feature Usage',
          scenario: 'App breadth',
          recommendation: 'Expand usage',
          resources: 'Link',
          target: '3-5 apps',
          targetType: 'range',
          targetMin: 3,
          targetMax: 5,
          targetUnit: 'apps',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Feature Usage:App breadth': {
          metric: 'Feature Usage',
          scenario: 'App breadth',
          value: 4,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered).toHaveLength(0)
    })
  })

  describe('Effort Estimation', () => {
    it('should estimate low effort for small gaps', () => {
      const rules: Rule[] = [
        {
          id: 'test-5',
          metric: 'Usage',
          scenario: 'Small gap',
          recommendation: 'Quick fix',
          resources: 'Link',
          target: '< 100',
          targetType: 'threshold',
          targetValue: 100,
          targetOperator: '<',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Usage:Small gap': {
          metric: 'Usage',
          scenario: 'Small gap',
          value: 95,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered[0].effort).toBe('low')
    })

    it('should estimate high effort for large gaps', () => {
      const rules: Rule[] = [
        {
          id: 'test-6',
          metric: 'Usage',
          scenario: 'Large gap',
          recommendation: 'Major initiative',
          resources: 'Link',
          target: '< 100',
          targetType: 'threshold',
          targetValue: 100,
          targetOperator: '<',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Usage:Large gap': {
          metric: 'Usage',
          scenario: 'Large gap',
          value: 20,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered[0].effort).toBe('high')
    })
  })

  describe('Gap Calculation', () => {
    it('should calculate percentage gap correctly', () => {
      const rules: Rule[] = [
        {
          id: 'test-7',
          metric: 'Adoption',
          scenario: 'Test',
          recommendation: 'Action',
          resources: 'Link',
          target: '< 50',
          targetType: 'threshold',
          targetValue: 50,
          targetOperator: '<',
        },
      ]

      const inputs: Record<string, UserInput> = {
        'Adoption:Test': {
          metric: 'Adoption',
          scenario: 'Test',
          value: 25,
        },
      }

      const result = evaluateRules(rules, inputs)

      expect(result.triggered[0].gap).toBe(25)
      expect(result.triggered[0].gapPercent).toBe(-50) // 25 is 50% below 50
    })
  })
})
