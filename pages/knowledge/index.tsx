import Head from 'next/head'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import { useLanguage } from '../../hooks/useLanguage'
import { getDirectionTranslation, getKnowledgeDirections, getKnowledgeMaterials } from '../../lib/knowledge'
import type { KnowledgeDirection, KnowledgeStatus } from '../../types/knowledge'

const pageCopy = {
  en: {
    metaTitle: 'Knowledge Base | Oleksandr Doroshenko',
    eyebrow: '03 / KNOWLEDGE BASE',
    title: 'A practical map for growing as a quality engineer.',
    intro: 'Questions, explanations, examples, and hands-on exercises across testing, automation, delivery, security, cloud, and AI engineering.',
    catalog: 'Directions',
    catalogIntro: 'Start with a published topic or see what is being prepared next.',
    open: 'Open direction',
    material: 'material',
    materials: 'materials',
    unavailable: 'Translation unavailable',
    quizTitle: 'Quiz',
    quizText: 'Short knowledge checks will be added as the collection grows.',
    quizStatus: 'Coming soon',
    statuses: { published: 'Published', template: 'Template available', preparation: 'In preparation' },
  },
  uk: {
    metaTitle: 'База знань | Олександр Дорошенко',
    eyebrow: '03 / БАЗА ЗНАНЬ',
    title: 'Практична мапа розвитку інженера з якості.',
    intro: 'Питання, пояснення, приклади та практичні вправи з тестування, автоматизації, delivery, безпеки, cloud та AI engineering.',
    catalog: 'Напрямки',
    catalogIntro: 'Почніть з опублікованої теми або подивіться, що готується далі.',
    open: 'Відкрити напрямок',
    material: 'матеріал',
    materials: 'матеріали',
    unavailable: 'Переклад недоступний',
    quizTitle: 'Quiz',
    quizText: 'Короткі перевірки знань з’являтимуться разом із розвитком колекції.',
    quizStatus: 'Незабаром',
    statuses: { published: 'Опубліковано', template: 'Доступний шаблон', preparation: 'Готується' },
  },
}

export default function KnowledgeIndex({ directions }: { directions: KnowledgeDirection[] }) {
  const { lang, setLang } = useLanguage('en')
  const copy = pageCopy[lang]

  return <><Head><title>{copy.metaTitle}</title></Head><main className="inner-page knowledge-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="knowledge" />
    <section className="inner-hero knowledge-hero">
      <p className="section-index">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p>{copy.intro}</p>
    </section>

    <section className="knowledge-directory" aria-labelledby="knowledge-catalog-title">
      <div className="knowledge-directory-heading">
        <p className="section-index">01 / CATALOG</p>
        <div><h2 id="knowledge-catalog-title">{copy.catalog}</h2><p>{copy.catalogIntro}</p></div>
      </div>
      <div className="knowledge-grid">
        {directions.map(direction => {
          const translation = getDirectionTranslation(direction, lang)
          const materialCount = getKnowledgeMaterials(direction.slug).length
          const status = copy.statuses[direction.status as KnowledgeStatus]

          return <article className="knowledge-card" key={direction.slug}>
            <div className="knowledge-card-meta"><span>{String(direction.order).padStart(2, '0')}</span><span className={`knowledge-status status-${direction.status}`}>{status}</span></div>
            {translation ? <>
              <h3>{translation.title}</h3>
              <p>{translation.description}</p>
              {materialCount > 0 && <small>{materialCount} {materialCount === 1 ? copy.material : copy.materials}</small>}
              <Link href={{ pathname: `/knowledge/${direction.slug}`, query: { lang } }}>{copy.open}<span aria-hidden="true">→</span></Link>
            </> : <p className="translation-status">{copy.unavailable}</p>}
          </article>
        })}
      </div>
    </section>

    <aside className="knowledge-quiz" aria-label={copy.quizTitle}>
      <div><p className="section-index">QUIZ</p><h2>{copy.quizTitle}</h2><p>{copy.quizText}</p></div>
      <span>{copy.quizStatus}</span>
    </aside>
  </main></>
}

export async function getStaticProps() {
  return { props: { directions: getKnowledgeDirections() } }
}
