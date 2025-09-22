import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil(post.content.length / 1000)
  const publishDate = new Date(post.created_at)

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main>
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.created_at}>
                    {publishDate.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{readingTime} min read</span>
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{post.profiles?.full_name || 'Anonymous'}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight max-w-3xl mx-auto">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <article className="prose prose-lg prose-slate max-w-none">
              <div className="space-y-6">
                {post.content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.trim() === '') {
                    return <div key={index} className="h-4" />
                  }

                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-3xl font-bold text-slate-900 mt-12 mb-6 pb-2 border-b border-slate-200">
                        {paragraph.slice(2)}
                      </h1>
                    )
                  }

                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                        {paragraph.slice(3)}
                      </h2>
                    )
                  }

                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-3">
                        {paragraph.slice(4)}
                      </h3>
                    )
                  }

                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 rounded-r-lg">
                        <p className="text-slate-700 italic leading-relaxed">
                          {paragraph.slice(2)}
                        </p>
                      </blockquote>
                    )
                  }

                  if (paragraph.startsWith('- ') || paragraph.match(/^\d+\. /)) {
                    return (
                      <div key={index} className="flex items-start space-x-3 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <p className="text-slate-700 leading-relaxed">
                          {paragraph.replace(/^[-\d+\. ]+/, '')}
                        </p>
                      </div>
                    )
                  }

                  return (
                    <p key={index} className="text-slate-700 leading-relaxed text-lg mb-6">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </article>

            {/* Back to Home */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stories
              </Link>
            </div>
          </div>
        </section>

        {/* Author Section */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {(post.profiles?.full_name || 'Anonymous').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {post.profiles?.full_name || 'Anonymous'}
                  </h3>
                  <p className="text-slate-600">
                    Published on {publishDate.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}