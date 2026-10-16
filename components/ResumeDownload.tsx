import { useState } from 'react'
import type { Language } from '../types/post'

type ResumeLanguage = 'en' | 'uk'
type ResumeRole = 'aqa' | 'sdet' | 'lead'

const resumeFiles: Record<ResumeRole, Record<ResumeLanguage, string>> = {
  aqa: {
    en: 'Oleksandr_Doroshenko_Senior_AQA_EN.pdf',
    uk: 'Oleksandr_Doroshenko_Senior_AQA_UK.pdf',
  },
  sdet: {
    en: 'Oleksandr_Doroshenko_SDET_EN.pdf',
    uk: 'Oleksandr_Doroshenko_SDET_UK.pdf',
  },
  lead: {
    en: 'Oleksandr_Doroshenko_QA_Automation_Lead_EN.pdf',
    uk: 'Oleksandr_Doroshenko_QA_Automation_Lead_UK.pdf',
  },
}

const copy = {
  en: {
    open: 'Download CV',
    title: 'Choose the resume that fits the role',
    role: 'Target role',
    language: 'Resume language',
    download: 'Download PDF',
    roles: { aqa: 'Senior AQA Engineer', sdet: 'Senior SDET', lead: 'QA Automation Lead' },
  },
  uk: {
    open: 'Завантажити резюме',
    title: 'Оберіть резюме під потрібну роль',
    role: 'Цільова роль',
    language: 'Мова резюме',
    download: 'Завантажити PDF',
    roles: { aqa: 'Senior AQA Engineer', sdet: 'Senior SDET', lead: 'QA Automation Lead' },
  },
}

export default function ResumeDownload({ uiLanguage }: { uiLanguage: Language }) {
  const [role, setRole] = useState<ResumeRole>('aqa')
  const [resumeLanguage, setResumeLanguage] = useState<ResumeLanguage>('en')
  const labels = copy[uiLanguage]
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const href = `${basePath}/resumes/${resumeFiles[role][resumeLanguage]}`

  return (
    <details className="resume-download">
      <summary className="button button-secondary resume-download-trigger">
        {labels.open}<span aria-hidden="true">↓</span>
      </summary>
      <div className="resume-download-panel">
        <p>{labels.title}</p>
        <label htmlFor="resume-role">{labels.role}</label>
        <select id="resume-role" value={role} onChange={(event) => setRole(event.target.value as ResumeRole)}>
          <option value="aqa">{labels.roles.aqa}</option>
          <option value="sdet">{labels.roles.sdet}</option>
          <option value="lead">{labels.roles.lead}</option>
        </select>
        <fieldset>
          <legend>{labels.language}</legend>
          <div className="resume-language-toggle">
            <button type="button" aria-pressed={resumeLanguage === 'en'} onClick={() => setResumeLanguage('en')}>EN</button>
            <button type="button" aria-pressed={resumeLanguage === 'uk'} onClick={() => setResumeLanguage('uk')}>UA</button>
          </div>
        </fieldset>
        <a className="resume-download-link" href={href} download>
          {labels.download}<span aria-hidden="true">↓</span>
        </a>
      </div>
    </details>
  )
}
