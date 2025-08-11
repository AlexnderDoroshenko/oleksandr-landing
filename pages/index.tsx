import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Oleksandr Doroshenko – AQA Engineer</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/oleksandr-landing/images/avatar.png" alt="Oleksandr" className="mb-4 border-4 border-white rounded-full w-160 h-160" />
        <h1 className="mb-2 text-3xl font-bold">Привіт! Я Олександр Дорошенко</h1>
        <p className="max-w-xl text-lg text-center">
          AQA інженер з досвідом автоматизації, CI/CD, Python, Jenkins, Docker та лідерських функцій. Навчаюся також у сфері кібербезпеки.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/about" className="px-4 py-2 text-gray-900 bg-white rounded hover:bg-gray-300">
            Про мене
          </Link>
          <Link href="/blog" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900">
            Блог
          </Link>
          <Link href="/contact" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900">
            Контакти
          </Link>
        </div>
      </main>
    </>
  )
}
