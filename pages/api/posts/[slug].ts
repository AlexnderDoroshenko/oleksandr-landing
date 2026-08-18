import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import fs from 'fs'
import path from 'path'
import { authOptions } from '../../../lib/authOptions'
import { isValidSlug, isValidLang } from '../../../lib/validation'
import { successResponse, errorResponse } from '../../../lib/apiResponse'
import type { BlockPost } from '../../../types/post'

const postsDir = path.join(process.cwd(), 'posts')

async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    errorResponse(res, 'Authentication required', 401, 'UNAUTHENTICATED')
    return null
  }
  if (session.user.role !== 'admin') {
    errorResponse(res, 'Admin access required', 403, 'FORBIDDEN')
    return null
  }
  return session
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string }

  if (!isValidSlug(slug)) {
    return errorResponse(res, 'Invalid slug format', 400, 'INVALID_SLUG')
  }

  if (req.method === 'PUT') {
    const session = await requireAdmin(req, res)
    if (!session) return

    const { lang, post } = req.body as { lang?: string; post?: BlockPost }
    if (!lang || !post) return errorResponse(res, 'lang and post are required', 400, 'MISSING_FIELDS')
    if (!isValidLang(lang)) return errorResponse(res, 'lang must be "en" or "uk"', 400, 'INVALID_LANG')

    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    if (!fs.existsSync(filePath)) return errorResponse(res, 'Post not found', 404, 'NOT_FOUND')

    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8')
    return successResponse(res, { slug, lang })
  }

  if (req.method === 'DELETE') {
    const session = await requireAdmin(req, res)
    if (!session) return

    const { lang } = req.query as { lang?: string }
    if (!lang) return errorResponse(res, 'lang query parameter is required', 400, 'MISSING_FIELDS')
    if (!isValidLang(lang)) return errorResponse(res, 'lang must be "en" or "uk"', 400, 'INVALID_LANG')

    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    if (!fs.existsSync(filePath)) return errorResponse(res, 'Post not found', 404, 'NOT_FOUND')

    fs.unlinkSync(filePath)
    return successResponse(res, { deleted: true })
  }

  return errorResponse(res, 'Method not allowed', 405, 'METHOD_NOT_ALLOWED')
}
