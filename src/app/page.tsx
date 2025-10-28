'use client';

import React, { useState, useRef } from 'react';
import { MetricsSchema, type Metrics, type Recommendation, type ActionPlan } from '../lib/schemas';
import { RulesEngine } from '../lib/rules-engine';

export default function CopilotNavigator() {
  const [metrics, setMetrics] = useState<Partial<Metrics>>({
    seatAssignmentRate: 0,
    activeUsersPercent_28d: 0,
    suggestionAcceptanceRate: 0,
    promptsPerActiveDay: 0,
    timeToFirstUseDays: 0,
    trainingCompletionRate: 0,
    chatToInlineRatio: 1,
    repoCoveragePercent: 0,
    ideDistribution: {},
    languagesDistribution: {},
    enterprisePolicyReady: false,
    networkRestrictionsPresent: false,
    securityFindingsFlagged: false,
    dataLossPreventionBlockers: false,
    orgSize: 'mid',
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rulesEngine = new RulesEngine();

  const handleInputChange = (field: keyof Metrics, value: any) => {
    setMetrics(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const analyzeMetrics = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Validate metrics
      const validatedMetrics = MetricsSchema.parse(metrics);
      
      // Run analysis
      const recs = rulesEngine.evaluateMetrics(validatedMetrics);
      const plan = rulesEngine.createActionPlan(recs);
      
      setRecommendations(recs);
      setActionPlan(plan);
      setShowResults(true);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`));
      } else {
        setErrors([error.message || 'An error occurred during analysis']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = async (filename: string) => {
    try {
      const response = await fetch(`/data/samples/${filename}`);
      const sampleData = await response.json();
      setMetrics(sampleData);
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to load sample data']);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setMetrics(data);
        setErrors([]);
      } catch (error) {
        setErrors(['Invalid JSON file format']);
      }
    };
    reader.readAsText(file);
  };

  const exportResults = () => {
    const exportData = {
      metrics,
      recommendations: filteredRecommendations,
      actionPlan,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copilot-adoption-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setRecommendations([]);
    setActionPlan(null);
    setErrors([]);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && rec.severity !== selectedSeverity) return false;
    return true;
  });

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPriorityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Copilot Adoption Navigator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your GitHub Copilot adoption metrics and receive personalized, evidence-based recommendations 
            to accelerate productivity and maximize ROI.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Metrics Input Section */}
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Input Metrics</h2>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    📁 Upload JSON
                  </button>
                  <select
                    onChange={(e) => e.target.value && loadSampleData(e.target.value)}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    defaultValue=""
                  >
                    <option value="">Load Sample Data</option>
                    <option value="low-adoption-scenario.json">Low Adoption Scenario</option>
                    <option value="quality-issues-scenario.json">Quality Issues Scenario</option>
                    <option value="security-blockers-scenario.json">Security Blockers Scenario</option>
                  </select>
                </div>
              </div>

              {/* Error Display */}
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Validation Errors:</h3>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metrics Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Adoption Metrics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Adoption Metrics</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seat Assignment Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.seatAssignmentRate || ''}
                      onChange={(e) => handleInputChange('seatAssignmentRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage of developers with Copilot licenses</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Users (28d) (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.activeUsersPercent_28d || ''}
                      onChange={(e) => handleInputChange('activeUsersPercent_28d', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 65"
                    />
                    <p className="text-xs text-gray-500 mt-1">Active users in last 28 days</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suggestion Acceptance Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.suggestionAcceptanceRate || ''}
                      onChange={(e) => handleInputChange('suggestionAcceptanceRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 35"
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage of suggestions accepted</p>
                  </div>
                </div>

                {/* Usage Metrics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Usage Metrics</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompts per Active Day
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={metrics.promptsPerActiveDay || ''}
                      onChange={(e) => handleInputChange('promptsPerActiveDay', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Average prompts per user per day</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time to First Use (days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={metrics.timeToFirstUseDays || ''}
                      onChange={(e) => handleInputChange('timeToFirstUseDays', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 7"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days from license to first usage</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Training Completion Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.trainingCompletionRate || ''}
                      onChange={(e) => handleInputChange('trainingCompletionRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 60"
                    />
                    <p className="text-xs text-gray-500 mt-1">Users who completed training</p>
                  </div>
                </div>

                {/* Configuration & Context */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Configuration</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repository Coverage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={metrics.repoCoveragePercent || ''}
                      onChange={(e) => handleInputChange('repoCoveragePercent', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 45"
                    />
                    <p className="text-xs text-gray-500 mt-1">Repos with Copilot usage</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Size
                    </label>
                    <select
                      value={metrics.orgSize || 'mid'}
                      onChange={(e) => handleInputChange('orgSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small (< 100 developers)</option>
                      <option value="mid">Medium (100-1000 developers)</option>
                      <option value="large">Large (> 1000 developers)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Security & Compliance</label>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={metrics.enterprisePolicyReady || false}
                        onChange={(e) => handleInputChange('enterprisePolicyReady', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Enterprise policies configured</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={metrics.networkRestrictionsPresent || false}
                        onChange={(e) => handleInputChange('networkRestrictionsPresent', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Network restrictions present</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={metrics.securityFindingsFlagged || false}
                        onChange={(e) => handleInputChange('securityFindingsFlagged', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Security findings flagged</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={analyzeMetrics}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  {isLoading ? '🔄 Analyzing...' : '📊 Analyze Metrics & Get Recommendations'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
                <div className="flex gap-3">
                  <button
                    onClick={exportResults}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📄 Export Report
                  </button>
                  <button
                    onClick={resetAnalysis}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ↺ New Analysis
                  </button>
                </div>
              </div>
              
              <div className="text-center text-gray-600 mb-4">
                Found {recommendations.length} recommendations based on your metrics
              </div>
            </div>

            {/* Action Plan Summary */}
            {actionPlan && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">📋 Action Plan Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">🔥 Do Now ({actionPlan.doNow.length})</h4>
                    <p className="text-red-700 text-sm mb-3">Critical and high-impact items requiring immediate attention</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {actionPlan.doNow.slice(0, 3).map((rec, idx) => (
                        <li key={idx}>• {rec.title}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⏳ Do Next ({actionPlan.doNext.length})</h4>
                    <p className="text-yellow-700 text-sm mb-3">Important items to address in the coming weeks</p>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {actionPlan.doNext.slice(0, 3).map((rec, idx) => (
                        <li key={idx}>• {rec.title}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">💡 Consider ({actionPlan.consider.length})</h4>
                    <p className="text-green-700 text-sm mb-3">Lower priority optimizations and improvements</p>
                    <ul className="text-sm text-green-600 space-y-1">
                      {actionPlan.consider.slice(0, 3).map((rec, idx) => (
                        <li key={idx}>• {rec.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Security/Compliance">Security/Compliance</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Prompting">Prompting</option>
                    <option value="Networking">Networking</option>
                    <option value="Champions">Champions</option>
                    <option value="Measurement">Measurement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Severity</label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-6">
              {filteredRecommendations.map((recommendation, index) => (
                <div
                  key={recommendation.id}
                  className={`bg-white shadow-lg rounded-lg border-l-4 p-6 ${getPriorityColor(recommendation.severity)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPriorityIcon(recommendation.severity)}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{recommendation.title}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {recommendation.category}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded font-medium ${getPriorityColor(recommendation.severity)}`}>
                            {recommendation.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">Score: {recommendation.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{recommendation.rationale}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions:</h4>
                    <div className="space-y-2">
                      {recommendation.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-800">{action.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              action.estimatedEffort === 'S' ? 'bg-green-100 text-green-700' :
                              action.estimatedEffort === 'M' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {action.estimatedEffort === 'S' ? 'Small' : action.estimatedEffort === 'M' ? 'Medium' : 'Large'}
                            </span>
                            <a
                              href={action.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Guide →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {recommendation.sourceRefs.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sources:</h4>
                      <div className="space-y-1">
                        {recommendation.sourceRefs.map((ref, refIndex) => (
                          <div key={refIndex} className="text-sm text-gray-600">
                            {ref.url ? (
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                {ref.title} - {ref.section}
                              </a>
                            ) : (
                              <span>{ref.title} - {ref.section}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}