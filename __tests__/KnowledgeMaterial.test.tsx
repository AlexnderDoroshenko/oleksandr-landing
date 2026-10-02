import { fireEvent, render, screen } from '@testing-library/react'
import KnowledgeMaterialView from '../components/KnowledgeMaterial'
import type { KnowledgeMaterial } from '../types/knowledge'

const labels = { answer: 'Answer', examples: 'Examples', exercises: 'Exercises', missingTranslation: 'Translation unavailable' }
const material: KnowledgeMaterial = {
  id: 'question-one',
  direction: 'testing-theory',
  level: 'Junior',
  translations: {
    en: {
      question: 'What is testing?',
      answer: 'A way to investigate risk.',
      answerPoints: ['Reveal relevant problems', 'Support a decision'],
      examples: ['A payment check'],
      exercises: ['List three risks'],
    },
  },
}

describe('KnowledgeMaterialView', () => {
  it('renders an expandable localized answer with its defined level', () => {
    render(<KnowledgeMaterialView material={material} lang="en" labels={labels} />)

    expect(screen.getByText('Junior')).toBeInTheDocument()
    fireEvent.click(screen.getByText('What is testing?'))
    expect(screen.getByText('A way to investigate risk.')).toBeInTheDocument()
    expect(screen.getByText('Reveal relevant problems')).toBeInTheDocument()
    expect(screen.getByText('Support a decision')).toBeInTheDocument()
    expect(screen.getByText('A payment check')).toBeInTheDocument()
    expect(screen.getByText('List three risks')).toBeInTheDocument()
  })

  it('shows an explicit status instead of another language', () => {
    render(<KnowledgeMaterialView material={material} lang="uk" labels={labels} />)

    expect(screen.getByText('Translation unavailable')).toBeInTheDocument()
    expect(screen.queryByText('What is testing?')).not.toBeInTheDocument()
  })
})
