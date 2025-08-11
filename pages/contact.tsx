import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'uk'>('uk')

  useEffect(() => {
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

  const texts = {
    en: {
      title: "Contact",
      email: "Email",
      linkedin: "LinkedIn",
      home: "Home"
    },
    uk: {
      title: "Контакти",
      email: "Електронна пошта",
      linkedin: "LinkedIn",
      home: "Головна"
    }
  }

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'uk'
    setLang(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', newLang)
    }
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="absolute flex gap-2 top-4 right-4">
        <Link
          href={lang === 'en' ? '/?lang=en' : '/?lang=uk'}
          className="px-3 py-1 text-gray-900 bg-white rounded hover:bg-gray-300"
        >
          {texts[lang].home}
        </Link>
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
      <h1 className="mb-4 text-3xl font-bold">{texts[lang].title}</h1>
      <ul className="text-lg">
        <li>{texts[lang].email}: <a href="mailto:doroshenkoaldm@gmail.com" className="underline">doroshenkoaldm@gmail.com</a></li>
        <li>{texts[lang].linkedin}: <a href="https://www.linkedin.com/in/oleksandr-doroshenko-3a426a134" className="underline">oleksandr-doroshenko</a></li>
      </ul>
    </div>
  )
}