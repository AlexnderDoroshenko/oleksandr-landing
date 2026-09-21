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
