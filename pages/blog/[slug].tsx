import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BlockRenderer from '../../components/BlockRenderer'
import { getAllSlugs, getPostTranslations } from '../../lib/posts'
import { isBlockPost } from '../../types/post'
import type { Language, BlockPost, LegacyPost } from '../../types/post'

type PostProps = {
  translations: Partial<Record<Language, BlockPost | LegacyPost>>
}

export default function Post({ translations }: PostProps) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('en')

  useEffect(() => {
    const queryLang = router.query.lang

    if (queryLang === 'en' || queryLang === 'uk') {
      setLang(queryLang)
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', queryLang)
      }
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const storedLang = localStorage.getItem('lang')

    if (storedLang === 'en' || storedLang === 'uk') {
      setLang(storedLang)
    }
  }, [router.query.lang])

  const post = translations[lang] ?? translations.en ?? translations.uk

  if (!post) {
    return null
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <div className="mb-4 text-sm text-gray-400">{post.date}</div>
      {isBlockPost(post) ? (
        <BlockRenderer blocks={post.blocks} basePath={basePath} />
      ) : (
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: (post as LegacyPost).content }}
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

  return { props: { translations } }
}
