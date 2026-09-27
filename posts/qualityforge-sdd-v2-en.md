---
title: "QualityForge Lab #7: SDD v2 — Orchestrator, Builder, and Reviewer"
date: "2026-09-27"
summary: "How risk-based SDD v2 separated Orchestrator, Builder, and Reviewer, bounded correction cycles, and enabled honest validation reuse."
---

SDD v2 was not meant to automate the human out of development. Its smaller goal was to preserve human authority for decisions while removing manual control of every process transition.

## Three roles

The **Orchestrator** reads the canonical task, determines risk, scope, approvals, and required checks, maintains one task record, and decides which results may be reused.

The **Builder** implements frozen requirements, runs focused validation, and corrects in-scope defects. A failed test does not automatically become a question for a human.

The **Reviewer** works in a separate context. It receives the contract, source identity, and raw evidence, but not the Builder’s private reasoning or a prepared verdict.

These are logical roles, not three new services. They initially ran through checked-in instructions because native OpenCode dispatch was unavailable in the active shell.

## Risk selects the route

V2 uses three categories:

- LOW for documentation, focused tests, and isolated code;
- MEDIUM for API, ordinary database/integration, and bounded CI changes;
- HIGH for security, authorization, destructive lifecycle, concurrency, and architecture.

Their correction budgets are up to one, two, and three cycles. A budget never authorizes acceptance of a defect. It identifies when repeated corrections require human direction.

## When the agent stops

A human gate is required for changed requirement meaning, expanded scope, unresolved product/security/architecture decisions, dangerous external actions, an exhausted correction budget, and merge or release approval.

The agent should not stop for every failed test, Minor finding, or local correction when the frozen contract already supplies the answer. Otherwise, the human becomes a Continue button rather than a decision owner.

## Evidence as shared state

One task record stores the base, candidate identity, risk, counters, findings, validation, reuse, and limitations. No orchestration database is needed.

Each check is labelled as executed or reused. Known inputs and environment prevent expensive validation from being repeated without cause. Unknown timing or model configuration is recorded as `unknown`, not inferred as zero.

## CI after a normal commit

V2 also removed the default amend loop. The normal route is:

```text
local candidate -> human approval -> commit -> push -> existing CI -> PR
```

A task can remain `CI_PENDING` before its hosted run exists. Merge readiness still requires current checks. This model acknowledges when hosted evidence actually becomes available.

## Still only a hypothesis

SDD v2 was a design response to Feature 001, not a victory by definition. Evaluation required real tasks with recorded cycles, interventions, findings, and validation reuse.

The first datapoints were `AUTH-T01–T04`. All were HIGH-risk, making them useful examples of where human intervention is necessary and where an agent can continue independently.

The next story is about **security tasks and decisions an agent must not invent**.
