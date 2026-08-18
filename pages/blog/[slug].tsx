import DOMPurify from 'isomorphic-dompurify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import BlockRenderer from '../../components/BlockRenderer'
import { useLanguage } from '../../hooks/useLanguage'
import { getAllSlugs, getPostTranslations } from '../../lib/posts'
import { isBlockPost } from '../../types/post'
import type { Language, BlockPost, LegacyPost } from '../../types/post'

type PostProps = {
  slug: string
  translations: Partial<Record<Language, BlockPost | LegacyPost>>
}

export default function Post({ slug, translations }: PostProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { lang } = useLanguage()
  const [deleting, setDeleting] = useState(false)

  const isAdmin = session?.user?.role === 'admin'

  const post = translations[lang] ?? translations.en ?? translations.uk

  if (!post) {
    return null
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  async function handleDelete() {
    if (!confirm('Delete this post translation? This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch(`/api/posts/${slug}?lang=${lang}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/blog')
    } else {
      const data = (await res.json()) as { error?: { message?: string } }
      alert(data.error?.message ?? 'Delete failed')
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {isAdmin && (
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={() => router.push(`/admin/new-post?edit=${slug}&lang=${lang}`)}
              className="px-3 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      <div className="mb-4 text-sm text-gray-400">{post.date}</div>
      {isBlockPost(post) ? (
        <BlockRenderer blocks={post.blocks} basePath={basePath} />
      ) : (
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((post as LegacyPost).content) }}
        />
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const slugs = getAllSlugs()

  const paths = slugs.map((slug) => ({
    params: { slug },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const translations = getPostTranslations(params.slug)

  if (!translations.en && !translations.uk) {
    return { notFound: true }
  }

  return { props: { slug: params.slug, translations } }
}
