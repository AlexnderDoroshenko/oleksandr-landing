---
title: "QualityForge Lab #10: AUTH-T01–T04 у цифрах"
date: "2026-09-27"
summary: "Перші чотири HIGH-risk SDD v2 tasks у цифрах: passes, corrections, human interventions, findings і чесні межі порівняння."
---

Після чотирьох HIGH-risk identity tasks у нас з’явився перший невеликий набір process records. Він ще не доводить, що SDD v2 швидший або дешевший, але вже дозволяє говорити не лише враженнями.

| Task | Human interventions | Builder passes | Reviewer passes | Corrections | Final verdict |
|---|---:|---:|---:|---:|---|
| AUTH-T01 | 1 | 3 | 3 | 2 / 3 | PASS |
| AUTH-T02 | 1 | 4 | 2 | 3 / 3 | PASS |
| AUTH-T03 | 0 | 3 | 1 | 2 / 3 | PASS |
| AUTH-T04 | 1 | 4 | 2 | 2 / 3 | PASS |

Human interventions тут означають actual decision/approval responses до final gate. Routine commentary не рахується. Final approval існував окремо для кожного task.

## T01: review знайшов дві Major

Identity foundation завершилася після двох focused corrections. Independent review знайшов bypass email normalization через Core insert/Unicode variants і неповні reusable negative policy cases.

Focused identity checks були повторені, а незмінений platform evidence — reuse. Target PostgreSQL виконання залишилося limitation, бо локальний Docker daemon був зупинений.

## T02: весь budget використано

Authentication lifecycle використав 3/3 correction cycles. Builder і Orchestrator знайшли migration fixture, route inventory, Unicode refresh та DB-error sanitation problems. Reviewer додав RFC 9457 Problem Details mismatch і metadata/docs findings.

Фінальний affected run мав 60 PASS, full component — 140 PASS, reviewer delta — 10 PASS. Це найдорожчий із чотирьох tasks за кількістю corrections, але elapsed time лишився unknown.

## T03: нуль рішень, не нуль роботи

Authorization reuse accepted contracts, тому human intervention не знадобився. Дві fixture corrections усе одно дали три Builder passes. Reviewer повернув PASS без findings.

Це хороший приклад різниці між autonomy та absence of work.

## T04: правильний BLOCKED_DECISION

Administrative provisioning зупинився на initial password і first-Admin bootstrap. Після одного консолідованого human decision task завершився з двома correction cycles і незалежним PASS.

Фінальний component run мав 193 PASS. Але target PostgreSQL competing-bootstrap behaviour залишився before-release evidence, а не прихований успіх.

## Що можна порівнювати

Можна сказати, що всі чотири tasks завершилися PASS у межах HIGH-risk budget. Можна побачити, де findings прийшли від Builder, Reviewer або environment. Можна відрізнити executed validation від reused.

Не можна чесно порахувати speedup проти SDD v1: Feature 001 не має повного сумісного task-level dataset. Не можна також робити causal висновок із чотирьох різних tasks без контрольної групи.

Це baseline, а не переможний графік.

Наступний експеримент уже підготовлений: перевірити, чи може той самий workflow працювати як справжній reusable Codex Skill. Native discovery та read-only routing smoke вже мають evidence, але перший реальний post-skill datapoint має дати `AUTH-T05`. До нього висновки про користь Skill були б передчасними.
