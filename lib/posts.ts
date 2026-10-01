import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Language, BlockPost, LegacyPost } from '../types/post'

const postsDir = path.join(process.cwd(), 'posts')

let cachedPostMetas: PostMeta[] | null = null

export type PostMeta = {
  title: string
  date: string
  summary: string
  slug: string
  lang: Language
  series?: string
  seriesOrder?: number
}

export type PostLink = Pick<PostMeta, 'title' | 'slug'>

export function getAllPostMetas(): PostMeta[] {
  // Cache the result in production (static builds) to avoid re-reading every post
  // file for each call. In development the cache is skipped so edits are reflected
  // immediately without restarting the server.
  if (cachedPostMetas && process.env.NODE_ENV === 'production') return [...cachedPostMetas]
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir)
  const metas: PostMeta[] = []

  for (const file of files) {
    let lang: Language | null = null
    let slugBase: string | null = null

    if (file.endsWith('-en.md')) {
      lang = 'en'
      slugBase = file.replace(/-en\.md$/, '')
    } else if (file.endsWith('-uk.md')) {
      lang = 'uk'
      slugBase = file.replace(/-uk\.md$/, '')
    } else if (file.endsWith('-en.json')) {
      lang = 'en'
      slugBase = file.replace(/-en\.json$/, '')
    } else if (file.endsWith('-uk.json')) {
      lang = 'uk'
      slugBase = file.replace(/-uk\.json$/, '')
    }

    if (!lang || !slugBase) continue

    const filePath = path.join(postsDir, file)
    let title = slugBase
    let date = ''
    let summary = ''
    let series: string | undefined
    let seriesOrder: number | undefined

    try {
      if (file.endsWith('.md')) {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(raw)
        title = data.title ?? slugBase
        date = data.date ?? ''
        summary = data.summary ?? ''
        series = data.series
        seriesOrder = data.seriesOrder != null ? Number(data.seriesOrder) : undefined
      } else {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const json = JSON.parse(raw) as BlockPost
        title = json.title
        date = json.date
        summary = json.summary ?? ''
        series = (json as BlockPost & { series?: string }).series
        seriesOrder = (json as BlockPost & { seriesOrder?: number }).seriesOrder
      }
    } catch (err) {
      // Silently skip files that cannot be read or parsed (e.g. permission errors,
      // malformed JSON). The file will still appear in the listing with a fallback
      // title derived from its filename.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[posts] could not read metadata from ${file}:`, err)
      }
    }

    metas.push({ title, date, summary, slug: slugBase, lang, series, seriesOrder })
  }

  cachedPostMetas = metas.sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date)
    if (dateOrder) return dateOrder

    if (a.seriesOrder != null && b.seriesOrder != null) {
      const seriesOrder = b.seriesOrder - a.seriesOrder
      if (seriesOrder) return seriesOrder
    }

    return a.title.localeCompare(b.title)
  })
  return [...cachedPostMetas]
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir)
  const slugs = new Set<string>()

  for (const file of files) {
    if (file.endsWith('-en.md')) slugs.add(file.replace(/-en\.md$/, ''))
    else if (file.endsWith('-uk.md')) slugs.add(file.replace(/-uk\.md$/, ''))
    else if (file.endsWith('-en.json')) slugs.add(file.replace(/-en\.json$/, ''))
    else if (file.endsWith('-uk.json')) slugs.add(file.replace(/-uk\.json$/, ''))
  }

  return Array.from(slugs)
}

const localizedPostsCache: Partial<Record<Language, PostMeta[]>> = {}

export function getNextSeriesPost(slug: string, lang: Language): PostLink | null {
  const localizedPosts =
    localizedPostsCache[lang] ?? (localizedPostsCache[lang] = getAllPostMetas().filter(post => post.lang === lang))
  const currentPost = localizedPosts.find(post => post.slug === slug)
  if (!currentPost || currentPost.series == null || currentPost.seriesOrder == null) return null

  const nextPost = localizedPosts.find(
    post => post.series === currentPost.series && post.seriesOrder === currentPost.seriesOrder! + 1
  )
  return nextPost ? { title: nextPost.title, slug: nextPost.slug } : null
}

export function getPostTranslations(
  slug: string
): Partial<Record<Language, BlockPost | LegacyPost>> {
  const languages: Language[] = ['en', 'uk']
  const translations: Partial<Record<Language, BlockPost | LegacyPost>> = {}

  for (const lang of languages) {
    // Prefer JSON block post format
    const jsonPath = path.join(postsDir, `${slug}-${lang}.json`)
    if (fs.existsSync(jsonPath)) {
      try {
        const raw = fs.readFileSync(jsonPath, 'utf-8')
        translations[lang] = JSON.parse(raw) as BlockPost
        continue
      } catch (err) {
        // JSON is malformed – fall through to markdown fallback so the post can
        // still be rendered. Warn in development to help authors spot broken files.
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[posts] malformed JSON in ${slug}-${lang}.json:`, err)
        }
      }
    }

    // Fall back to legacy markdown
    const mdPath = path.join(postsDir, `${slug}-${lang}.md`)
    if (fs.existsSync(mdPath)) {
      const raw = fs.readFileSync(mdPath, 'utf-8')
      const { data, content } = matter(raw)
      translations[lang] = {
        title: data.title,
        date: data.date,
        summary: data.summary,
        content: marked.parse(content) as string,
      } as LegacyPost
    }
  }

  return translations
}
