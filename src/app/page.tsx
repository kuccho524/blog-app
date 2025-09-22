import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'

interface Post {
  id: any
  title: any
  excerpt: any
  slug: any
  created_at: any
  profiles: {
    full_name: any
  }[]
}

export default async function Home() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      excerpt,
      slug,
      created_at,
      profiles (
        full_name
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
            <div className="text-center">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-700/10">
                  ✨ Welcome to my digital space
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Creative thoughts,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  shared stories
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Exploring the intersection of design, technology, and creativity through personal insights and project experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#posts"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Read latest posts
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  Join the community
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section id="posts" className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover insights, tutorials, and personal reflections on design, development, and creativity.
              </p>
            </div>

            {posts && posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: Post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 text-sm text-slate-500 mb-4">
                      <time
                        dateTime={post.created_at}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.profiles?.[0]?.full_name || 'Anonymous'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/posts/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:gap-2 transition-all duration-200"
                    >
                      Continue reading
                      <svg
                        className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No stories yet</h3>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  Be the first to share your thoughts and join our growing community of writers.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start writing today
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get notified when new articles are published. No spam, just quality content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/10 backdrop-blur text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button className="px-8 py-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}