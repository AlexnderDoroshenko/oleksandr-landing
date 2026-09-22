---
title: "QualityForge Lab: why a QA engineer needs a testing playground"
date: "2026-09-21"
---

A typical pet project mostly demonstrates finished code. That is not enough for a QA portfolio: it should also show how an engineer reviews requirements, identifies risk, designs coverage, builds quality gates, and communicates evidence. This is the idea behind **QualityForge Lab** — a controlled QA playground where every skill ends with something verifiable.

## More than another shop with Playwright tests

The playground is designed as an order and delivery platform. The domain is familiar enough to understand quickly, yet it provides roles, payments, inventory, state transitions, asynchronous events, and an AI assistant.

The main roles are customer, merchant, courier, support, and admin. An order moves from `CREATED` to `DELIVERED`, but it can also be cancelled, refunded, duplicated by a webhook, or affected by concurrent operations. The catalog adds currencies, promotions, rounding, time zones, and competition for the last item in stock.

This creates realistic work for state-transition testing, boundary-value analysis, decision tables, API and UI automation, SQL, idempotency, retries, and eventual consistency.

## Every skill needs evidence

The central rule is simple: saying “I know JMeter” or “I have done security testing” is not evidence. Every skill should have:

- a concrete challenge;
- an artifact such as code, a report, a dashboard, an ADR, or an RCA;
- acceptance criteria;
- a difficulty level;
- a short reflection on decisions and trade-offs.

Performance testing, for example, should not end with a screenshot of a chart. It should include a workload model, a checkout API test, a diagnosed bottleneck, supporting metrics, and verification after the fix.

## Controlled faults instead of accidental bugs

QualityForge includes a “defect museum”. Faults can be enabled through feature flags: duplicate order events, a slow database query, stale cache data, acceptance of an expired JWT, or personal data written to logs.

That makes it possible to practise the complete investigation loop:

1. Detect the symptom.
2. Collect logs, metrics, and traces.
3. Isolate the cause.
4. Assess impact and priority.
5. Verify the fix.
6. Record the RCA and regression coverage.

Troubleshooting becomes a repeatable engineering exercise rather than a lucky discovery.

## From a basic API to AI and security

The MVP deliberately starts small: authentication, catalog, an order state machine, PostgreSQL, a REST API, a simple web UI, Docker Compose, API/UI tests, logs, and several controlled faults.

Later phases add asynchronous messaging, observability, performance, and security testing. An AI/RAG assistant introduces another class of risks: prompt injection, access to another user’s order, stale documents, incorrect refusals, and PII leakage. Those scenarios require datasets and measurable signals such as retrieval relevance, faithfulness, refusal correctness, latency, and cost per request.

## The intended outcome

QualityForge Lab is a portfolio, an interview training environment, and a place for engineering experiments. Its value is not the number of automated tests. The value is traceability between a risk, a decision, and the evidence that the decision works.

The next practical step is a Skill Coverage Map: `skill → challenge → tool → artifact → acceptance criteria`. That map turns a long technology checklist into a coherent backlog for growing as a quality engineer.
