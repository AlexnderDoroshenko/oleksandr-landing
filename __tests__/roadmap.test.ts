import roadmap from '../content/knowledge/roadmap.json'
import { getKnowledgeDirections } from '../lib/knowledge'

describe('practical knowledge map', () => {
  it('covers every published knowledge direction with bilingual, actionable milestones', () => {
    const knownDirections = new Set(getKnowledgeDirections().map(direction => direction.slug))
    const milestones = roadmap.flatMap(region => region.milestones)
    const linkedDirections = new Set(milestones.flatMap(milestone => milestone.directions))

    expect(roadmap).toHaveLength(6)
    expect(milestones).toHaveLength(12)
    expect(new Set(roadmap.map(region => region.id)).size).toBe(roadmap.length)
    expect(new Set(milestones.map(milestone => milestone.id)).size).toBe(milestones.length)
    expect(linkedDirections).toEqual(knownDirections)

    for (const region of roadmap) {
      for (const lang of ['en', 'uk'] as const) {
        expect(region.translations[lang].title).toBeTruthy()
        expect(region.translations[lang].summary).toBeTruthy()
      }
      for (const milestone of region.milestones) {
        expect(milestone.directions.length).toBeGreaterThan(0)
        for (const lang of ['en', 'uk'] as const) {
          expect(milestone.translations[lang].title).toBeTruthy()
          expect(milestone.translations[lang].action).toBeTruthy()
          expect(milestone.translations[lang].evidence).toBeTruthy()
        }
      }
    }
  })
})
