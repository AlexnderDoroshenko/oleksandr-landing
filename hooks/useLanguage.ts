import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { Language } from '../types/post'

const DEFAULT_LANG: Language = 'en'
const STORAGE_KEY = 'lang'

/**
 * Reads the current UI language from (in priority order):
 *   1. `?lang=` query param
 *   2. localStorage
 *   3. the provided default (falls back to 'en')
 *
 * Also persists the selection to localStorage and exposes a setter.
 */
export function useLanguage(defaultLang: Language = DEFAULT_LANG) {
  const router = useRouter()
  const [lang, setLangState] = useState<Language>(defaultLang)

  useEffect(() => {
    const queryLang = router.query.lang

    if (queryLang === 'en' || queryLang === 'uk') {
      setLangState(queryLang)
      localStorage.setItem(STORAGE_KEY, queryLang)
      return
    }

    const storedLang = localStorage.getItem(STORAGE_KEY)
    if (storedLang === 'en' || storedLang === 'uk') {
      setLangState(storedLang)
    }
  }, [router.query.lang])

  function setLang(newLang: Language) {
    setLangState(newLang)
    localStorage.setItem(STORAGE_KEY, newLang)
  }

  return { lang, setLang }
}
