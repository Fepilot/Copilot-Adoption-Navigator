/**
 * Feedback System Data Schema
 * Stores user feedback, feature requests, and annotations for roadmap planning
 */

import { v4 as uuidv4 } from 'uuid'

// Feedback Types
export type FeedbackCategory = 
  | 'bug' 
  | 'feature-request' 
  | 'improvement' 
  | 'ui-ux' 
  | 'performance' 
  | 'documentation' 
  | 'general'

export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical'

export type FeedbackStatus = 
  | 'submitted' 
  | 'reviewing' 
  | 'planned' 
  | 'in-progress' 
  | 'completed' 
  | 'wont-fix'

export type FeedbackPage = 
  | 'landing' 
  | 'inputs' 
  | 'results' 
  | 'plans' 
  | 'evidence' 
  | 'general'

// Feedback Item
export interface FeedbackItem {
  id: string
  category: FeedbackCategory
  priority: FeedbackPriority
  status: FeedbackStatus
  page: FeedbackPage
  title: string
  description: string
  submittedBy: string
  submittedAt: string
  screenshot?: string // Base64 encoded screenshot
  votes: number
  tags: string[]
  assignedTo?: string
  targetRelease?: string
  notes?: string
  updatedAt?: string
}

// Screenshot Annotation
export interface ScreenshotAnnotation {
  id: string
  screenshotId: string
  x: number // Position X (percentage)
  y: number // Position Y (percentage)
  comment: string
  submittedBy: string
  submittedAt: string
  category: FeedbackCategory
  resolved: boolean
}

// Screenshot Gallery Item
export interface GalleryScreenshot {
  id: string
  page: FeedbackPage
  title: string
  description: string
  imageUrl: string
  annotations: ScreenshotAnnotation[]
  order: number
}

// In-Memory Feedback Database
class FeedbackDB {
  private static instance: FeedbackDB
  private feedbackItems: Map<string, FeedbackItem>
  private screenshots: Map<string, GalleryScreenshot>
  private annotations: Map<string, ScreenshotAnnotation>
  private readonly STORAGE_KEY_FEEDBACK = 'copilot-navigator-feedback'
  private readonly STORAGE_KEY_SCREENSHOTS = 'copilot-navigator-screenshots'
  private readonly STORAGE_KEY_ANNOTATIONS = 'copilot-navigator-annotations'

  private constructor() {
    this.feedbackItems = new Map()
    this.screenshots = new Map()
    this.annotations = new Map()
    this.loadFromStorage()
  }

  static getInstance(): FeedbackDB {
    if (!FeedbackDB.instance) {
      FeedbackDB.instance = new FeedbackDB()
    }
    return FeedbackDB.instance
  }

  // ===== FEEDBACK CRUD =====

  createFeedback(data: Omit<FeedbackItem, 'id' | 'submittedAt' | 'votes'>): FeedbackItem {
    const feedback: FeedbackItem = {
      ...data,
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
      votes: 0,
    }
    this.feedbackItems.set(feedback.id, feedback)
    this.saveToStorage()
    return feedback
  }

  getFeedback(id: string): FeedbackItem | undefined {
    return this.feedbackItems.get(id)
  }

  getAllFeedback(): FeedbackItem[] {
    return Array.from(this.feedbackItems.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  }

  getFeedbackByPage(page: FeedbackPage): FeedbackItem[] {
    return this.getAllFeedback().filter(f => f.page === page)
  }

  getFeedbackByStatus(status: FeedbackStatus): FeedbackItem[] {
    return this.getAllFeedback().filter(f => f.status === status)
  }

  getFeedbackByCategory(category: FeedbackCategory): FeedbackItem[] {
    return this.getAllFeedback().filter(f => f.category === category)
  }

  updateFeedback(id: string, updates: Partial<FeedbackItem>): FeedbackItem | undefined {
    const feedback = this.feedbackItems.get(id)
    if (!feedback) return undefined

    const updated = {
      ...feedback,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.feedbackItems.set(id, updated)
    this.saveToStorage()
    return updated
  }

  deleteFeedback(id: string): boolean {
    const deleted = this.feedbackItems.delete(id)
    if (deleted) this.saveToStorage()
    return deleted
  }

  upvoteFeedback(id: string): FeedbackItem | undefined {
    const feedback = this.feedbackItems.get(id)
    if (!feedback) return undefined

    feedback.votes += 1
    this.feedbackItems.set(id, feedback)
    this.saveToStorage()
    return feedback
  }

  // ===== SCREENSHOT CRUD =====

  createScreenshot(data: Omit<GalleryScreenshot, 'id'>): GalleryScreenshot {
    const screenshot: GalleryScreenshot = {
      ...data,
      id: uuidv4(),
    }
    this.screenshots.set(screenshot.id, screenshot)
    this.saveToStorage()
    return screenshot
  }

  getScreenshot(id: string): GalleryScreenshot | undefined {
    return this.screenshots.get(id)
  }

  getAllScreenshots(): GalleryScreenshot[] {
    return Array.from(this.screenshots.values()).sort((a, b) => a.order - b.order)
  }

  getScreenshotsByPage(page: FeedbackPage): GalleryScreenshot[] {
    return this.getAllScreenshots().filter(s => s.page === page)
  }

  // ===== ANNOTATION CRUD =====

  createAnnotation(data: Omit<ScreenshotAnnotation, 'id' | 'submittedAt'>): ScreenshotAnnotation {
    const annotation: ScreenshotAnnotation = {
      ...data,
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
    }
    this.annotations.set(annotation.id, annotation)

    // Add to screenshot
    const screenshot = this.screenshots.get(data.screenshotId)
    if (screenshot) {
      screenshot.annotations.push(annotation)
      this.screenshots.set(screenshot.id, screenshot)
    }

    this.saveToStorage()
    return annotation
  }

  getAnnotation(id: string): ScreenshotAnnotation | undefined {
    return this.annotations.get(id)
  }

  getAnnotationsByScreenshot(screenshotId: string): ScreenshotAnnotation[] {
    return Array.from(this.annotations.values()).filter(a => a.screenshotId === screenshotId)
  }

  updateAnnotation(id: string, updates: Partial<ScreenshotAnnotation>): ScreenshotAnnotation | undefined {
    const annotation = this.annotations.get(id)
    if (!annotation) return undefined

    const updated = { ...annotation, ...updates }
    this.annotations.set(id, updated)

    // Update in screenshot
    const screenshot = this.screenshots.get(annotation.screenshotId)
    if (screenshot) {
      const index = screenshot.annotations.findIndex(a => a.id === id)
      if (index !== -1) {
        screenshot.annotations[index] = updated
        this.screenshots.set(screenshot.id, screenshot)
      }
    }

    this.saveToStorage()
    return updated
  }

  // ===== STATISTICS =====

  getStats() {
    const feedback = this.getAllFeedback()
    
    return {
      total: feedback.length,
      byCategory: this.countBy(feedback, 'category'),
      byStatus: this.countBy(feedback, 'status'),
      byPriority: this.countBy(feedback, 'priority'),
      byPage: this.countBy(feedback, 'page'),
      totalVotes: feedback.reduce((sum, f) => sum + f.votes, 0),
      topVoted: [...feedback].sort((a, b) => b.votes - a.votes).slice(0, 5),
    }
  }

  private countBy<T extends Record<string, any>>(items: T[], key: keyof T): Record<string, number> {
    return items.reduce((acc, item) => {
      const value = String(item[key])
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // ===== STORAGE =====

  private saveToStorage() {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(
        this.STORAGE_KEY_FEEDBACK,
        JSON.stringify(Array.from(this.feedbackItems.entries()))
      )
      localStorage.setItem(
        this.STORAGE_KEY_SCREENSHOTS,
        JSON.stringify(Array.from(this.screenshots.entries()))
      )
      localStorage.setItem(
        this.STORAGE_KEY_ANNOTATIONS,
        JSON.stringify(Array.from(this.annotations.entries()))
      )
    } catch (error) {
      console.error('Failed to save feedback to localStorage:', error)
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return

    try {
      const feedbackData = localStorage.getItem(this.STORAGE_KEY_FEEDBACK)
      if (feedbackData) {
        this.feedbackItems = new Map(JSON.parse(feedbackData))
      }

      const screenshotsData = localStorage.getItem(this.STORAGE_KEY_SCREENSHOTS)
      if (screenshotsData) {
        this.screenshots = new Map(JSON.parse(screenshotsData))
      }

      const annotationsData = localStorage.getItem(this.STORAGE_KEY_ANNOTATIONS)
      if (annotationsData) {
        this.annotations = new Map(JSON.parse(annotationsData))
      }
    } catch (error) {
      console.error('Failed to load feedback from localStorage:', error)
    }
  }

  clearAll() {
    this.feedbackItems.clear()
    this.screenshots.clear()
    this.annotations.clear()
    this.saveToStorage()
  }
}

// Export singleton instance
export function getFeedbackDB(): FeedbackDB {
  return FeedbackDB.getInstance()
}

// Export CSV
export function exportFeedbackToCSV(feedback: FeedbackItem[]): string {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Page',
    'Submitted By',
    'Submitted At',
    'Votes',
    'Tags',
    'Assigned To',
    'Target Release',
    'Notes',
  ]

  const rows = feedback.map(f => [
    f.id,
    f.title,
    f.description,
    f.category,
    f.priority,
    f.status,
    f.page,
    f.submittedBy,
    f.submittedAt,
    f.votes,
    f.tags.join('; '),
    f.assignedTo || '',
    f.targetRelease || '',
    f.notes || '',
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  return csv
}
