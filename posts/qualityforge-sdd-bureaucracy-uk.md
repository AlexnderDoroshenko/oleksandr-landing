---
title: "QualityForge Lab #5: коли SDD став бюрократією"
date: "2026-09-27"
summary: "Як hosted CI, portability evidence та повторні review перетворили корисні controls SDD v1 на помітний process overhead."
---

Strict SDD workflow дав Feature 001 контроль і traceability. А потім ті самі правила почали заважати отримувати evidence, заради якого їх створили.

Найкраще це видно на `PLAT-T07` і `PLAT-T09`.

## Deadlock навколо hosted CI

Наш порядок казав: acceptance, human approval, atomic commit. Але для hosted CI потрібні commit і push. Без них немає final SHA, GitHub Actions run і job logs. Без hosted evidence acceptance для CI task неповна.

Вийшло коло:

```text
acceptance needs hosted evidence
hosted evidence needs commit
commit needs acceptance
```

Для `PLAT-T07` ми використали контрольований provisional commit, push, hosted run, acceptance і amend. Human authority збереглася, але історія стала складнішою саме через правило, яке мало зробити її чистішою.

Це був не дефект CI. Це був дефект моделі процесу: вона уявляла evidence як результат, доступний до commit, хоча частина доказів народжується лише після нього.

## Portability без кінця

`PLAT-T09` мала перевірити platform portability. Дуже швидко просте «працює на macOS і Linux» перетворилося на architecture, Docker backend locality, resource limits, image identity, filesystem, timing qualification та cleanup safety.

Контракт довелося уточнити: mandatory — macOS Apple Silicon/arm64 і Ubuntu 24.04/amd64; Windows/WSL2 — optional. Functional portability відокремили від performance claim. GitHub runner із двома CPU міг довести, що stack працює на Linux, але не міг чесно бути baseline для вимоги з чотирма CPU та 8 GB Docker memory.

Перший hosted Linux run зупинив надто суворий preflight до Docker mutation. Після correction окремий run підтвердив portability. Це правильна обережність, але також сигнал: acceptance contract розрісся настільки, що перевірка інструмента почала конкурувати з перевіркою продукту.

## Full review після кожної коми

Ще одна проблема проявилася під час corrections. Finding міг бути Major, бо блокував acceptance. Але його виправлення інколи стосувалося лише evidence field або документаційного посилання.

V1 не завжди чітко розділяв важливість finding і обсяг повторної роботи. У результаті вузька correction могла тягнути повний review або дорогу platform validation, хоча runtime inputs не змінилися.

Reviewer checklists теж перетворювалися на серію дрібних зупинок. Людина підтверджувала не лише product і security decisions, а й рутинні переходи між Builder, Reviewer та correction.

## Це не аргумент проти evidence

Висновок не в тому, що documentation або platform evidence зайві. Без них ми б не відрізнили фактичний Linux PASS від припущення, а exact version limitation — від failed validation.

Проблема була в іншому: workflow трактував усі controls майже однаково незалежно від risk, cost і blast radius. Контроль став механічним.

Feature 001 дала нам видимість, але ціною великої ручної диспетчеризації. Так з’явилося питання для наступної версії процесу: що треба перевіряти повторно після correction, а що вже можна чесно reuse?

Ключова відповідь вмістилася в одну формулу: **severity finding не дорівнює correction blast radius**.
