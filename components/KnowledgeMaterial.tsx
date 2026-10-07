import { getMaterialTranslation } from '../lib/knowledge'
import type { Language } from '../types/post'
import type { KnowledgeMaterial, KnowledgeReference } from '../types/knowledge'

type Labels = {
  answer: string
  examples: string
  exercises: string
  missingTranslation: string
  sources?: string
}

type Props = {
  material: KnowledgeMaterial
  lang: Language
  labels: Labels
  references?: KnowledgeReference[]
}

export default function KnowledgeMaterialView({ material, lang, labels, references = [] }: Props) {
  const content = getMaterialTranslation(material, lang)

  if (!content) {
    return <article className="knowledge-material missing-translation" data-material-id={material.id}>
      <p>{labels.missingTranslation}</p>
    </article>
  }

  return <details className="knowledge-material" id={material.id} data-material-id={material.id}>
    <summary>
      <span>{content.question}</span>
      {material.level && <span className="knowledge-level">{material.level}</span>}
    </summary>
    <div className="knowledge-material-body">
      <section>
        <h3>{labels.answer}</h3>
        <p>{content.answer}</p>
        {content.answerPoints && content.answerPoints.length > 0 && <ul className="knowledge-answer-points">
          {content.answerPoints.map(point => <li key={point}>{point}</li>)}
        </ul>}
      </section>
      {content.sources && content.sources.length > 0 && <section className="knowledge-sources">
        <h3>{labels.sources ?? 'Sources'}</h3>
        <ul>{content.sources.map(sourceId => {
          const reference = references.find(item => item.id === sourceId)
          return <li key={sourceId}>{reference ? <a href={reference.url} target="_blank" rel="noreferrer">{reference.id}: {reference.title}{reference.version ? ` (${reference.version})` : ''}</a> : sourceId}</li>
        })}</ul>
      </section>}
      {content.examples.length > 0 && <section>
        <h3>{labels.examples}</h3>
        <ul>{content.examples.map(example => <li key={example}>{example}</li>)}</ul>
      </section>}
      {content.exercises.length > 0 && <section>
        <h3>{labels.exercises}</h3>
        <ol>{content.exercises.map(exercise => <li key={exercise}>{exercise}</li>)}</ol>
      </section>}
    </div>
  </details>
}
