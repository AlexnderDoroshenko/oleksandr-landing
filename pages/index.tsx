import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'uk'>('uk')

  useEffect(() => {
    // Пріоритет: query param > localStorage > default
    const queryLang = router.query.lang
    if (queryLang === 'en' || queryLang === 'uk') {
      setLang(queryLang)
      localStorage.setItem('lang', queryLang)
    } else {
      const storedLang = localStorage.getItem('lang') as 'en' | 'uk' | null
      if (storedLang === 'en' || storedLang === 'uk') {
        setLang(storedLang)
      }
    }
  }, [router.query.lang])

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as 'en' | 'uk')
  }

  // Texts for both languages
  const texts = {
    en: {
      title: "Oleksandr Doroshenko – AQA Engineer",
      greeting: "Hello! I'm Oleksandr Doroshenko",
      description: "AQA engineer with experience in automation, CI/CD, Python, Jenkins, Docker, and leadership. Also learning in the field of cybersecurity.",
      about: "About me",
      blog: "Blog",
      contact: "Contact"
    },
    uk: {
      title: "Олександр Дорошенко – AQA Інженер",
      greeting: "Привіт! Я Олександр Дорошенко",
      description: "AQA інженер з досвідом автоматизації, CI/CD, Python, Jenkins, Docker та лідерських функцій. Навчаюся також у сфері кібербезпеки.",
      about: "Про мене",
      blog: "Блог",
      contact: "Контакти"
    }
  };

  return (
    <>
      <Head>
        <title>{texts[lang].title}</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
        <div className="absolute top-4 right-4">
          <select
            value={lang}
            onChange={handleLangChange}
            className="px-3 py-1 text-gray-900 rounded"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="uk">Українська</option>
          </select>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/oleksandr-landing/images/avatar.png" alt="Oleksandr" className="mb-4 border-4 border-white rounded-full w-160 h-160" />
        <h1 className="mb-2 text-3xl font-bold">{texts[lang].greeting}</h1>
        <p className="max-w-xl text-lg text-center">
          {texts[lang].description}
        </p>
        <div className="flex gap-4 mt-6">
          <Link href={{ pathname: '/about', query: { lang } }} className="px-4 py-2 text-gray-900 bg-white rounded hover:bg-gray-300">
            {texts[lang].about}
          </Link>
          <Link href={{ pathname: '/blog', query: { lang } }} className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900">
            {texts[lang].blog}
          </Link>
          <Link href={{ pathname: '/contact', query: { lang } }} className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900">
            {texts[lang].contact}
          </Link>
        </div>
      </main>
    </>
  )
}
