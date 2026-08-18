import type { Language } from '../types/post'

/** Returns true when the slug contains only lowercase letters, digits, and hyphens. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug)
}

const SUPPORTED_LANGUAGES: Language[] = ['en', 'uk']

/** Returns true when the value is a supported UI language. */
export function isValidLang(lang: unknown): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language)
}
