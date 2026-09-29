import DOMPurify from 'isomorphic-dompurify'
import Head from 'next/head'
import Link from 'next/link'
import BlockRenderer from '../../components/BlockRenderer'
import SiteHeader from '../../components/SiteHeader'
import { useLanguage } from '../../hooks/useLanguage'
import { getAllSlugs, getNextSeriesPost, getPostTranslations } from '../../lib/posts'
import type { PostLink } from '../../lib/posts'
import { isBlockPost } from '../../types/post'
import type { Language, BlockPost, LegacyPost } from '../../types/post'

type PostProps = {
  slug: string
  translations: Partial<Record<Language, BlockPost | LegacyPost>>
  nextPosts: Partial<Record<Language, PostLink>>
}

export default function Post({ slug, translations, nextPosts }: PostProps) {
  const { lang, setLang } = useLanguage()

  const post = translations[lang] ?? translations.en ?? translations.uk
  const nextPost = nextPosts[lang]

  if (!post) {
    return null
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  return (
    <><Head><title>{post.title} | Oleksandr Doroshenko</title></Head><main className="inner-page article-page">
      <SiteHeader lang={lang} onLanguageChange={setLang} section="blog" />
      <article className="article-shell">
        <Link className="article-back" href={{ pathname: '/blog', query: { lang } }}>← {lang === 'uk' ? 'До блогу' : 'Back to blog'}</Link>
        <div className="article-title-row"><div><p className="section-index">BLOG / {post.date}</p><h1>{post.title}</h1></div></div>
        <div className="article-body">{isBlockPost(post) ? <BlockRenderer blocks={post.blocks} basePath={basePath} /> : <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((post as LegacyPost).content) }} />}</div>
        {nextPost && <nav className="article-next" aria-label={lang === 'uk' ? 'Наступний пост' : 'Next post'}>
          <p>{lang === 'uk' ? 'Читати наступний пост' : 'Read next post'}</p>
          <Link href={{ pathname: `/blog/${nextPost.slug}`, query: { lang } }}><span>{nextPost.title}</span><span aria-hidden="true">→</span></Link>
        </nav>}
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
  const nextPosts: Partial<Record<Language, PostLink>> = {}

  for (const lang of ['en', 'uk'] as Language[]) {
    const nextPost = getNextSeriesPost(params.slug, lang)
    if (nextPost) nextPosts[lang] = nextPost
  }

  if (!translations.en && !translations.uk) {
    return { notFound: true }
  }

  return { props: { slug: params.slug, translations, nextPosts } }
}
