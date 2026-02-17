import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ripple | Living Data for Lasting Impact',
  description: 'Modern donor management and multi-site analytics for nonprofits. AI-powered, zero manual entry, 100% free to start.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ocean-900/80 backdrop-blur-lg border-b border-ocean-600/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-mint-400 rounded-full animate-ripple"></div>
              <div className="absolute inset-0 bg-mint-400 rounded-full"></div>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Ripple</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm hover:text-mint-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-mint-400 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm hover:text-mint-400 transition-colors">Pricing</a>
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-coral-400 hover:bg-coral-500 rounded-full text-sm font-medium transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-mint-400/10 border border-mint-400/30 rounded-full">
              <span className="w-2 h-2 bg-mint-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-mint-400">100% Free • AI-Powered • No Credit Card</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
              Living Data for<br />
              <span className="bg-gradient-to-r from-coral-400 via-coral-300 to-mint-400 bg-clip-text text-transparent">
                Lasting Impact
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-ocean-200 max-w-3xl mx-auto leading-relaxed">
              The donor management platform where typing is minimal, insights are instant, 
              and your database grows smarter with every interaction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/login"
                className="px-8 py-4 bg-coral-400 hover:bg-coral-500 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-coral-400/50"
              >
                Start Free Demo
              </Link>
              <button 
                className="px-8 py-4 bg-ocean-600/50 hover:bg-ocean-600 border border-ocean-400/30 rounded-full text-lg font-semibold transition-all hover:scale-105"
              >
                Watch 2-Min Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-col items-center space-y-3">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-ocean-600 border-2 border-ocean-700 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-ocean-300">
                Trusted by <span className="text-mint-400 font-semibold">47 nonprofits</span> across 12 countries
              </p>
            </div>
          </div>

          {/* Hero Visual - Floating Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-transparent to-transparent z-10"></div>
            <div className="relative bg-ocean-800/50 backdrop-blur-sm rounded-3xl border border-ocean-600/30 p-1 animate-float shadow-2xl">
              <div className="bg-ocean-900 rounded-2xl p-8">
                {/* Mock Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-gradient-to-br from-mint-400/20 to-mint-600/10 rounded-xl p-6 border border-mint-400/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-mint-300 font-medium">Total Raised</span>
                      <div className="w-2 h-2 bg-mint-400 rounded-full animate-pulse-slow"></div>
                    </div>
                    <div className="text-4xl font-display font-bold text-white mb-2">$127,450</div>
                    <div className="text-sm text-mint-300">↑ 23% vs last month</div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-gradient-to-br from-coral-400/20 to-coral-600/10 rounded-xl p-6 border border-coral-400/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-coral-300 font-medium">Active Donors</span>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-pulse-slow"></div>
                    </div>
                    <div className="text-4xl font-display font-bold text-white mb-2">847</div>
                    <div className="text-sm text-coral-300">↑ 12 new this week</div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-gradient-to-br from-ocean-400/20 to-ocean-600/10 rounded-xl p-6 border border-ocean-400/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-ocean-300 font-medium">Avg Donation</span>
                      <div className="w-2 h-2 bg-ocean-400 rounded-full animate-pulse-slow"></div>
                    </div>
                    <div className="text-4xl font-display font-bold text-white mb-2">$150</div>
                    <div className="text-sm text-ocean-300">↑ 8% vs target</div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-coral-400/10 to-mint-400/10 rounded-xl border border-coral-400/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-mint-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-ocean-900 text-sm font-bold">AI</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">Weekly Insight</div>
                      <div className="text-sm text-ocean-200">
                        Sarah Thompson hasn't donated in 90 days. Her average is $500. 
                        <span className="text-mint-400 font-medium"> Suggest a personalized outreach?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-ocean-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold mb-4">
              Stop typing. Start <span className="text-mint-400">connecting.</span>
            </h2>
            <p className="text-xl text-ocean-200 max-w-2xl mx-auto">
              AI handles the busywork. You focus on relationships that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group bg-ocean-800/50 backdrop-blur-sm rounded-2xl p-8 border border-ocean-600/30 hover:border-mint-400/50 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-ocean-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold mb-4">
              Three steps to <span className="text-coral-400">smarter fundraising</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-400 to-coral-400 flex items-center justify-center text-2xl font-display font-bold mb-6">
                    {idx + 1}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-ocean-200 leading-relaxed">{step.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-mint-400/50 to-coral-400/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-ocean-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl font-bold mb-4">
              Start free. <span className="text-mint-400">Scale forever.</span>
            </h2>
            <p className="text-xl text-ocean-200">
              Built on 100% free infrastructure. No hidden costs.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-mint-400/20 to-coral-400/20 rounded-3xl p-12 border-2 border-mint-400/30">
            <div className="text-center">
              <div className="text-6xl font-display font-bold mb-2">$0</div>
              <div className="text-2xl text-ocean-200 mb-8">Forever free for nonprofits</div>
              
              <ul className="text-left space-y-4 mb-8">
                {pricingFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-mint-400 mr-3 text-xl">✓</span>
                    <span className="text-ocean-100">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/login"
                className="block w-full px-8 py-4 bg-coral-400 hover:bg-coral-500 rounded-full text-lg font-semibold transition-all hover:scale-105"
              >
                Get Started Now
              </Link>

              <p className="text-sm text-ocean-300 mt-6">
                No credit card • No setup fees • Cancel anytime (but why would you?)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-ocean-600/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-mint-400 rounded-full"></div>
              <span className="text-xl font-display font-bold">Ripple</span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-ocean-300">
              <a href="#" className="hover:text-mint-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-mint-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-mint-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-mint-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-ocean-400">
            © 2025 Ripple Platform. Built with care for nonprofits everywhere. 🌊
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Everything',
    description: 'Draft outreach emails, generate executive reports, extract data from notes—all in seconds.',
  },
  {
    icon: '📊',
    title: 'Multi-Site Analytics',
    description: 'Compare performance across locations in real-time. Spot trends before they become problems.',
  },
  {
    icon: '💬',
    title: 'Living Interactions',
    description: 'Every call, email, meeting builds your database. AI learns what matters to each donor.',
  },
  {
    icon: '🎯',
    title: 'Smart Predictions',
    description: 'Know which donors are at risk of churning. Get suggested next actions for every relationship.',
  },
  {
    icon: '🔐',
    title: 'Bank-Level Security',
    description: 'Role-based access, audit logs, row-level security. Your data stays yours.',
  },
  {
    icon: '⚡️',
    title: 'Lightning Fast',
    description: 'Add a donor in 30 seconds. Generate a weekly report in 10 seconds. Built for speed.',
  },
]

const steps = [
  {
    title: 'Import or Start Fresh',
    description: 'Add your first donor. Or upload 1000. Paste meeting notes. AI extracts everything.',
  },
  {
    title: 'Watch It Learn',
    description: 'Every donation, interaction, and note makes your database smarter. No manual tagging.',
  },
  {
    title: 'Get Insights',
    description: 'Weekly reports, outreach drafts, churn predictions. Your AI fundraising assistant.',
  },
]

const pricingFeatures = [
  'Unlimited donors, donations, sites',
  'AI executive reports (weekly)',
  'AI outreach drafts (unlimited)',
  'Multi-site dashboards',
  'Interaction logging & history',
  'Role-based team access',
  'Email & magic link auth',
  'Mobile-responsive design',
  'Community support',
  'All future updates included',
]
