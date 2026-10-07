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
  sources?: string[]
}

export type KnowledgeMaterial = {
  id: string
  aliases?: string[]
  direction: string
  collections?: string[]
  topic?: string
  level?: KnowledgeLevel
  translations: Partial<Record<Language, LocalizedMaterial>>
}

export type LocalizedKnowledgeTopic = {
  title: string
  practice: string
  deepDives?: Array<{
    title: string
    body: string
  }>
  codeExamples?: Array<{
    id: string
    title: string
    code: string
    explanation: string
  }>
}

export type KnowledgeTopic = {
  id: string
  direction: string
  order: number
  translations: Record<Language, LocalizedKnowledgeTopic>
}

export type KnowledgeReference = {
  id: string
  title: string
  url: string
  version?: string
}

export type KnowledgeCurriculum = {
  direction: string
  reviewedAt: string
  translations: Record<Language, {
    principles: string[]
    project: string
    completion: Record<KnowledgeLevel, string>
    definitionOfDone: string
  }>
}
