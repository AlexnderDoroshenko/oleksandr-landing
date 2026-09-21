import Head from 'next/head'
import SiteHeader from '../components/SiteHeader'
import { useLanguage } from '../hooks/useLanguage'

export default function About() {
  const { lang, setLang } = useLanguage('en')
  const copy = lang === 'uk' ? {
    title: 'Якість — це інженерна система, а не остання перевірка.',
    intro: 'Я Олександр Дорошенко, AQA Engineer з понад 6 роками досвіду. Допомагаю командам перетворювати тестування на швидкий і зрозумілий механізм зворотного зв’язку.',
    facts: [['Локація', 'Одеса, Україна'], ['Досвід', '6+ років у QA'], ['Фокус', 'Automation · Leadership · Security']],
    principles: 'Як я працюю',
    items: [
      ['Автоматизація з метою', 'Покриття має скорочувати ризики й час до рішення, а не просто збільшувати кількість тестів.'],
      ['Ясність для команди', 'Будую процеси, результати й сигнали якості так, щоб ними могли користуватися інженери та бізнес.'],
      ['Постійний розвиток', 'Поєдную практику автоматизації з магістерським навчанням у кібербезпеці та дослідженням AI/SDD.'],
    ],
    story: 'Професійний шлях',
    paragraphs: [
      'У Capgemini я працюю як AQA Engineer: автоматизую тестування, підтримую фреймворки, проводжу технічні співбесіди та менторю інженерів.',
      'У Nayax Retail я виконував роль Automation Team Lead / AQA Engineer — координував команду й розвивав автоматизацію web та API, CI-пайплайни й спостережуваність.',
      'В UPITec допомагав впроваджувати тестові процеси з нуля. Поза основною роботою розвиваю волонтерські проєкти, NiceDice та QualityForge.',
    ],
  } : {
    title: 'Quality is an engineering system, not a final checkpoint.',
    intro: 'I’m Oleksandr Doroshenko, an AQA Engineer with over 6 years of experience. I help teams turn testing into a fast, understandable feedback system.',
    facts: [['Location', 'Odesa, Ukraine'], ['Experience', '6+ years in QA'], ['Focus', 'Automation · Leadership · Security']],
    principles: 'How I work',
    items: [
      ['Automation with purpose', 'Coverage should reduce risk and decision time, not simply increase the number of tests.'],
      ['Clarity for the team', 'I design processes, results, and quality signals that engineering and business stakeholders can actually use.'],
      ['Continuous growth', 'I combine automation practice with a cybersecurity master’s degree and hands-on exploration of AI and SDD.'],
    ],
    story: 'Professional journey',
    paragraphs: [
      'At Capgemini I work as an AQA Engineer, automating tests, maintaining frameworks, conducting technical interviews, and mentoring engineers.',
      'At Nayax Retail I worked as an Automation Team Lead / AQA Engineer, coordinating the team and advancing web/API automation, CI pipelines, and observability.',
      'At UPITec I helped establish testing processes from scratch. Beyond my core work, I contribute to volunteer projects, NiceDice, and QualityForge.',
    ],
  }
  return <><Head><title>{lang === 'uk' ? 'Про мене' : 'About'} | Oleksandr Doroshenko</title></Head><main className="inner-page">
    <SiteHeader lang={lang} onLanguageChange={setLang} section="about" />
    <section className="inner-hero"><p className="section-index">01 / {lang === 'uk' ? 'ПРО МЕНЕ' : 'ABOUT'}</p><h1>{copy.title}</h1><p>{copy.intro}</p></section>
    <section className="fact-grid">{copy.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
    <section className="inner-section"><div className="inner-section-title"><p className="section-index">02 / PRINCIPLES</p><h2>{copy.principles}</h2></div><div className="principle-list">{copy.items.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="inner-section story-section"><div className="inner-section-title"><p className="section-index">03 / JOURNEY</p><h2>{copy.story}</h2></div><div className="story-copy">{copy.paragraphs.map(p => <p key={p}>{p}</p>)}</div></section>
  </main></>
}
