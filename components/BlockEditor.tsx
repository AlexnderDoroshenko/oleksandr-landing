import React, { useState, useRef, useId } from 'react'
import type {
  ContentBlock,
  ParagraphBlock,
  ImageBlock,
  PdfBlock,
  VideoBlock,
  BlockPost,
} from '../types/post'
import { validateFile } from '../types/post'

// Extended blocks carry optional preview URL and File for media blocks
type EditorBlock =
  | ParagraphBlock
  | (ImageBlock & { previewUrl?: string; file?: File })
  | (PdfBlock & { previewUrl?: string; file?: File })
  | (VideoBlock & { previewUrl?: string; file?: File })

function generateBlockId() {
  return Math.random().toString(36).slice(2, 10)
}

/** Converts a title (including non-ASCII/Cyrillic characters) to a URL-safe slug. */
function slugify(text: string): string {
  return text
    .normalize('NFD')                     // decompose accents/diacritics
    .replace(/[\u0300-\u036f]/g, '')      // strip combining characters
    .toLowerCase()
    .replace(/[а-яіїєґ]/g, (ch) => cyrillicToLatin[ch] ?? ch)  // transliterate Cyrillic
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const cyrillicToLatin: Record<string, string> = {
  а:'a', б:'b', в:'v', г:'h', ґ:'g', д:'d', е:'e', є:'ye', ж:'zh', з:'z',
  и:'y', і:'i', ї:'yi', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p',
  р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts', ч:'ch', ш:'sh', щ:'shch',
  ю:'yu', я:'ya', ь:'', ъ:'',
}

interface BlockEditorProps {
  initialTitle?: string
  initialDate?: string
  initialLang?: 'en' | 'uk'
  initialBlocks?: ContentBlock[]
}

export default function BlockEditor({
  initialTitle = '',
  initialDate = new Date().toISOString().slice(0, 10),
  initialLang = 'en',
  initialBlocks = [],
}: BlockEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [date, setDate] = useState(initialDate)
  const [lang, setLang] = useState<'en' | 'uk'>(initialLang)
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks as EditorBlock[])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [exported, setExported] = useState(false)
  const formId = useId()

  // ─── Block mutations ──────────────────────────────────────────────────────

  function moveUp(index: number) {
    if (index === 0) return
    setBlocks((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function moveDown(index: number) {
    setBlocks((prev) => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  function removeBlock(index: number) {
    setBlocks((prev) => {
      const block = prev[index] as EditorBlock & { previewUrl?: string }
      if (block.previewUrl) URL.revokeObjectURL(block.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function updateBlock(index: number, patch: Partial<EditorBlock>) {
    setBlocks((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch } as EditorBlock
      return next
    })
  }

  function addParagraph() {
    setBlocks((prev) => [...prev, { id: generateBlockId(), type: 'paragraph', content: '' }])
  }

  function handleMediaFile(
    index: number,
    file: File,
    blockType: 'image' | 'pdf' | 'video'
  ) {
    const result = validateFile(file, blockType)
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, [index]: result.error }))
      return
    }
    setErrors((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })

    const previewUrl = URL.createObjectURL(file)
    const src = `/uploads/${file.name}`

    if (blockType === 'image') {
      updateBlock(index, { src, previewUrl, file } as Partial<EditorBlock>)
    } else if (blockType === 'pdf') {
      updateBlock(index, { src, filename: file.name, previewUrl, file } as Partial<EditorBlock>)
    } else {
      updateBlock(index, { src, previewUrl, file } as Partial<EditorBlock>)
    }
  }

  function addImageBlock() {
    setBlocks((prev) => [
      ...prev,
      { id: generateBlockId(), type: 'image', src: '', alt: '', caption: '' } as EditorBlock,
    ])
  }

  function addPdfBlock() {
    setBlocks((prev) => [
      ...prev,
      { id: generateBlockId(), type: 'pdf', src: '', filename: '', caption: '' } as EditorBlock,
    ])
  }

  function addVideoBlock() {
    setBlocks((prev) => [
      ...prev,
      { id: generateBlockId(), type: 'video', src: '', caption: '' } as EditorBlock,
    ])
  }

  // ─── Export ───────────────────────────────────────────────────────────────

  function exportPost() {
    const cleanBlocks: ContentBlock[] = blocks.map((b) => {
      if (b.type === 'paragraph') return { id: b.id, type: 'paragraph', content: b.content }
      if (b.type === 'image') {
        const { previewUrl: _p, file: _f, ...rest } = b as ImageBlock & { previewUrl?: string; file?: File }
        return rest
      }
      if (b.type === 'pdf') {
        const { previewUrl: _p, file: _f, ...rest } = b as PdfBlock & { previewUrl?: string; file?: File }
        return rest
      }
      // video
      const { previewUrl: _p, file: _f, ...rest } = b as VideoBlock & { previewUrl?: string; file?: File }
      return rest
    })

    const post: BlockPost = { title, date, blocks: cleanBlocks }
    const json = JSON.stringify(post, null, 2)
    const slug = slugify(title) || 'post'

    // Download JSON file
    downloadText(json, `${slug}-${lang}.json`, 'application/json')

    // Download each media file
    for (const block of blocks) {
      const b = block as EditorBlock & { file?: File }
      if (b.file) {
        downloadFile(b.file)
      }
    }

    setExported(true)
  }

  function downloadText(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadFile(file: File) {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">New Blog Post</h1>

        {/* Post meta */}
        <div className="mb-8 space-y-4">
          <div>
            <label htmlFor={`${formId}-title`} className="block mb-1 text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              id={`${formId}-title`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Post title"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor={`${formId}-date`} className="block mb-1 text-sm font-medium text-gray-300">
                Date
              </label>
              <input
                id={`${formId}-date`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-lang`} className="block mb-1 text-sm font-medium text-gray-300">
                Language
              </label>
              <select
                id={`${formId}-lang`}
                value={lang}
                onChange={(e) => setLang(e.target.value as 'en' | 'uk')}
                className="px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="en">English</option>
                <option value="uk">Українська</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blocks */}
        <div className="mb-6 space-y-4">
          {blocks.length === 0 && (
            <div role="status" aria-live="polite" className="text-gray-500 italic">
              No blocks yet. Add content below.
            </div>
          )}

          {blocks.map((block, index) => (
            <div key={block.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              {/* Block controls */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {block.type}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs text-gray-300 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30 focus:outline-none focus:ring-1 focus:ring-white"
                    aria-label="Move block up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === blocks.length - 1}
                    className="px-2 py-1 text-xs text-gray-300 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30 focus:outline-none focus:ring-1 focus:ring-white"
                    aria-label="Move block down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeBlock(index)}
                    className="px-2 py-1 text-xs text-red-400 bg-gray-700 rounded hover:bg-red-900 focus:outline-none focus:ring-1 focus:ring-red-400"
                    aria-label="Remove block"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {errors[index] && (
                <p role="alert" className="mb-2 text-sm text-red-400">
                  {errors[index]}
                </p>
              )}

              {/* Paragraph */}
              {block.type === 'paragraph' && (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 text-white bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Write your paragraph here…"
                  aria-label="Paragraph content"
                />
              )}

              {/* Image */}
              {block.type === 'image' && (
                <ImageBlockForm
                  block={block as ImageBlock & { previewUrl?: string }}
                  index={index}
                  onFileChange={(file) => handleMediaFile(index, file, 'image')}
                  onAltChange={(alt) => updateBlock(index, { alt })}
                  onCaptionChange={(caption) => updateBlock(index, { caption })}
                />
              )}

              {/* PDF */}
              {block.type === 'pdf' && (
                <PdfBlockForm
                  block={block as PdfBlock & { previewUrl?: string }}
                  index={index}
                  onFileChange={(file) => handleMediaFile(index, file, 'pdf')}
                  onCaptionChange={(caption) => updateBlock(index, { caption })}
                />
              )}

              {/* Video */}
              {block.type === 'video' && (
                <VideoBlockForm
                  block={block as VideoBlock & { previewUrl?: string }}
                  index={index}
                  onFileChange={(file) => handleMediaFile(index, file, 'video')}
                  onCaptionChange={(caption) => updateBlock(index, { caption })}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={addParagraph}
            className="px-4 py-2 text-sm text-gray-900 bg-white rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            + Text
          </button>
          <button
            onClick={addImageBlock}
            className="px-4 py-2 text-sm text-white border border-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            + Image
          </button>
          <button
            onClick={addPdfBlock}
            className="px-4 py-2 text-sm text-white border border-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            + PDF
          </button>
          <button
            onClick={addVideoBlock}
            className="px-4 py-2 text-sm text-white border border-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            + Video
          </button>
        </div>

        {/* Export */}
        <div className="p-4 mb-8 bg-gray-800 rounded-lg border border-gray-600">
          <h2 className="mb-2 text-lg font-semibold">Export Post</h2>
          <p className="mb-4 text-sm text-gray-400">
            Downloads the post JSON file and all media files. Place the JSON in{' '}
            <code className="text-yellow-300">posts/</code> and media files in{' '}
            <code className="text-yellow-300">public/uploads/</code>, then commit and push.
          </p>
          <button
            onClick={exportPost}
            disabled={!title.trim() || blocks.length === 0}
            className="px-6 py-3 text-sm font-semibold text-gray-900 bg-yellow-400 rounded hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Download Post Files
          </button>
          {exported && (
            <p className="mt-2 text-sm text-green-400">
              ✓ Files downloaded. Commit them to publish the post.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-forms ────────────────────────────────────────────────────────────────

function ImageBlockForm({
  block,
  index,
  onFileChange,
  onAltChange,
  onCaptionChange,
}: {
  block: ImageBlock & { previewUrl?: string }
  index: number
  onFileChange: (file: File) => void
  onAltChange: (alt: string) => void
  onCaptionChange: (caption: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const id = `img-block-${index}`

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${id}-file`} className="block mb-1 text-sm text-gray-300">
          Image file <span className="text-gray-500">(JPEG, PNG, GIF, WebP, SVG · max 10 MB)</span>
        </label>
        <input
          id={`${id}-file`}
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
          className="block text-sm text-gray-300 file:mr-3 file:px-3 file:py-1 file:text-sm file:text-gray-900 file:bg-white file:border-0 file:rounded file:cursor-pointer"
        />
      </div>
      {block.previewUrl && (
        <img
          src={block.previewUrl}
          alt={block.alt || 'Preview'}
          className="max-h-48 rounded"
        />
      )}
      <div>
        <label htmlFor={`${id}-alt`} className="block mb-1 text-sm text-gray-300">
          Alt text <span className="text-red-400">*</span>
        </label>
        <input
          id={`${id}-alt`}
          type="text"
          value={block.alt}
          onChange={(e) => onAltChange(e.target.value)}
          required
          className="w-full px-3 py-2 text-white bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Describe the image for screen readers"
        />
      </div>
      <div>
        <label htmlFor={`${id}-caption`} className="block mb-1 text-sm text-gray-300">
          Caption <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id={`${id}-caption`}
          type="text"
          value={block.caption ?? ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="w-full px-3 py-2 text-white bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Caption shown below the image"
        />
      </div>
    </div>
  )
}

function PdfBlockForm({
  block,
  index,
  onFileChange,
  onCaptionChange,
}: {
  block: PdfBlock & { previewUrl?: string }
  index: number
  onFileChange: (file: File) => void
  onCaptionChange: (caption: string) => void
}) {
  const id = `pdf-block-${index}`

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${id}-file`} className="block mb-1 text-sm text-gray-300">
          PDF file <span className="text-gray-500">(max 50 MB)</span>
        </label>
        <input
          id={`${id}-file`}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
          className="block text-sm text-gray-300 file:mr-3 file:px-3 file:py-1 file:text-sm file:text-gray-900 file:bg-white file:border-0 file:rounded file:cursor-pointer"
        />
      </div>
      {block.filename && (
        <p className="text-sm text-gray-400">
          Selected: <span className="text-white">{block.filename}</span>
        </p>
      )}
      {block.previewUrl && (
        <iframe
          src={block.previewUrl}
          className="w-full rounded"
          style={{ height: '300px' }}
          title={block.filename}
        />
      )}
      <div>
        <label htmlFor={`${id}-caption`} className="block mb-1 text-sm text-gray-300">
          Caption / description <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id={`${id}-caption`}
          type="text"
          value={block.caption ?? ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="w-full px-3 py-2 text-white bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Short description of the PDF"
        />
      </div>
    </div>
  )
}

function VideoBlockForm({
  block,
  index,
  onFileChange,
  onCaptionChange,
}: {
  block: VideoBlock & { previewUrl?: string }
  index: number
  onFileChange: (file: File) => void
  onCaptionChange: (caption: string) => void
}) {
  const id = `video-block-${index}`

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${id}-file`} className="block mb-1 text-sm text-gray-300">
          Video file <span className="text-gray-500">(MP4, WebM, OGG · max 100 MB)</span>
        </label>
        <input
          id={`${id}-file`}
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
          className="block text-sm text-gray-300 file:mr-3 file:px-3 file:py-1 file:text-sm file:text-gray-900 file:bg-white file:border-0 file:rounded file:cursor-pointer"
        />
      </div>
      {block.previewUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={block.previewUrl}
          controls
          className="max-h-48 rounded"
          aria-label="Video preview"
        />
      )}
      <div>
        <label htmlFor={`${id}-caption`} className="block mb-1 text-sm text-gray-300">
          Caption <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id={`${id}-caption`}
          type="text"
          value={block.caption ?? ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="w-full px-3 py-2 text-white bg-gray-900 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Caption shown below the video"
        />
      </div>
    </div>
  )
}
