export type Language = 'en' | 'uk'

export type ParagraphBlock = {
  id: string
  type: 'paragraph'
  content: string
}

export type ImageBlock = {
  id: string
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export type PdfBlock = {
  id: string
  type: 'pdf'
  src: string
  filename: string
  caption?: string
}

export type VideoBlock = {
  id: string
  type: 'video'
  src: string
  caption?: string
}

export type ContentBlock = ParagraphBlock | ImageBlock | PdfBlock | VideoBlock

export type BlockPost = {
  title: string
  date: string
  blocks: ContentBlock[]
}

export type LegacyPost = {
  title: string
  date: string
  content: string
}

export function isBlockPost(post: BlockPost | LegacyPost): post is BlockPost {
  return 'blocks' in post
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
export const ALLOWED_PDF_TYPES = ['application/pdf']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10 MB
export const MAX_PDF_SIZE = 50 * 1024 * 1024     // 50 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024  // 100 MB

export type ValidationResult = { valid: true } | { valid: false; error: string }

export function validateFile(file: File, blockType: 'image' | 'pdf' | 'video'): ValidationResult {
  let allowedTypes: string[]
  let maxSize: number
  let typeLabel: string

  if (blockType === 'image') {
    allowedTypes = ALLOWED_IMAGE_TYPES
    maxSize = MAX_IMAGE_SIZE
    typeLabel = 'Images'
  } else if (blockType === 'pdf') {
    allowedTypes = ALLOWED_PDF_TYPES
    maxSize = MAX_PDF_SIZE
    typeLabel = 'PDFs'
  } else {
    allowedTypes = ALLOWED_VIDEO_TYPES
    maxSize = MAX_VIDEO_SIZE
    typeLabel = 'Videos'
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `${typeLabel} must be one of: ${allowedTypes.join(', ')}. Received: ${file.type || 'unknown'}`
    }
  }

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024)
    const fileMB = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size ${fileMB} MB exceeds the ${maxMB} MB limit for ${typeLabel.toLowerCase()}.`
    }
  }

  return { valid: true }
}
