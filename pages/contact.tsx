import Link from 'next/link'
import { useLanguage } from '../hooks/useLanguage'
import LanguageSelector from '../components/LanguageSelector'

export default function Contact() {
  const { lang, setLang } = useLanguage('uk')
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

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="absolute flex gap-2 top-4 right-4">
        <Link
          href={lang === 'en' ? '/?lang=en' : '/?lang=uk'}
          className="px-3 py-1 text-gray-900 bg-white rounded hover:bg-gray-300"
        >
          {texts[lang].home}
        </Link>
        <LanguageSelector value={lang} onChange={setLang} />
      </div>
      <h1 className="mb-4 text-3xl font-bold">{texts[lang].title}</h1>
      <ul className="text-lg">
        <li>{texts[lang].email}: <a href="mailto:doroshenkoaldm@gmail.com" className="underline">doroshenkoaldm@gmail.com</a></li>
        <li>{texts[lang].linkedin}: <a href="https://www.linkedin.com/in/oleksandr-doroshenko-3a426a134" className="underline">oleksandr-doroshenko</a></li>
      </ul>
    </div>
  )
}