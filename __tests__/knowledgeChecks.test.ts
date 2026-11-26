import { knowledgeChecks } from '../content/knowledge/checks'
import roadmap from '../content/knowledge/roadmap.json'
import { getKnowledgeDirections } from '../lib/knowledge'
import { getCheckReport } from '../lib/knowledgeChecks'

test('every roadmap area has one practice and Junior, Middle, Senior depth scenarios in both languages', () => {
  const ids = knowledgeChecks.map(check => check.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(knowledgeChecks).toHaveLength(24)
  const directions = new Set(getKnowledgeDirections().map(direction => direction.slug))
  for (const region of roadmap) {
    const checks = knowledgeChecks.filter(check => check.region === region.id)
    expect(checks.filter(check => check.mode === 'practice')).toHaveLength(1)
    expect(checks.filter(check => check.mode === 'depth').map(check => check.level).sort()).toEqual(['Junior', 'Middle', 'Senior'])
  }
  for (const check of knowledgeChecks) {
    expect(directions.has(check.direction)).toBe(true)
    expect(check.correct).toBeGreaterThanOrEqual(0)
    expect(check.correct).toBeLessThan(3)
    for (const lang of ['en', 'uk'] as const) {
      expect(check.translations[lang].prompt.trim()).not.toBe('')
      expect(check.translations[lang].explanation.trim()).not.toBe('')
      expect(check.translations[lang].options).toHaveLength(3)
      expect(check.translations[lang].options.every(option => option.trim())).toBe(true)
    }
  }
})

test('report distinguishes supported answers from wrong and uncertain answers by area', () => {
  const checks = knowledgeChecks.filter(check => check.mode === 'depth')
  const report = getCheckReport(checks, {
    [checks[0].id]: checks[0].correct,
    [checks[1].id]: 'unsure',
    [checks[2].id]: (checks[2].correct + 1) % 3,
  })
  expect(report).toMatchObject({ total: 18, answered: 3, correct: 1 })
  expect(report.gaps.map(check => check.id)).toEqual([checks[1].id, checks[2].id])
  expect(report.byRegion[0]).toMatchObject({ answered: 3, correct: 1, total: 3 })
})
