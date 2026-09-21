import { isBlockPost } from '../types/post'
import type { BlockPost, LegacyPost, ContentBlock } from '../types/post'

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
