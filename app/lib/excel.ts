import ExcelJS from 'exceljs'
import type { TriggeredRecommendation } from './schemas'

/**
 * Generate Excel workbook matching the original Adoption Tracker format
 * Columns A-E & M filled, F-L left empty
 */
export async function generateExcelReport(
  triggered: TriggeredRecommendation[]
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Copilot Adoption Tracker')

  // Define column headers
  const headers = [
    'Metric',              // A
    'Scenario',            // B
    'Action (Recommendation)', // C
    'Resources',           // D
    'Baseline Metric',     // E
    'Post Metric',         // F
    'Increase',            // G
    '% Increase',          // H
    'Start Date',          // I
    'End Date',            // J
    'Status',              // K
    'Notes',               // L
    'Target',              // M
    'Feedback',            // N
  ]

  // Add header row with styling
  const headerRow = worksheet.addRow(headers)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0078D4' }, // Microsoft blue
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' }

  // Add data rows
  for (const rec of triggered) {
    worksheet.addRow([
      rec.metric,              // A
      rec.scenario,            // B
      rec.recommendation,      // C
      rec.resources,           // D
      rec.userValue,           // E - Baseline Metric (user's input)
      '',                      // F - Post Metric (empty)
      '',                      // G - Increase (empty)
      '',                      // H - % Increase (empty)
      '',                      // I - Start Date (empty)
      '',                      // J - End Date (empty)
      '',                      // K - Status (empty)
      '',                      // L - Notes (empty)
      rec.target,              // M - Target
      '',                      // N - Feedback (empty)
    ])
  }

  // Set column widths
  const columnWidths = [
    25, // A - Metric
    30, // B - Scenario
    60, // C - Action
    40, // D - Resources
    15, // E - Baseline Metric
    15, // F - Post Metric
    12, // G - Increase
    12, // H - % Increase
    15, // I - Start Date
    15, // J - End Date
    15, // K - Status
    30, // L - Notes
    15, // M - Target
    30, // N - Feedback
  ]

  worksheet.columns = columnWidths.map((width, index) => ({
    key: headers[index],
    width,
  }))

  // Apply text wrapping to recommendation column
  worksheet.getColumn(3).alignment = { wrapText: true, vertical: 'top' }
  worksheet.getColumn(4).alignment = { wrapText: true, vertical: 'top' }

  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

/**
 * Trigger download of Excel file in browser
 */
export function downloadExcel(buffer: ArrayBuffer, filename: string = 'copilot-adoption-tracker.xlsx') {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
