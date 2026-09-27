---
title: "QualityForge Lab #6: Severity ≠ blast radius"
date: "2026-09-27"
summary: "Чому severity finding визначає важливість проблеми, але не обсяг correction, validation і повторного review."
series: "qualityforge"
seriesOrder: 6
---

У Feature 001 ми кілька разів потрапляли в одну пастку: якщо finding має severity Major, значить після correction треба повторити майже все. Логічно звучить — і часто марнує час.

Severity відповідає на питання: **наскільки finding заважає acceptance?** Blast radius — **що саме змінилося і які попередні докази воно могло зробити невалідними?**

Це різні осі.

## Major може мати малу correction

Уявімо mandatory Linux evidence, де відсутнє одне поле environment. Без нього portability claim не можна прийняти — це Major. Але якщо значення є в уже збереженому run log, correction може бути документаційною: відновити поле, перевірити посилання й виконати delta review.

Повторний Docker experiment нічого не додасть. Runtime code, dependencies, environment і результат не змінилися.

Інший приклад — classification одного endpoint. Якщо correction змінює обробку redirect, треба повторити позитивні, негативні та leakage cases цього boundary. Але це не автоматично робить необхідним весь cross-platform bootstrap.

## Validation reuse — не халтура

Reuse допустимий лише тоді, коли можна назвати:

- який check уже пройшов;
- на яких source inputs і configuration;
- який environment використовувався;
- чому поточна correction не впливає на цей результат.

SHA сам по собі недостатній, особливо для dirty candidate. Тому SDD v2 почав записувати input hashes, affected paths, execution environment і причину execute або reuse.

Якщо змінилася dependency, shared authorization policy, migration або runtime configuration, blast radius розширюється. Якщо виправлено посилання в evidence — ні. Важливість finding не дає відповіді автоматично.

## Delta review замість амнезії

Після correction reviewer перевіряє named finding, actual diff і affected accepted behaviour. Незмінені результати залишаються чинними, якщо їхні inputs не зачеплені.

Це не означає «ніколи не запускати full regression». Вона потрібна на feature/PR gate або після cross-cutting change. Але повний прогін має мати технічну причину, а не бути ритуалом покаяння за слово Major.

Практичний маршрут став таким:

```text
finding -> correction scope -> affected validation -> delta review
```

Саме ця ідея дозволила перейти від SDD v1 до risk-based workflow. Ми залишили незалежний acceptance там, де наслідки високі, але перестали скидати весь накопичений evidence після кожної вузької correction.

Наступний допис — про повну конструкцію **SDD v2: Orchestrator, Builder і Reviewer**.
