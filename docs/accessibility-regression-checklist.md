# Accessibility regression checklist (manual)

Record tester, date, browser/OS, viewport/zoom, route, language, result, and screenshot/recording path for every run. Test EN and UA; do not infer one from the other.

1. Keyboard only: from the browser chrome, Tab through header, language selector, resume trigger, role select, EN/UA buttons and download link; use Enter/Space/arrow keys as appropriate. Verify order, visible focus, no trap, and return path to Home. Repeat on an inner page and at 320px.
2. Navigation: check all primary destinations at desktop and 320px; verify their labels, language query and focus order. Confirm a visible way to bypass repeated navigation, whether via skip link or equivalent mechanism.
3. Language: switch EN→UA→EN on home, a post, a knowledge page and the resume picker. Check document `lang`, translated title/H1/control names, current-route preservation and focused-element behaviour.
4. Resume: open/close via keyboard; select each of 3 roles and both PDF languages; confirm link name states the variant, URL points to the expected file, download succeeds, and panel neither clips nor traps focus at 320px and 200% zoom.
5. VoiceOver on macOS/Safari: start a fresh recording, navigate by headings/landmarks, list links and controls, operate language and resume picker, inspect one long code block and one blog post. Save actual evidence. **Not performed in Phase 1.**
6. Visual: at 200% text zoom and 320 CSS pixels, inspect home, blog, knowledge, contact, 404 and long content for clipping/horizontal page scroll; independently check code-block horizontal scrolling, target size, focus indicators and contrast in all states.
7. Motion/media: enable Reduce Motion, verify no forced smooth movement; inspect any embedded image alt, video captions/controls and PDF fallback links actually present in content.
8. Findings: rerun the 70-state axe matrix, compare rule/impact/node counts with baseline, then inspect every `incomplete` result. Run Lighthouse as secondary evidence only. Record regressions and narrow, reviewed exceptions with owner, reason and expiry.
