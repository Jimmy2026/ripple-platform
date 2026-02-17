'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/dashboard`,
          },
        })
        
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-mint-400 rounded-full"></div>
          <span className="text-3xl font-display font-bold text-white">Ripple</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-ocean-800/80 backdrop-blur-lg rounded-2xl border border-ocean-600/30 p-8 shadow-2xl">
          <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-ocean-200 text-center mb-8">
            {isSignUp ? 'Start managing your donors today' : 'Sign in to your account'}
          </p>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-coral-400/10 border border-coral-400/30 rounded-lg">
              <p className="text-coral-400 text-sm">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-4 bg-mint-400/10 border border-mint-400/30 rounded-lg">
              <p className="text-mint-400 text-sm">{message}</p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ocean-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-ocean-700/50 border border-ocean-600/50 rounded-lg text-white placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ocean-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-ocean-700/50 border border-ocean-600/50 rounded-lg text-white placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="mt-2 text-xs text-ocean-400">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-coral-400 hover:bg-coral-500 rounded-full text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setMessage('')
              }}
              className="text-mint-400 hover:text-mint-300 text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-ocean-600/30">
            <p className="text-xs text-ocean-400 text-center mb-3">Quick Demo Access:</p>
            <div className="bg-ocean-700/30 rounded-lg p-3 text-xs text-ocean-300 font-mono">
              <p>Email: demo@ripple.dev</p>
              <p>Password: demo123</p>
              <p className="text-ocean-500 mt-2">(Or create your own account above)</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-ocean-300 hover:text-mint-400 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
