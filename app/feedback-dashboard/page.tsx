'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FunnelSimple, 
  Download, 
  ThumbsUp,
  CheckCircle,
  Clock,
  Eye,
  Rocket,
  X,
  ChatCircleDots
} from 'phosphor-react'
import { 
  getFeedbackDB, 
  FeedbackItem, 
  FeedbackCategory, 
  FeedbackStatus, 
  FeedbackPriority,
  FeedbackPage,
  exportFeedbackToCSV 
} from '@/app/lib/feedback-schema'

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([])
  const [stats, setStats] = useState<any>(null)
  
  // Filters
  const [filterCategory, setFilterCategory] = useState<FeedbackCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<FeedbackPriority | 'all'>('all')
  const [filterPage, setFilterPage] = useState<FeedbackPage | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Selected feedback for detail view
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)

  // Load feedback on mount
  useEffect(() => {
    loadFeedback()
  }, [])

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters()
  }, [feedback, filterCategory, filterStatus, filterPriority, filterPage, searchQuery])

  const loadFeedback = () => {
    const db = getFeedbackDB()
    const allFeedback = db.getAllFeedback()
    const stats = db.getStats()
    setFeedback(allFeedback)
    setStats(stats)
  }

  const applyFilters = () => {
    let filtered = [...feedback]

    if (filterCategory !== 'all') {
      filtered = filtered.filter(f => f.category === filterCategory)
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus)
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(f => f.priority === filterPriority)
    }
    if (filterPage !== 'all') {
      filtered = filtered.filter(f => f.page === filterPage)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(f => 
        f.title.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query) ||
        f.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredFeedback(filtered)
  }

  const handleUpvote = (id: string) => {
    const db = getFeedbackDB()
    db.upvoteFeedback(id)
    loadFeedback()
  }

  const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
    const db = getFeedbackDB()
    db.updateFeedback(id, { status: newStatus })
    loadFeedback()
    if (selectedFeedback?.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status: newStatus })
    }
  }

  const handleExportCSV = () => {
    const csv = exportFeedbackToCSV(filteredFeedback)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCategoryColor = (category: FeedbackCategory): string => {
    const colors = {
      'bug': 'red',
      'feature-request': 'blue',
      'improvement': 'green',
      'ui-ux': 'purple',
      'performance': 'yellow',
      'documentation': 'indigo',
      'general': 'gray',
    }
    return colors[category] || 'gray'
  }

  const getPriorityColor = (priority: FeedbackPriority): string => {
    const colors = {
      'low': 'gray',
      'medium': 'blue',
      'high': 'orange',
      'critical': 'red',
    }
    return colors[priority]
  }

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case 'submitted': return <Clock size={18} />
      case 'reviewing': return <Eye size={18} />
      case 'planned': return <CheckCircle size={18} />
      case 'in-progress': return <Rocket size={18} />
      case 'completed': return <CheckCircle size={18} weight="fill" />
      case 'wont-fix': return <X size={18} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft size={24} weight="bold" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <ChatCircleDots size={36} weight="fill" className="text-purple-600" />
                  Feedback Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage team feedback for roadmap planning
                </p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={filteredFeedback.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} weight="bold" />
              Export CSV ({filteredFeedback.length})
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                <div className="text-sm text-blue-600">Total Feedback</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">{stats.totalVotes}</div>
                <div className="text-sm text-purple-600">Total Votes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">
                  {stats.byStatus?.['completed'] || 0}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-900">
                  {stats.byStatus?.['submitted'] || 0}
                </div>
                <div className="text-sm text-orange-600">Awaiting Review</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelSimple size={24} weight="bold" className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FeedbackCategory | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="bug">🐛 Bug</option>
              <option value="feature-request">✨ Feature Request</option>
              <option value="improvement">📈 Improvement</option>
              <option value="ui-ux">🎨 UI/UX</option>
              <option value="performance">⚡ Performance</option>
              <option value="documentation">📚 Documentation</option>
              <option value="general">💬 General</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FeedbackStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="reviewing">Reviewing</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="wont-fix">Won't Fix</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as FeedbackPriority | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Page Filter */}
            <select
              value={filterPage}
              onChange={(e) => setFilterPage(e.target.value as FeedbackPage | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Pages</option>
              <option value="landing">Landing</option>
              <option value="inputs">Inputs</option>
              <option value="results">Results</option>
              <option value="plans">Plans</option>
              <option value="evidence">Evidence</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-600">
                {feedback.length === 0 
                  ? 'Submit your first feedback using the floating button!'
                  : 'No feedback matches your current filters.'
                }
              </p>
            </div>
          ) : (
            filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Title & Category */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className={`px-3 py-1 bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-700 text-xs font-semibold rounded-full`}>
                        {item.category}
                      </span>
                      <span className={`px-3 py-1 bg-${getPriorityColor(item.priority)}-100 text-${getPriorityColor(item.priority)}-700 text-xs font-semibold rounded-full`}>
                        {item.priority}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize">{item.page}</span>
                      <span>•</span>
                      <span>{item.submittedBy}</span>
                      <span>•</span>
                      <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                      {item.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-2">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Status */}
                    <div className={`flex items-center gap-2 px-3 py-1 bg-${getPriorityColor(item.priority)}-50 text-${getPriorityColor(item.priority)}-700 rounded-lg text-sm font-medium`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status.replace('-', ' ')}</span>
                    </div>

                    {/* Votes */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpvote(item.id)
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
                    >
                      <ThumbsUp size={16} weight="bold" />
                      {item.votes}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h2 className="text-xl font-bold">Feedback Details</h2>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="hover:bg-white/20 rounded-lg p-2 transition"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedFeedback.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 bg-${getCategoryColor(selectedFeedback.category)}-100 text-${getCategoryColor(selectedFeedback.category)}-700 text-sm font-semibold rounded-full`}>
                    {selectedFeedback.category}
                  </span>
                  <span className={`px-3 py-1 bg-${getPriorityColor(selectedFeedback.priority)}-100 text-${getPriorityColor(selectedFeedback.priority)}-700 text-sm font-semibold rounded-full`}>
                    {selectedFeedback.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedFeedback.description}</p>
              </div>

              {/* Status Workflow */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['submitted', 'reviewing', 'planned', 'in-progress', 'completed', 'wont-fix'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedFeedback.id, status as FeedbackStatus)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedFeedback.status === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Page</label>
                  <p className="text-gray-900 capitalize">{selectedFeedback.page}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Submitted By</label>
                  <p className="text-gray-900">{selectedFeedback.submittedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Submitted At</label>
                  <p className="text-gray-900">
                    {new Date(selectedFeedback.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Votes</label>
                  <p className="text-gray-900">{selectedFeedback.votes}</p>
                </div>
              </div>

              {/* Tags */}
              {selectedFeedback.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
