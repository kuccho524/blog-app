'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Stories
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium"
            >
              Home
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/posts/new"
                      className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium ml-2"
                    >
                      Write
                    </Link>
                    <div className="relative group ml-2">
                      <button className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-50 transition-all">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium ml-2"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/posts/new"
                        className="block px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Write
                      </Link>
                      <div className="px-4 py-2 border-t border-slate-200 mt-2 pt-2">
                        <p className="text-sm text-slate-500 mb-2">{user.email}</p>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        className="block px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}