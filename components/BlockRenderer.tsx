import React from 'react'
import type { ContentBlock } from '../types/post'

interface BlockRendererProps {
  blocks: ContentBlock[]
  basePath?: string
}

export default function BlockRenderer({ blocks, basePath = '' }: BlockRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <div key={block.id} className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{block.content}</p>
              </div>
            )

          case 'image':
            return (
              <figure key={block.id} className="my-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}${block.src}`}
                  alt={block.alt}
                  className="w-full rounded-lg"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-sm text-center text-gray-400">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'pdf':
            return (
              <div
                key={block.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-600"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">📄</span>
                  <div>
                    <p className="font-medium text-white">{block.filename}</p>
                    {block.caption && (
                      <p className="text-sm text-gray-400">{block.caption}</p>
                    )}
                  </div>
                </div>
                <a
                  href={`${basePath}${block.src}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm text-gray-900 bg-white rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Open PDF
                </a>
                <iframe
                  src={`${basePath}${block.src}`}
                  className="w-full mt-3 rounded"
                  style={{ height: '500px' }}
                  title={block.filename}
                />
              </div>
            )

          case 'video':
            return (
              <figure key={block.id} className="my-4">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={`${basePath}${block.src}`}
                  controls
                  className="w-full rounded-lg"
                  aria-label={block.caption ?? 'Video'}
                >
                  Your browser does not support the video tag.
                </video>
                {block.caption && (
                  <figcaption className="mt-2 text-sm text-center text-gray-400">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
