---
title: "QualityForge Lab #4: Green tests, broken contract"
date: "2026-09-27"
summary: "Як PLAT-T05 і PLAT-T06 пройшли автоматизовані checks, але незалежний review усе одно знайшов порушення контракту."
series: "qualityforge"
seriesOrder: 4
---

У першому SDD workflow автоматизовані перевірки були обов’язковими, але не останніми. Feature 001 швидко пояснила чому: тест може бути зеленим і водночас доводити не той контракт, який ми думаємо.

## PLAT-T05: redirect, який став Connected

UI мала показувати стан backend через same-origin connectivity endpoint. Очікування виглядало просто: canonical success дає `Connected`, недоступність або неготовність — інший стан.

Проблема ховалася у стандартній поведінці `fetch`: redirect дозволявся автоматично. Відповідь `302` могла привести клієнт до фінального `200`, після чого UI показувала `Connected`.

Тести були зеленими, бо не моделювали цей шлях. Код проходив написані assertions, але порушував acceptance contract: connectivity layer не мала приймати redirect як canonical backend success.

Independent review знайшов розрив між requirement і test design. Виправлення було вузьким: `redirect: "manual"`, негативний test case і кілька lifecycle corrections. Цінність review була не в повторному запуску тих самих тестів, а в іншому питанні: **яку небезпечну поведінку ці тести взагалі не описали?**

## PLAT-T06: три Major за зелених checks

Composed runtime пройшов автоматизовані перевірки, але acceptance review знайшов три integration findings.

Перший — bootstrap мав окремі timeouts, але не справжній загальний deadline. Блокуючий крок міг з’їсти весь бюджет, хоча локальні перевірки виглядали обмеженими.

Другий — cleanup покладався на фіксовані Compose names. Інший checkout міг побачити ті самі resource names, тому destructive operation потребувала доказу ownership, а не лише правильного імені.

Третій — власний `.env` parser відтворював не всю семантику Docker Compose. Quotes, comments, escaping та interpolation створювали ризик: validation могла перевірити одне значення, а Compose використати інше.

Виправлення відповідали boundary кожного finding: monotonic deadline, ownership label від canonical checkout path і Compose як джерело істини для parsing `.env`.

## Що саме довели тести

Ці випадки не означають, що automation марна. Навпаки: тести точно зафіксували вже відомі очікування і захистили corrections від регресії.

Проблема починається, коли `PASS` непомітно розширюють до твердження «контракт виконаний». Насправді тест доводить лише:

- цей check був виконаний;
- на цих inputs і в цьому environment;
- його assertions не побачили порушення.

Acceptance review працює на іншому рівні. Він перевіряє, чи правильні самі assertions, чи покриті failure modes і чи evidence підтримує заявлений висновок.

## Незалежність — це не церемонія

Reviewer отримував canonical contract, source identity та результати перевірок, але не готовий verdict від Builder. Його задача була не підтвердити оптимізм автора, а спробувати зламати acceptance claim.

У нашому кейсі це спрацювало. Але за контроль довелося платити review cycles, повторними validation і новими human gates. Чим більше evidence ми вимагали, тим частіше сам порядок процесу починав конфліктувати з реальним CI та platform testing.

Тести залишилися зеленими. Контракт — ні. Після corrections обидва зійшлися, але наступне питання стало незручнішим: **скільки процесу потрібно, щоб це довести?**

Про це наступний допис — **коли SDD став бюрократією**.
