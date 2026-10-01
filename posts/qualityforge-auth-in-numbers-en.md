---
title: "QualityForge Lab #10: AUTH-T01–T04 in numbers"
date: "2026-09-27"
summary: "The first four HIGH-risk SDD v2 tasks in numbers: passes, corrections, human interventions, findings, and honest comparison limits."
series: "qualityforge"
seriesOrder: 10
---

After four HIGH-risk identity tasks, we had our first small collection of process records. It does not prove that SDD v2 is faster or cheaper, but it lets us discuss more than impressions.

| Task | Human interventions | Builder passes | Reviewer passes | Corrections | Final verdict |
|---|---:|---:|---:|---:|---|
| AUTH-T01 | 1 | 3 | 3 | 2 / 3 | PASS |
| AUTH-T02 | 1 | 4 | 2 | 3 / 3 | PASS |
| AUTH-T03 | 0 | 3 | 1 | 2 / 3 | PASS |
| AUTH-T04 | 1 | 4 | 2 | 2 / 3 | PASS |

Human interventions here mean actual decision or approval responses before the final gate. Routine commentary is excluded. Every task still had a separate final approval.

## T01: review found two Major issues

The identity foundation completed after two focused corrections. Independent review found an email-normalization bypass through Core inserts and Unicode variants, plus missing reusable negative policy cases.

Focused identity checks were repeated while unchanged platform evidence was reused. Target PostgreSQL execution remained a disclosed limitation because the local Docker daemon was stopped.

## T02: the whole budget was used

The authentication lifecycle consumed all three correction cycles. Builder and Orchestrator found migration-fixture, route-inventory, Unicode-refresh, and database-error-sanitization problems. Reviewer added an RFC 9457 Problem Details mismatch and metadata/documentation findings.

The final affected run passed 60 tests, the component run passed 140, and the reviewer delta passed 10. It had the largest correction count of the four tasks, but elapsed time remained unknown.

## T03: zero decisions, not zero work

Authorization reused accepted contracts, so no human intervention was required. Two fixture corrections still produced three Builder passes. Reviewer returned PASS with no findings.

This is a useful distinction between autonomy and absence of work.

## T04: a correct BLOCKED_DECISION

Administrative provisioning stopped on initial-password and first-Admin-bootstrap policy. After one consolidated human decision, the task completed with two correction cycles and independent PASS.

The final component run passed 193 tests. Target PostgreSQL competing-bootstrap behaviour remained before-release evidence, not a hidden success.

## What can be compared

We can say that all four tasks completed with PASS inside the HIGH-risk budget. We can observe whether findings came from Builder, Reviewer, or environment. We can distinguish executed validation from reused evidence.

We cannot calculate a credible speedup over SDD v1 because Feature 001 lacks a compatible complete task-level dataset. We also cannot infer causality from four different tasks without a control group.

This is a baseline, not a victory chart.

The next experiment is prepared: test whether the same workflow works as a genuine reusable Codex Skill. Native discovery and a read-only routing smoke already have evidence, but `AUTH-T05` must supply the first real post-skill datapoint. Any claim about the Skill’s benefit before that would be premature.
