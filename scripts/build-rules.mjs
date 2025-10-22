#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse command-line arguments
const args = process.argv.slice(2)
const sourceIndex = args.indexOf('--source')
const outIndex = args.indexOf('--out')

const sourceFile =
  sourceIndex !== -1 && args[sourceIndex + 1]
    ? args[sourceIndex + 1]
    : join(__dirname, '../data/copilot_adoption_tracking_enhanced.csv')

const outFile =
  outIndex !== -1 && args[outIndex + 1]
    ? args[outIndex + 1]
    : join(__dirname, '../app/data/rules.json')

console.log(`📖 Reading CSV from: ${sourceFile}`)

if (!existsSync(sourceFile)) {
  console.error(`❌ CSV file not found: ${sourceFile}`)
  console.log('💡 Using seed data instead...')
  
  const seedData = {
    rules: [
      {
        id: 'seed-1',
        metric: 'Usage Summary',
        scenario: 'Low % active users',
        recommendation: 'Run a Copilot Awareness Campaign (kick-off email, manager comms, quick start guides).',
        resources: 'Copilot Success Kit; Get Started with Copilot',
        target: '< 50%',
        targetType: 'threshold',
        targetValue: 50,
        targetOperator: '<',
      },
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'seed',
      totalRules: 1,
    },
  }
  
  writeFileSync(outFile, JSON.stringify(seedData, null, 2), 'utf8')
  console.log(`✅ Seed rules written to: ${outFile}`)
  process.exit(0)
}

try {
  const csvContent = readFileSync(sourceFile, 'utf8')
  
  // Remove BOM if present
  const cleanedContent = csvContent.replace(/^\uFEFF/, '')
  
  const records = parse(cleanedContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  
  console.log(`📊 Parsed ${records.length} rows from CSV`)
  
  // Debug: Check first row
  if (records.length > 0) {
    console.log('First row columns:', Object.keys(records[0]))
    console.log('First row data:', records[0])
  }
  
  // Transform CSV rows into rule objects
  const rules = records
    .filter((row) => {
      // Keep row if it has Metric, Scenario, and Recommendation
      const hasRequired = row['Metric'] && row['Scenario'] && row['Action (Recommendation)']
      const isNotEmpty = row['Metric'] && row['Metric'].trim() !== ''
      const result = hasRequired && isNotEmpty
      if (!result && row['Metric']) {
        console.log('Filtered out row:', row['Metric'], row['Scenario'])
      }
      return result
    })
    .map((row, index) => {
      const target = row['Target'] || ''
      const targetParsed = parseTarget(target)
      
      return {
        id: `rule-${index + 1}`,
        metric: row['Metric'].trim(),
        scenario: row['Scenario'].trim(),
        recommendation: row['Action (Recommendation)'].trim(),
        resources: row['Resources'] ? row['Resources'].trim() : '',
        target: target.trim(),
        ...targetParsed,
      }
    })
  
  // Group rules by metric for easier access
  const rulesByMetric = rules.reduce((acc, rule) => {
    if (!acc[rule.metric]) {
      acc[rule.metric] = []
    }
    acc[rule.metric].push(rule)
    return acc
  }, {})
  
  const output = {
    rules,
    rulesByMetric,
    metadata: {
      generatedAt: new Date().toISOString(),
      source: sourceFile,
      totalRules: rules.length,
      metrics: Object.keys(rulesByMetric),
    },
  }
  
  writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf8')
  
  console.log(`✅ Generated ${rules.length} rules`)
  console.log(`📁 Output written to: ${outFile}`)
  console.log(`📊 Metrics found: ${Object.keys(rulesByMetric).join(', ')}`)
  
} catch (error) {
  console.error('❌ Error processing CSV:', error.message)
  process.exit(1)
}

/**
 * Parse target string into structured format
 * Examples:
 *   "< 50%" -> { targetType: 'threshold', targetValue: 50, targetOperator: '<', targetUnit: '%' }
 *   "> 100 actions" -> { targetType: 'threshold', targetValue: 100, targetOperator: '>', targetUnit: 'actions' }
 *   "10-20%" -> { targetType: 'range', targetMin: 10, targetMax: 20, targetUnit: '%' }
 */
function parseTarget(targetStr) {
  if (!targetStr || targetStr.trim() === '') {
    return {
      targetType: 'none',
      targetValue: null,
      targetOperator: null,
      targetUnit: null,
    }
  }
  
  const str = targetStr.trim()
  
  // Range: "10-20%" or "10-20 actions"
  const rangeMatch = str.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(.*)$/)
  if (rangeMatch) {
    return {
      targetType: 'range',
      targetMin: parseFloat(rangeMatch[1]),
      targetMax: parseFloat(rangeMatch[2]),
      targetUnit: rangeMatch[3].trim() || null,
    }
  }
  
  // Threshold: "< 50%", "> 100", "≥ 20", etc.
  const thresholdMatch = str.match(/^([<>≤≥!=]+)\s*(\d+(?:\.\d+)?)\s*(.*)$/)
  if (thresholdMatch) {
    let operator = thresholdMatch[1]
    // Normalize operators
    if (operator === '≤') operator = '<='
    if (operator === '≥') operator = '>='
    
    return {
      targetType: 'threshold',
      targetValue: parseFloat(thresholdMatch[2]),
      targetOperator: operator,
      targetUnit: thresholdMatch[3].trim() || null,
    }
  }
  
  // Label/text-based target
  return {
    targetType: 'label',
    targetLabel: str,
    targetValue: null,
    targetOperator: null,
  }
}
