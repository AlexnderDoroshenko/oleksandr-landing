# Accessibility automation — baseline and implemented gate

At the read-only baseline there was no accessibility browser test or accessibility CI gate. Existing Jest tests covered components/data and PDF filename presence, not rendered routes, keyboard journeys, contrast or screen-reader behaviour. The approved implementation now adds `e2e/accessibility.spec.ts`, `playwright.config.ts`, and an accessibility job to the existing quality workflow without removing its other gates.

## Temporary Phase 1 baseline

The audit built the production static export, served `out/` locally, and used Playwright 1.62.1 plus axe-core 4.14.0 to inspect 35 exported routes in both languages (70 states, including 404). Each scan waited for the page, recorded HTTP status, title, document language, H1 and landmarks, then ran axe WCAG A/AA tags. A separate mobile interaction checked the language selector, resume role/language, selected PDF response and 320px layout. Lighthouse 13.6.0 scanned the EN/UA home page only. Source scripts and outputs were temporary under `/private/tmp/`; no test dependency, workflow or production file was changed in Phase 1.

The full JSON evidence paths and measured baseline are in `docs/accessibility-audit.md`. Automated output is diagnostic, not a conformance certificate; `incomplete` items and assistive-technology behaviour require manual review.

## Approved Phase 2 acceptance criteria

- Add Playwright and `@axe-core/playwright` as **devDependencies** because the current Jest/jsdom setup cannot reliably validate CSS layout, focus or rendered route states. Pin versions in the lockfile and use a production static export served on localhost.
- Enumerate all public exported paths (including blog/knowledge variants and 404), then test both `?lang=en` and `?lang=uk` at desktop and a critical narrow viewport. Assert a non-error response, expected H1/title and intended route before axe, so an error page cannot masquerade as a clean scan.
- Test language switching, header/mobile navigation, keyboard operation of native controls, and all 3×2 resume links. Assert actual file availability and document `lang` after state changes. Do not automate claims about VoiceOver speech.
- On failure, print rule ID, impact, target, failure summary and help URL. Save JSON, screenshots and trace on failure; upload artifacts with retention. Maintain a reviewed, exact rule+route+node exception record only if needed, with owner, reason and expiry; no blanket rule or directory exclusions.
- Add a CI job dependent on the existing build or reproduce `npm ci`/`GITHUB_PAGES=true npm run build`; serve the real `out/`, wait for HTTP readiness, run browser/axe tests, upload artifacts, and fail on approved blocking severity. Keep current quality/security jobs unchanged. Run Lighthouse as a separately reported trend, not a pass/fail WCAG proxy.

## Implemented Phase 2

Run `npm ci`, `npx playwright install chromium`, `npm run build`, then `npm run test:a11y`. The browser suite enumerates the exported routes, checks both languages at 1280px and 320px, asserts status/H1/main/header/lang before axe, and fails on any automatically detected WCAG A/AA violation (no exclusions). It also checks skip navigation, mobile navigation, focus preservation, resume variant naming and a live PDF response. The JSON reporter and failure screenshots/traces are under ignored `test-results/`.

The CI accessibility job installs Chromium, builds the production static export, starts a local server with readiness polling, runs the browser suite, captures EN/UA Lighthouse trend JSON, and uploads evidence. The separate existing GitHub Pages build still covers `GITHUB_PAGES=true`; the browser job uses the same production export mode without the deployment prefix so localhost routes resolve directly. A CI run is still required after integration. Automated tests do not replace VoiceOver/Safari or human judgments about alternative text, media and usability.
