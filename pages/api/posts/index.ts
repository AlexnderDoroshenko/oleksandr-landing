import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import fs from 'fs'
import path from 'path'
import { authOptions } from '../../../lib/authOptions'
import { isValidSlug, isValidLang } from '../../../lib/validation'
import { successResponse, errorResponse } from '../../../lib/apiResponse'
import type { BlockPost } from '../../../types/post'

const postsDir = path.join(process.cwd(), 'posts')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405, 'METHOD_NOT_ALLOWED')
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return errorResponse(res, 'Authentication required', 401, 'UNAUTHENTICATED')
  }

  const { slug, lang, post } = req.body as {
    slug?: string
    lang?: string
    post?: BlockPost
  }

  if (!slug || !lang || !post) {
    return errorResponse(res, 'slug, lang, and post are required', 400, 'MISSING_FIELDS')
  }

  if (!isValidSlug(slug)) {
    return errorResponse(res, 'Invalid slug format', 400, 'INVALID_SLUG')
  }

  if (!isValidLang(lang)) {
    return errorResponse(res, 'lang must be "en" or "uk"', 400, 'INVALID_LANG')
  }

  try {
    fs.mkdirSync(postsDir, { recursive: true })
    const filePath = path.join(postsDir, `${slug}-${lang}.json`)
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf-8')
    return successResponse(res, { slug, lang }, 201)
  } catch {
    return errorResponse(res, 'Failed to save post', 500, 'SAVE_FAILED')
  }
}
