import React from 'react'
import { render, screen } from '@testing-library/react'
import BlockRenderer from '../components/BlockRenderer'
import type { ContentBlock } from '../types/post'

describe('BlockRenderer', () => {
  it('renders an empty list with no blocks', () => {
    const { container } = render(<BlockRenderer blocks={[]} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(0)
  })

  it('renders a paragraph block', () => {
    const blocks: ContentBlock[] = [
      { id: '1', type: 'paragraph', content: 'Hello world' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders an image block with alt text', () => {
    const blocks: ContentBlock[] = [
      { id: '2', type: 'image', src: '/uploads/photo.jpg', alt: 'A nice photo' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    const img = screen.getByRole('img', { name: 'A nice photo' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/uploads/photo.jpg')
  })

  it('renders an image block with a caption', () => {
    const blocks: ContentBlock[] = [
      { id: '3', type: 'image', src: '/uploads/photo.jpg', alt: 'Photo', caption: 'My caption' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('My caption')).toBeInTheDocument()
  })

  it('renders an image block without caption when caption is absent', () => {
    const blocks: ContentBlock[] = [
      { id: '3', type: 'image', src: '/uploads/photo.jpg', alt: 'Photo' },
    ]
    const { container } = render(<BlockRenderer blocks={blocks} />)
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('renders a PDF block with filename and open link', () => {
    const blocks: ContentBlock[] = [
      { id: '4', type: 'pdf', src: '/uploads/doc.pdf', filename: 'document.pdf' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Open PDF' })
    expect(link).toHaveAttribute('href', '/uploads/doc.pdf')
  })

  it('renders a PDF block with optional caption', () => {
    const blocks: ContentBlock[] = [
      { id: '4', type: 'pdf', src: '/uploads/doc.pdf', filename: 'doc.pdf', caption: 'Annual report' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('Annual report')).toBeInTheDocument()
  })

  it('renders a video block', () => {
    const blocks: ContentBlock[] = [
      { id: '5', type: 'video', src: '/uploads/demo.mp4', caption: 'Demo video' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    const video = screen.getByLabelText('Demo video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/uploads/demo.mp4')
    expect(screen.getByText('Demo video')).toBeInTheDocument()
  })

  it('renders multiple blocks in correct order', () => {
    const blocks: ContentBlock[] = [
      { id: '1', type: 'paragraph', content: 'First' },
      { id: '2', type: 'image', src: '/uploads/img.jpg', alt: 'Middle image' },
      { id: '3', type: 'paragraph', content: 'Last' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    const all = screen.getAllByText(/First|Last/)
    expect(all[0]).toHaveTextContent('First')
    expect(all[1]).toHaveTextContent('Last')
    expect(screen.getByRole('img', { name: 'Middle image' })).toBeInTheDocument()
  })

  it('prepends basePath to image src', () => {
    const blocks: ContentBlock[] = [
      { id: '1', type: 'image', src: '/uploads/img.jpg', alt: 'Test' },
    ]
    render(<BlockRenderer blocks={blocks} basePath="/oleksandr-landing" />)
    const img = screen.getByRole('img', { name: 'Test' })
    expect(img).toHaveAttribute('src', '/oleksandr-landing/uploads/img.jpg')
  })

  it('prepends basePath to PDF href', () => {
    const blocks: ContentBlock[] = [
      { id: '2', type: 'pdf', src: '/uploads/doc.pdf', filename: 'doc.pdf' },
    ]
    render(<BlockRenderer blocks={blocks} basePath="/oleksandr-landing" />)
    const link = screen.getByRole('link', { name: 'Open PDF' })
    expect(link).toHaveAttribute('href', '/oleksandr-landing/uploads/doc.pdf')
  })
})
