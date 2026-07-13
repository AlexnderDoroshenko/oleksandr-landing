import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Language, BlockPost, LegacyPost } from '../types/post'

const postsDir = path.join(process.cwd(), 'posts')

export type PostMeta = {
  title: string
  date: string
  slug: string
  lang: Language
}

export function getAllPostMetas(): PostMeta[] {
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

    try {
      if (file.endsWith('.md')) {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(raw)
        title = data.title ?? slugBase
        date = data.date ?? ''
      } else {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const json = JSON.parse(raw) as BlockPost
        title = json.title
        date = json.date
      }
    } catch (err) {
      // Silently skip files that cannot be read or parsed (e.g. permission errors,
      // malformed JSON). The file will still appear in the listing with a fallback
      // title derived from its filename.
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[posts] could not read metadata from ${file}:`, err)
      }
    }

    metas.push({ title, date, slug: slugBase, lang })
  }

  return metas
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
        content: marked(content, { async: false }) as string,
      } as LegacyPost
    }
  }

  return translations
}
