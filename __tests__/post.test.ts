import { validateFile, isBlockPost } from '../types/post'
import type { BlockPost, LegacyPost, ContentBlock } from '../types/post'

describe('validateFile', () => {
  function makeFile(name: string, type: string, sizeMB: number): File {
    const bytes = new Uint8Array(sizeMB * 1024 * 1024)
    return new File([bytes], name, { type })
  }

  describe('image validation', () => {
    it('accepts valid JPEG images under 10 MB', () => {
      const file = makeFile('photo.jpg', 'image/jpeg', 1)
      expect(validateFile(file, 'image')).toEqual({ valid: true })
    })

    it('accepts valid PNG images under 10 MB', () => {
      const file = makeFile('photo.png', 'image/png', 5)
      expect(validateFile(file, 'image')).toEqual({ valid: true })
    })

    it('rejects images over 10 MB', () => {
      const file = makeFile('big.jpg', 'image/jpeg', 11)
      const result = validateFile(file, 'image')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toMatch(/10 MB/)
      }
    })

    it('rejects unsupported image MIME types', () => {
      const file = makeFile('photo.bmp', 'image/bmp', 1)
      const result = validateFile(file, 'image')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toMatch(/image\/bmp/)
      }
    })
  })

  describe('PDF validation', () => {
    it('accepts valid PDF files under 50 MB', () => {
      const file = makeFile('doc.pdf', 'application/pdf', 10)
      expect(validateFile(file, 'pdf')).toEqual({ valid: true })
    })

    it('rejects PDFs over 50 MB', () => {
      const file = makeFile('huge.pdf', 'application/pdf', 51)
      const result = validateFile(file, 'pdf')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toMatch(/50 MB/)
      }
    })

    it('rejects non-PDF files in pdf slot', () => {
      const file = makeFile('doc.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1)
      const result = validateFile(file, 'pdf')
      expect(result.valid).toBe(false)
    })
  })

  describe('video validation', () => {
    it('accepts valid MP4 videos under 100 MB', () => {
      const file = makeFile('video.mp4', 'video/mp4', 50)
      expect(validateFile(file, 'video')).toEqual({ valid: true })
    })

    it('accepts WebM videos', () => {
      const file = makeFile('video.webm', 'video/webm', 20)
      expect(validateFile(file, 'video')).toEqual({ valid: true })
    })

    it('rejects videos over 100 MB', () => {
      const file = makeFile('huge.mp4', 'video/mp4', 101)
      const result = validateFile(file, 'video')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toMatch(/100 MB/)
      }
    })

    it('rejects unsupported video types', () => {
      const file = makeFile('video.avi', 'video/x-msvideo', 10)
      const result = validateFile(file, 'video')
      expect(result.valid).toBe(false)
    })
  })
})

describe('isBlockPost', () => {
  it('returns true for block posts', () => {
    const post: BlockPost = { title: 'Test', date: '2025-01-01', blocks: [] }
    expect(isBlockPost(post)).toBe(true)
  })

  it('returns false for legacy posts', () => {
    const post: LegacyPost = { title: 'Test', date: '2025-01-01', content: '<p>Hello</p>' }
    expect(isBlockPost(post)).toBe(false)
  })
})

describe('block ordering in BlockPost', () => {
  it('preserves the order of mixed content blocks', () => {
    const blocks: ContentBlock[] = [
      { id: '1', type: 'paragraph', content: 'First paragraph' },
      { id: '2', type: 'image', src: '/uploads/img.jpg', alt: 'Image' },
      { id: '3', type: 'paragraph', content: 'Second paragraph' },
      { id: '4', type: 'pdf', src: '/uploads/doc.pdf', filename: 'doc.pdf' },
      { id: '5', type: 'video', src: '/uploads/vid.mp4' },
    ]
    const post: BlockPost = { title: 'Test', date: '2025-01-01', blocks }

    // Verify order is preserved through serialisation round-trip
    const serialised = JSON.stringify(post)
    const deserialised: BlockPost = JSON.parse(serialised)

    expect(deserialised.blocks.map((b) => b.id)).toEqual(['1', '2', '3', '4', '5'])
    expect(deserialised.blocks.map((b) => b.type)).toEqual([
      'paragraph', 'image', 'paragraph', 'pdf', 'video',
    ])
  })
})
