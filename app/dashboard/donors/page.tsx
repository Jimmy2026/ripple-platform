import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function DonorsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: donors } = await supabase
    .from('donors')
    .select('*')
    .order('total_donated', { ascending: false })
    .limit(50)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Donors</h1>
          <p className="text-ocean-200">Manage your donor relationships</p>
        </div>
        <Link
          href="/dashboard/donors/new"
          className="px-6 py-3 bg-coral-400 hover:bg-coral-500 rounded-full text-white font-semibold transition-all hover:scale-105"
        >
          + Add Donor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Donors" value={donors?.length.toString() || '0'} />
        <StatCard 
          label="Major Donors" 
          value={donors?.filter(d => d.tags?.includes('major_donor')).length.toString() || '0'} 
        />
        <StatCard 
          label="Monthly Sustainers" 
          value={donors?.filter(d => d.tags?.includes('monthly')).length.toString() || '0'} 
        />
        <StatCard 
          label="Total Raised" 
          value={formatCurrency(donors?.reduce((sum, d) => sum + Number(d.total_donated || 0), 0) || 0)} 
        />
      </div>

      {/* Donors Table */}
      <div className="bg-ocean-800/50 backdrop-blur-sm rounded-2xl border border-ocean-600/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ocean-700/50 border-b border-ocean-600/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ocean-200">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ocean-200">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ocean-200">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ocean-200">Tags</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ocean-200">Total Donated</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ocean-200">Donations</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-ocean-200">Last Gift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-600/30">
              {donors?.map((donor) => (
                <tr key={donor.id} className="hover:bg-ocean-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/dashboard/donors/${donor.id}`}
                      className="text-white font-medium hover:text-mint-400 transition-colors"
                    >
                      {donor.first_name} {donor.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-ocean-200 text-sm">
                    {donor.email || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-ocean-700 rounded text-xs text-ocean-200 capitalize">
                      {donor.donor_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {donor.tags?.slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-mint-400/20 text-mint-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {(donor.tags?.length || 0) > 2 && (
                        <span className="px-2 py-1 bg-ocean-700 text-ocean-300 rounded text-xs">
                          +{(donor.tags?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-mint-400 font-bold">
                      {formatCurrency(Number(donor.total_donated || 0))}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-ocean-200">
                    {donor.donation_count || 0}
                  </td>
                  <td className="px-6 py-4 text-right text-ocean-200 text-sm">
                    {donor.last_donation_date 
                      ? new Date(donor.last_donation_date).toLocaleDateString()
                      : '—'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {!donors || donors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-display font-bold text-white mb-2">No donors yet</h3>
          <p className="text-ocean-300 mb-6">Get started by adding your first donor</p>
          <Link
            href="/dashboard/donors/new"
            className="inline-block px-6 py-3 bg-coral-400 hover:bg-coral-500 rounded-full text-white font-semibold transition-all"
          >
            Add Your First Donor
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ocean-800/50 backdrop-blur-sm rounded-xl border border-ocean-600/30 p-6">
      <p className="text-sm text-ocean-300 mb-2">{label}</p>
      <p className="text-3xl font-display font-bold text-white">{value}</p>
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
