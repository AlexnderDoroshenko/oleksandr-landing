---
title: "QualityForge Lab #3: від специфікації до acceptance — наш перший SDD workflow"
date: "2026-09-27"
summary: "Перший суворий SDD baseline: канонічна специфікація, human gates, незалежний acceptance review та traceability до evidence."
---

У [попередньому дописі](/blog/qualityforge-local-llm-sdd) ми прибрали з експерименту local-first inference як обов’язкову умову. Після цього можна було перевіряти вже не склейку Ollama, OpenCode і Spec Kit, а сам engineering workflow.

Першим контрактом стала **Feature 001: Reproducible Platform Baseline**: backend, web UI, PostgreSQL і Redis, які піднімаються відтворювано та залишають перевірюваний evidence.

## Робоча гіпотеза

Гіпотеза була такою:

> Точна специфікація, автоматизовані тести, незалежний review та явне право людини ухвалювати рішення мають зробити LLM-assisted development більш контрольованою і спостережуваною.

Саме «мають». Ми ще не знали, чи буде процес швидшим або дешевшим, і не намагалися оголосити його єдино правильним SDD.

## Канонічний контракт

Джерелом істини був не чат, а `specs/001-platform/spec.md`. Вимоги отримали стабільні IDs: `PLAT-FR-001` для запуску, `PLAT-FR-002` для readiness, `PLAT-FR-003` для correlation ID, `PLAT-FR-004` для детермінованого reset.

Контракт визначав і межі. Kubernetes та cloud deployment не входили до Feature 001. UI не мав непомітно забрати Compose або CI, а CI — підмінити acceptance evidence.

Фразу «зроби healthcheck» ми розклали на спостережувану поведінку. Liveness не дорівнює readiness. Not-ready response називає проблемний компонент, але не витікає секретами. Correlation ID збігається у response header, structured log та OpenTelemetry span attribute.

## Workflow зі стоп-кранами

Першу версію процесу навмисно зробили суворою:

```text
SPEC
  -> human review
  -> correction
  -> human approval
  -> implementation
  -> acceptance review
  -> human approval
  -> atomic commit
```

Перед implementation людина затверджувала значення контракту. Якщо review знаходив неоднозначність, спочатку змінювалася spec, а не поведінка «у голові агента».

Після implementation зелені перевірки ще не означали завершення task. Незалежний acceptance review звіряв реалізацію та evidence з контрактом. Лише після human approval можна було змінити status і створити atomic commit.

Правило `no commit before approval` було незручним навмисно. Commit означав не «збережімо про всяк випадок», а завершений slice із зрозумілою історією. У git log Feature 001 тому видно окремі кроки: liveness, readiness, correlation, database lifecycle, UI, Compose baseline, CI, evidence publication і portability verification.

## Traceability як instrumentation

Ми хотіли бачити повний ланцюжок:

```text
requirement -> implementation -> tests -> evidence
```

Наприклад, для `PLAT-FR-003` middleware, logging і tracing були лише реалізацією. Тести перевіряли генерацію та збереження ID, а `docs/traceability.md` пояснював, які саме checks підтримують acceptance claim.

Для runtime-сценаріїв evidence також фіксував environment, commit, процедуру, observations, limitations і cleanup. Це не давало зеленому CI job автоматично перетворитися на доказ усього на світі.

## Ми вимірювали ще й процес

Нас цікавив не лише продукт. Ми хотіли бачити, де виникають clarification, скільки correction/review cycles потребує кандидат, що знаходять тести й незалежний reviewer, де потрібне людське рішення та чи можна відновити шлях від requirement до evidence.

Повної ранньої статистики Feature 001 не збереглося, тому постфактум неможливо чесно заявити «SDD скоротив роботу на N%». Але суворий baseline дав контрольну точку: стало видно, які дані взагалі треба записувати.

## Чому це було корисно

Feature 001 мала достатньо реальних меж: degraded dependencies, destructive reset, ownership Docker resources, same-origin UI, bootstrap deadline та platform differences. Це вже не `hello world`, але ще й не весь майбутній продукт.

Суворий workflow зменшував простір для тихої зміни вимог. Human gates залишали рішення за людиною. Independent review відокремлював авторську впевненість від acceptance.

Водночас перша тріщина з’явилася дуже швидко: green tests не гарантували, що реалізація справді виконує контракт.

Саме про це наступний допис — **Green tests, broken contract**.
