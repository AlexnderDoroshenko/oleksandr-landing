import Head from 'next/head'
import SiteHeader from '../components/SiteHeader'
import { useLanguage } from '../hooks/useLanguage'

export default function Contact() {
  const { lang, setLang } = useLanguage('en')
  const copy = lang === 'uk' ? {
    eyebrow: 'КОНТАКТИ', title: 'Поговорімо про якість вашого продукту.',
    text: 'Відкритий до Senior AQA та Automation Lead ролей, продуктових колаборацій і обміну інженерним досвідом.',
    location: 'Одеса, Україна · Віддалена співпраця', email: 'Електронна пошта', social: 'Професійні профілі',
  } : {
    eyebrow: 'CONTACT', title: 'Let’s talk about your product’s quality.',
    text: 'Open to Senior AQA and Automation Lead roles, product collaborations, and thoughtful engineering exchange.',
    location: 'Odesa, Ukraine · Remote collaboration', email: 'Email', social: 'Professional profiles',
  }
  return <><Head><title>{copy.eyebrow} | Oleksandr Doroshenko</title></Head><main className="inner-page contact-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="contact" />
    <section className="contact-hero"><p className="section-index">03 / {copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.text}</p><span>{copy.location}</span></section>
    <section className="contact-directory">
      <div><p>{copy.email}</p><a href="mailto:doroshenkoaldm@gmail.com">doroshenkoaldm@gmail.com <span>↗</span></a></div>
      <div><p>{copy.social}</p><a href="https://www.linkedin.com/in/oleksandr-doroshenko-3a426a134" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a><a href="https://github.com/AlexnderDoroshenko" target="_blank" rel="noreferrer">GitHub <span>↗</span></a></div>
    </section>
  </main></>
}
