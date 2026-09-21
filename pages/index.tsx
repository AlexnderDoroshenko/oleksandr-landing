import Head from 'next/head'
import Link from 'next/link'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../hooks/useLanguage'

const profile = {
  en: {
    metaTitle: 'Oleksandr Doroshenko | Senior AQA Engineer',
    metaDescription: 'Senior AQA Engineer and Automation Team Lead focused on reliable delivery, test architecture, and secure software.',
    nav: ['Experience', 'Expertise', 'Projects', 'Contact'],
    eyebrow: 'Senior AQA Engineer · Automation Team Lead',
    headline: 'I build quality systems that help teams ship with confidence.',
    intro: 'Over 6 years in software quality — from hands-on automation and CI/CD to test strategy, mentoring, and technical leadership.',
    availability: 'Based in Ukraine · Open to remote collaboration',
    primaryCta: 'Let’s talk', secondaryCta: 'View experience',
    proof: [['6+', 'years in QA'], ['3', 'product & service companies'], ['End-to-end', 'quality ownership']],
    experienceTitle: 'Experience built across products and platforms',
    experienceIntro: 'I connect engineering detail with delivery goals: practical automation, fast feedback, and processes teams actually use.',
    jobs: [
      { company: 'Capgemini', role: 'AQA Engineer', detail: 'Test automation, framework maintenance, technical interviews, mentoring, and delivery quality for international products.' },
      { company: 'Nayax Retail', role: 'Automation Team Lead / AQA Engineer', detail: 'Team leadership, web and API automation, CI pipelines, observability, and reliable regression coverage for retail technology.' },
      { company: 'UPITec', role: 'QA Automation Engineer', detail: 'Helped establish testing processes from the ground up and grew maintainable automated coverage.' },
    ],
    expertiseTitle: 'What I bring to a team',
    expertise: [
      { number: '01', title: 'Automation engineering', detail: 'Playwright, TypeScript, Python, Pytest, Selenium, Behave, REST API testing, and maintainable framework design.' },
      { number: '02', title: 'Delivery & observability', detail: 'GitLab CI, Jenkins, Docker, GCP, Datadog, and JMeter — from feedback loops to performance insight.' },
      { number: '03', title: 'Quality leadership', detail: 'Test strategy, team processes, mentoring, technical interviews, and clear quality signals for stakeholders.' },
      { number: '04', title: 'Security-minded testing', detail: 'Master’s studies in cybersecurity with a focus on bringing security thinking into everyday software quality.' },
    ],
    projectsTitle: 'Building beyond the test suite', projectsIntro: 'Selected work where automation, developer experience, and product thinking meet.',
    projects: [
      { name: 'NiceDice', label: 'Volunteer product', detail: 'A collaborative platform where I contribute test architecture, automation, and engineering quality practices.' },
      { name: 'QualityForge', label: 'AI-assisted QA platform', detail: 'An evolving quality engineering workspace for structured requirements, test design, and automation workflows.' },
      { name: 'AI × SDD', label: 'Engineering practice', detail: 'Exploring specification-driven development and practical ways to use AI without losing precision or ownership.' },
    ],
    contactEyebrow: 'Have a complex quality challenge?', contactTitle: 'Let’s make the path to production clearer.',
    contactText: 'I’m interested in senior AQA and automation leadership roles, product collaborations, and thoughtful engineering conversations.',
    email: 'Email me', linkedin: 'LinkedIn', github: 'GitHub', blog: 'Read the blog',
    footer: 'Designed around quality, clarity, and useful outcomes.',
  },
  uk: {
    metaTitle: 'Олександр Дорошенко | Senior AQA Engineer',
    metaDescription: 'Senior AQA Engineer та Automation Team Lead: архітектура автоматизації, якісна доставка й безпека програмного забезпечення.',
    nav: ['Досвід', 'Експертиза', 'Проєкти', 'Контакти'],
    eyebrow: 'Senior AQA Engineer · Automation Team Lead',
    headline: 'Будую системи якості, з якими команди впевнено випускають продукт.',
    intro: 'Понад 6 років у якості програмного забезпечення — від автоматизації та CI/CD до тестової стратегії, менторства й технічного лідерства.',
    availability: 'Україна · Відкритий до віддаленої співпраці',
    primaryCta: 'Обговорімо співпрацю', secondaryCta: 'Переглянути досвід',
    proof: [['6+', 'років у QA'], ['3', 'продуктові та сервісні компанії'], ['End-to-end', 'відповідальність за якість']],
    experienceTitle: 'Досвід, сформований на продуктах і платформах',
    experienceIntro: 'Поєдную інженерні деталі з цілями доставки: практична автоматизація, швидкий зворотний зв’язок і процеси, якими команда справді користується.',
    jobs: [
      { company: 'Capgemini', role: 'AQA Engineer', detail: 'Автоматизація тестування, підтримка фреймворку, технічні співбесіди, менторство та якість доставки міжнародних продуктів.' },
      { company: 'Nayax Retail', role: 'Automation Team Lead / AQA Engineer', detail: 'Лідерство команди, автоматизація web та API, CI-пайплайни, спостережуваність і надійне регресійне покриття retail-рішень.' },
      { company: 'UPITec', role: 'QA Automation Engineer', detail: 'Допомагав будувати тестові процеси з нуля та розвивати підтримуване автоматизоване покриття.' },
    ],
    expertiseTitle: 'Що я додаю команді',
    expertise: [
      { number: '01', title: 'Інженерія автоматизації', detail: 'Playwright, TypeScript, Python, Pytest, Selenium, Behave, тестування REST API та підтримувана архітектура фреймворків.' },
      { number: '02', title: 'Доставка та спостережуваність', detail: 'GitLab CI, Jenkins, Docker, GCP, Datadog і JMeter — від циклів зворотного зв’язку до аналізу продуктивності.' },
      { number: '03', title: 'Лідерство в якості', detail: 'Тестова стратегія, командні процеси, менторство, технічні співбесіди та зрозумілі сигнали якості для стейкхолдерів.' },
      { number: '04', title: 'Безпека в тестуванні', detail: 'Магістратура з кібербезпеки та фокус на впровадженні security-мислення в щоденну роботу з якістю.' },
    ],
    projectsTitle: 'За межами тестового набору', projectsIntro: 'Вибрані напрями, де зустрічаються автоматизація, developer experience і продуктове мислення.',
    projects: [
      { name: 'NiceDice', label: 'Волонтерський продукт', detail: 'Спільна платформа, де я розвиваю тестову архітектуру, автоматизацію та інженерні практики якості.' },
      { name: 'QualityForge', label: 'AI-assisted QA platform', detail: 'Середовище для структурованих вимог, тест-дизайну й автоматизаційних workflow, що постійно розвивається.' },
      { name: 'AI × SDD', label: 'Інженерна практика', detail: 'Досліджую specification-driven development і практичне використання AI без втрати точності та відповідальності.' },
    ],
    contactEyebrow: 'Є складний виклик у якості?', contactTitle: 'Зробімо шлях до production зрозумілішим.',
    contactText: 'Цікавлять позиції Senior AQA та лідерство в автоматизації, продуктові колаборації й змістовні інженерні розмови.',
    email: 'Написати', linkedin: 'LinkedIn', github: 'GitHub', blog: 'Перейти до блогу',
    footer: 'З фокусом на якість, ясність і корисний результат.',
  },
}

export default function Home() {
  const { lang, setLang } = useLanguage('en')
  const copy = profile[lang]
  const anchors = ['#experience', '#expertise', '#projects', '#contact']

  return <>
    <Head><title>{copy.metaTitle}</title><meta name="description" content={copy.metaDescription} /></Head>
    <main className="portfolio-shell">
      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Oleksandr Doroshenko — home">OD<span>.</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{copy.nav.map((item, i) => <a key={item} href={anchors[i]}>{item}</a>)}</nav>
        <LanguageSelector value={lang} onChange={setLang} className="language-select" />
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" />{copy.eyebrow}</p><h1>{copy.headline}</h1><p className="hero-intro">{copy.intro}</p>
          <div className="hero-actions"><a className="button button-primary" href="mailto:doroshenkoaldm@gmail.com">{copy.primaryCta}<span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#experience">{copy.secondaryCta}</a></div>
          <p className="availability">{copy.availability}</p>
        </div>
        <div className="portrait-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}<img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/avatar.png`} alt="Oleksandr Doroshenko" />
          <div className="portrait-caption"><span>Oleksandr Doroshenko</span><small>Quality engineering · Odesa, UA</small></div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Career highlights">{copy.proof.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>

      <section className="section experience-section" id="experience">
        <div className="section-heading"><p className="section-index">01 / EXPERIENCE</p><div><h2>{copy.experienceTitle}</h2><p>{copy.experienceIntro}</p></div></div>
        <div className="timeline">{copy.jobs.map(job => <article className="timeline-row" key={job.company}><h3>{job.company}</h3><p className="job-role">{job.role}</p><p>{job.detail}</p></article>)}</div>
      </section>

      <section className="section expertise-section" id="expertise">
        <div className="section-heading compact-heading"><p className="section-index">02 / EXPERTISE</p><div><h2>{copy.expertiseTitle}</h2></div></div>
        <div className="expertise-grid">{copy.expertise.map(item => <article className="expertise-card" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="section-heading"><p className="section-index">03 / PROJECTS</p><div><h2>{copy.projectsTitle}</h2><p>{copy.projectsIntro}</p></div></div>
        <div className="project-list">{copy.projects.map(project => <article className="project-row" key={project.name}><div><p>{project.label}</p><h3>{project.name}</h3></div><p>{project.detail}</p><span aria-hidden="true">↗</span></article>)}</div>
      </section>

      <section className="contact-section" id="contact">
        <p className="section-index">04 / CONTACT</p><p className="contact-eyebrow">{copy.contactEyebrow}</p><h2>{copy.contactTitle}</h2><p className="contact-copy">{copy.contactText}</p>
        <div className="contact-links"><a href="mailto:doroshenkoaldm@gmail.com">{copy.email}<span>↗</span></a><a href="https://www.linkedin.com/in/oleksandr-doroshenko-3a426a134" target="_blank" rel="noreferrer">{copy.linkedin}<span>↗</span></a><a href="https://github.com/AlexnderDoroshenko" target="_blank" rel="noreferrer">{copy.github}<span>↗</span></a><Link href={{ pathname: '/blog', query: { lang } }}>{copy.blog}<span>↗</span></Link></div>
      </section>

      <footer><span>© {new Date().getFullYear()} Oleksandr Doroshenko</span><span>{copy.footer}</span></footer>
    </main>
  </>
}
