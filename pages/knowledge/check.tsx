import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import { knowledgeChecks, type KnowledgeCheck } from '../../content/knowledge/checks'
import roadmapData from '../../content/knowledge/roadmap.json'
import { useLanguage } from '../../hooks/useLanguage'
import { getCheckReport, type CheckAnswer } from '../../lib/knowledgeChecks'
import type { Language } from '../../types/post'

const regions = roadmapData.map(region => ({ id: region.id, title: region.translations }))
const practiceChecks = knowledgeChecks.filter(check => check.mode === 'practice')
const depthChecks = knowledgeChecks.filter(check => check.mode === 'depth')

const copy = {
  en: {
    meta: 'Reinforce the material | Oleksandr Doroshenko', back: 'Knowledge Base', eyebrow: 'PRACTICE / SELF-CHECK',
    title: 'Reinforce the material.', intro: 'Try one short scenario in each area, then explore a separate self-check across Junior, Middle, and Senior situations. Explanations point back to the knowledge base.',
    areaNav: 'Jump to an area', practice: 'Practice by area', practiceIntro: 'Answer, read the explanation, and revisit the linked topic. These prompts are for learning, not grading.',
    depth: 'Check your understanding', depthIntro: '18 original scenarios, three per area. Choose an answer or “Not sure”. Submit to see topics to revisit. This is an indicative self-check, not an ISTQB exam or a skill certification.',
    choose: 'Choose one answer', unsure: 'Not sure yet', correct: 'Good reasoning', revisit: 'Worth revisiting', explanation: 'Why', study: 'Review this topic',
    submit: 'Show my learning gaps', complete: 'Answer or select “Not sure” for every scenario to see the overview.',
    report: 'Your learning overview', reportIntro: 'These results reflect only this small question set. Treat flagged areas as prompts to study and try a practical task, not as a measure of professional ability.',
    answered: 'answered', right: 'supported choices', areas: 'Areas to revisit', none: 'No gaps surfaced in this set. Try the practical milestones and external sample exams for broader evidence.',
    allGood: 'No flagged scenario in this area', gap: 'Review the reasoning', reset: 'Start again', official: 'Official sample exams',
    officialIntro: 'For testing fundamentals, ISTQB publishes CTFL 4.0 sample exams A–D and the syllabus. ASTQB provides additional sample exams. These resources cover Foundation Level testing; the questions on this page are original and also cover other areas.',
    istqb: 'ISTQB CTFL 4.0 syllabus and sample exams', astqb: 'ASTQB Foundation Level practice resources',
  },
  uk: {
    meta: 'Закріпити матеріал | Олександр Дорошенко', back: 'База знань', eyebrow: 'ПРАКТИКА / САМОПЕРЕВІРКА',
    title: 'Закріпити матеріал.', intro: 'Спробуйте короткий сценарій у кожній області, а потім пройдіть окрему самоперевірку із ситуаціями рівнів Junior, Middle і Senior. Пояснення ведуть до матеріалів бази знань.',
    areaNav: 'Перейти до області', practice: 'Практика за областями', practiceIntro: 'Дайте відповідь, прочитайте пояснення й поверніться до теми. Ці питання допомагають навчатися, а не виставляють оцінку.',
    depth: 'Перевірити глибину розуміння', depthIntro: '18 авторських сценаріїв, по три на кожну область. Оберіть відповідь або «Поки не знаю». Після завершення побачите теми для повторення. Це орієнтовна самоперевірка, а не іспит ISTQB чи підтвердження кваліфікації.',
    choose: 'Оберіть одну відповідь', unsure: 'Поки не знаю', correct: 'Правильне міркування', revisit: 'Варто повторити', explanation: 'Чому', study: 'Повторити тему',
    submit: 'Показати теми для повторення', complete: 'Дайте відповідь або оберіть «Поки не знаю» для кожного сценарію, щоб побачити огляд.',
    report: 'Ваш навчальний огляд', reportIntro: 'Результат відображає лише цей невеликий набір питань. Позначені області — привід повторити тему й виконати практичне завдання, а не оцінка професійних навичок.',
    answered: 'відповідей', right: 'обґрунтованих відповідей', areas: 'Області для повторення', none: 'Цей набір не виявив прогалин. Спробуйте практичні майлстоуни та зовнішні зразки іспитів для ширшої перевірки.',
    allGood: 'У цій області немає позначених сценаріїв', gap: 'Розберіть логіку відповіді', reset: 'Почати знову', official: 'Офіційні зразки іспитів',
    officialIntro: 'Для основ тестування ISTQB публікує зразки іспиту CTFL 4.0 A–D і програму, а ASTQB — додаткові зразки. Ці ресурси охоплюють тестування рівня Foundation; питання на цій сторінці авторські й також охоплюють інші області.',
    istqb: 'Програма й зразки іспитів ISTQB CTFL 4.0', astqb: 'Практичні матеріали ASTQB Foundation Level',
  },
}

function CheckCard({ check, lang, answer, onAnswer, showFeedback }: {
  check: KnowledgeCheck; lang: Language; answer: CheckAnswer | undefined; onAnswer: (answer: CheckAnswer) => void; showFeedback: boolean
}) {
  const labels = copy[lang]
  const content = check.translations[lang]
  const isCorrect = answer === check.correct
  return <article className="check-card" id={`check-${check.id}`}>
    <div className="check-card-top"><span>{check.level}</span></div>
    <fieldset>
      <legend>{content.prompt}</legend>
      <p className="check-choice-hint">{labels.choose}</p>
      {content.options.map((option, index) => <label className="check-option" key={index}>
        <input type="radio" name={check.id} checked={answer === index} onChange={() => onAnswer(index)} />
        <span>{option}</span>
      </label>)}
      <label className="check-option check-unsure"><input type="radio" name={check.id} checked={answer === 'unsure'} onChange={() => onAnswer('unsure')} /><span>{labels.unsure}</span></label>
    </fieldset>
    {showFeedback && answer !== undefined && <div className={`check-feedback ${isCorrect ? 'is-correct' : 'needs-review'}`} role="status">
      <strong>{isCorrect ? labels.correct : labels.revisit}</strong>
      {!isCorrect && <p><strong>{labels.correct}:</strong> {content.options[check.correct]}</p>}
      <p><strong>{labels.explanation}:</strong> {content.explanation}</p>
      <Link href={{ pathname: `/knowledge/${check.direction}`, query: { lang } }}>{labels.study} →</Link>
    </div>}
  </article>
}

export default function KnowledgeCheckPage() {
  const { lang, setLang } = useLanguage('en')
  const labels = copy[lang]
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, CheckAnswer>>({})
  const [depthAnswers, setDepthAnswers] = useState<Record<string, CheckAnswer>>({})
  const [submitted, setSubmitted] = useState(false)
  const report = getCheckReport(depthChecks, depthAnswers)

  function setDepthAnswer(id: string, answer: CheckAnswer) {
    setDepthAnswers(previous => ({ ...previous, [id]: answer }))
    setSubmitted(false)
  }

  function submitDepth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (report.answered !== report.total) return
    setSubmitted(true)
    requestAnimationFrame(() => document.getElementById('check-report')?.focus())
  }

  return <><Head><title>{labels.meta}</title><meta name="description" content={labels.intro} /></Head><div className="inner-page check-page">
    <a className="skip-link" href="#main-content">{lang === 'uk' ? 'Перейти до вмісту' : 'Skip to content'}</a>
    <SiteHeader lang={lang} onLanguageChange={setLang} section="knowledge" />
    <main id="main-content" tabIndex={-1}>
      <header className="check-hero">
        <Link className="article-back" href={{ pathname: '/knowledge', query: { lang } }}>← {labels.back}</Link>
        <p className="section-index">{labels.eyebrow}</p><h1>{labels.title}</h1><p>{labels.intro}</p>
        <div className="check-hero-links"><a href="#practice">{labels.practice} ↓</a><a href="#depth">{labels.depth} ↓</a></div>
      </header>
      <nav className="check-area-nav" aria-label={labels.areaNav}>{regions.map(region => <a key={region.id} href={`#practice-${region.id}`}>{region.title[lang].title}</a>)}</nav>
      <section className="check-section" id="practice" aria-labelledby="practice-title">
        <div className="check-section-heading"><p className="section-index">01 / PRACTICE</p><h2 id="practice-title">{labels.practice}</h2><p>{labels.practiceIntro}</p></div>
        <div className="check-practice-grid">{regions.map(region => {
          const check = practiceChecks.find(item => item.region === region.id)!
          return <section className="check-area" id={`practice-${region.id}`} key={region.id} aria-labelledby={`practice-title-${region.id}`}>
            <h3 id={`practice-title-${region.id}`}>{region.title[lang].title}</h3>
            <CheckCard check={check} lang={lang} answer={practiceAnswers[check.id]} onAnswer={answer => setPracticeAnswers(previous => ({ ...previous, [check.id]: answer }))} showFeedback />
          </section>
        })}</div>
      </section>
      <section className="check-section check-depth" id="depth" aria-labelledby="depth-title">
        <div className="check-section-heading"><p className="section-index">02 / SELF-CHECK</p><h2 id="depth-title">{labels.depth}</h2><p>{labels.depthIntro}</p></div>
        <form onSubmit={submitDepth}>
          {regions.map(region => <section className="check-depth-area" key={region.id} aria-labelledby={`depth-area-${region.id}`}>
            <h3 id={`depth-area-${region.id}`}>{region.title[lang].title}</h3>
            <div className="check-depth-grid">{depthChecks.filter(check => check.region === region.id).map(check => <CheckCard key={check.id} check={check} lang={lang} answer={depthAnswers[check.id]} onAnswer={answer => setDepthAnswer(check.id, answer)} showFeedback={submitted} />)}</div>
          </section>)}
          <div className="check-submit"><p aria-live="polite">{report.answered} / {report.total} {labels.answered}</p><button type="submit" disabled={report.answered !== report.total}>{labels.submit}</button>{report.answered !== report.total && <p>{labels.complete}</p>}</div>
        </form>
        {submitted && <section className="check-report" id="check-report" tabIndex={-1} aria-labelledby="check-report-title">
          <p className="section-index">03 / REVIEW</p><h2 id="check-report-title">{labels.report}</h2><p>{labels.reportIntro}</p>
          <p className="check-report-count"><strong>{report.correct} / {report.total}</strong> {labels.right}</p>
          <h3>{labels.areas}</h3>
          {report.gaps.length === 0 && <p>{labels.none}</p>}
          <div className="check-report-areas">{report.byRegion.map(area => <section key={area.region}>
            <h4>{regions.find(region => region.id === area.region)?.title[lang].title} <span>{area.correct}/{area.total}</span></h4>
            {area.gaps.length ? <ul>{area.gaps.map(check => <li key={check.id}><a href={`#check-${check.id}`}>{check.level}: {check.translations[lang].prompt}</a><span>{depthAnswers[check.id] === 'unsure' ? labels.unsure : labels.gap}</span></li>)}</ul> : <p>{labels.allGood}</p>}
          </section>)}</div>
          <button className="check-reset" type="button" onClick={() => { setDepthAnswers({}); setSubmitted(false); requestAnimationFrame(() => document.getElementById('depth')?.scrollIntoView()) }}>{labels.reset}</button>
        </section>}
      </section>
      <aside className="check-official" aria-labelledby="official-title"><p className="section-index">ISTQB / CTFL 4.0</p><h2 id="official-title">{labels.official}</h2><p>{labels.officialIntro}</p><div><a href="https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/" target="_blank" rel="noopener noreferrer">{labels.istqb} ↗</a><a href="https://astqb.org/resources-test/" target="_blank" rel="noopener noreferrer">{labels.astqb} ↗</a></div></aside>
    </main>
  </div></>
}
