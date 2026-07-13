import dynamic from 'next/dynamic'
import Head from 'next/head'

const BlockEditor = dynamic(() => import('../../components/BlockEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      Loading editor…
    </div>
  ),
})

export default function NewPostPage() {
  return (
    <>
      <Head>
        <title>New Post – Admin</title>
      </Head>
      <BlockEditor />
    </>
  )
}
