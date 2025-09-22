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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <Link
            href="/posts/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            新規投稿
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">あなたの投稿</h2>

            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border-l-4 border-indigo-400 bg-indigo-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="hover:text-indigo-600"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {new Date(post.created_at).toLocaleDateString('ja-JP')}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.published ? '公開中' : '下書き'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/posts/${post.slug}/edit`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          編集
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">まだ投稿がありません。</p>
                <Link
                  href="/posts/new"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  最初の投稿を作成
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}