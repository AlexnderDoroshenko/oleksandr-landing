import type { GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import KnowledgeMaterialView from '../../components/KnowledgeMaterial'
import SiteHeader from '../../components/SiteHeader'
import { useLanguage } from '../../hooks/useLanguage'
import { getDirectionTranslation, getKnowledgeDirection, getKnowledgeDirections, getKnowledgeMaterials } from '../../lib/knowledge'
import type { KnowledgeDirection, KnowledgeMaterial } from '../../types/knowledge'

const pageCopy = {
  en: {
    back: 'Back to Knowledge Base',
    materials: 'Questions and practice',
    intro: 'Open a question to see the answer, examples, and exercises.',
    preparation: 'Materials for this direction are in preparation.',
    unavailable: 'This direction is not translated into English yet.',
    missingTranslation: 'This material is not translated into English yet.',
    answer: 'Answer', examples: 'Examples', exercises: 'Practice exercises',
    quiz: 'Quiz', quizText: 'A knowledge check for this direction is coming soon.', comingSoon: 'Coming soon',
  },
  uk: {
    back: 'До Бази знань',
    materials: 'Питання та практика',
    intro: 'Розгорніть питання, щоб переглянути відповідь, приклади та вправи.',
    preparation: 'Матеріали для цього напрямку готуються.',
    unavailable: 'Цей напрямок ще не перекладено українською.',
    missingTranslation: 'Цей матеріал ще не перекладено українською.',
    answer: 'Відповідь', examples: 'Приклади', exercises: 'Практичні вправи',
    quiz: 'Quiz', quizText: 'Перевірка знань для цього напрямку з’явиться незабаром.', comingSoon: 'Незабаром',
  },
}

type Props = { direction: KnowledgeDirection; materials: KnowledgeMaterial[] }

export default function KnowledgeDirectionPage({ direction, materials }: Props) {
  const { lang, setLang } = useLanguage('en')
  const copy = pageCopy[lang]
  const translation = getDirectionTranslation(direction, lang)
  const title = translation?.title ?? (lang === 'uk' ? 'Переклад готується' : 'Translation in preparation')

  return <><Head><title>{title} | {lang === 'uk' ? 'База знань' : 'Knowledge Base'}</title></Head><main className="inner-page knowledge-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="knowledge" />
    <article className="knowledge-direction-shell">
      <Link className="article-back" href={{ pathname: '/knowledge', query: { lang } }}>← {copy.back}</Link>
      <header className="knowledge-direction-header">
        <p className="section-index">KNOWLEDGE / {String(direction.order).padStart(2, '0')}</p>
        <h1>{title}</h1>
        <p>{translation?.description ?? copy.unavailable}</p>
      </header>

      {translation && <section className="knowledge-material-list" aria-labelledby="knowledge-materials-title">
        <div className="knowledge-material-heading"><h2 id="knowledge-materials-title">{copy.materials}</h2><p>{materials.length > 0 ? copy.intro : copy.preparation}</p></div>
        {materials.map(material => <KnowledgeMaterialView key={material.id} material={material} lang={lang} labels={copy} />)}
      </section>}

      <aside className="direction-quiz">
        <div><p className="section-index">QUIZ</p><h2>{copy.quiz}</h2><p>{copy.quizText}</p></div>
        <span>{copy.comingSoon}</span>
      </aside>
    </article>
  </main></>
}

export async function getStaticPaths() {
  return { paths: getKnowledgeDirections().map(direction => ({ params: { direction: direction.slug } })), fallback: false }
}

export async function getStaticProps({ params }: GetStaticPropsContext<{ direction: string }>) {
  const slug = params?.direction
  if (!slug) return { notFound: true }
  const direction = getKnowledgeDirection(slug)
  if (!direction) return { notFound: true }
  return { props: { direction, materials: getKnowledgeMaterials(slug) } }
}
