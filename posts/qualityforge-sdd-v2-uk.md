---
title: "QualityForge Lab #7: SDD v2 — Orchestrator, Builder і Reviewer"
date: "2026-09-27"
summary: "Як risk-based SDD v2 розділив Orchestrator, Builder і Reviewer, обмежив correction cycles та дозволив чесний validation reuse."
series: "qualityforge"
seriesOrder: 7
---

SDD v2 не мав «автоматизувати людину». Його мета була скромнішою: залишити human authority для рішень, але прибрати ручне керування кожним переходом процесу.

## Три ролі

**Orchestrator** читає canonical task, визначає risk, scope, approvals і потрібні checks. Він веде один task record і вирішує, які результати можна reuse.

**Builder** реалізує frozen requirements, запускає focused validation і сам виправляє in-scope defects. Failed test не стає автоматично питанням до людини.

**Reviewer** працює в окремому контексті. Він отримує contract, source identity та raw evidence, але не приватне reasoning Builder і не готовий verdict.

Це логічні ролі, а не три нові сервіси. Спочатку вони виконувалися через checked-in інструкції, бо native OpenCode dispatch у доступному shell не працював.

## Risk визначає маршрут

V2 використовує три категорії:

- LOW — documentation, focused tests, isolated code;
- MEDIUM — API, звичайні DB/integration та bounded CI changes;
- HIGH — security, authorization, destructive lifecycle, concurrency, architecture.

Для них встановлено correction budgets до 1/2/3 cycles. Budget не дозволяє прийняти дефект; він визначає момент, коли повторні corrections вже потребують людського рішення.

## Коли агент зупиняється

Human gate потрібен для зміни requirement meaning, розширення scope, unresolved product/security/architecture decision, небезпечної зовнішньої дії, вичерпаного budget і merge/release.

Але агент не має зупинятися через кожен failed test, Minor або локальну correction, якщо frozen contract уже дає відповідь. Інакше людина перетворюється з decision owner на кнопку Continue.

## Evidence як shared state

Один task record зберігає base, candidate identity, risk, counters, findings, validations, reuse і limitations. Окрема база даних для orchestration не потрібна.

Для кожного check важливо розділяти `executed` і `reused`. Відомі inputs та environment дозволяють не повторювати дороге validation без причини. Невідомий час або model config записується як `unknown`, а не нуль.

## CI після normal commit

V2 також прибрав default amend-loop. Нормальний маршрут:

```text
local candidate -> human approval -> commit -> push -> existing CI -> PR
```

Task може мати `CI_PENDING`, якщо hosted run ще не існує. Merge readiness уже вимагає актуальних checks. Так process model визнає реальний порядок появи hosted evidence.

## Це ще не доказ покращення

SDD v2 був design response на lessons Feature 001, а не перемога за замовчуванням. Щоб оцінити його, потрібні реальні tasks із записаними cycles, interventions, findings і validation reuse.

Першими такими datapoints стали `AUTH-T01–T04`. Усі вони були HIGH-risk, і саме там добре видно, де human intervention необхідне, а де агент може пройти task самостійно.

Наступна історія — **security tasks і рішення, які не можна вигадувати**.
