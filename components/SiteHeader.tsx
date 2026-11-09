import Link from 'next/link'
import LanguageSelector from './LanguageSelector'
import MobileNavigation from './MobileNavigation'
import type { Language } from '../types/post'

type Props = { lang: Language; onLanguageChange: (lang: Language) => void; section?: string }

export default function SiteHeader({ lang, onLanguageChange, section }: Props) {
  const labels = lang === 'uk'
    ? { home: 'Головна', about: 'Про мене', knowledge: 'База знань', blog: 'Блог', contact: 'Контакти' }
    : { home: 'Home', about: 'About', knowledge: 'Knowledge Base', blog: 'Blog', contact: 'Contact' }
  return <header className="site-header inner-header">
    <Link className="monogram" href={{ pathname: '/', query: { lang } }} aria-label={`OD. — ${labels.home}`}>OD<span>.</span></Link>
    <nav className="desktop-nav" aria-label={lang === 'uk' ? 'Основна навігація' : 'Primary navigation'}>
      <Link className={section === 'about' ? 'active' : ''} href={{ pathname: '/about', query: { lang } }}>{labels.about}</Link>
      <Link className={section === 'knowledge' ? 'active' : ''} href={{ pathname: '/knowledge', query: { lang } }}>{labels.knowledge}</Link>
      <Link className={section === 'blog' ? 'active' : ''} href={{ pathname: '/blog', query: { lang } }}>{labels.blog}</Link>
      <Link className={section === 'contact' ? 'active' : ''} href={{ pathname: '/contact', query: { lang } }}>{labels.contact}</Link>
    </nav>
    <MobileNavigation lang={lang}>
      <Link href={{ pathname: '/about', query: { lang } }}>{labels.about}</Link>
      <Link href={{ pathname: '/knowledge', query: { lang } }}>{labels.knowledge}</Link>
      <Link href={{ pathname: '/blog', query: { lang } }}>{labels.blog}</Link>
      <Link href={{ pathname: '/contact', query: { lang } }}>{labels.contact}</Link>
    </MobileNavigation>
    <LanguageSelector value={lang} onChange={onLanguageChange} className="language-select" />
  </header>
}
