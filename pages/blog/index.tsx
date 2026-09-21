import Head from 'next/head'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import { useLanguage } from '../../hooks/useLanguage'
import { getAllPostMetas } from '../../lib/posts'
import type { PostMeta } from '../../lib/posts'

export default function Blog({ posts }: { posts: PostMeta[] }) {
  const { lang, setLang } = useLanguage('en')
  const filteredPosts = posts.filter(post => post.lang === lang)
  const copy = lang === 'uk'
    ? { title: 'Нотатки про якість та інженерію.', intro: 'Практичні спостереження про автоматизацію, процеси, безпеку та створення програмного забезпечення.', empty: 'Поки що немає записів.' }
    : { title: 'Notes on quality and engineering.', intro: 'Practical observations on automation, process, security, and building software.', empty: 'No posts yet.' }

  return <><Head><title>{lang === 'uk' ? 'Блог' : 'Blog'} | Oleksandr Doroshenko</title></Head><main className="inner-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="blog" />
    <section className="inner-hero blog-hero"><p className="section-index">02 / BLOG</p><h1>{copy.title}</h1><p>{copy.intro}</p></section>
    <section className="article-list">{filteredPosts.length === 0 ? <p className="empty-state">{copy.empty}</p> : filteredPosts.map((post, index) => <article key={post.slug}>
      <span>0{index + 1}</span><div><p>{post.date}</p><h2><Link href={{ pathname: `/blog/${post.slug}`, query: { lang } }}>{post.title}</Link></h2></div><Link aria-label={post.title} href={{ pathname: `/blog/${post.slug}`, query: { lang } }}>↗</Link>
    </article>)}</section>
  </main></>
}

export async function getStaticProps() { return { props: { posts: getAllPostMetas() } } }
