---
title: "QualityForge Lab #8: де агент повинен зупинитися"
date: "2026-09-27"
summary: "Три security-рішення з AUTH-T01, T02 і T04, які агент мав винести на human gate, а не вигадувати самостійно."
---

SDD v2 дозволяв агенту самостійно виправляти in-scope defects. Але security task може бути технічно зрозумілим і водночас не мати правильної відповіді без продуктового рішення.

`AUTH-T01`, `AUTH-T02` і `AUTH-T04` дали три різні приклади правильної зупинки.

## T01: що означають кілька ролей

Identity foundation мала зберігати tenant-local users і roles. Але самі таблиці не відповідали на питання: якщо користувач має кілька ролей, grants об’єднуються чи одна роль перемагає? Як нормалізувати email? Чи зберігати dots і plus suffixes?

Це не implementation detail. Рішення впливає на authorization і uniqueness. Людина затвердила union-of-grants після tenant/status checks, tenant-local Admin, trim і lowercase повного email без спеціальної обробки dots/plus.

Лише після цього Builder міг реалізувати frozen contract.

## T02: authentication — це набір policy decisions

Registration/login/refresh вимагали визначити, хто може реєструватися, у який tenant, який status і role отримує account, як живуть access та refresh tokens, що бачить attacker у помилках і хто відповідає за rate limiting.

Людина затвердила self-registration Customer в існуючий tenant, 15-хвилинний access JWT, hashed rotating opaque refresh на сім днів і generic safe errors. Rate limiting залишився пізнішому task, а не був непомітно доданий «для security».

Тобто human gate не просив вибрати назву функції. Він закрив product/security contract.

## T04: звідки береться перший Admin

Role assignment та audit уже мали прийнятий slice. Але privileged provisioning відкрив дві прогалини: хто задає initial password і як з’являється перший Admin, якщо створювати Admin може лише Admin?

Це справжній `BLOCKED_DECISION`. Агент не повинен був вигадувати invitation flow, default password або публічний bootstrap endpoint.

Людина затвердила Admin-supplied initial password через існуючий T02 hashing і operator-only local bootstrap для existing tenant. Команда fail-closed, якщо Admin уже існує; password не передається через argv чи environment; HTTP bootstrap route не з’явився.

## Хороша зупинка має бути конкретною

`Потрібне уточнення` — слабкий результат. Orchestrator має показати:

- яке requirement заблоковане;
- чому наявний contract не дає відповіді;
- які bounded options існують;
- яку downstream implementation кожен варіант дозволить.

Після рішення canonical spec оновлюється, і Builder продовжує без повторного питання про те саме.

У всіх трьох tasks було по одному консолідованому human intervention до final gate. Це не нуль, але й не безперервне ручне керування.

А `AUTH-T03` показав інший сценарій: HIGH-risk authorization task пройшов без нового продуктового рішення. Саме його розберемо далі.
