import type { GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import KnowledgeMaterialView from '../../../components/KnowledgeMaterial'
import SiteHeader from '../../../components/SiteHeader'
import { useLanguage } from '../../../hooks/useLanguage'
import { getKnowledgeMaterials, getKnowledgeReferences, getKnowledgeTopics } from '../../../lib/knowledge'
import type { KnowledgeLevel, KnowledgeMaterial, KnowledgeReference, KnowledgeTopic } from '../../../types/knowledge'

const sections = ['junior', 'middle', 'senior', 'deep-dives', 'python-examples'] as const
type Section = typeof sections[number]

const copy = {
  en: {
    back: 'AI System Testing overview', topics: 'Topics', practice: 'Practice', answer: 'Answer', examples: 'Examples',
    exercises: 'Practice exercises', missingTranslation: 'This material is not translated into English yet.', sources: 'Primary sources',
    labels: { junior: 'Junior', middle: 'Middle', senior: 'Senior', 'deep-dives': 'Detailed discussions', 'python-examples': 'Runnable Python examples' },
    descriptions: {
      junior: 'Foundations and basic checks across the twelve AI testing topics.', middle: 'Implementation, diagnosis, comparison, and failure-path testing.', senior: 'Strategy, architecture, metrics, security, and risk decisions.',
      'deep-dives': 'Ten extended explanations with mechanisms, examples, pitfalls, and verification approaches.',
      'python-examples': 'Six executable examples validated by the repository test command.',
    },
  },
  uk: {
    back: 'До огляду тестування AI-систем', topics: 'Теми', practice: 'Практика', answer: 'Відповідь', examples: 'Приклади',
    exercises: 'Практичні вправи', missingTranslation: 'Цей матеріал ще не перекладено українською.', sources: 'Першоджерела',
    labels: { junior: 'Junior', middle: 'Middle', senior: 'Senior', 'deep-dives': 'Розгорнуті розбори', 'python-examples': 'Виконувані приклади Python' },
    descriptions: {
      junior: 'Основи та базові перевірки у дванадцяти темах тестування AI.', middle: 'Реалізація, діагностика, порівняння та перевірка failure paths.', senior: 'Стратегія, архітектура, метрики, безпека та risk decisions.',
      'deep-dives': 'Десять розгорнутих пояснень із механізмами, прикладами, типовими помилками та способами перевірки.',
      'python-examples': 'Шість виконуваних прикладів, перевірених окремою командою репозиторію.',
    },
  },
}

type Props = { section: Section; materials: KnowledgeMaterial[]; topics: KnowledgeTopic[]; references: KnowledgeReference[] }

export default function AiSystemTestingSection({ section, materials, topics, references }: Props) {
  const { lang, setLang } = useLanguage('en')
  const text = copy[lang]
  const title = text.labels[section]

  return <><Head><title>{title} | AI System Testing</title></Head><main className="inner-page knowledge-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="knowledge" />
    <article className="knowledge-direction-shell">
      <Link className="article-back" href={{ pathname: '/knowledge/ai-system-testing', query: { lang } }}>← {text.back}</Link>
      <header className="knowledge-direction-header"><p className="section-index">AI SYSTEM TESTING</p><h1>{title}</h1><p>{text.descriptions[section]}</p></header>
      <nav className="knowledge-section-tabs" aria-label={text.topics}>{sections.map(item => <Link className={item === section ? 'active' : ''} key={item} href={{ pathname: `/knowledge/ai-system-testing/${item}`, query: { lang } }}>{text.labels[item]}</Link>)}</nav>

      {(section === 'junior' || section === 'middle' || section === 'senior') && topics.map(topic => {
        const topicMaterials = materials.filter(material => material.topic === topic.id)
        if (topicMaterials.length === 0) return null
        return <section className="knowledge-topic" id={`topic-${topic.id}`} key={topic.id}>
          <header><p className="section-index">{String(topic.order).padStart(2, '0')} / 12</p><h2>{topic.translations[lang].title}</h2></header>
          <div className="knowledge-material-list">{topicMaterials.map(material => <KnowledgeMaterialView key={material.id} material={material} lang={lang} labels={text} references={references} />)}</div>
        </section>
      })}

      {section === 'deep-dives' && topics.flatMap(topic => topic.translations[lang].deepDives?.map(deepDive => <article className="knowledge-deep-dive" id={`topic-${topic.id}`} key={deepDive.title}><p className="section-index">{topic.translations[lang].title}</p><h2>{deepDive.title}</h2>{deepDive.body.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>) ?? [])}

      {section === 'python-examples' && topics.flatMap(topic => topic.translations[lang].codeExamples?.map(example => <article className="knowledge-code-example" id={example.id} key={example.id}><h2>{example.title}</h2><pre tabIndex={0}><code>{example.code}</code></pre><p>{example.explanation}</p></article>) ?? [])}
    </article>
  </main></>
}

export function getStaticPaths() {
  return { paths: sections.map(section => ({ params: { section } })), fallback: false }
}

export function getStaticProps({ params }: GetStaticPropsContext<{ section: string }>) {
  const section = params?.section as Section
  if (!sections.includes(section)) return { notFound: true }
  const allTopics = getKnowledgeTopics('ai-system-testing')
  const allMaterials = getKnowledgeMaterials('ai-system-testing')

  if (section === 'deep-dives') {
    return { props: { section, materials: [], topics: allTopics.filter(topic => topic.translations.en.deepDives), references: [] } }
  }
  if (section === 'python-examples') {
    return { props: { section, materials: [], topics: allTopics.filter(topic => topic.translations.en.codeExamples), references: [] } }
  }

  const level = `${section[0].toUpperCase()}${section.slice(1)}` as KnowledgeLevel
  const materials = allMaterials.filter(material => material.level === level)
  const sourceIds = new Set(materials.flatMap(material => material.translations.en?.sources ?? []))
  const topics = allTopics.map(topic => ({
    ...topic,
    translations: {
      uk: { title: topic.translations.uk.title, practice: '' },
      en: { title: topic.translations.en.title, practice: '' },
    },
  }))
  return { props: { section, materials, topics, references: getKnowledgeReferences().filter(reference => sourceIds.has(reference.id)) } }
}
