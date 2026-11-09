import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  // Static export starts in English; useLanguage updates this after client-side selection.
  return <Html lang="en"><Head /><body><Main /><NextScript /></body></Html>
}
