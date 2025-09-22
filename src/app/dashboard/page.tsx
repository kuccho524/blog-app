import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
}

export default async function Dashboard() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: posts }: { data: Post[] | null } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const publishedPosts = posts?.filter(post => post.published) || []
  const draftPosts = posts?.filter(post => !post.published) || []

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Your Stories
              </h1>
              <p className="text-lg text-slate-600">
                Manage and create your articles
              </p>
            </div>
            <Link
              href="/posts/new"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl self-start"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Story
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Stories</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {posts?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {publishedPosts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {draftPosts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {posts && posts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Your Stories</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors group-hover:text-blue-600 truncate"
                        >
                          {post.title}
                        </Link>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {Math.ceil(post.content.length / 1000)} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {post.published && (
                        <Link
                          href={`/posts/${post.slug}`}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      )}
                      <Link
                        href={`/posts/${post.slug}/edit`}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Start your writing journey</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Share your thoughts, experiences, and expertise with the world. Your first story is just a click away.
            </p>
            <Link
              href="/posts/new"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first story
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}