'use client'

import Link from 'next/link'
import { ArrowRight, ChartLine, Target, Download, Lightbulb, ClipboardText, Trophy, ChatCircleDots } from 'phosphor-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Microsoft & Copilot Logos */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-microsoft-blue flex items-center justify-center text-white font-bold text-xl rounded">
                  M
                </div>
                <div className="w-10 h-10 bg-microsoft-purple flex items-center justify-center text-white font-bold text-xl rounded">
                  C
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <div className="text-sm text-gray-500">Microsoft</div>
                <div className="text-xs text-gray-400">Copilot</div>
              </div>
            </div>
            {/* Feedback Dashboard Link */}
            <Link
              href="/feedback-dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium"
            >
              <ChatCircleDots size={24} weight="fill" />
              Feedback Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Copilot Adoption Navigator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your Super User reports into targeted, actionable recommendations.
            Enter your metrics and get personalized guidance to accelerate Copilot adoption.
          </p>
          <Link
            href="/inputs"
            className="inline-flex items-center px-8 py-4 bg-microsoft-blue text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            Start now
            <ArrowRight className="ml-3" size={24} weight="bold" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ChartLine size={28} className="text-microsoft-blue" weight="bold" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analysis</h3>
            <p className="text-gray-600">
              Enter your usage metrics and get instant evaluation against proven adoption benchmarks.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target size={28} className="text-microsoft-green" weight="bold" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Targeted Actions</h3>
            <p className="text-gray-600">
              Receive specific recommendations with resources tailored to your adoption gaps.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Download size={28} className="text-microsoft-purple" weight="bold" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Action Plan Export</h3>
            <p className="text-gray-600">
              Download your personalized adoption tracker in Excel format with progress tracking.
            </p>
          </div>
        </div>

        {/* New Features - Plan-Execute-Evidence */}
        <div className="bg-gradient-to-r from-microsoft-blue to-purple-600 rounded-xl p-8 shadow-lg text-white mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Plan-Execute-Evidence Loop</h2>
          <p className="text-center text-blue-50 mb-8 max-w-2xl mx-auto">
            Track which recommendations work, measure impact, and build evidence of success
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/plans" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-6 transition-all">
              <ClipboardText size={32} className="mb-3" weight="fill" />
              <h3 className="text-xl font-semibold mb-2">Plans</h3>
              <p className="text-sm text-blue-50">
                Organize recommendations into actionable plans with Kanban tracking
              </p>
            </Link>
            
            <Link href="/evidence" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-6 transition-all">
              <Trophy size={32} className="mb-3" weight="fill" />
              <h3 className="text-xl font-semibold mb-2">Evidence</h3>
              <p className="text-sm text-blue-50">
                View win rates, deltas, and evidence scores for completed initiatives
              </p>
            </Link>
            
            <Link href="/evidence" className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-6 transition-all">
              <ChartLine size={32} className="mb-3" weight="fill" />
              <h3 className="text-xl font-semibold mb-2">Outcomes</h3>
              <p className="text-sm text-blue-50">
                Pre/post analysis with coverage, persistence, and success metrics
              </p>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-12 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-microsoft-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enter Metrics</h4>
              <p className="text-sm text-gray-600">
                Input your Copilot usage data across 9 key categories
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-microsoft-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Analysis</h4>
              <p className="text-sm text-gray-600">
                Our engine compares your data against adoption targets
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-microsoft-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">View Results</h4>
              <p className="text-sm text-gray-600">
                See prioritized recommendations with gap analysis
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-microsoft-purple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Take Action</h4>
              <p className="text-sm text-gray-600">
                Download your plan and start implementing improvements
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-lg mb-6">
            <Lightbulb size={24} className="text-microsoft-blue mr-3" weight="fill" />
            <span className="text-gray-700">
              <strong>New:</strong> Try sample data to see how it works
            </span>
          </div>
          <div>
            <Link
              href="/inputs"
              className="inline-flex items-center px-8 py-4 bg-microsoft-blue text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-3" size={24} weight="bold" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Microsoft Corporation. All rights reserved.</p>
            <p className="mt-2">Copilot Adoption Navigator</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
