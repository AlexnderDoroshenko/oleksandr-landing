import type { GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import KnowledgeMaterialView from '../../components/KnowledgeMaterial'
import SiteHeader from '../../components/SiteHeader'
import { useLanguage } from '../../hooks/useLanguage'
import { getDirectionTranslation, getKnowledgeCurriculum, getKnowledgeDirection, getKnowledgeDirections, getKnowledgeMaterials, getKnowledgeReferences, getKnowledgeTopics } from '../../lib/knowledge'
import type { KnowledgeCurriculum, KnowledgeDirection, KnowledgeMaterial, KnowledgeReference, KnowledgeTopic } from '../../types/knowledge'

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
    topics: 'Topics', practice: 'Practice', deepDive: 'Detailed discussion', codeExamples: 'Runnable Python examples',
    sources: 'Primary sources',
    learningProject: 'Learning project', completion: 'Completion criteria', reviewed: 'Reviewed',
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
    topics: 'Теми', practice: 'Практика', deepDive: 'Розгорнутий розбір', codeExamples: 'Виконувані приклади Python',
    sources: 'Першоджерела',
    learningProject: 'Навчальний проєкт', completion: 'Критерії готовності', reviewed: 'Перевірено',
  },
}

type Props = { direction: KnowledgeDirection; materials: KnowledgeMaterial[]; topics: KnowledgeTopic[]; references: KnowledgeReference[]; curriculum: KnowledgeCurriculum | null }

export default function KnowledgeDirectionPage({ direction, materials, topics, references, curriculum }: Props) {
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

      {curriculum && <section className="knowledge-curriculum" aria-label={copy.learningProject}>
        <p className="knowledge-reviewed">{copy.reviewed}: {curriculum.reviewedAt}</p>
        {curriculum.translations[lang].principles.map(principle => <p key={principle}>{principle}</p>)}
        <h2>{copy.learningProject}</h2><p>{curriculum.translations[lang].project}</p>
        <h2>{copy.completion}</h2>
        <dl>{(['Junior', 'Middle', 'Senior'] as const).map(level => <div key={level}><dt>{level}</dt><dd>{curriculum.translations[lang].completion[level]}</dd></div>)}</dl>
        <p>{curriculum.translations[lang].definitionOfDone}</p>
      </section>}

      {translation && topics.length > 0 && <>
        <nav className="knowledge-topic-nav" aria-label={copy.topics}>
          <p className="section-index">{copy.topics}</p>
          <ol>{topics.map(topic => <li key={topic.id}><a href={`#topic-${topic.id}`}><span>{String(topic.order).padStart(2, '0')}</span>{topic.translations[lang].title}</a></li>)}</ol>
        </nav>
        {topics.map(topic => {
          const topicContent = topic.translations[lang]
          const topicMaterials = materials.filter(material => material.topic === topic.id)
          return <section className="knowledge-topic" id={`topic-${topic.id}`} key={topic.id} aria-labelledby={`topic-title-${topic.id}`}>
            <header><p className="section-index">{String(topic.order).padStart(2, '0')} / 12</p><h2 id={`topic-title-${topic.id}`}>{topicContent.title}</h2></header>
            <aside className="knowledge-practice"><h3>{copy.practice}</h3><p>{topicContent.practice}</p></aside>
            <div className="knowledge-material-list">{topicMaterials.map(material => <KnowledgeMaterialView key={material.id} material={material} lang={lang} labels={copy} references={references} />)}</div>
            {topicContent.deepDives?.map(deepDive => <article className="knowledge-deep-dive" key={deepDive.title}><p className="section-index">{copy.deepDive}</p><h3>{deepDive.title}</h3>{deepDive.body.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>)}
            {topicContent.codeExamples && <section className="knowledge-code-examples"><h3>{copy.codeExamples}</h3>{topicContent.codeExamples.map(example => <article id={example.id} key={example.id}><h4>{example.title}</h4><pre tabIndex={0}><code>{example.code}</code></pre><p>{example.explanation}</p></article>)}</section>}
          </section>
        })}
      </>}

      {translation && topics.length === 0 && <section className="knowledge-material-list" aria-labelledby="knowledge-materials-title">
        <div className="knowledge-material-heading"><h2 id="knowledge-materials-title">{copy.materials}</h2><p>{materials.length > 0 ? copy.intro : copy.preparation}</p></div>
        {materials.map(material => <KnowledgeMaterialView key={material.id} material={material} lang={lang} labels={copy} references={references} />)}
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
  return { props: { direction, materials: getKnowledgeMaterials(slug), topics: getKnowledgeTopics(slug), references: getKnowledgeReferences(), curriculum: getKnowledgeCurriculum(slug) } }
}
