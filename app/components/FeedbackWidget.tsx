'use client'

import React, { useState } from 'react'
import { X, ChatCircleDots, PaperPlaneRight } from 'phosphor-react'
import { getFeedbackDB, FeedbackCategory, FeedbackPriority, FeedbackPage } from '@/app/lib/feedback-schema'

interface FeedbackWidgetProps {
  currentPage: FeedbackPage
}

export default function FeedbackWidget({ currentPage }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<FeedbackCategory>('general')
  const [priority, setPriority] = useState<FeedbackPriority>('medium')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submittedBy, setSubmittedBy] = useState('')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const db = getFeedbackDB()
      
      db.createFeedback({
        category,
        priority,
        status: 'submitted',
        page: currentPage,
        title: title.trim(),
        description: description.trim(),
        submittedBy: submittedBy.trim() || 'Anonymous',
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      })

      // Show success message
      setShowSuccess(true)
      
      // Reset form
      setTitle('')
      setDescription('')
      setTags('')
      setPriority('medium')
      setCategory('general')
      
      // Close after delay
      setTimeout(() => {
        setShowSuccess(false)
        setIsOpen(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions: { value: FeedbackCategory; label: string; color: string }[] = [
    { value: 'bug', label: '🐛 Bug Report', color: 'red' },
    { value: 'feature-request', label: '✨ Feature Request', color: 'blue' },
    { value: 'improvement', label: '📈 Improvement', color: 'green' },
    { value: 'ui-ux', label: '🎨 UI/UX Issue', color: 'purple' },
    { value: 'performance', label: '⚡ Performance', color: 'yellow' },
    { value: 'documentation', label: '📚 Documentation', color: 'indigo' },
    { value: 'general', label: '💬 General Feedback', color: 'gray' },
  ]

  const priorityOptions: { value: FeedbackPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' },
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 group"
        aria-label="Give Feedback"
      >
        <ChatCircleDots size={28} weight="fill" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Give Feedback
        </span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChatCircleDots size={28} weight="fill" />
                <div>
                  <h2 className="text-xl font-bold">Share Your Feedback</h2>
                  <p className="text-sm text-purple-100">
                    Page: <span className="font-semibold capitalize">{currentPage}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-lg p-2 transition"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold">Thank you for your feedback!</div>
                <div className="text-sm text-green-600">Your input helps us improve the app.</div>
              </div>
            )}

            {/* Form */}
            {!showSuccess && (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCategory(opt.value)}
                        className={`p-3 rounded-lg border-2 text-left transition ${
                          category === opt.value
                            ? `border-${opt.color}-500 bg-${opt.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority *
                  </label>
                  <div className="flex gap-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriority(opt.value)}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${
                          priority === opt.value
                            ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="feedback-title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    id="feedback-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of your feedback..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 mt-1">{title.length}/100 characters</div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="feedback-description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="feedback-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about your feedback. What did you expect? What happened instead?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                    required
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="feedback-tags" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (optional)
                  </label>
                  <input
                    id="feedback-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., navigation, performance, mobile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</div>
                </div>

                {/* Submitted By */}
                <div>
                  <label htmlFor="feedback-submittedby" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    id="feedback-submittedby"
                    type="text"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={50}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <PaperPlaneRight size={20} weight="bold" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
