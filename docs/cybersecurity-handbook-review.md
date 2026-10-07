# Cybersecurity handbook integration review / Рев’ю інтеграції довідника з кібербезпеки

Reviewed / Перевірено: **2026-10-07**. Source: *Cybersecurity Interview Handbook 2025*, v16, 28 pages, six sections of 20 questions and one glossary. The PDF is a source of topics, not an authority for technical or legal requirements.

## Українська

### Що є в базі знань

Маршрут «Кібербезпека за ролями» має дев’ять тем: шість ролей із PDF, безпеку AI-систем, агентні системи та протоколи, двомовний глосарій. Основні 120 питань згруповані за змістом у 18 матеріалів; дев’ять нових матеріалів розкривають AI, ACP, MCP, A2A і глосарій. Це навчальний синтез, а не дослівне перенесення 120 відповідей. Точна відповідність номера питання та матеріалу збережена в `content/knowledge/cybersecurity-handbook/source-map.json` і перевіряється тестом.

| Розділ PDF | Тема на сайті | Питання |
|---|---|---:|
| 1 Універсальні питання | `security-foundations` | 1.1–1.20 |
| 2 Cyber Security Analyst | `security-analyst` | 2.1–2.20 |
| 3 SOC Analyst | `soc-analyst` | 3.1–3.20 |
| 4 Security Auditor / Compliance Officer | `audit-compliance` | 4.1–4.20 |
| 5 Cyber Security Administrator | `security-administration` | 5.1–5.20 |
| 6 Junior Penetration Tester | `penetration-testing` | 6.1–6.20 |
| 7 Glossary | `security-glossary` | 19 термінів |

### Суттєві виправлення

- Уточнено ризик як оцінку сценарію, а не твердження, що відкритий порт автоматично є вразливістю чи що risk завжди точно дорівнює likelihood × impact.
- Розрізнено false-positive rate `FP/(FP+TN)` та частку хибних серед перевірених алертів `FP/(FP+TP)`; показано вплив вибірки й необхідність розмітки.
- Оновлено CIS Controls до v8.1; ISO/IEC 27001 зафіксовано як видання 2022 року; incident response прив’язано до NIST SP 800-61 Rev. 3, а не до єдиної лінійної послідовності.
- Уточнено: NAT не є самостійним контролем безпеки; VPN не замінює MFA й авторизацію; 90-денне зберігання журналів не універсальна вимога; GDPR/DPIA та повідомлення про інциденти залежать від обставин і застосовного права.
- Оновлено складність трьох матеріалів: `security-analyst-frameworks-risk` Junior→Middle через порівняння frameworks та оцінку залишкового ризику; `admin-access-network` Junior→Middle через проєктування меж доступу й аудит каталогів; `pentest-validation-reporting` Senior→Middle, оскільки звітність і контрольований PoC належать до практичної роботи досвідченого виконавця, а не обов’язково до архітектурного рівня.
- Для AI і агентів додано практичні security checks: prompt injection, RAG/memory poisoning, tenant isolation, делеговані дозволи, фактичні tool effects, audit trail, stopping та budgets. Для ACP використовується **Agent Client Protocol v1**, MCP зафіксовано як **2026-07-28**, A2A як **1.0.0**. Ці три протоколи мають різні межі довіри.

### Обмеження

18 об’єднаних матеріалів не замінюють усі 120 окремих відповідей для поглибленої підготовки до співбесіди; карта покриття показує, де шукати тему, але не гарантує однакової глибини для кожного пункту PDF. Першоджерела в `references.json` доступні через посилання на сторінці. Повний текст ISO/IEC 27001 захищений ліцензією; тут використано лише офіційний опис і відкриті метадані. Версійні протоколи та правові вимоги слід повторно перевіряти перед впровадженням.

## English

The **Cybersecurity by role** path now has nine topics: the six handbook roles, AI system security, agent systems and protocols, and a bilingual glossary. The 120 original questions are grouped into 18 substantive materials; nine further materials cover AI, ACP, MCP, A2A, and the glossary. This is an educational synthesis, not a verbatim reproduction of 120 answers. `source-map.json` maps every source question number to a material and is checked automatically. The table above maps all source sections to site topics.

The review corrects the false-positive-rate denominator (`FP/(FP+TN)`) and distinguishes it from the false share of investigated alerts (`FP/(FP+TP)`). It updates CIS Controls to v8.1, uses ISO/IEC 27001:2022 and NIST SP 800-61 Rev. 3, and removes categorical claims about NAT, VPN, log retention, GDPR, and DPIA. Three level changes are explained above. Agent guidance covers observable actions and permitted artifacts without requiring hidden reasoning. Protocol content pins Agent Client Protocol v1, MCP 2026-07-28, and A2A 1.0.0.

The consolidated format does not give each of the 120 source questions an independent in-depth answer. The mapping establishes findability, not equal depth. The full ISO/IEC 27001 text is licensed; only its official public description and metadata were used. Recheck fast-moving protocol revisions and jurisdiction-specific obligations before implementation.
