import Link from 'next/link'
import { getAllPostMetas } from '../../lib/posts'
import type { PostMeta } from '../../lib/posts'
import { useLanguage } from '../../hooks/useLanguage'
import LanguageSelector from '../../components/LanguageSelector'

type Post = PostMeta

export default function Blog({ posts }: { posts: Post[] }) {
  const { lang, setLang } = useLanguage('uk')
  const texts = {
    en: {
      title: "Blog",
      noPosts: "No posts yet.",
      home: "Home"
    },
    uk: {
      title: "Блог",
      noPosts: "Поки що немає записів.",
      home: "Головна"
    }
  }

  // Filter posts by selected language
  const filteredPosts = posts.filter(post => post.lang === lang)

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="absolute flex gap-2 top-4 right-4">
        <Link
          href={{ pathname: '/', query: { lang } }}
          className="px-3 py-1 text-gray-900 bg-white rounded hover:bg-gray-300"
        >
          {texts[lang].home}
        </Link>
        <LanguageSelector value={lang} onChange={setLang} />
      </div>
      <h1 className="mb-6 text-3xl font-bold">{texts[lang].title}</h1>
      {filteredPosts.length === 0 ? (
        <div className="text-gray-400">{texts[lang].noPosts}</div>
      ) : (
        <ul className="space-y-4">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={{
                  pathname: `/blog/${post.slug}`,
                  query: { lang }
                }}
                className="text-xl underline hover:text-yellow-300"
              >
                {post.title}
              </Link>
              <div className="text-sm text-gray-400">{post.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export async function getStaticProps() {
  const posts = getAllPostMetas()
  return { props: { posts } }
}
