---
title: "QualityForge Lab #9: zero human interventions — what actually happened in AUTH-T03"
date: "2026-09-27"
summary: "What zero human interventions really meant in HIGH-risk AUTH-T03, and why that is not the same as full autonomy."
series: "qualityforge"
seriesOrder: 9
---

The `AUTH-T03` task record contains an attractive number: **Human interventions — 0**. It would make an excellent headline about an autonomous agent and an equally poor description of what happened.

## What T03 implemented

The task added a centralized tenant-first authorization evaluator and reusable request adapter for already approved policy cases. It reused identity rules from T01 and access-token verification from T02.

Scope was narrow: no new product endpoint, role mutation, audit, rate limiting, or identity decision. Risk was still HIGH because a defect could violate tenant isolation.

## Why no human decision was needed

The canonical contract already answered the material questions. Tenant and current account status were checked before grants. Role claims in a token were not treated as current authorization truth. Subject lookup stayed tenant-scoped. Own-profile meant the same subject ID.

The Builder therefore had no reason to request a new policy decision. It implemented decisions that had already been accepted.

Zero interventions did not mean zero human authority. A human had approved the earlier T01 and T02 contracts and separately gave final approval for T03. The metric counted decisions during execution before the final gate; it did not remove the human from the workflow.

## Corrections still happened

The Builder made three passes and consumed two of the three HIGH-risk correction cycles.

Both problems were in test fixtures. One created a JWT from an expired detached ORM instance. The other tried to clear a SQLAlchemy instrumented set in a way that did not model the intended role change.

These were failed focused checks, not product decisions. The Builder corrected the fixtures, reran affected tests, and did not interrupt the human to ask permission to continue.

The final affected run passed 85 tests. Full component regression passed 168 after a retry with loopback permission; the first attempt had two environment setup errors, not product failures. An independent Reviewer separately ran 25 focused tests and returned PASS with no findings.

## What the number proves

It proves only that **for this task**, previously accepted contracts were sufficient to complete implementation and corrections without a new material decision.

It does not prove that every HIGH-risk task can run autonomously. T01, T02, and T04 needed human decisions. It also does not prove time savings: elapsed time for T03 is recorded as unknown.

T03’s value is not the magical zero. It is that the workflow distinguished a test-fixture defect from product ambiguity. The first returned to the Builder; the second would have returned to the human.

The next post places `AUTH-T01–T04` in one table without pretending that four different HIGH-risk tasks form a controlled A/B test.
