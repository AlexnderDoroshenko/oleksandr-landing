---
title: "QualityForge Lab #9: zero human interventions — що насправді сталося в AUTH-T03"
date: "2026-09-27"
summary: "Що насправді означають zero human interventions у HIGH-risk AUTH-T03 — і чому це не дорівнює повній автономності."
series: "qualityforge"
seriesOrder: 9
---

У task record `AUTH-T03` є приваблива цифра: **Human interventions — 0**. Її дуже легко перетворити на рекламний headline про автономного агента. І так само легко неправильно зрозуміти.

## Що робив T03

Task додавав centralized tenant-first authorization evaluator і reusable request adapter для вже погоджених policy cases. Він перевикористовував identity rules із T01 та access-token verification із T02.

Scope був вузьким: без нового product endpoint, role mutation, audit, rate limiting або нових identity decisions. Risk залишався HIGH, бо помилка могла порушити tenant isolation.

## Чому не знадобилося рішення людини

Canonical contract уже відповідав на material questions. Tenant і current account status перевіряються до grants. Role claims із token не вважаються актуальною authorization truth. Subject lookup залишається tenant-scoped. Own-profile означає той самий subject ID.

Тому Builder не мав причини запитувати нову policy. Він реалізував уже прийняті рішення.

Нуль interventions не означає нуль human authority: людина раніше затвердила contracts T01/T02 і окремо дала final approval T03. Метрика рахувала рішення під час виконання до final gate, а не видаляла людину з процесу.

## Corrections все одно були

Builder зробив три passes і використав 2 із 3 HIGH-risk correction cycles.

Обидві problems були в test fixtures. Одна створювала JWT із expired detached ORM instance. Інша намагалася очистити SQLAlchemy instrumented set способом, який не моделював потрібну зміну ролі.

Це були failed focused checks, але не product decisions. Builder виправив fixtures, повторив affected tests і не перервав людину питанням «можна продовжувати?».

Фінальний affected run мав 85 PASS. Full component regression пройшла 168 tests після повтору з дозволеним loopback: перша спроба мала два environment setup errors, а не product failures. Незалежний Reviewer окремо виконав 25 focused tests і повернув PASS без findings.

## Що ця цифра доводить

Вона доводить лише одне: **для цього task** раніше прийнятий contract був достатнім, щоб пройти implementation і corrections без нового material decision.

Вона не доводить, що HIGH-risk tasks завжди можна виконувати автономно. T01, T02 і T04 потребували рішення людини. Вона також не доводить економію часу: elapsed time для T03 записаний як unknown.

Цінність T03 не в магічному нулі. Вона в тому, що workflow розрізнив test-fixture defect і product ambiguity. Перше повернулося Builder, друге повернулося б людині.

Наступний допис збере `AUTH-T01–T04` в одну таблицю — без спроб видати чотири різні HIGH-risk tasks за контрольований A/B test.
