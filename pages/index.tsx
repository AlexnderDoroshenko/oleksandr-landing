import Head from 'next/head'
import Link from 'next/link'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSelector from '../components/LanguageSelector'

export default function Home() {
  const { lang, setLang } = useLanguage('en')
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
          <LanguageSelector value={lang} onChange={setLang} />
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
