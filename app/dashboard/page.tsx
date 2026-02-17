import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch dashboard stats
  const [donorsResult, donationsResult, campaignsResult] = await Promise.all([
    supabase.from('donors').select('id, total_donated, donation_count', { count: 'exact' }),
    supabase.from('donations').select('amount, donation_date'),
    supabase.from('campaigns').select('name, total_raised, is_active'),
  ])

  const totalDonors = donorsResult.count || 0
  const donors = donorsResult.data || []
  const donations = donationsResult.data || []
  const campaigns = campaignsResult.data || []

  // Calculate stats
  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0)
  const avgDonation = donations.length > 0 ? totalRaised / donations.length : 0
  
  // Get this month's donations
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thisMonthDonations = donations.filter(d => d.donation_date >= thisMonthStart)
  const thisMonthTotal = thisMonthDonations.reduce((sum, d) => sum + Number(d.amount), 0)
  
  // Active donors (donated in last 90 days)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const activeDonors = donations.filter(d => d.donation_date >= ninetyDaysAgo)
    .map(d => d)
    .length

  const activeCampaigns = campaigns.filter(c => c.is_active).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-ocean-200">
          Here's what's happening with your organization today
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Raised"
          value={formatCurrency(totalRaised)}
          change="+23%"
          changeType="positive"
          icon="💰"
          color="mint"
        />
        <KPICard
          title="Total Donors"
          value={totalDonors.toString()}
          change="+12 this week"
          changeType="positive"
          icon="👥"
          color="coral"
        />
        <KPICard
          title="Avg Donation"
          value={formatCurrency(avgDonation)}
          change="+8%"
          changeType="positive"
          icon="📊"
          color="ocean"
        />
        <KPICard
          title="Active Campaigns"
          value={activeCampaigns.toString()}
          change={`${campaigns.length} total`}
          changeType="neutral"
          icon="🎯"
          color="mint"
        />
      </div>

      {/* This Month Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 p-6">
          <h2 className="text-xl font-display font-bold text-white mb-4">This Month</h2>
          <div className="space-y-4">
            <StatRow label="Donations Received" value={thisMonthDonations.length.toString()} />
            <StatRow label="Amount Raised" value={formatCurrency(thisMonthTotal)} />
            <StatRow label="Active Donors (90d)" value={activeDonors.toString()} />
          </div>
        </div>

        <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 p-6">
          <h2 className="text-xl font-display font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton href="/dashboard/donors/new" icon="➕">
              Add New Donor
            </ActionButton>
            <ActionButton href="/dashboard/donations/new" icon="💵">
              Record Donation
            </ActionButton>
            <ActionButton href="/dashboard/reports" icon="🤖">
              Generate AI Report
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 p-6">
        <h2 className="text-xl font-display font-bold text-white mb-4">Recent Donations</h2>
        <div className="space-y-3">
          {donations.slice(0, 5).map((donation, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-ocean-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-mint-400/20 flex items-center justify-center text-xl">
                  💚
                </div>
                <div>
                  <p className="text-white font-medium">Donation #{idx + 1}</p>
                  <p className="text-sm text-ocean-400">{new Date(donation.donation_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-mint-400 font-bold">{formatCurrency(Number(donation.amount))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KPICard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color 
}: { 
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  color: 'mint' | 'coral' | 'ocean'
}) {
  const colorClasses = {
    mint: 'from-mint-400/20 to-mint-600/10 border-mint-400/20',
    coral: 'from-coral-400/20 to-coral-600/10 border-coral-400/20',
    ocean: 'from-ocean-400/20 to-ocean-600/10 border-ocean-400/20',
  }

  const changeColorClasses = {
    positive: 'text-mint-400',
    negative: 'text-coral-400',
    neutral: 'text-ocean-300',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-ocean-300 font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-4xl font-display font-bold text-white mb-2">{value}</div>
      <div className={`text-sm ${changeColorClasses[changeType]}`}>{change}</div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ocean-200">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}

function ActionButton({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 px-4 py-3 bg-ocean-700/50 hover:bg-ocean-700 rounded-lg transition-all group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-white font-medium">{children}</span>
    </a>
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
