import catalogData from '../content/knowledge/catalog.json'
import testingTheoryData from '../content/knowledge/materials/testing-theory.json'
import starterPackData from '../content/knowledge/materials/starter-pack.json'
import expandedQualityEngineeringData from '../content/knowledge/materials/expanded-quality-engineering.json'
import expandedPlatformData from '../content/knowledge/materials/expanded-platform.json'
import expandedIntelligentSystemsData from '../content/knowledge/materials/expanded-intelligent-systems.json'
import aiSystemTestingTopicsData from '../content/knowledge/ai-system-testing/topics.json'
import aiSystemTestingReferencesData from '../content/knowledge/ai-system-testing/references.json'
import aiSystemTestingCurriculumData from '../content/knowledge/ai-system-testing/curriculum.json'
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
import type { Language } from '../types/post'
import type { KnowledgeCurriculum, KnowledgeDirection, KnowledgeMaterial, KnowledgeReference, KnowledgeTopic, LocalizedDirection, LocalizedMaterial } from '../types/knowledge'

const directions = catalogData as KnowledgeDirection[]
const levelOrder = { Junior: 0, Middle: 1, Senior: 2 } as const
const allMaterials = [
  ...(testingTheoryData as KnowledgeMaterial[]),
  ...(starterPackData as KnowledgeMaterial[]),
  ...(expandedQualityEngineeringData as KnowledgeMaterial[]),
  ...(expandedPlatformData as KnowledgeMaterial[]),
  ...(expandedIntelligentSystemsData as KnowledgeMaterial[]),
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
const topics = aiSystemTestingTopicsData as KnowledgeTopic[]

export function getKnowledgeDirections(): KnowledgeDirection[] {
  return [...directions].sort((a, b) => a.order - b.order)
}

export function getKnowledgeDirection(slug: string): KnowledgeDirection | undefined {
  return directions.find(direction => direction.slug === slug)
}

export function getKnowledgeMaterials(direction: string): KnowledgeMaterial[] {
  return allMaterials
    .filter(material => material.direction === direction || material.collections?.includes(direction))
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
