import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-ocean-900">
      {/* Sidebar */}
      <aside className="w-64 bg-ocean-800 border-r border-ocean-600/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-ocean-600/30">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-mint-400 rounded-full"></div>
            <span className="text-xl font-display font-bold text-white">Ripple</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/dashboard" icon="📊">
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/donors" icon="👥">
            Donors
          </NavLink>
          <NavLink href="/dashboard/donations" icon="💰">
            Donations
          </NavLink>
          <NavLink href="/dashboard/campaigns" icon="🎯">
            Campaigns
          </NavLink>
          <NavLink href="/dashboard/interactions" icon="💬">
            Interactions
          </NavLink>
          <NavLink href="/dashboard/reports" icon="📈">
            AI Reports
          </NavLink>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-ocean-600/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-ocean-600 flex items-center justify-center text-lg">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.email}
              </p>
              <p className="text-xs text-ocean-400">Executive Director</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm text-ocean-300 hover:text-white hover:bg-ocean-700 rounded-lg transition-colors text-left"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-ocean-200 hover:text-white hover:bg-ocean-700/50 rounded-lg transition-all group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
