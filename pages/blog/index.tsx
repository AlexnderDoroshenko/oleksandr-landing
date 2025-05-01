import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default function Blog({ posts }: { posts: any[] }) {
  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Блог</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-xl underline hover:text-yellow-300">
              {post.title}
            </Link>
            <div className="text-sm text-gray-400">{post.date}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const postsDir = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDir)

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return {
      title: data.title,
      date: data.date,
      slug: filename.replace(/\.md$/, '')
    }
  })

  return { props: { posts } }
}
