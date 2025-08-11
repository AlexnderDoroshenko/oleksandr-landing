import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function About() {
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

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'uk'
    setLang(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', newLang)
    }
  }

  const texts = {
    en: {
      title: "About me",
      home: "Home",
      paragraphs: [
        "My name is Oleksandr, I am an AQA Engineer with over 6 years of experience in testing.",
        "Worked at Capgemini, Nayax Retail, UPITec. Helped implement testing processes from scratch at all levels.",
        "Main stack: Python, Pytest, Playwright, Selenium, Requests. Implemented CI pipelines, Jenkins.",
        "Experienced in mentoring, teamwork, and technical interviews. Currently mainly supporting a Behave-based framework. Participate in volunteer projects and mentor beginners.",
        "I am also currently studying for a master's degree in cybersecurity.",
        "I strive to combine test automation with modern approaches to software security."
      ]
    },
    uk: {
      title: "Про мене",
      home: "Головна",
      paragraphs: [
        "Моє ім'я Олександр, я AQA Engineer з понад 6 роками досвіду у тестуванні.",
        "Працював у Capgemini, Nayax Retail, UPITec. Допомагав впроваджувати процес тестування з нуля на усіх рівнях.",
        "Основний стек: Python, Pytest, Playwright, Selenium, Requests. Впроваджували пайплайни для CI, Jenkins.",
        "Маю досвід менторства, командної роботи та технічних інтерв’ю. Наразі переважно займаюся підтримкою фреймворку на Behave. Приймаю участь у волонтерськіх проектах, менторю початківців.",
        "Також я наразі навчаюся на магістратурі на напрямку кібербезпека.",
        "Прагну поєднувати автоматизацію тестування з сучасними підходами до безпеки програмного забезпечення."
      ]
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
      <img src="/oleksandr-landing/images/avatar.png" alt="Oleksandr" className="mb-4 border-4 border-white rounded-full w-160 h-160" />
      {texts[lang].paragraphs.map((p, i) => (
        <p className="mb-2" key={i}>{p}</p>
      ))}
    </div>
  )
}
