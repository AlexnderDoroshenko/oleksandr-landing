import { getMaterialTranslation } from '../lib/knowledge'
import type { Language } from '../types/post'
import type { KnowledgeMaterial } from '../types/knowledge'

type Labels = {
  answer: string
  examples: string
  exercises: string
  missingTranslation: string
}

type Props = {
  material: KnowledgeMaterial
  lang: Language
  labels: Labels
}

export default function KnowledgeMaterialView({ material, lang, labels }: Props) {
  const content = getMaterialTranslation(material, lang)

  if (!content) {
    return <article className="knowledge-material missing-translation" data-material-id={material.id}>
      <p>{labels.missingTranslation}</p>
    </article>
  }

  return <details className="knowledge-material" data-material-id={material.id}>
    <summary>
      <span>{content.question}</span>
      {material.level && <span className="knowledge-level">{material.level}</span>}
    </summary>
    <div className="knowledge-material-body">
      <section>
        <h3>{labels.answer}</h3>
        <p>{content.answer}</p>
      </section>
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
