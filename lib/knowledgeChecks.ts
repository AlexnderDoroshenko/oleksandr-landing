import type { KnowledgeCheck } from '../content/knowledge/checks'

export type CheckAnswer = number | 'unsure'

export function getCheckReport(checks: KnowledgeCheck[], answers: Record<string, CheckAnswer>) {
  const answered = checks.filter(check => answers[check.id] !== undefined)
  const correct = answered.filter(check => answers[check.id] === check.correct)
  const gaps = answered.filter(check => answers[check.id] !== check.correct)
  const byRegion = Array.from(new Set(checks.map(check => check.region))).map(region => {
    const regionChecks = checks.filter(check => check.region === region)
    return {
      region,
      total: regionChecks.length,
      answered: regionChecks.filter(check => answers[check.id] !== undefined).length,
      correct: regionChecks.filter(check => answers[check.id] === check.correct).length,
      gaps: gaps.filter(check => check.region === region),
    }
  })
  return { total: checks.length, answered: answered.length, correct: correct.length, gaps, byRegion }
}
