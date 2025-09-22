'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const postSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '内容は必須です'),
  excerpt: z.string().optional(),
  published: z.boolean(),
})

type PostFormData = {
  title: string
  content: string
  excerpt?: string
  published: boolean
}

export default function EditPost({ params }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      published: false,
    },
  })

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { slug } = await params
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: post, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('author_id', user.id)
          .single()

        type Post = {
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

        if (error || !post) {
          router.push('/dashboard')
          return
        }

        const typedPost = post as Post
        setValue('title', typedPost.title)
        setValue('content', typedPost.content)
        setValue('excerpt', typedPost.excerpt || '')
        setValue('published', typedPost.published)
      } catch (error) {
        console.error('Error loading post:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params, router, setValue])

  const onSubmit = async (data: PostFormData) => {
    setSaving(true)

    try {
      const { slug } = await params
      const supabase = createClient()

      const { error } = await supabase
        .from('posts')
        .update({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || null,
          published: data.published,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)

      if (error) {
        throw error
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating post:', error)
      alert('投稿の更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？この操作は取り消せません。')) {
      return
    }

    try {
      const { slug } = await params
      const supabase = createClient()

      const { error } = await supabase.from('posts').delete().eq('slug', slug)

      if (error) {
        throw error
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('投稿の削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">投稿を編集</h1>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
          >
            削除
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                タイトル
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700"
              >
                概要（オプション）
              </label>
              <textarea
                id="excerpt"
                rows={3}
                {...register('excerpt')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="記事の簡単な説明を入力してください"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                内容
              </label>
              <textarea
                id="content"
                rows={20}
                {...register('content')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="記事の内容を入力してください（Markdown記法が使えます）"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                {...register('published')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                公開する
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? '保存中...' : '更新'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}