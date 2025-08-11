import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Post = {
  title: string
  date: string
  slug: string
  lang: 'en' | 'uk'
}

export default function Blog({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'uk'>('uk')

  useEffect(() => {
    const queryLang = router.query.lang
    if (queryLang === 'en' || queryLang === 'uk') {
      setLang(queryLang)
      localStorage.setItem('lang', queryLang)
    } else {
      const storedLang = localStorage.getItem('lang') as 'en' | 'uk' | null
      if (storedLang === 'en' || storedLang === 'uk') {
        setLang(storedLang)
      }
    }
  }, [router.query.lang])

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
        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value as 'en' | 'uk')
            localStorage.setItem('lang', e.target.value)
          }}
          className="px-3 py-1 text-gray-900 rounded"
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
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
  const postsDir = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDir)

  const posts = filenames
    .filter((filename) => filename.endsWith('-en.md') || filename.endsWith('-uk.md'))
    .map((filename) => {
      const filePath = path.join(postsDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      // Use lang based on filename ending
      let lang: 'en' | 'uk' = 'en'
      if (filename.endsWith('-uk.md')) lang = 'uk'
      if (filename.endsWith('-en.md')) lang = 'en'
      // Remove the language suffix for the slug
      const slug = filename.replace(/-(en|uk)\.md$/, '')
      return {
        title: data.title,
        date: data.date,
        slug,
        lang,
      }
    })

  return { props: { posts } }
}
