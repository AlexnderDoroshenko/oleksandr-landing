import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Language = 'en' | 'uk'

type PostTranslation = {
  title: string
  date: string
  content: string
}

type PostProps = {
  translations: Partial<Record<Language, PostTranslation>>
}

const languages: Language[] = ['en', 'uk']

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

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <div className="mb-4 text-sm text-gray-400">{post.date}</div>
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}

export async function getStaticPaths() {
  const postsDir = path.join(process.cwd(), 'posts')
  const files = fs.readdirSync(postsDir)

  const slugs = Array.from(new Set(
    files
      .filter((filename) => filename.endsWith('-en.md') || filename.endsWith('-uk.md'))
      .map((filename) => filename.replace(/-(en|uk)\.md$/, ''))
  ))

  const paths = slugs.map((slug) => ({
    params: { slug }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }: any) {
  const postsDir = path.join(process.cwd(), 'posts')
  const translations: Partial<Record<Language, PostTranslation>> = {}

  for (const language of languages) {
    const filePath = path.join(postsDir, `${params.slug}-${language}.md`)

    if (!fs.existsSync(filePath)) {
      continue
    }
    const markdown = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(markdown)

    translations[language] = {
      title: data.title,
      date: data.date,
      content: marked(content, { async: false })
    }
  }

  if (!translations.en && !translations.uk) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      translations
    }
  }
}
