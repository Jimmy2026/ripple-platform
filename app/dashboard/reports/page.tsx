'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [currentReport, setCurrentReport] = useState<any>(null)
  const [error, setError] = useState('')
  const [savedReports, setSavedReports] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const supabase = createClientComponentClient()

  // Load saved reports on mount
  useEffect(() => {
    loadReportHistory()
  }, [])

  const loadReportHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('report_type', 'weekly_executive')
        .order('generated_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setSavedReports(data || [])
    } catch (err: any) {
      console.error('Error loading reports:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    setError('')
    setCurrentReport(null)

    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      setCurrentReport(data.report)
      // Reload history to show the new report
      loadReportHistory()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const viewSavedReport = (report: any) => {
    setCurrentReport({
      id: report.id,
      title: report.title,
      content: report.content,
      stats: report.metadata?.stats || {},
      topCampaigns: report.metadata?.topCampaigns || [],
      atRiskDonors: [],
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">
          AI Executive Reports 🤖
        </h1>
        <p className="text-ocean-200">
          Generate intelligent summaries and insights from your donor data
        </p>
      </div>

      {/* Generate New Report */}
      <div className="bg-gradient-to-br from-mint-400/20 to-coral-400/20 rounded-2xl border-2 border-mint-400/30 p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              Weekly Executive Summary
            </h2>
            <p className="text-ocean-200 mb-6">
              AI analyzes your donations, campaigns, and donor patterns to create a comprehensive executive report with actionable recommendations.
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={generateReport}
                disabled={loading}
                className="px-8 py-4 bg-coral-400 hover:bg-coral-500 rounded-full text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Report</span>
                  </>
                )}
              </button>
              
              <div className="text-sm text-ocean-300">
                <p>⚡ Takes ~10-30 seconds</p>
                <p>🧠 Powered by AI (Mistral-7B)</p>
              </div>
            </div>
          </div>

          <div className="text-6xl">📊</div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-coral-400/10 border border-coral-400/30 rounded-lg">
            <p className="text-coral-400 text-sm">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-coral-300 text-xs mt-2">
              Tip: Free tier has rate limits (30 requests/hour). Try again in a few minutes.
            </p>
          </div>
        )}
      </div>

      {/* Generated Report */}
      {currentReport && (
        <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">
                {currentReport.title}
              </h2>
              <p className="text-sm text-ocean-400">
                Generated {new Date().toLocaleString()}
              </p>
            </div>
            <span className="px-4 py-2 bg-mint-400/20 text-mint-400 rounded-full text-sm font-medium">
              ✨ Fresh
            </span>
          </div>

          {/* Stats Summary */}
          {currentReport.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Raised" value={formatCurrency(currentReport.stats.totalRaised)} />
              <StatCard label="Total Donors" value={currentReport.stats.totalDonors} />
              <StatCard label="This Week" value={formatCurrency(currentReport.stats.weekTotal)} />
              <StatCard label="At Risk" value={currentReport.stats.atRiskCount} />
            </div>
          )}

          {/* AI-Generated Content */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-ocean-700/30 rounded-xl p-6 border border-ocean-600/30">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-display font-bold text-white m-0">AI Executive Summary</h3>
              </div>
              <div className="text-ocean-100 whitespace-pre-wrap leading-relaxed">
                {currentReport.content}
              </div>
            </div>
          </div>

          {/* Top Campaigns */}
          {currentReport.topCampaigns && currentReport.topCampaigns.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-display font-bold text-white mb-4">Top Performing Campaigns</h3>
              <div className="space-y-3">
                {currentReport.topCampaigns.map((campaign: any, idx: number) => (
                  <div key={idx} className="bg-ocean-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{campaign.name}</span>
                      <span className="text-mint-400 font-bold">{formatCurrency(campaign.raised)}</span>
                    </div>
                    <div className="w-full bg-ocean-600 rounded-full h-2">
                      <div 
                        className="bg-mint-400 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-ocean-400 mt-1">
                      {Math.round((campaign.raised / campaign.goal) * 100)}% of ${campaign.goal.toLocaleString()} goal
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* At-Risk Donors */}
          {currentReport.atRiskDonors && currentReport.atRiskDonors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-display font-bold text-white mb-4">⚠️ Donors Needing Attention</h3>
              <div className="space-y-2">
                {currentReport.atRiskDonors.map((donor: any, idx: number) => (
                  <div key={idx} className="bg-coral-400/10 border border-coral-400/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{donor.first_name} {donor.last_name}</span>
                        <span className="text-ocean-400 text-sm ml-3">
                          Last gift: {new Date(donor.last_donation_date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-coral-400 font-bold">${donor.total_donated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report History */}
      <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 p-8">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Recent Reports</h2>
        
        {loadingHistory ? (
          <div className="text-center py-8 text-ocean-400">Loading...</div>
        ) : savedReports.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-ocean-300">No reports generated yet</p>
            <p className="text-sm text-ocean-400 mt-2">Click "Generate Report" above to create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedReports.map((report) => (
              <button
                key={report.id}
                onClick={() => viewSavedReport(report)}
                className="w-full text-left p-4 bg-ocean-700/30 hover:bg-ocean-700/50 rounded-lg transition-all border border-transparent hover:border-mint-400/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">{report.title}</h3>
                    <p className="text-sm text-ocean-400">
                      Generated {new Date(report.generated_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-ocean-400 text-sm">View →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-ocean-700/30 rounded-lg p-4">
      <p className="text-xs text-ocean-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-white">{value}</p>
    </div>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
