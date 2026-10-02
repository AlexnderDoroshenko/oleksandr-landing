import { getDirectionTranslation, getKnowledgeDirections, getKnowledgeMaterials, getMaterialTranslation } from '../lib/knowledge'
import type { KnowledgeMaterial } from '../types/knowledge'

describe('Knowledge Base content', () => {
  it('contains the twelve requested directions in a stable order', () => {
    const directions = getKnowledgeDirections()

    expect(directions).toHaveLength(12)
    expect(directions.map(direction => direction.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(new Set(directions.map(direction => direction.slug)).size).toBe(12)
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
          if (translation?.answerPoints) expect(translation.answerPoints.length).toBeGreaterThan(1)
          expect(translation?.examples.length).toBeGreaterThan(0)
          expect(translation?.exercises.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('uses globally unique material ids', () => {
    const ids = getKnowledgeDirections().flatMap(direction =>
      getKnowledgeMaterials(direction.slug).map(material => material.id),
    )

    expect(ids).toHaveLength(126)
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
        expect(translation?.examples.length).toBeGreaterThan(0)
        expect(translation?.exercises.length).toBeGreaterThan(0)
      }
    }
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
