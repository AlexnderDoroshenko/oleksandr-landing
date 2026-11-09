import type { ReactNode } from 'react'
import type { Language } from '../types/post'

export default function MobileNavigation({ lang, children }: { lang: Language; children: ReactNode }) {
  const label = lang === 'uk' ? 'Меню' : 'Menu'
  const navigation = lang === 'uk' ? 'Основна навігація' : 'Primary navigation'

  return <details className="mobile-navigation">
    <summary>{label}</summary>
    <nav aria-label={navigation}>{children}</nav>
  </details>
}
