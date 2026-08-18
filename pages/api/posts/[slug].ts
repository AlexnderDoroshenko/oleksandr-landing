import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import fs from 'fs'
import path from 'path'
import { authOptions } from '../../../lib/authOptions'
import type { BlockPost } from '../../../types/post'

const postsDir = path.join(process.cwd(), 'posts')

function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  // Inline check so we can early-return
  return getServerSession(req, res, authOptions).then((session) => {
    if (!session) {
      res.status(401).json({ error: 'Authentication required' })
      return null
    }
    const role = (session.user as { role?: string })?.role
    if (role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' })
      return null
    }
    return session
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug format' })
  }

  if (req.method === 'PUT') {
    const session = await requireAdmin(req, res)
    if (!session) return

    const { lang, post } = req.body as { lang?: string; post?: BlockPost }
    if (!lang || !post) return res.status(400).json({ error: 'lang and post are required' })
    if (lang !== 'en' && lang !== 'uk') return res.status(400).json({ error: 'lang must be "en" or "uk"' })

    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Post not found' })

    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8')
    return res.status(200).json({ slug, lang })
  }

  if (req.method === 'DELETE') {
    const session = await requireAdmin(req, res)
    if (!session) return

    const { lang } = req.query as { lang?: string }
    if (!lang) return res.status(400).json({ error: 'lang query parameter is required' })
    if (lang !== 'en' && lang !== 'uk') return res.status(400).json({ error: 'lang must be "en" or "uk"' })

    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Post not found' })

    fs.unlinkSync(filePath)
    return res.status(200).json({ deleted: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
