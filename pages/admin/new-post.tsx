import dynamic from 'next/dynamic'
import Head from 'next/head'
import { withAuth } from '../../lib/withAuth'

const BlockEditor = dynamic(() => import('../../components/BlockEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      Loading editor…
    </div>
  ),
})

type Props = { role: string }

export default function NewPostPage({ role }: Props) {
  return (
    <>
      <Head>
        <title>New Post – Admin</title>
      </Head>
      <BlockEditor role={role} />
    </>
  )
}

export const getServerSideProps = withAuth('user', async (_ctx, _userId, role) => {
  return { props: { role } }
})
