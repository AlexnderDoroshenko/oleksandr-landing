# AI System Testing content review / Рев’ю матеріалів із тестування AI-систем

Reviewed on / Перевірено: **2026-10-06**

## Українська

### Результат інтеграції

Матеріал інтегровано як навчальний маршрут **«Тестування AI-систем»** із 12 темами. Після рев’ю дублювання 25 вихідних питань прибрано: 70 AI-специфічних записів зберігаються окремо, а 25 вихідних ID відображаються на 23 наявні канонічні записи. Дві пари близьких питань об’єднано відповідно в матеріалах про structured output/tool calls і retrieval precision/recall. Таким чином, маршрут показує 93 унікальні питання, але через стабільні aliases простежувано покриває всі 95 вихідних ID `AIQA-*`.

Спільні основи не повторюються в AI-напрямку як друга відповідь. Дев’ять канонічних матеріалів у **«Теорії тестування»** — про test case, oracle, defect report, severity/priority, test types, entry/exit criteria, strategy, metrics і risk-based testing — доповнено короткими двомовними пунктами про застосування до AI. Решта повторно використаних матеріалів посилається на відповідні канонічні записи Python, AI/LLM/RAG/агентів, API, LLMOps та security.

Для статичного експорту маршрут розділено на компактний огляд і п’ять окремих сторінок: `junior`, `middle`, `senior`, `deep-dives` та `python-examples`. Після дедуплікації найбільший JSON payload AI-сторінки становить приблизно 65 kB замість початкових 177 kB; попередження Next.js про large page data відсутнє.

Кожна тема має українську й англійську версії, практичне завдання та посилання на першоджерела. Десять розгорнутих розборів прив’язані до змістовно відповідних тем, а шість Python-прикладів розміщено у темі Python і перевіряються окремою командою.

### Суттєві виправлення після рев’ю

- MCP оновлено з зафіксованої у джерелі ревізії `2025-11-25` до актуальної для цього рев’ю ревізії `2026-07-28`. У відповіді явно зазначено, що старіші handshake-based ревізії мають інший lifecycle і повинні тестуватися з явною protocol version.
- У матеріалі про OpenAI evaluation додано датоване попередження: станом на 2026-10-06 попередня Evals platform перебуває у процесі виведення; перед інтеграцією потрібно перевіряти поточну deprecations page та новіші Datasets/evaluation workflows.
- Збережено чіткі межі доказовості: semantic similarity не є oracle правильності; RAG не гарантує відсутності hallucinations; low temperature або seed не гарантують детермінізму; groundedness/faithfulness не доводять істинність джерела.
- Для агентів оцінюються observable actions, tool arguments/results, дозволені артефакти, фінальний state, authorization, termination і recovery. Матеріал не вимагає прихованого chain-of-thought.
- Уточнено знаменники retrieval та agent metrics: `precision@k`, `recall@k`, reciprocal rank, scenario-level і call-level unsafe-action rates не змішуються; MRR є середнім RR по набору, а не RR одного прикладу.
- Першоджерела винесено у версійований каталог. Посилання в питаннях відкривають офіційну документацію, специфікації або оригінальні дослідницькі публікації.
- Виправлено архітектурну проблему початкового імпорту: розгорнуті розбори тепер прив’язані за змістом, а не за порядковим номером теми.
- Прибрано паралельні копії базових QA-відповідей. AI-маршрут повторно використовує канонічні ID та зберігає вихідні `AIQA-*` як aliases; тому зміни до спільної теорії мають одне джерело істини.

### Перегляд рівнів складності

Шість рівнів змінено. Решта відповідає заявленій моделі: Junior пояснює й виконує базову перевірку; Middle реалізує, діагностує та порівнює; Senior визначає стратегію, архітектуру, метрики й risk decisions.

| ID | Було | Стало | Причина |
|---|---|---|---|
| AIQA-02-15 | Senior | Middle | Реалізація generator/decorator/context manager є практичною мовною навичкою; стратегічного або архітектурного рішення питання не вимагає. |
| AIQA-02-16 | Senior | Middle | Class decorator і closure потребують впевненої реалізації та діагностики, але не Senior-level ownership. |
| AIQA-02-17 | Senior | Middle | Вибір dataclass для test records є design/implementation decision середнього рівня. |
| AIQA-08-03 | Junior | Middle | Вибір single/multi-agent і перевірка handoff/permissions потребують порівняння архітектурних альтернатив та failure paths. |
| AIQA-11-02 | Senior | Middle | Розпізнавання основних GenAI threats і jailbreaking є необхідною діагностичною компетенцією Middle; побудова всієї security strategy лишається Senior. |
| AIQA-12-02 | Senior | Middle | Різниця anonymization/pseudonymization і базова перевірка re-identification — прикладна privacy-компетенція Middle; governance decisions лишаються Senior. |

У темах 10–12 не додано штучних Junior-питань: вихідний матеріал їх не містив, а прогалину видно в навігації.

### Відповідність джерела репозиторію

| Розділ документа | Канонічний файл / сторінка |
|---|---|
| 01 Документація і тестовий процес | AI-специфічне: `content/knowledge/ai-system-testing/01-documentation-testing-process.json`; спільне: канонічний `testing-theory`, доповнений через `canonical-extensions.json` |
| 02 Python для автоматизації | AI-специфічне: `02-python-automation.json`; спільне: канонічний `python-coding-whiteboard` |
| 03 Основи AI і ML | `03-ai-ml-fundamentals.json`; також `ai-llm-rag-agents` |
| 04 Prompting і tool calling | `04-prompting-tool-calling.json`; також `ai-llm-rag-agents` |
| 05 RAG і retrieval | `05-rag-retrieval.json`; також `ai-llm-rag-agents` |
| 06 Агенти і взаємодія | `06-agents-coordination.json`; також `ai-llm-rag-agents` |
| 07 MCP і contract testing | `07-mcp-contract-testing.json`; також `api-sql-data` |
| 08 Frameworks для chains і graphs | `08-chain-graph-frameworks.json`; також `ai-llm-rag-agents` |
| 09 Автоматизація GenAI tests | `09-genai-test-automation.json`; також `llmops-evaluation-observability` |
| 10 Evaluation і golden datasets | `10-evaluation-golden-data.json`; також `llmops-evaluation-observability` |
| 11 Безпека і privacy GenAI | `11-genai-security-privacy.json`; також `security-devsecops` |
| 12 Responsible AI | `12-responsible-ai.json`; також `llmops-evaluation-observability` |
| 13 Десять розгорнутих розборів | `topics.json`, поле `deepDives` відповідної теми |
| 14 Шість Python-прикладів | `topics.json`, `python-automation.translations.*.codeExamples` |
| 15 Практичний набір і критерії готовності | Розподілено між `practice` 12 тем; completion criteria збережено в цьому звіті як вимогу до evidence, versions, denominators і bilingual equivalence |
| 16 Джерела і правила перенесення | `references.json`, типи в `types/knowledge.ts`, автоматичні content checks |

Відображення 25 об’єднаних вихідних ID на 23 канонічні записи зберігається у `reused-materials.json`. Воно є машинно перевірюваною частиною покриття, а не прихованою домовленістю.

### Невирішені питання й обмеження

- Framework APIs і hosted evaluation products змінюються швидше за навчальний матеріал. Дата рев’ю та версії зафіксовані, але LangGraph, LlamaIndex, AutoGen, CrewAI, Ragas, DeepEval, Langfuse та provider APIs потрібно повторно перевіряти перед копіюванням implementation code.
- Числові thresholds і sample sizes у розборах є навчальними прикладами, не універсальними release standards.
- Правові висновки щодо privacy залежать від jurisdiction та use case; матеріал навмисно не подає їх як юридичну консультацію.
- Теми 10–12 не мають Junior-рівня у вихідному наборі. Це не помилка імпорту, але майбутнє окреме доповнення може вирівняти learning path.

## English

### Integration outcome

The content is published as an **AI System Testing** learning path with 12 topics. The review removed 25 duplicated source questions: 70 AI-specific records remain standalone, while 25 source IDs map to 23 existing canonical records. Two closely related pairs were consolidated into the structured-output/tool-calling and retrieval-precision/recall materials. The route therefore presents 93 unique questions while stable aliases preserve traceable coverage of all 95 original `AIQA-*` IDs.

Shared fundamentals are not repeated as a second AI answer. Nine canonical **Testing Theory** records—test case, oracle, defect report, severity/priority, test types, entry/exit criteria, strategy, metrics, and risk-based testing—now include concise bilingual AI-application points. Other reused material remains canonical in Python, AI/LLM/RAG/agents, APIs, LLMOps, or security.

For static export, the learning path is split into a compact overview plus `junior`, `middle`, `senior`, `deep-dives`, and `python-examples` pages. After deduplication, the largest AI-page JSON payload is approximately 65 kB rather than the original 177 kB, and the Next.js large-page-data warning is absent.

Every topic has equivalent Ukrainian and English content, a practical exercise, and primary-source links. Ten detailed discussions are mapped to the relevant topics; six Python examples live under Python automation and have an executable verification command.

The substantive corrections, level changes, source-to-file mapping, and limitations are identical to the Ukrainian report above. In particular, MCP is pinned to revision `2026-07-28`; the OpenAI evaluation entry records the 2026 Evals-platform transition; and the material explicitly rejects semantic similarity, RAG, low temperature, hidden reasoning, or an aggregate judge score as standalone proof of correctness or safety.

The six level changes are: `AIQA-02-15`, `AIQA-02-16`, `AIQA-02-17`, and `AIQA-12-02` from Senior to Middle; `AIQA-08-03` and `AIQA-11-02` from Junior/Senior respectively to Middle. The reasons are the same as in the bilingual table: these questions test implementation/diagnosis rather than Senior strategy, except multi-agent selection, which requires Middle-level comparison and failure analysis.

The 25-to-23 source-to-canonical mapping is stored in `reused-materials.json` and checked automatically; `canonical-extensions.json` contains the bilingual AI additions to shared Testing Theory. Remaining limitations are API/framework churn, illustrative rather than normative thresholds, jurisdiction-dependent legal requirements, and the source document’s intentional absence of Junior questions in topics 10–12.
