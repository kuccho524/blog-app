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
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ブログ
          </h1>
          <p className="text-xl text-gray-600">
            最新の記事をお楽しみください
          </p>
        </div>

        <div className="space-y-8">
          {posts && posts.length > 0 ? (
            posts.map((post: Post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="text-sm text-gray-500">
                    by {post.profiles?.[0]?.full_name || '匿名'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                )}

                <Link
                  href={`/posts/${post.slug}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  続きを読む →
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                まだ記事がありません。
              </p>
              <Link
                href="/auth/signup"
                className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                最初の記事を書く
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
