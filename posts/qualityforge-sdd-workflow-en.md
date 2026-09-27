---
title: "QualityForge Lab #2: from specification to acceptance — our first SDD workflow"
date: "2026-09-27"
---

In the [first post](/blog/qualityforge-qa-polygon), I described QualityForge as a playground where every engineering skill should leave verifiable evidence. The next question was much more practical: how do we build the playground with an LLM without turning development into a stream of convincing but unverified chat responses?

Our first experiment was **Feature 001: Reproducible Platform Baseline**. Its task sounded modest: create a reproducible local baseline with a backend, web UI, PostgreSQL, and Redis. But this was precisely where we decided to test a deliberately strict SDD workflow — a process in which implementation starts from an approved specification and its acceptance criteria.

## A hypothesis, not a religion

Our initial hypothesis was:

> A precise specification, automated tests, independent review, and explicit human decision authority should make LLM-assisted development more controllable and observable.

The key word is **should**. We did not yet know whether this process would be faster, cheaper, or more convenient. We certainly were not trying to prove that there is one “correct” way to do SDD.

We needed an experimental baseline strict enough to keep process failures from disappearing inside informal agreements. If we relaxed the rules later, we wanted to understand what we had removed and which risk we had reintroduced.

## The contract comes first

The canonical source of truth for Feature 001 was not the chat or the agent’s latest answer. It was `specs/001-platform/spec.md`. The specification introduced stable requirement IDs: `PLAT-FR-001` for environment startup, `PLAT-FR-002` for readiness, `PLAT-FR-003` for correlation IDs, and `PLAT-FR-004` for deterministic reset.

That distinction matters. “Add a health check” almost guarantees several competing definitions of service health. The contract stated that liveness was not readiness, and that a not-ready response had to identify component state without leaking secrets. For correlation IDs, it specified exactly where the value had to match: the response header, structured log, and OpenTelemetry span attribute.

The specification also said what **not** to build. Kubernetes and cloud deployment were out of scope. As the feature evolved, each task received tighter boundaries: the UI did not absorb Compose or CI work, CI did not replace evidence publication, and cross-platform verification did not become another complete acceptance campaign.

Feature 001 was split into nine bounded tasks, from `PLAT-T01` for backend liveness to `PLAT-T09` for platform verification. Each step had its own completion contract, so the whole feature could not be declared complete merely because the first happy path worked.

For an LLM, these boundaries were not bureaucratic decoration. They were a fence around the assignment. A model can work extremely hard on something nobody requested. A clear out-of-scope section saves more than tokens; it saves us from the consequences of enthusiasm.

## A workflow with circuit breakers

We built the first version of the process around this sequence:

```text
SPEC
  -> human review
  -> correction
  -> human approval
  -> implementation
  -> acceptance review
  -> human approval
  -> atomic commit
```

Before implementation, a human had to review and explicitly approve the contract. If the review uncovered ambiguity, we corrected the canonical specification first instead of silently “clarifying” the behaviour in code.

After implementation, automated checks still did not grant permission to call the task complete. The candidate went through acceptance review: a separate check of the implementation and evidence against the approved contract. Only after final human approval could we change task status and create an atomic commit.

The **no commit before approval** rule was intentionally strict. A commit did not mean “save this just in case.” It was a statement that this vertical slice had completed the agreed cycle and had an understandable history. The git log shows the steps separately: backend liveness, readiness probes, correlation, database lifecycle, UI, the Compose baseline, CI gates, evidence publication, and platform verification.

The human was not replacing tools by checking every line manually. Their role was different: approve the meaning of the contract, accept or reject the evidence, and authorize the status change and commit. The agent could propose and execute, but it could not issue its own quality certificate.

## From requirement to evidence

We wanted more than a list of tests. We wanted the complete chain:

```text
requirement -> implementation -> tests -> evidence
```

For example, `PLAT-FR-003` required end-to-end correlation IDs. The implementation included middleware, structured logging, and tracing. Tests covered generation of a new ID, preservation of a valid incoming value, and the ID’s presence at the required points. `docs/traceability.md` connected the requirement to its task, concrete checks, and accepted status.

For more complex platform scenarios, one unit test was not enough. Evidence had to record the environment and commit, related requirement IDs, procedure, observations, conclusion, limitations, and cleanup. This kept four different layers separate:

- the contract in the specification and plan;
- raw execution output or a CI log;
- curated evidence in the repository;
- the traceability map explaining what that evidence actually proves.

This guarded against a familiar shortcut: “there was a green job somewhere, so we must be done.” A green job proves only what actually ran inside it and what its assertions were capable of detecting.

## Why Feature 001 was a useful first experiment

A platform baseline sounds like straightforward infrastructure work, but it contains many testable boundaries.

Does the backend remain live when PostgreSQL is unavailable? Does readiness identify the failing component honestly? Does reset work only in the allowed profile? Does teardown remove only resources owned by the current checkout? Does the browser receive a normalized same-origin response without learning the backend’s internal address? Does bootstrap stay within its deadline on the documented baseline rather than merely being “fast on my machine”?

These questions let us test SDD on something more substantial than an abstract `hello world`: a system with runtime behaviour, data, networking, failure modes, and several kinds of evidence. The scope was still bounded, however, with no production deployment, Kubernetes, or business behaviour from future features.

## What we intended to measure

In an ordinary acceptance check, the main question is whether the implementation meets the contract. This experiment added another question: **what is happening to the development process itself?**

Beyond test outcomes, we wanted to observe:

- where clarifications appeared and whether they changed the canonical contract;
- how many correction and review cycles a candidate needed, and where a human decision was required;
- which defects automated checks found and which were found by independent acceptance review;
- whether we could reconstruct the path from requirement to code, test, and evidence;
- which checks were actually executed and which results were reused;
- which claims remained unsupported because an environment or artifact was missing.

That is why evidence recorded more than `PASS`: it included context, limitations, and cleanup. A missing historical detail had to remain missing rather than magically turning into a successful result after another Markdown edit.

There is an important limitation here. Feature 001 did not preserve complete task-level statistics for every cycle and human intervention in a form we can aggregate reliably. We therefore cannot claim after the fact that SDD v1 reduced the work by some percentage. The experiment did, however, show us which data future runs needed to record if we wanted to compare processes rather than impressions.

## Why start with something this strict?

The strict workflow gave us a control point.

The canonical specification reduced room for requirements to change silently. Human gates kept product and risk decisions under human authority. Atomic commits made the history task-level. Independent review separated author confidence from acceptance. Traceability and evidence showed not only the result but also the path that produced it.

None of this proves that every task needs the same review depth. On the contrary: without a baseline like this, it would be difficult to distinguish sensible simplification from an ordinary loss of control. We deliberately turned the controls all the way up so we could observe the system at work.

## Control has a cost

Feature 001 reached implementation, CI, and acceptance evidence, but the experiment did not end with the comforting sentence “all tests are green.” We later learned that green automated tests did not guarantee contract acceptance, and that independent review could find problems the automation had missed.

At the same time, repeated full reviews, approval points, and evidence publication began to create noticeable process overhead. Those observations eventually pushed us toward risk-based SDD v2 — but that is not this post’s story.

The strict workflow gave us visibility and control. Later, those same controls would become part of the problem.

The next experiment report is **Green tests, broken contract**.
