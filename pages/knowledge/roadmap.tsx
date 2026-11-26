import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import roadmapData from '../../content/knowledge/roadmap.json'
import { useLanguage } from '../../hooks/useLanguage'
import { getKnowledgeDirections } from '../../lib/knowledge'
import type { KnowledgeDirection } from '../../types/knowledge'
import type { Language } from '../../types/post'

type LocalizedText = { title: string; summary: string }
type MilestoneText = { title: string; action: string; evidence: string }
type Milestone = { id: string; directions: string[]; translations: Record<Language, MilestoneText> }
type Region = { id: string; order: number; translations: Record<Language, LocalizedText>; milestones: Milestone[] }
type Props = { regions: Region[]; directions: KnowledgeDirection[] }

const STORAGE_KEY = 'knowledge-roadmap-completed-v1'
const copy = {
  en: {
    meta: 'Practical learning map | Oleksandr Doroshenko',
    back: 'Knowledge Base', eyebrow: 'FIELD GUIDE / QUALITY ENGINEERING',
    title: 'Make the next step visible.',
    intro: 'A practical map of six connected areas. Each milestone asks you to build something, check the result, and keep the evidence. Choose a route that fits your work.',
    regions: 'Explore the areas', route: 'The map', routeNote: 'The route is a suggestion. You can work on neighboring areas in parallel.',
    progress: 'Your progress', completed: 'milestones completed',
    milestone: 'Milestone', doThis: 'Do this', proof: 'Evidence of completion',
    resources: 'Study this topic', markDone: 'Mark complete', done: 'Completed',
    storage: 'Progress is saved in this browser only. The checkboxes are a personal planning aid, not a skill certification.',
  },
  uk: {
    meta: 'Практична мапа навчання | Олександр Дорошенко',
    back: 'База знань', eyebrow: 'ПОЛЬОВИЙ ПОСІБНИК / ІНЖЕНЕРІЯ ЯКОСТІ',
    title: 'Зробіть наступний крок видимим.',
    intro: 'Практична мапа шести пов’язаних областей. Кожен майлстоун пропонує щось створити, перевірити результат і зберегти докази. Оберіть маршрут під свої задачі.',
    regions: 'Оберіть область', route: 'Мапа', routeNote: 'Маршрут рекомендований. Суміжні області можна проходити паралельно.',
    progress: 'Ваш прогрес', completed: 'майлстоунів виконано',
    milestone: 'Майлстоун', doThis: 'Завдання', proof: 'Доказ виконання',
    resources: 'Вивчити тему', markDone: 'Позначити виконаним', done: 'Виконано',
    storage: 'Прогрес зберігається лише в цьому браузері. Позначки допомагають планувати навчання і не засвідчують кваліфікацію.',
  },
}

export default function KnowledgeRoadmap({ regions, directions }: Props) {
  const { lang, setLang } = useLanguage('en')
  const labels = copy[lang]
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const directionBySlug = new Map(directions.map(direction => [direction.slug, direction]))
  const milestoneCount = regions.reduce((count, region) => count + region.milestones.length, 0)
  const completedCount = completedIds.filter(id => regions.some(region => region.milestones.some(milestone => milestone.id === id))).length

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      if (Array.isArray(saved)) setCompletedIds(saved.filter((id): id is string => typeof id === 'string'))
    } catch {
      setCompletedIds([])
    }
  }, [])

  function toggleMilestone(id: string) {
    setCompletedIds(previous => {
      const next = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Browser storage may be unavailable. */ }
      return next
    })
  }

  return <><Head><title>{labels.meta}</title><meta name="description" content={labels.intro} /></Head>
    <div className="inner-page roadmap-page">
      <a className="skip-link" href="#main-content">{lang === 'uk' ? 'Перейти до вмісту' : 'Skip to content'}</a>
      <SiteHeader lang={lang} onLanguageChange={setLang} section="knowledge" />
      <main id="main-content" tabIndex={-1}>
        <section className="roadmap-hero">
          <Link className="article-back" href={{ pathname: '/knowledge', query: { lang } }}>← {labels.back}</Link>
          <p className="section-index">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p className="roadmap-intro">{labels.intro}</p>
          <div className="roadmap-progress" aria-label={labels.progress}>
            <div><span>{labels.progress}</span><strong>{completedCount}<span> / {milestoneCount}</span></strong></div>
            <p>{labels.completed}</p>
            <progress value={completedCount} max={milestoneCount} aria-label={labels.progress}>{completedCount} / {milestoneCount}</progress>
          </div>
        </section>

        <nav className="roadmap-area-nav" aria-label={labels.regions}>
          <span>{labels.regions}</span>
          <div>{regions.map(region => <a key={region.id} href={`#area-${region.id}`}><b>{String(region.order).padStart(2, '0')}</b>{region.translations[lang].title}</a>)}</div>
        </nav>

        <section className="roadmap-section" aria-labelledby="roadmap-title">
          <div className="roadmap-section-heading"><div><p className="section-index">01 / ROUTE</p><h2 id="roadmap-title">{labels.route}</h2></div><p>{labels.routeNote}</p></div>
          <div className="roadmap-map">
            <svg className="roadmap-route" viewBox="0 0 1200 1080" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M110 110 C450 70 490 270 650 240 S1110 120 1060 360 C1010 590 410 420 190 610 S490 1010 670 850 S1010 780 1090 980" /></svg>
            {regions.map(region => <section className={`roadmap-region roadmap-region-${region.id}`} id={`area-${region.id}`} key={region.id} aria-labelledby={`area-title-${region.id}`}>
              <header className="roadmap-region-header">
                <span className="roadmap-pin" aria-hidden="true">{String(region.order).padStart(2, '0')}</span>
                <div><p className="section-index">{String(region.order).padStart(2, '0')} / {String(regions.length).padStart(2, '0')}</p><h3 id={`area-title-${region.id}`}>{region.translations[lang].title}</h3><p>{region.translations[lang].summary}</p></div>
              </header>
              <ol className="roadmap-milestones">
                {region.milestones.map((milestone, index) => {
                  const content = milestone.translations[lang]
                  const isDone = completedIds.includes(milestone.id)
                  return <li key={milestone.id} className={isDone ? 'is-done' : ''}>
                    <div className="roadmap-milestone-heading"><span>{labels.milestone} {region.order}.{index + 1}</span><h4>{content.title}</h4></div>
                    <p><strong>{labels.doThis}.</strong> {content.action}</p>
                    <p className="roadmap-evidence"><strong>{labels.proof}.</strong> {content.evidence}</p>
                    <div className="roadmap-milestone-links">{milestone.directions.map(slug => {
                      const direction = directionBySlug.get(slug)
                      if (!direction) return null
                      return <Link key={slug} href={{ pathname: `/knowledge/${slug}`, query: { lang } }} aria-label={`${labels.resources}: ${direction.translations[lang]?.title ?? slug}`}>{direction.translations[lang]?.title ?? slug}</Link>
                    })}</div>
                    <label className="roadmap-check"><input type="checkbox" checked={isDone} onChange={() => toggleMilestone(milestone.id)} /><span>{isDone ? labels.done : labels.markDone}</span></label>
                  </li>
                })}
              </ol>
            </section>)}
          </div>
          <p className="roadmap-storage-note">{labels.storage}</p>
        </section>
      </main>
    </div>
  </>
}

export async function getStaticProps() {
  return { props: { regions: roadmapData as Region[], directions: getKnowledgeDirections() } }
}
