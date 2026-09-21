import DOMPurify from 'isomorphic-dompurify'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import BlockRenderer from '../../components/BlockRenderer'
import SiteHeader from '../../components/SiteHeader'
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
  const { lang, setLang } = useLanguage()
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
    <><Head><title>{post.title} | Oleksandr Doroshenko</title></Head><main className="inner-page article-page">
      <SiteHeader lang={lang} onLanguageChange={setLang} section="blog" />
      <article className="article-shell">
        <Link className="article-back" href={{ pathname: '/blog', query: { lang } }}>← {lang === 'uk' ? 'До блогу' : 'Back to blog'}</Link>
        <div className="article-title-row"><div><p className="section-index">BLOG / {post.date}</p><h1>{post.title}</h1></div>
        {isAdmin && (
          <div className="article-admin-actions">
            <button
              onClick={() => router.push(`/admin/new-post?edit=${slug}&lang=${lang}`)}
              className="admin-button"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="admin-button danger-button"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
        </div>
        <div className="article-body">{isBlockPost(post) ? <BlockRenderer blocks={post.blocks} basePath={basePath} /> : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((post as LegacyPost).content) }} />}</div>
      </article>
    </main></>
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
