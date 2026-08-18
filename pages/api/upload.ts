import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/authOptions'
import { errorResponse, successResponse } from '../../lib/apiResponse'
import { MAX_VIDEO_SIZE } from '../../types/post'

export const config = { api: { bodyParser: false } }

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405, 'METHOD_NOT_ALLOWED')
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return errorResponse(res, 'Authentication required', 401, 'UNAUTHENTICATED')
  }
  if (session.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403, 'FORBIDDEN')
  }

  fs.mkdirSync(uploadsDir, { recursive: true })

  const form = formidable({ uploadDir: uploadsDir, keepExtensions: true, maxFileSize: MAX_VIDEO_SIZE })

  return new Promise<void>((resolve) => {
    form.parse(req, (err, _fields, files) => {
      if (err) {
        errorResponse(res, 'Upload failed', 500, 'UPLOAD_FAILED')
        return resolve()
      }

      const uploaded = files.file
      const fileEntry = Array.isArray(uploaded) ? uploaded[0] : uploaded
      if (!fileEntry) {
        errorResponse(res, 'No file provided', 400, 'MISSING_FILE')
        return resolve()
      }

      // Keep the server-generated UUID filename from formidable (keepExtensions: true)
      // rather than trusting the client-supplied originalFilename, to prevent collisions.
      const serverFilename = path.basename(fileEntry.filepath)

      successResponse(res, { path: `/uploads/${serverFilename}` }, 201)
      resolve()
    })
  })
}
