import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export default function Post({ title, date, content }: any) {
  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <div className="mb-4 text-sm text-gray-400">{date}</div>
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map((filename) => ({
    params: { slug: filename.replace('.md', '') }
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }: any) {
  const filePath = path.join('posts', `${params.slug}.md`)
  const markdown = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(markdown)

  return {
    props: {
      title: data.title,
      date: data.date,
      content: marked(content)
    }
  }
}
