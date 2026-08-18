import React from 'react'
import type { Language } from '../types/post'

interface LanguageSelectorProps {
  value: Language
  onChange: (lang: Language) => void
  className?: string
}

/** Reusable language picker dropdown. */
export default function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className={`px-3 py-1 text-gray-900 rounded ${className}`}
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="uk">Українська</option>
    </select>
  )
}
