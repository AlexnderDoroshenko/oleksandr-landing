"""Execute every published AI QA Python example in an isolated namespace."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOPICS = ROOT / "content" / "knowledge" / "ai-system-testing" / "topics.json"


def main() -> None:
    topics = json.loads(TOPICS.read_text(encoding="utf-8"))
    examples = topics[1]["translations"]["en"]["codeExamples"]

    for example in examples:
        namespace = {"__name__": f"ai_qa_{example['id'].lower().replace('-', '_')}"}
        compiled = compile(example["code"], example["id"], "exec")
        exec(compiled, namespace)

    print(f"Validated {len(examples)} AI QA Python examples")


if __name__ == "__main__":
    main()
