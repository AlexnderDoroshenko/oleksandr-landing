---
title: "QualityForge Lab #5: when SDD became bureaucracy"
date: "2026-09-27"
summary: "How hosted CI, portability evidence, and repeated reviews turned useful SDD v1 controls into substantial process overhead."
series: "qualityforge"
seriesOrder: 5
---

The strict workflow gave Feature 001 control and traceability. Then those same rules began to obstruct the evidence they were designed to protect.

`PLAT-T07` and `PLAT-T09` show this best.

## The hosted-CI deadlock

Our order was acceptance, human approval, atomic commit. Hosted CI, however, needs a commit and push before it can produce a final SHA, GitHub Actions run, and job logs. Without hosted evidence, CI-task acceptance was incomplete.

We had created a loop:

```text
acceptance needs hosted evidence
hosted evidence needs commit
commit needs acceptance
```

For `PLAT-T07`, we used a controlled provisional commit, push, hosted run, acceptance, and amend. Human authority remained intact, but history became more complicated because of a rule intended to keep it clean.

This was not a CI defect. The process model incorrectly assumed that all evidence existed before a commit, while some evidence can only be created after it.

## Portability without an end

`PLAT-T09` was meant to verify platform portability. “Works on macOS and Linux” expanded into architecture, Docker-backend locality, resource limits, image identity, filesystem details, timing qualification, and cleanup safety.

We clarified the contract: mandatory macOS Apple Silicon/arm64 and Ubuntu 24.04/amd64, with Windows/WSL2 optional. Functional portability was separated from the performance claim. A two-CPU GitHub runner could prove Linux functionality but could not honestly represent a baseline requiring four CPUs and 8 GB of Docker memory.

An overly strict preflight blocked the first hosted Linux run before Docker mutation. After correction, a separate run passed portability. The caution was valid, but the acceptance contract had grown until testing the test harness competed with testing the product.

## Full review after every comma

A finding could be Major because it blocked acceptance, while its correction touched only an evidence field or documentation link.

V1 did not always separate finding importance from the amount of work that needed repeating. A narrow correction could trigger full review or expensive platform validation even when runtime inputs had not changed.

Reviewer checklists also became a chain of small interruptions. Humans were approving not only product and security decisions but routine transitions among Builder, Reviewer, and correction work.

## Evidence was not the problem

The lesson was not that documentation or platform evidence was unnecessary. Without it, we could not distinguish an actual Linux pass from an assumption, or an unavailable exact version from failed validation.

The issue was that the workflow applied controls too mechanically, with too little regard for risk, cost, and blast radius.

Feature 001 gave us visibility at the cost of heavy manual dispatch. The next process needed to answer what should be rerun after a correction and what could be reused honestly.

The answer became a simple rule: **finding severity does not equal correction blast radius**.
