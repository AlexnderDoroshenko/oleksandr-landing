import Head from 'next/head'
import Link from 'next/link'
import SiteHeader from '../components/SiteHeader'
import { useLanguage } from '../hooks/useLanguage'

export default function NotFound() {
  const { lang, setLang } = useLanguage('en')
  const copy = lang === 'uk'
    ? { title: 'Сторінку не знайдено', text: 'Перевірте адресу або поверніться на головну.', home: 'На головну' }
    : { title: 'Page not found', text: 'Check the address or return to the home page.', home: 'Back home' }

  return <><Head><title>{copy.title} | Oleksandr Doroshenko</title></Head><div className="inner-page">
    <a className="skip-link" href="#main-content">{lang === 'uk' ? 'Перейти до вмісту' : 'Skip to content'}</a>
    <SiteHeader lang={lang} onLanguageChange={setLang} />
    <main id="main-content" className="inner-hero not-found-page" tabIndex={-1}>
      <p className="section-index">404</p><h1>{copy.title}</h1><p>{copy.text}</p>
      <Link className="button button-primary" href={{ pathname: '/', query: { lang } }}>{copy.home}</Link>
    </main>
  </div></>
}
