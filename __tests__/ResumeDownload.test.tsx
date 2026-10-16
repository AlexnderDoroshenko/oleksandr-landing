import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import ResumeDownload from '../components/ResumeDownload'

describe('ResumeDownload', () => {
  it('defaults to the English Senior AQA resume', () => {
    render(<ResumeDownload uiLanguage="en" />)

    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('link', { name: /Download PDF/ })).toHaveAttribute(
      'href',
      '/resumes/Oleksandr_Doroshenko_Senior_AQA_EN.pdf',
    )
  })

  it('updates the download for the selected role and language', () => {
    render(<ResumeDownload uiLanguage="uk" />)

    fireEvent.change(screen.getByLabelText('Цільова роль'), { target: { value: 'lead' } })
    fireEvent.click(screen.getByRole('button', { name: 'UA' }))

    expect(screen.getByRole('button', { name: 'UA' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('link', { name: /Завантажити PDF/ })).toHaveAttribute(
      'href',
      '/resumes/Oleksandr_Doroshenko_QA_Automation_Lead_UK.pdf',
    )
  })

  it('ships every role and language PDF referenced by the picker', () => {
    const filenames = [
      'Oleksandr_Doroshenko_Senior_AQA_EN.pdf',
      'Oleksandr_Doroshenko_Senior_AQA_UK.pdf',
      'Oleksandr_Doroshenko_SDET_EN.pdf',
      'Oleksandr_Doroshenko_SDET_UK.pdf',
      'Oleksandr_Doroshenko_QA_Automation_Lead_EN.pdf',
      'Oleksandr_Doroshenko_QA_Automation_Lead_UK.pdf',
    ]

    filenames.forEach((filename) => {
      expect(existsSync(join(process.cwd(), 'public', 'resumes', filename))).toBe(true)
    })
  })
})
