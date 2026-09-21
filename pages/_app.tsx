import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="64x64" href={`${basePath}/favicon.png`} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
