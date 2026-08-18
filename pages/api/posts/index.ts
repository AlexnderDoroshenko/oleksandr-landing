import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import fs from 'fs'
import path from 'path'
import { authOptions } from '../../../lib/authOptions'
import type { BlockPost } from '../../../types/post'

const postsDir = path.join(process.cwd(), 'posts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const { slug, lang, post } = req.body as {
    slug?: string
    lang?: string
    post?: BlockPost
  }

  if (!slug || !lang || !post) {
    return res.status(400).json({ error: 'slug, lang, and post are required' })
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug format' })
  }

  if (lang !== 'en' && lang !== 'uk') {
    return res.status(400).json({ error: 'lang must be "en" or "uk"' })
  }

  try {
    fs.mkdirSync(postsDir, { recursive: true })
    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8')
    return res.status(201).json({ slug, lang })
  } catch {
    return res.status(500).json({ error: 'Failed to save post' })
  }
}
