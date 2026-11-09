# Accessibility audit — baseline before fixes

Date: 2026-11-09. Target: WCAG 2.2 Level AA. Scope: the current `origin/main` at `d6a1bb6390a2d07be9049e15359496c3aa1737bb` of `github.com/AlexnderDoroshenko/oleksandr-landing`. This is an audit, not a conformance claim. No production code or visual styles were changed.

The sections below preserve the read-only baseline. The approved implementation was added afterward on `codex/accessibility-wcag22`; see the post-fix section at the end. “Status: open” in each baseline finding describes the **pre-fix** state.

## Repository and coverage

- Next.js 16.3.8 (Pages Router), React 19, TypeScript, npm lockfile; static export to `out/`. GitHub Pages deployment builds with `GITHUB_PAGES=true`; Cloudflare asset configuration is also present. `npm run build`, `npm test -- --runInBand`, and `npx tsc --noEmit` are the existing relevant commands; there is no format or lint script.
- Inspected `pages/` (home, about, contact, blog index/10 posts, knowledge index/14 directions and 5 AI sections, 404 export), `components/`, `hooks/useLanguage.ts`, `styles/globals.css`, English/Ukrainian content patterns, `public/resumes/`, tests, both workflows, `next.config.js`, and `wrangler.jsonc`.
- No form or custom dialog was found. The resume picker uses native `<details>`, `<select>`, buttons and a download link. Blog content can include images, PDF embeds and video through `BlockRenderer`; actual media instances and captions need content-by-content review.
- Automated baseline: 35 exported routes × EN/UA = 70 browser states, all loaded. axe-core 4.14.0 found 70 `html-has-lang` nodes, 68 `label-content-name-mismatch` nodes, and 2 `scrollable-region-focusable` nodes. These are occurrences, not 140 distinct defects. Lighthouse 13.6.0 accessibility score on the home page: 0.95 EN, 0.95 UA. A score is not proof of WCAG conformance.
- 320 CSS-pixel home page had `document.scrollWidth = 320`; the screenshot shows no horizontal page overflow. It also had **zero visible navigation links**. Other routes, zoom levels, browsers and assistive technologies still require manual checks.

Severity summary: **2 high** (A11Y-001/002), **4 medium** (A11Y-003/004/005/007; A11Y-005 needs manual WCAG confirmation), **1 low/medium** (A11Y-006), and **1 low** (A11Y-008). The automated findings are A11Y-001/003/004; A11Y-002/005/006/007/008 come from code, browser interaction or contrast review. These categories should not be summed as independent affected pages.

## Findings

### A11Y-001 — Document language absent

- WCAG: [3.1.1 Language of Page (A)](https://www.w3.org/TR/WCAG22/#language-of-page). Severity: high. Affected: screen-reader and pronunciation users; all routes, both languages, including 404.
- Reproduce: open any route with `?lang=en` or `?lang=uk`, inspect `<html lang>` and switch language. Actual: `lang` is empty both before and after the content changes; axe reports `html-has-lang` in all 70 states. Expected: a valid primary language that tracks the rendered content (`en` or `uk`).
- Remediation: set a valid initial language in the document shell and update `document.documentElement.lang` when the UI language changes. Account for static-export first paint and localStorage/query priority; avoid announcing Ukrainian content as English on hydration.
- Detection: automated axe and browser DOM check. Status: open. Evidence: `axe-baseline.json` and `interactions.json` in the evidence directory below.

### A11Y-002 — Navigation disappears on narrow viewports

- WCAG: [2.4.5 Multiple Ways (AA)](https://www.w3.org/TR/WCAG22/#multiple-ways); verify full impact manually against [2.1.1 Keyboard (A)](https://www.w3.org/TR/WCAG22/#keyboard). Severity: high. Affected: mobile, low-vision/zoom and keyboard users; shared header on all ordinary routes.
- Reproduce: set viewport to 320 CSS pixels; inspect or Tab through the header. Actual: `.desktop-nav` is `display:none` below 900px, with no replacement menu or equivalent site-level navigation. Browser check found zero visible `nav a` on mobile home. The logo and language selector remain, but pages such as About and Contact are not offered through the header.
- Expected: a discoverable, keyboard/screen-reader-usable way to reach the primary destinations at narrow widths. Remediation: expose a compact native navigation (for example a `<details>` menu) with visible focus and preserved language query. Do not rely only on direct URLs.
- Detection: manual code/viewport inspection, Playwright focus sequence. Status: open. Evidence: `axe-baseline.json` mobile/focus fields and `home-uk-320.png`.

### A11Y-003 — Logo name excludes visible text

- WCAG: [2.5.3 Label in Name (A)](https://www.w3.org/TR/WCAG22/#label-in-name). Severity: medium. Affected: speech-input users; `.monogram` in shared and home headers, 68 normal route/language states.
- Reproduce: inspect the accessible name of the visible `OD.` link. Actual: `aria-label` is `Home`/`Головна` on inner pages or the person's name on home, without `OD`; axe reports `label-content-name-mismatch`. Expected: accessible name starts with or contains the visible `OD.` label and explains destination.
- Remediation: use a localized accessible name such as `OD — Home` / `OD — Головна`, retaining visible text in the name.
- Detection: automated axe. Status: open. Evidence: `axe-baseline.json`.

### A11Y-004 — Scrollable code block cannot receive keyboard focus

- WCAG: [2.1.1 Keyboard (A)](https://www.w3.org/TR/WCAG22/#keyboard). Severity: medium. Affected: keyboard users on `/blog/qualityforge-local-llm-sdd/`, EN and UA.
- Reproduce: navigate to the long code sample, reduce viewport width, and attempt to scroll it horizontally by keyboard. Actual: `.article-body pre` uses `overflow:auto` but the rendered `pre:nth-child(23)` has no focusable descendant or `tabindex`; axe reports `scrollable-region-focusable` twice. Expected: keyboard access to all code content.
- Remediation: make only genuinely scrollable code regions focusable with an appropriate accessible label or use a semantic code rendering pattern that permits keyboard scrolling; verify at 320px and 200% zoom.
- Detection: automated axe, then manual keyboard confirmation. Status: open. Evidence: `axe-baseline.json`.

### A11Y-005 — Resume download link does not identify the selected variant

- WCAG: review against [2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/TR/WCAG22/#link-purpose-in-context). Severity: medium, manual-review finding rather than confirmed WCAG failure. Affected: screen-reader links-list users; home resume picker in both languages.
- Reproduce: open the picker, choose QA Automation Lead and UA, inspect the download link's accessible name. Actual: only `Download PDF` / `Завантажити PDF` is announced; the href changes correctly to the selected PDF, but role and language are not in the link name. Expected: the link itself makes the selected variant clear, while preserving its visible words.
- Remediation: append the selected role and language to the visible or programmatic link name; announce changes if necessary. Browser verified the selected UA PDF returns HTTP 200.
- Detection: Playwright interaction and manual screen-reader links-list check. Status: open. Evidence: `interactions.json`, `resume-uk-320-open.png`.

### A11Y-006 — Ukrainian language picker has an English-only accessible name

- WCAG: review against [3.1.2 Language of Parts (AA)](https://www.w3.org/TR/WCAG22/#language-of-parts) once page language is set. Severity: low/medium. Affected: Ukrainian screen-reader users; `LanguageSelector` on all normal routes.
- Reproduce: switch to UA and inspect the select's accessible name. Actual: `aria-label="Select language"` remains English. Expected: localized name (`Мова сайту` or equivalent) or explicit language metadata where appropriate.
- Remediation: pass a translated label from the UI language; preserve native `<select>`. Detection: code and browser inspection. Status: open. Evidence: `interactions.json` and `components/LanguageSelector.tsx`.

### A11Y-007 — Resume focus outline has insufficient adjacent contrast

- WCAG: [1.4.11 Non-text Contrast (AA)](https://www.w3.org/TR/WCAG22/#non-text-contrast), alongside [2.4.7 Focus Visible (AA)](https://www.w3.org/TR/WCAG22/#focus-visible). Severity: medium. Affected: low-vision keyboard users; focusable resume controls.
- Reproduce: focus controls in the open resume panel. Actual CSS sets a 3px `#88ad00` outline; calculated contrast is **2.62:1** on white panel and **2.44:1** on `#f5f7f8` paper, below the 3:1 adjacent-color threshold. Focus remains visible, so do not claim 2.4.7 fails solely from this calculation. Other focus treatments and backgrounds still need visual review.
- Expected: a focus indicator distinguishable from adjacent colors at 3:1 or better. Remediation: use a darker outline token or a two-color indicator while preserving the design.
- Detection: CSS/contrast calculation; visual confirmation pending. Status: open. Evidence: `styles/globals.css` and contrast calculation recorded in the audit session.

### A11Y-008 — Default 404 has no site landmark/navigation

- WCAG: usability/consistency observation; no automatic WCAG failure asserted. Severity: low. Affected: users who reach `/404/`.
- Reproduce: open exported 404. Actual: one H1 but zero `main` and `nav` landmarks and no site header. Expected: a consistent recovery route to Home and meaningful landmarks.
- Remediation: add a localized custom 404 with a Home link after approval. Detection: browser DOM check. Status: open. Evidence: `axe-baseline.json`.

## Passed or not applicable in this baseline

- All 70 rendered states loaded with one H1; the 68 ordinary states had one `main`. Titles were present in the inspected routes.
- Native resume controls are keyboard focusable; role/language changes update a real PDF URL. At 320px, the open panel fits horizontally (`x=20`, width `280`) and the chosen UA PDF returned 200. A keyboard-focused language select remained focused after switching language in the browser check.
- `prefers-reduced-motion` disables smooth scrolling and the project-row transition. No flashing content or custom dialog was found. No form is present, so form-error criteria are not applicable to the current UI.
- Axe marked some color-contrast instances **incomplete**; they are not passes. Image alt quality, video captions, focus visibility across all backgrounds, 200% zoom, and actual VoiceOver behaviour remain manual checks.

## Reproduction and evidence

Run `npm ci`, then `npm run build`, serve `out/` on localhost, and scan each exported route under both `?lang=en` and `?lang=uk`. The temporary audit used Playwright 1.62.1, axe-core 4.14.0 and Lighthouse 13.6.0. Commands used included `git ls-remote`, `git fetch origin main`, `git worktree add --detach`, `npm ci`, `npm run build`, the temporary Playwright/axe scripts, and two Lighthouse runs. No VoiceOver session was executed or recorded.

Evidence in this local session (temporary, copy into durable CI artifacts after Phase 2 approval):

- `/private/tmp/oleksandr-a11y-evidence/axe-baseline.json` — all 70 states, rule/impact/target/help URL, headings/landmarks, mobile/focus sample.
- `/private/tmp/oleksandr-a11y-evidence/lighthouse-home-en.json` and `lighthouse-home-uk.json` — home-page accessibility baselines.
- `/private/tmp/oleksandr-a11y-evidence/home-uk-320.png` and `resume-uk-320-open.png` — mobile screenshots.
- `/private/tmp/oleksandr-a11y-evidence/interactions.json` — language switching, resume selector, selected URL and PDF response.

## Proposed order and scope after approval

1. Fix document language and mobile navigation; add explicit focus/reflow checks.
2. Fix logo names, scrollable code, resume variant name, Ukrainian control label and focus-outline contrast.
3. Add a localized 404 and optional skip link if manual keyboard/assistive-tech testing supports it.
4. Add browser-based axe regression coverage to the existing quality gate, then run manual VoiceOver/zoom/reflow checks and compare with this baseline.

Likely changed files: `pages/_document.tsx` (new), `hooks/useLanguage.ts`, `components/SiteHeader.tsx`, `components/LanguageSelector.tsx`, `components/ResumeDownload.tsx`, `components/BlockRenderer.tsx` or blog code rendering, `pages/index.tsx`, `pages/404.tsx` (new), `styles/globals.css`, accessibility tests and `.github/workflows/quality-gate.yml`. Keep EN/UA synchronized. Do not add an accessibility statement without approval of its wording.

Risks/ambiguities: a static export has one prerendered initial language while `?lang=` and localStorage select client-side content; the initial HTML language/hydration strategy needs careful design. The exact WCAG 2.4.5 impact of missing mobile navigation and 2.4.4 impact of the generic resume link require human judgment, although both are usability defects against the requested scope. Contrast calculations should be visually checked on every adjacent background. Browser automation here used Chromium, not Safari/VoiceOver. The 404 route is a framework default rather than a localized page. No legal/compliance or perfect-accessibility claim is supported by this baseline.

## Post-fix verification (2026-11-09)

| Finding | Implementation status | Evidence |
| --- | --- | --- |
| A11Y-001 | Fixed in code: static English `html lang`, client update on EN/UA switch | All 148 Playwright checks passed; both languages checked on every route |
| A11Y-002 | Fixed in code: localized native mobile disclosure navigation | 320px keyboard/menu test; all routes scanned at mobile viewport |
| A11Y-003 | Fixed in code: visible `OD.` included in accessible name | No axe `label-content-name-mismatch` findings in final matrix |
| A11Y-004 | Fixed in code: long legacy code wraps instead of requiring keyboard-inaccessible horizontal scrolling | No axe `scrollable-region-focusable` findings in final matrix |
| A11Y-005 | Fixed in code: resume link name includes selected role and PDF language | EN/UA resume interaction tests and successful PDF request |
| A11Y-006 | Fixed in code: language-picker name localized | EN/UA interaction tests |
| A11Y-007 | Fixed in code: dark focus outline plus light outer ring | CSS contrast reviewed; visual assistive-technology check still pending |
| A11Y-008 | Fixed in code: localized custom 404 with header, main and Home route | 404 included in both-language browser matrix |

The new accessibility-testing knowledge direction contains 3 topics and 9 bilingual Junior/Middle/Senior materials with direct W3C/WAI and Playwright references. The final static export has 36 routes. `npm test -- --runInBand` passed 32 tests, `npx tsc --noEmit` passed, the production build passed, and the complete 148-test Playwright/axe desktop+320px matrix passed. Home-page Lighthouse accessibility scores changed from **0.95 → 1.00** for EN and **0.95 → 1.00** for UA; the final JSON reports no failed table audits. Final reports are `/private/tmp/oleksandr-a11y-evidence/lighthouse-final-home-en.json`, `lighthouse-final-home-uk.json`, and the ignored local `test-results/accessibility-results.json`.

The home portrait now uses an empty alt because its adjacent visible caption already identifies the person; this avoids repeating the same name to screen-reader users. This change should still receive a human content review.

Remaining verification: a real VoiceOver/Safari session; image alt and media content judgments; 200% text zoom and focus/reflow on additional browsers; review of all axe `incomplete` results; and a CI run on Ubuntu after integration. The static export initially serves English HTML and hydrates Ukrainian from query/localStorage, so a short initial-language transition can occur; this is a known architectural limitation, not evidence of full WCAG conformance. No accessibility statement was added because its wording still needs human approval.
