import { getDirectionTranslation, getKnowledgeCurriculum, getKnowledgeDirections, getKnowledgeMaterials, getKnowledgeReferences, getKnowledgeTopics, getMaterialTranslation } from '../lib/knowledge'
import type { KnowledgeMaterial } from '../types/knowledge'

describe('Knowledge Base content', () => {
  it('contains the published directions and AI system testing learning path in a stable order', () => {
    const directions = getKnowledgeDirections()

    expect(directions).toHaveLength(14)
    expect(directions.map(direction => direction.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    expect(new Set(directions.map(direction => direction.slug)).size).toBe(14)
  })

  it('localizes every catalog direction in English and Ukrainian', () => {
    for (const direction of getKnowledgeDirections()) {
      expect(getDirectionTranslation(direction, 'en')?.title).toBeTruthy()
      expect(getDirectionTranslation(direction, 'uk')?.title).toBeTruthy()
      expect(getDirectionTranslation(direction, 'en')?.description).toBeTruthy()
      expect(getDirectionTranslation(direction, 'uk')?.description).toBeTruthy()
    }
  })

  it('loads a bilingual, levelled learning path for every direction', () => {
    const levelOrder = { Junior: 0, Middle: 1, Senior: 2 } as const

    for (const direction of getKnowledgeDirections()) {
      const materials = getKnowledgeMaterials(direction.slug)
      const levels = materials.map(material => material.level ? levelOrder[material.level] : 3)

      expect(materials.length).toBeGreaterThanOrEqual(9)
      expect(materials.every(material => getMaterialTranslation(material, 'en'))).toBe(true)
      expect(materials.every(material => getMaterialTranslation(material, 'uk'))).toBe(true)
      expect(materials.every(material => material.level)).toBe(true)
      expect(levels).toEqual([...levels].sort((a, b) => a - b))
      expect(materials.filter(material => material.level === 'Junior').length).toBeGreaterThanOrEqual(3)
      expect(materials.filter(material => material.level === 'Middle').length).toBeGreaterThanOrEqual(3)
      expect(materials.filter(material => material.level === 'Senior').length).toBeGreaterThanOrEqual(3)

      for (const material of materials) {
        for (const lang of ['en', 'uk'] as const) {
          const translation = getMaterialTranslation(material, lang)
          expect(translation?.question).toBeTruthy()
          expect(translation?.answer).toBeTruthy()
          if (translation?.answerPoints) expect(translation.answerPoints.length).toBeGreaterThan(0)
          if (material.direction !== 'ai-system-testing') {
            expect(translation?.examples.length).toBeGreaterThan(0)
            expect(translation?.exercises.length).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  it('uses globally unique material ids', () => {
    const ids = getKnowledgeDirections().filter(direction => direction.slug !== 'ai-system-testing').flatMap(direction =>
      getKnowledgeMaterials(direction.slug).map(material => material.id),
    )

    expect(ids).toHaveLength(144)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('provides a broad testing-theory foundation without project-specific examples', () => {
    const materials = getKnowledgeMaterials('testing-theory')
    const serialized = JSON.stringify(materials)
    const levelOrder = { Junior: 0, Middle: 1, Senior: 2 } as const
    const materialLevels = materials.map(material => material.level ? levelOrder[material.level] : 3)

    expect(materials).toHaveLength(27)
    expect(new Set(materials.map(material => material.id)).size).toBe(27)
    expect(materialLevels).toEqual([...materialLevels].sort((a, b) => a - b))
    expect(materials.some(material => material.level === 'Junior')).toBe(true)
    expect(materials.some(material => material.level === 'Middle')).toBe(true)
    expect(materials.some(material => material.level === 'Senior')).toBe(true)
    expect(serialized).not.toMatch(/NiceDice/i)

    for (const material of materials) {
      for (const lang of ['en', 'uk'] as const) {
        const translation = getMaterialTranslation(material, lang)
        expect(translation?.answer).toBeTruthy()
        if (material.direction !== 'ai-system-testing') {
          expect(translation?.examples.length).toBeGreaterThan(0)
          expect(translation?.exercises.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('extends canonical testing theory with concise AI applications instead of duplicate questions', () => {
    const materials = getKnowledgeMaterials('testing-theory')
    const extendedIds = ['effective-test-case', 'test-basis-oracle', 'defect-report', 'severity-priority', 'test-types', 'entry-exit-criteria', 'test-strategy', 'metrics-context', 'risk-based-testing']

    for (const id of extendedIds) {
      const material = materials.find(item => item.id === id)
      expect(material?.translations.uk?.answerPoints?.at(-1)).toBeTruthy()
      expect(material?.translations.en?.answerPoints?.at(-1)).toBeTruthy()
    }
  })

  it('publishes the complete bilingual AI system testing curriculum without duplicating storage', () => {
    const topics = getKnowledgeTopics('ai-system-testing')
    const materials = getKnowledgeMaterials('ai-system-testing')
    const curriculum = getKnowledgeCurriculum('ai-system-testing')

    expect(topics).toHaveLength(12)
    expect(topics.map(topic => topic.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(materials).toHaveLength(93)
    expect(new Set(materials.map(material => material.id)).size).toBe(93)
    expect(materials.filter(material => material.aliases).length).toBe(23)
    expect(materials.filter(material => !material.aliases).length).toBe(70)
    expect(materials.filter(material => !material.aliases).every(material => material.direction === 'ai-system-testing')).toBe(true)
    expect(materials.every(material => topics.some(topic => topic.id === material.topic))).toBe(true)
    expect(materials.filter(material => material.level === 'Junior')).toHaveLength(29)
    expect(materials.filter(material => material.level === 'Middle')).toHaveLength(43)
    expect(materials.filter(material => material.level === 'Senior')).toHaveLength(21)
    const sourceIds = [
      ...materials.filter(material => !material.aliases).map(material => material.id),
      ...materials.flatMap(material => material.aliases ?? []),
    ]
    expect(sourceIds).toHaveLength(95)
    expect(new Set(sourceIds).size).toBe(95)
    expect(curriculum?.reviewedAt).toBe('2026-10-06')
    expect(curriculum?.translations.uk.completion.Senior).toBeTruthy()
    expect(curriculum?.translations.en.completion.Senior).toBeTruthy()

    for (const topic of topics) {
      expect(topic.translations.uk.title).toBeTruthy()
      expect(topic.translations.en.title).toBeTruthy()
      expect(topic.translations.uk.practice).toBeTruthy()
      expect(topic.translations.en.practice).toBeTruthy()
    }
    expect(topics.flatMap(topic => topic.translations.en.deepDives ?? [])).toHaveLength(10)
    expect(topics.flatMap(topic => topic.translations.uk.deepDives ?? [])).toHaveLength(10)
    expect(topics.flatMap(topic => topic.translations.en.codeExamples ?? [])).toHaveLength(6)
    expect(topics.flatMap(topic => topic.translations.uk.codeExamples ?? [])).toHaveLength(6)
  })

  it('resolves every AI system testing source to an official or primary reference', () => {
    const references = getKnowledgeReferences()
    const referenceIds = new Set(references.map(reference => reference.id))
    const materials = getKnowledgeMaterials('ai-system-testing')

    expect(new Set(references.map(reference => reference.id)).size).toBe(references.length)
    for (const material of materials) {
      for (const lang of ['en', 'uk'] as const) {
        const translation = getMaterialTranslation(material, lang)
        expect(translation?.sources?.length).toBeGreaterThan(0)
        expect(translation?.sources?.every(source => referenceIds.has(source))).toBe(true)
      }
    }
  })

  it('publishes six bilingual cybersecurity role blocks without duplicate material ids', () => {
    const topics = getKnowledgeTopics('cybersecurity-handbook')
    const materials = getKnowledgeMaterials('cybersecurity-handbook')

    expect(topics).toHaveLength(6)
    expect(topics.map(topic => topic.order)).toEqual([1, 2, 3, 4, 5, 6])
    expect(materials).toHaveLength(18)
    expect(new Set(materials.map(material => material.id)).size).toBe(18)
    expect(materials.filter(material => material.level === 'Junior')).toHaveLength(6)
    expect(materials.filter(material => material.level === 'Middle')).toHaveLength(6)
    expect(materials.filter(material => material.level === 'Senior')).toHaveLength(6)
    expect(materials.every(material => topics.some(topic => topic.id === material.topic))).toBe(true)
    expect(topics.every(topic => topic.translations.uk.practice && topic.translations.en.practice)).toBe(true)
  })

  it('does not silently fall back when a material translation is missing', () => {
    const material: KnowledgeMaterial = {
      id: 'missing-uk',
      direction: 'testing-theory',
      translations: {
        en: { question: 'Question', answer: 'Answer', examples: [], exercises: [] },
      },
    }

    expect(getMaterialTranslation(material, 'uk')).toBeNull()
    expect(getMaterialTranslation(material, 'en')?.answer).toBe('Answer')
  })
})
