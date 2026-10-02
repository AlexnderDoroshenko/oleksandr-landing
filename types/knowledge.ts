import type { Language } from './post'

export type KnowledgeLevel = 'Junior' | 'Middle' | 'Senior'
export type KnowledgeStatus = 'published' | 'template' | 'preparation'

export type LocalizedDirection = {
  title: string
  description: string
}

export type KnowledgeDirection = {
  slug: string
  order: number
  status: KnowledgeStatus
  translations: Partial<Record<Language, LocalizedDirection>>
}

export type LocalizedMaterial = {
  question: string
  answer: string
  answerPoints?: string[]
  examples: string[]
  exercises: string[]
}

export type KnowledgeMaterial = {
  id: string
  direction: string
  level?: KnowledgeLevel
  translations: Partial<Record<Language, LocalizedMaterial>>
}
