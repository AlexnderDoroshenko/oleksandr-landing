import Link from 'next/link'
import LanguageSelector from './LanguageSelector'
import type { Language } from '../types/post'

type Props = { lang: Language; onLanguageChange: (lang: Language) => void; section?: string }

export default function SiteHeader({ lang, onLanguageChange, section }: Props) {
  const labels = lang === 'uk'
    ? { home: 'Головна', about: 'Про мене', blog: 'Блог', contact: 'Контакти' }
    : { home: 'Home', about: 'About', blog: 'Blog', contact: 'Contact' }
  return <header className="site-header inner-header">
    <Link className="monogram" href={{ pathname: '/', query: { lang } }} aria-label={labels.home}>OD<span>.</span></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link className={section === 'about' ? 'active' : ''} href={{ pathname: '/about', query: { lang } }}>{labels.about}</Link>
      <Link className={section === 'blog' ? 'active' : ''} href={{ pathname: '/blog', query: { lang } }}>{labels.blog}</Link>
      <Link className={section === 'contact' ? 'active' : ''} href={{ pathname: '/contact', query: { lang } }}>{labels.contact}</Link>
    </nav>
    <LanguageSelector value={lang} onChange={onLanguageChange} className="language-select" />
  </header>
}
