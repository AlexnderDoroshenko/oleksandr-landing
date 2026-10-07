import catalogData from '../content/knowledge/catalog.json'
import testingTheoryData from '../content/knowledge/materials/testing-theory.json'
import starterPackData from '../content/knowledge/materials/starter-pack.json'
import expandedQualityEngineeringData from '../content/knowledge/materials/expanded-quality-engineering.json'
import expandedPlatformData from '../content/knowledge/materials/expanded-platform.json'
import expandedIntelligentSystemsData from '../content/knowledge/materials/expanded-intelligent-systems.json'
import aiSystemTestingTopicsData from '../content/knowledge/ai-system-testing/topics.json'
import aiSystemTestingReferencesData from '../content/knowledge/ai-system-testing/references.json'
import aiSystemTestingCurriculumData from '../content/knowledge/ai-system-testing/curriculum.json'
import aiSystemTestingReusedData from '../content/knowledge/ai-system-testing/reused-materials.json'
import aiSystemTestingExtensionsData from '../content/knowledge/ai-system-testing/canonical-extensions.json'
import aiSystemTesting01Data from '../content/knowledge/ai-system-testing/01-documentation-testing-process.json'
import aiSystemTesting02Data from '../content/knowledge/ai-system-testing/02-python-automation.json'
import aiSystemTesting03Data from '../content/knowledge/ai-system-testing/03-ai-ml-fundamentals.json'
import aiSystemTesting04Data from '../content/knowledge/ai-system-testing/04-prompting-tool-calling.json'
import aiSystemTesting05Data from '../content/knowledge/ai-system-testing/05-rag-retrieval.json'
import aiSystemTesting06Data from '../content/knowledge/ai-system-testing/06-agents-coordination.json'
import aiSystemTesting07Data from '../content/knowledge/ai-system-testing/07-mcp-contract-testing.json'
import aiSystemTesting08Data from '../content/knowledge/ai-system-testing/08-chain-graph-frameworks.json'
import aiSystemTesting09Data from '../content/knowledge/ai-system-testing/09-genai-test-automation.json'
import aiSystemTesting10Data from '../content/knowledge/ai-system-testing/10-evaluation-golden-data.json'
import aiSystemTesting11Data from '../content/knowledge/ai-system-testing/11-genai-security-privacy.json'
import aiSystemTesting12Data from '../content/knowledge/ai-system-testing/12-responsible-ai.json'
import cybersecurityTopicsData from '../content/knowledge/cybersecurity-handbook/topics.json'
import cybersecurityMaterialsData from '../content/knowledge/cybersecurity-handbook/materials.json'
import type { Language } from '../types/post'
import type { KnowledgeCurriculum, KnowledgeDirection, KnowledgeMaterial, KnowledgeReference, KnowledgeTopic, LocalizedDirection, LocalizedMaterial } from '../types/knowledge'

const directions = catalogData as KnowledgeDirection[]
const levelOrder = { Junior: 0, Middle: 1, Senior: 2 } as const
const rawBaseMaterials = [
  ...(testingTheoryData as KnowledgeMaterial[]),
  ...(starterPackData as KnowledgeMaterial[]),
  ...(expandedQualityEngineeringData as KnowledgeMaterial[]),
  ...(expandedPlatformData as KnowledgeMaterial[]),
  ...(expandedIntelligentSystemsData as KnowledgeMaterial[]),
]
const canonicalExtensions = aiSystemTestingExtensionsData as Array<{ id: string; uk: string; en: string }>
const baseMaterials = rawBaseMaterials.map(material => {
  const extension = canonicalExtensions.find(item => item.id === material.id)
  if (!extension) return material
  return {
    ...material,
    translations: {
      uk: { ...material.translations.uk!, answerPoints: [...(material.translations.uk?.answerPoints ?? []), extension.uk] },
      en: { ...material.translations.en!, answerPoints: [...(material.translations.en?.answerPoints ?? []), extension.en] },
    },
  }
})
const aiSystemTestingMaterials = [
  ...(aiSystemTesting01Data as KnowledgeMaterial[]),
  ...(aiSystemTesting02Data as KnowledgeMaterial[]),
  ...(aiSystemTesting03Data as KnowledgeMaterial[]),
  ...(aiSystemTesting04Data as KnowledgeMaterial[]),
  ...(aiSystemTesting05Data as KnowledgeMaterial[]),
  ...(aiSystemTesting06Data as KnowledgeMaterial[]),
  ...(aiSystemTesting07Data as KnowledgeMaterial[]),
  ...(aiSystemTesting08Data as KnowledgeMaterial[]),
  ...(aiSystemTesting09Data as KnowledgeMaterial[]),
  ...(aiSystemTesting10Data as KnowledgeMaterial[]),
  ...(aiSystemTesting11Data as KnowledgeMaterial[]),
  ...(aiSystemTesting12Data as KnowledgeMaterial[]),
]
const cybersecurityMaterials = cybersecurityMaterialsData as KnowledgeMaterial[]
const reusedMappings = aiSystemTestingReusedData as Array<{ canonicalId: string; topic: string; aliases: string[] }>
const topicReferenceIds: Record<string, string[]> = {
  'documentation-testing-process': ['S27'],
  'python-automation': ['S01', 'S04', 'S06', 'S08', 'S20'],
  'ai-ml-fundamentals': ['S12', 'S28'],
  'prompting-tool-calling': ['S21'],
  'rag-retrieval': ['S15', 'S22'],
  'agents-coordination': ['S23'],
  'genai-test-automation': ['S14', 'S16', 'S18'],
  'evaluation-golden-data': ['S14', 'S15', 'S16', 'S18'],
  'genai-security-privacy': ['S12', 'S13'],
}
const topics = [
  ...(aiSystemTestingTopicsData as KnowledgeTopic[]),
  ...(cybersecurityTopicsData as KnowledgeTopic[]),
]

export function getKnowledgeDirections(): KnowledgeDirection[] {
  return [...directions].sort((a, b) => a.order - b.order)
}

export function getKnowledgeDirection(slug: string): KnowledgeDirection | undefined {
  return directions.find(direction => direction.slug === slug)
}

export function getKnowledgeMaterials(direction: string): KnowledgeMaterial[] {
  const materials = direction === 'ai-system-testing'
    ? [
        ...aiSystemTestingMaterials,
        ...reusedMappings.map(mapping => {
          const canonical = baseMaterials.find(material => material.id === mapping.canonicalId)
          if (!canonical) throw new Error(`Unknown reused knowledge material: ${mapping.canonicalId}`)
          const sources = topicReferenceIds[mapping.topic] ?? []
          return {
            ...canonical,
            aliases: mapping.aliases,
            topic: mapping.topic,
            translations: {
              uk: { ...canonical.translations.uk!, sources },
              en: { ...canonical.translations.en!, sources },
            },
          }
        }),
      ]
    : direction === 'cybersecurity-handbook'
      ? cybersecurityMaterials
      : baseMaterials.filter(material => material.direction === direction)

  return materials
    .sort((a, b) => (a.level ? levelOrder[a.level] : 3) - (b.level ? levelOrder[b.level] : 3))
}

export function getDirectionTranslation(direction: KnowledgeDirection, lang: Language): LocalizedDirection | null {
  return direction.translations[lang] ?? null
}

export function getMaterialTranslation(material: KnowledgeMaterial, lang: Language): LocalizedMaterial | null {
  return material.translations[lang] ?? null
}

export function getKnowledgeTopics(direction: string): KnowledgeTopic[] {
  return topics.filter(topic => topic.direction === direction).sort((a, b) => a.order - b.order)
}

export function getKnowledgeReferences(): KnowledgeReference[] {
  return aiSystemTestingReferencesData as KnowledgeReference[]
}

export function getKnowledgeCurriculum(direction: string): KnowledgeCurriculum | null {
  const curriculum = aiSystemTestingCurriculumData as KnowledgeCurriculum
  return curriculum.direction === direction ? curriculum : null
}
