import type { Language } from '../../types/post'

export type CheckLevel = 'Junior' | 'Middle' | 'Senior'
export type CheckMode = 'practice' | 'depth'
export type CheckTranslation = { prompt: string; options: [string, string, string]; explanation: string }
export type KnowledgeCheck = {
  id: string
  region: string
  direction: string
  mode: CheckMode
  level: CheckLevel
  correct: number
  translations: Record<Language, CheckTranslation>
}

// Original learning scenarios. The linked ISTQB sample exams are external resources, not a source of copied questions.
export const knowledgeChecks: KnowledgeCheck[] = [
  {
    id: 'foundation-practice', region: 'foundations', direction: 'testing-theory', mode: 'practice', level: 'Junior', correct: 1,
    translations: {
      en: { prompt: 'A requirement says “search is fast”. What should you do first?', options: ['Write a UI test that waits two seconds', 'Agree on a measurable response-time target and conditions', 'Check only that results appear'], explanation: '“Fast” is not an observable expected result. Define a threshold, workload, environment, and measurement method before checking it.' },
      uk: { prompt: 'Вимога каже: «пошук швидкий». Що зробити спочатку?', options: ['Написати UI-тест з очікуванням у дві секунди', 'Узгодити вимірювану межу часу відповіді та умови', 'Перевірити лише появу результатів'], explanation: '«Швидкий» — не спостережуваний очікуваний результат. Перед перевіркою визначте поріг, навантаження, середовище й спосіб вимірювання.' },
    },
  },
  {
    id: 'foundation-junior', region: 'foundations', direction: 'testing-theory', mode: 'depth', level: 'Junior', correct: 2,
    translations: {
      en: { prompt: 'A user reports a wrong total. Which item is the failure?', options: ['The incorrect formula in source code', 'The developer misunderstanding the rule', 'The wrong total displayed to the user'], explanation: 'A failure is externally observed incorrect behavior. The code fault is a defect; the misunderstanding is a human error that may have caused it.' },
      uk: { prompt: 'Користувач повідомив про неправильну суму. Що є відмовою (failure)?', options: ['Неправильна формула в коді', 'Нерозуміння правила розробником', 'Неправильна сума, показана користувачу'], explanation: 'Відмова — спостережувана неправильна поведінка. Помилка в коді є дефектом, а нерозуміння правила — людською помилкою, що могла його спричинити.' },
    },
  },
  {
    id: 'foundation-middle', region: 'foundations', direction: 'test-design', mode: 'depth', level: 'Middle', correct: 0,
    translations: {
      en: { prompt: 'An input accepts whole numbers from 1 through 100. Which set best probes boundaries?', options: ['0, 1, 2, 99, 100, 101', '10, 20, 50, 80', '1, 50, 100 only'], explanation: 'Probe just below, at, and just above each boundary. Add representative interior values separately if needed; boundary checks do not prove every value works.' },
      uk: { prompt: 'Поле приймає цілі числа від 1 до 100 включно. Який набір краще перевіряє межі?', options: ['0, 1, 2, 99, 100, 101', '10, 20, 50, 80', 'Лише 1, 50, 100'], explanation: 'Перевіряйте значення безпосередньо до, на та після кожної межі. Типові внутрішні значення додавайте окремо; перевірка меж не доводить коректність усіх значень.' },
    },
  },
  {
    id: 'foundation-senior', region: 'foundations', direction: 'testing-theory', mode: 'depth', level: 'Senior', correct: 1,
    translations: {
      en: { prompt: 'Release is today; a critical payment path is untested but 95% of planned cases passed. Best recommendation?', options: ['Use the pass rate and the absence of open critical defects as the release criterion', 'Make the missing risk explicit, test the path or agree a documented risk decision', 'Delay release until every planned case runs, regardless of the risk of each case'], explanation: 'A pass percentage hides which risk is uncovered. A release decision needs exposure, impact, available evidence, and an accountable risk decision.' },
      uk: { prompt: 'Реліз сьогодні; критичний платіжний шлях не перевірено, але 95% запланованих тестів пройшли. Що порадити?', options: ['Використати відсоток проходження й відсутність відкритих критичних дефектів як критерій релізу', 'Показати непокритий ризик, перевірити шлях або погодити задокументоване рішення щодо ризику', 'Відкласти реліз до виконання всіх запланованих тестів незалежно від їхнього ризику'], explanation: 'Відсоток успіху приховує конкретний непокритий ризик. Для релізу потрібні оцінка впливу, докази та відповідальне рішення щодо ризику.' },
    },
  },
  {
    id: 'web-practice', region: 'web-data', direction: 'api-sql-data', mode: 'practice', level: 'Junior', correct: 0,
    translations: {
      en: { prompt: 'An API returns 200 for creating an order. What else would make the check useful?', options: ['Verify response fields and the persisted order state', 'Assume 200 proves the order is stored', 'Repeat the same request ten times'], explanation: 'A status code alone does not establish the contract or side effects. Check the expected response and observable stored state.' },
      uk: { prompt: 'API повернуло 200 під час створення замовлення. Що зробить перевірку кориснішою?', options: ['Перевірити поля відповіді й збережений стан замовлення', 'Вважати, що 200 доводить збереження', 'Повторити той самий запит десять разів'], explanation: 'Сам статус не підтверджує контракту чи побічних ефектів. Перевірте очікувану відповідь і спостережуваний збережений стан.' },
    },
  },
  {
    id: 'web-junior', region: 'web-data', direction: 'web-http-networking', mode: 'depth', level: 'Junior', correct: 1,
    translations: {
      en: { prompt: 'A protected endpoint responds 401 to a request without credentials. What does 401 indicate?', options: ['The user is authenticated but forbidden', 'The request lacks valid authentication credentials', 'The server has crashed'], explanation: 'HTTP 401 indicates the request lacks valid authentication credentials. An authenticated user lacking permission is generally a 403 case.' },
      uk: { prompt: 'Захищений endpoint повертає 401 на запит без облікових даних. Що означає 401?', options: ['Користувача автентифіковано, але доступ заборонено', 'Запит не має чинних даних автентифікації', 'Сервер упав'], explanation: 'HTTP 401 означає відсутні або нечинні дані автентифікації. Для автентифікованого користувача без дозволу зазвичай доречний 403.' },
    },
  },
  {
    id: 'web-middle', region: 'web-data', direction: 'api-sql-data', mode: 'depth', level: 'Middle', correct: 2,
    translations: {
      en: { prompt: 'A retry after a timeout creates two charges. What should you investigate?', options: ['Only the button color', 'Only the network latency', 'Idempotency key handling and whether the first request committed'], explanation: 'The client may not know whether the first request succeeded. Trace both requests and verify the server enforces the intended idempotency behavior.' },
      uk: { prompt: 'Повтор запиту після таймауту створює два списання. Що дослідити?', options: ['Лише колір кнопки', 'Лише затримку мережі', 'Обробку ключа ідемпотентності й те, чи завершився перший запит'], explanation: 'Клієнт може не знати, чи перший запит завершився успішно. Простежте обидва запити й перевірте потрібну поведінку ідемпотентності на сервері.' },
    },
  },
  {
    id: 'web-senior', region: 'web-data', direction: 'api-sql-data', mode: 'depth', level: 'Senior', correct: 0,
    translations: {
      en: { prompt: 'A multi-service order flow intermittently loses inventory reservations. Best first diagnostic plan?', options: ['Trace one correlation ID across services and compare events with database invariants', 'Inspect only the inventory database after the failure and infer which service caused it', 'Increase event retry timeouts and compare the UI success rate'], explanation: 'Correlating requests, events, and persistent state can locate the break. A database snapshot or UI success rate alone cannot show where the reservation was lost.' },
      uk: { prompt: 'У замовленні через кілька сервісів іноді зникає резерв товару. Який перший діагностичний план кращий?', options: ['Простежити один correlation ID між сервісами й порівняти події з інваріантами БД', 'Дивитися лише стан БД після збою й за ним визначити винний сервіс', 'Збільшити таймаути повторних подій і порівняти частку успішних дій у UI'], explanation: 'Зіставлення запитів, подій і збереженого стану допомагає локалізувати збій. Сам знімок БД чи частка успіху в UI не покажуть, де втрачено резерв.' },
    },
  },
  {
    id: 'automation-practice', region: 'automation', direction: 'typescript-playwright-bdd', mode: 'practice', level: 'Junior', correct: 2,
    translations: {
      en: { prompt: 'A browser test clicks the third button on the page. What is a stronger locator?', options: ['A longer CSS selector with nth-child', 'A fixed 5-second wait before clicking', 'A role and accessible name that identify the intended action'], explanation: 'A role and accessible name express user-visible intent. Positional selectors depend on layout and can silently target another control.' },
      uk: { prompt: 'Браузерний тест натискає третю кнопку на сторінці. Який локатор стійкіший?', options: ['Довший CSS-селектор із nth-child', 'Фіксоване очікування 5 секунд перед кліком', 'Роль і доступна назва потрібної дії'], explanation: 'Роль і доступна назва описують видиму користувачу дію. Позиційний селектор залежить від верстки й може непомітно вказати на інший елемент.' },
    },
  },
  {
    id: 'automation-junior', region: 'automation', direction: 'python-coding-whiteboard', mode: 'depth', level: 'Junior', correct: 1,
    translations: {
      en: { prompt: 'A parser receives an empty list. What should its test specify?', options: ['No test is needed for empty input', 'The documented return value or error for empty input', 'Only that the function does not hang'], explanation: 'Empty input is a boundary case. Define the intended contract before asserting either an empty result or an explicit error.' },
      uk: { prompt: 'Парсер отримує порожній список. Що має визначати тест?', options: ['Порожні дані тестувати не треба', 'Документований результат або помилку для порожніх даних', 'Лише те, що функція не зависає'], explanation: 'Порожнє введення — граничний випадок. Спочатку визначте контракт: порожній результат або явна помилка.' },
    },
  },
  {
    id: 'automation-middle', region: 'automation', direction: 'automation-architecture', mode: 'depth', level: 'Middle', correct: 0,
    translations: {
      en: { prompt: 'A UI suite fails only when run in parallel. What should you inspect first?', options: ['Shared test accounts, data, and cleanup isolation', 'Increase every timeout', 'Disable all assertions'], explanation: 'Parallel failures often reveal shared mutable state. Inspect isolation and cleanup, then use traces to confirm the cause before changing timing.' },
      uk: { prompt: 'UI-набір падає лише під час паралельного запуску. Що перевірити спочатку?', options: ['Спільні акаунти, дані та ізоляцію очищення', 'Збільшити всі таймаути', 'Вимкнути всі перевірки'], explanation: 'Паралельні збої часто виявляють спільний змінний стан. Перевірте ізоляцію й очищення, а причину підтвердьте трасуванням перед зміною таймінгів.' },
    },
  },
  {
    id: 'automation-senior', region: 'automation', direction: 'automation-architecture', mode: 'depth', level: 'Senior', correct: 2,
    translations: {
      en: { prompt: 'A slow end-to-end suite blocks feedback on every change. Best redesign?', options: ['Move every end-to-end check to nightly runs, including critical payment checks', 'Increase parallel workers without checking data isolation or resource limits', 'Keep a risk-based fast gate and place broader checks at an appropriate later stage'], explanation: 'Place checks where they provide timely evidence for their risk. Keep critical journeys in a fast gate and measure the residual coverage and feedback time.' },
      uk: { prompt: 'Повільний наскрізний набір затримує зворотний зв’язок на кожну зміну. Що краще зробити?', options: ['Перенести всі наскрізні перевірки на нічний запуск, включно з критичними платіжними', 'Збільшити паралельність без перевірки ізоляції даних і ресурсів', 'Залишити швидкий набір за ризиком, а ширші перевірки перенести на відповідний наступний етап'], explanation: 'Розміщуйте перевірки там, де вони вчасно дають докази щодо ризику. Критичні сценарії лишіть у швидкому наборі; вимірюйте залишкове покриття й час відгуку.' },
    },
  },
  {
    id: 'delivery-practice', region: 'delivery', direction: 'cicd-docker-kubernetes', mode: 'practice', level: 'Junior', correct: 1,
    translations: {
      en: { prompt: 'A CI job fails, but its only message is “exit 1”. What improves diagnosis?', options: ['Hide logs to reduce noise', 'Keep the relevant command, logs, and test artifacts', 'Rerun it silently until green'], explanation: 'A useful CI check must show what failed. Logs and artifacts allow the team to distinguish a product defect, test issue, and infrastructure problem.' },
      uk: { prompt: 'CI-завдання впало, а єдине повідомлення — «exit 1». Що поліпшить діагностику?', options: ['Приховати логи, щоб зменшити шум', 'Зберігати команду, потрібні логи та артефакти тестів', 'Тихо перезапускати до зеленого статусу'], explanation: 'Корисна CI-перевірка має показувати причину збою. Логи й артефакти допомагають відрізнити дефект продукту, проблему тесту та інфраструктури.' },
    },
  },
  {
    id: 'delivery-junior', region: 'delivery', direction: 'cicd-docker-kubernetes', mode: 'depth', level: 'Junior', correct: 0,
    translations: {
      en: { prompt: 'A build succeeds on one laptop but fails in CI. What should you compare?', options: ['Runtime versions, dependencies, environment, and build commands', 'Only the laptop wallpaper', 'Only the commit message'], explanation: 'Reproducibility depends on the same inputs and commands. Compare pinned runtime and package versions, configuration, and required secrets without exposing their values.' },
      uk: { prompt: 'Збірка працює на одному ноутбуці, але падає в CI. Що порівняти?', options: ['Версії середовища, залежності, конфігурацію й команди збірки', 'Лише шпалери ноутбука', 'Лише текст коміту'], explanation: 'Відтворюваність залежить від однакових вхідних даних і команд. Порівняйте зафіксовані версії, конфігурацію й наявність потрібних секретів без розкриття їхніх значень.' },
    },
  },
  {
    id: 'delivery-middle', region: 'delivery', direction: 'system-design-cloud', mode: 'depth', level: 'Middle', correct: 2,
    translations: {
      en: { prompt: 'A service is up but users cannot complete checkout. Which signal is most useful?', options: ['Only process uptime', 'Only CPU usage', 'A checkout success measure plus traces for failed journeys'], explanation: 'Infrastructure health does not prove user outcome. Track the critical journey and use traces or logs to diagnose failures.' },
      uk: { prompt: 'Сервіс працює, але користувачі не можуть завершити покупку. Який сигнал найкорисніший?', options: ['Лише час роботи процесу', 'Лише використання CPU', 'Показник успішного завершення покупки разом із трасуванням невдалих спроб'], explanation: 'Стан інфраструктури не доводить успішності дій користувача. Вимірюйте критичний сценарій і діагностуйте збої за трасами чи логами.' },
    },
  },
  {
    id: 'delivery-senior', region: 'delivery', direction: 'system-design-cloud', mode: 'depth', level: 'Senior', correct: 1,
    translations: {
      en: { prompt: 'A deployment increases checkout errors. What is a sound first response?', options: ['Wait for the trend to settle before checking user impact', 'Compare error and latency signals, mitigate or roll back using agreed criteria, then investigate', 'Immediately roll back on one error without checking baseline or impact'], explanation: 'Use observed user impact and pre-agreed rollback criteria to contain harm. Preserve evidence for root-cause analysis after stabilizing the service.' },
      uk: { prompt: 'Після релізу зросла кількість помилок покупки. Яка перша реакція обґрунтована?', options: ['Почекати стабілізації тренду, не перевіряючи вплив на користувачів', 'Зіставити помилки й затримку, зменшити вплив або відкотити за погодженими критеріями, потім дослідити', 'Одразу відкочувати після однієї помилки без порівняння з базовим рівнем і впливом'], explanation: 'Спирайтеся на спостережуваний вплив на користувачів і погоджені критерії відкату. Після стабілізації збережіть докази для пошуку причини.' },
    },
  },
  {
    id: 'trust-practice', region: 'trust', direction: 'accessibility-testing', mode: 'practice', level: 'Junior', correct: 2,
    translations: {
      en: { prompt: 'An automated accessibility scan reports no issues. What can you conclude?', options: ['The page is fully accessible', 'Keyboard testing is unnecessary', 'The scanned rules found no issues; manual checks remain needed'], explanation: 'Automated rules cover only detectable conditions. Verify keyboard operation, focus order, labels in context, and real task completion manually.' },
      uk: { prompt: 'Автоматичний скан доступності не знайшов помилок. Який висновок правильний?', options: ['Сторінка повністю доступна', 'Перевірка клавіатурою зайва', 'Правила сканера не знайшли помилок; ручні перевірки ще потрібні'], explanation: 'Автоматичні правила охоплюють лише те, що можна виявити машинно. Вручну перевірте клавіатуру, порядок фокуса, назви елементів у контексті й виконання задачі.' },
    },
  },
  {
    id: 'trust-junior', region: 'trust', direction: 'security-devsecops', mode: 'depth', level: 'Junior', correct: 0,
    translations: {
      en: { prompt: 'A user changes an order ID in a URL and sees another customer’s order. Which control is missing?', options: ['Server-side authorization for the requested object', 'A brighter login button', 'A longer client-side validation message'], explanation: 'Authentication alone does not authorize access to every object. The server must check that this user may read the specific order.' },
      uk: { prompt: 'Користувач змінює ID замовлення в URL і бачить чуже замовлення. Якого контролю бракує?', options: ['Серверної перевірки права на конкретний об’єкт', 'Яскравішої кнопки входу', 'Довшого повідомлення клієнтської валідації'], explanation: 'Автентифікація не дає права на кожен об’єкт. Сервер має перевіряти, чи може цей користувач читати саме це замовлення.' },
    },
  },
  {
    id: 'trust-middle', region: 'trust', direction: 'accessibility-testing', mode: 'depth', level: 'Middle', correct: 1,
    translations: {
      en: { prompt: 'A modal looks correct but keyboard focus moves to the page behind it. What should be tested?', options: ['Only its colors', 'Focus placement, keyboard containment when modal, escape, and focus restoration', 'Only the screenshot size'], explanation: 'A modal interaction needs predictable focus and keyboard behavior. Test opening, movement inside, closing, and return to the trigger.' },
      uk: { prompt: 'Модальне вікно виглядає правильно, але фокус клавіатури йде на сторінку позаду. Що перевіряти?', options: ['Лише кольори', 'Початковий фокус, утримання фокуса в модальному вікні, Escape і повернення фокуса', 'Лише розмір скриншота'], explanation: 'Для модального вікна потрібна передбачувана робота фокуса й клавіатури. Перевірте відкриття, рух усередині, закриття та повернення до елемента, що відкрив вікно.' },
    },
  },
  {
    id: 'trust-senior', region: 'trust', direction: 'cybersecurity-handbook', mode: 'depth', level: 'Senior', correct: 2,
    translations: {
      en: { prompt: 'A support tool can read production customer records. How should access tests be designed?', options: ['Use one admin account and test the menu for each role', 'Test the authorization rules in unit tests only, without checking deployed behavior', 'Use role-specific test identities and safe fixtures; verify server decisions and audit events'], explanation: 'Check the actual permission boundary with controlled data. A hidden UI element or isolated unit test alone does not establish deployed authorization; avoid exposing real customer records.' },
      uk: { prompt: 'Інструмент підтримки може читати дані клієнтів у production. Як проєктувати перевірки доступу?', options: ['Використати один адмін-акаунт і перевірити меню для кожної ролі', 'Перевірити правила доступу лише unit-тестами без перевірки розгорнутої поведінки', 'Використати окремі тестові ролі й безпечні дані; перевірити рішення сервера й аудит'], explanation: 'Перевіряйте реальну межу дозволів на контрольованих даних. Приховане меню чи лише unit-тест не доводять коректність розгорнутого доступу; не розкривайте реальні дані клієнтів.' },
    },
  },
  {
    id: 'ai-practice', region: 'ai', direction: 'ai-system-testing', mode: 'practice', level: 'Junior', correct: 1,
    translations: {
      en: { prompt: 'A RAG answer cites a document but states a fact absent from it. What should the check report?', options: ['Pass because a citation exists', 'Unsupported claim; compare each important claim with the cited passage', 'Pass because the answer sounds plausible'], explanation: 'A citation is not grounding by itself. Verify that the cited evidence actually supports the claim, and note missing or conflicting evidence.' },
      uk: { prompt: 'RAG-відповідь цитує документ, але містить факт, якого там немає. Що зафіксувати?', options: ['Успіх, бо є посилання', 'Непідтверджене твердження; звірити кожен важливий факт із цитованим уривком', 'Успіх, бо відповідь звучить правдоподібно'], explanation: 'Саме посилання не доводить обґрунтованості. Перевірте, чи джерело справді підтримує твердження, і зафіксуйте відсутні або суперечливі докази.' },
    },
  },
  {
    id: 'ai-junior', region: 'ai', direction: 'ai-system-testing', mode: 'depth', level: 'Junior', correct: 2,
    translations: {
      en: { prompt: 'Two LLM answers have high semantic similarity to a reference. What does this prove?', options: ['Both answers are factually correct', 'The model is deterministic', 'Only that their wording or meaning is similar by that measure'], explanation: 'Similarity is a useful comparison signal, not a correctness oracle. Check factual claims, task constraints, and evidence separately.' },
      uk: { prompt: 'Дві LLM-відповіді мають високу семантичну схожість з еталоном. Що це доводить?', options: ['Обидві відповіді фактично правильні', 'Модель детермінована', 'Лише схожість формулювання або змісту за цією метрикою'], explanation: 'Схожість — сигнал порівняння, а не оракул правильності. Окремо перевіряйте факти, умови задачі й докази.' },
    },
  },
  {
    id: 'ai-middle', region: 'ai', direction: 'ai-system-testing', mode: 'depth', level: 'Middle', correct: 0,
    translations: {
      en: { prompt: 'An LLM-as-a-judge rates a response highly, but human reviewers disagree. What next?', options: ['Inspect the rubric and disagreement sample, calibrate against labeled cases, and report judge limits', 'Treat the judge as ground truth', 'Delete the disagreement cases'], explanation: 'A judge is another fallible model. Validate it against human-reviewed examples, including difficult cases, before relying on aggregate scores.' },
      uk: { prompt: 'LLM-суддя високо оцінила відповідь, але люди-рецензенти не погодились. Що далі?', options: ['Переглянути рубрику й спірні приклади, відкалібрувати на розмічених випадках і описати межі судді', 'Вважати суддю безпомилковим еталоном', 'Видалити спірні приклади'], explanation: 'Суддя — теж модель, яка помиляється. Порівнюйте її з перевіреними людьми прикладами, зокрема складними, перш ніж покладатися на сумарні оцінки.' },
    },
  },
  {
    id: 'ai-senior', region: 'ai', direction: 'ai-system-testing', mode: 'depth', level: 'Senior', correct: 1,
    translations: {
      en: { prompt: 'An agent calls a tool that writes files. What should the evaluation inspect?', options: ['Check the final answer and a sample of files, but skip tool permissions', 'Authorized tool calls, observable actions, output artifacts, and permission boundaries', 'Require hidden chain-of-thought to prove the agent intended the right outcome'], explanation: 'Evaluate observable behavior and permitted artifacts. The final answer alone can conceal an unsafe side effect; hidden reasoning is neither required nor a reliable test oracle.' },
      uk: { prompt: 'Агент викликає інструмент, що записує файли. Що має перевіряти оцінювання?', options: ['Перевірити фінальну відповідь і вибірку файлів, але пропустити дозволи інструмента', 'Дозволені виклики, спостережувані дії, створені артефакти й межі доступу', 'Вимагати прихований chain-of-thought як доказ правильного наміру агента'], explanation: 'Оцінюйте спостережувану поведінку й дозволені артефакти. Фінальний текст може приховати небажану дію; доступ до прихованих міркувань не потрібен і не є надійним оракулом.' },
    },
  },
]
