import catalogData from '../content/knowledge/catalog.json'
import testingTheoryData from '../content/knowledge/materials/testing-theory.json'
import starterPackData from '../content/knowledge/materials/starter-pack.json'
import expandedQualityEngineeringData from '../content/knowledge/materials/expanded-quality-engineering.json'
import expandedPlatformData from '../content/knowledge/materials/expanded-platform.json'
import expandedIntelligentSystemsData from '../content/knowledge/materials/expanded-intelligent-systems.json'
import type { Language } from '../types/post'
import type { KnowledgeDirection, KnowledgeMaterial, LocalizedDirection, LocalizedMaterial } from '../types/knowledge'

const directions = catalogData as KnowledgeDirection[]
const levelOrder = { Junior: 0, Middle: 1, Senior: 2 } as const
const allMaterials = [
  ...(testingTheoryData as KnowledgeMaterial[]),
  ...(starterPackData as KnowledgeMaterial[]),
  ...(expandedQualityEngineeringData as KnowledgeMaterial[]),
  ...(expandedPlatformData as KnowledgeMaterial[]),
  ...(expandedIntelligentSystemsData as KnowledgeMaterial[]),
]

export function getKnowledgeDirections(): KnowledgeDirection[] {
  return [...directions].sort((a, b) => a.order - b.order)
}

export function getKnowledgeDirection(slug: string): KnowledgeDirection | undefined {
  return directions.find(direction => direction.slug === slug)
}

export function getKnowledgeMaterials(direction: string): KnowledgeMaterial[] {
  return allMaterials
    .filter(material => material.direction === direction)
    .sort((a, b) => (a.level ? levelOrder[a.level] : 3) - (b.level ? levelOrder[b.level] : 3))
}

export function getDirectionTranslation(direction: KnowledgeDirection, lang: Language): LocalizedDirection | null {
  return direction.translations[lang] ?? null
}

export function getMaterialTranslation(material: KnowledgeMaterial, lang: Language): LocalizedMaterial | null {
  return material.translations[lang] ?? null
}
