---
title: "QualityForge Lab #4: Green tests, broken contract"
date: "2026-09-27"
summary: "How PLAT-T05 and PLAT-T06 passed automated checks while independent review still found contract violations."
series: "qualityforge"
seriesOrder: 4
---

Automated checks were mandatory in our first SDD workflow, but they were not the final gate. Feature 001 quickly explained why: a test can be green while proving a different contract from the one we think it proves.

## PLAT-T05: the redirect that became Connected

The UI reported backend state through a same-origin connectivity endpoint. The expected rule was simple: canonical success meant `Connected`; unavailable or not-ready meant something else.

The defect hid inside default `fetch` behaviour. Redirects were followed automatically. A `302` response could lead to a final `200`, and the UI would show `Connected`.

Tests were green because they did not model that path. The code passed its assertions while violating the acceptance contract: the connectivity layer was not allowed to accept a redirect as canonical backend success.

Independent review found the gap between the requirement and the test design. The correction was narrow: `redirect: "manual"`, a negative case, and bounded lifecycle fixes. The reviewer’s value was not rerunning the same tests. It was asking: **which dangerous behaviour do these tests not describe at all?**

## PLAT-T06: three Major findings after green checks

The composed runtime passed automated checks, yet acceptance review found three integration problems.

First, bootstrap had local timeouts but no genuine overall deadline. One blocking step could consume the entire budget.

Second, cleanup trusted fixed Compose names. Another checkout could observe the same resource names, so a destructive operation needed proof of ownership, not merely the expected name.

Third, a custom `.env` parser did not fully match Docker Compose semantics. Quotes, comments, escaping, and interpolation could make validation inspect one value while Compose used another.

The corrections matched those boundaries: a monotonic overall deadline, ownership labels derived from the canonical checkout path, and Compose itself as the source of truth for `.env` parsing.

## What the tests actually proved

These examples do not make automation useless. The tests captured known expectations precisely and protected the corrections from regression.

The mistake is expanding `PASS` into “the contract is satisfied.” A test proves only that this check ran, on these inputs and in this environment, and that its assertions observed no violation.

Acceptance review operates one level higher. It asks whether the assertions are appropriate, whether failure modes are covered, and whether the evidence supports the claimed conclusion.

## Independence is not ceremony

The Reviewer received the canonical contract, source identity, and check results, but not a ready-made verdict from the Builder. The task was to challenge the acceptance claim, not to confirm the author’s confidence.

That worked in our case. It also cost review cycles, repeated validation, and additional human gates. As evidence requirements grew, process ordering began to collide with real CI and platform testing.

The tests were green. The contract was not. Corrections brought them back together, but raised a harder question: **how much process should it take to prove that?**

The next post is about **when SDD became bureaucracy**.
