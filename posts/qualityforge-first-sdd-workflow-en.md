---
title: "QualityForge Lab #3: from specification to acceptance — our first SDD workflow"
date: "2026-09-27"
summary: "Our first strict SDD baseline: a canonical specification, human gates, independent acceptance review, and evidence traceability."
---

In the [previous post](/blog/qualityforge-local-llm-sdd), we removed local-first inference as a requirement of the main experiment. That finally let us test the engineering workflow rather than the glue between Ollama, OpenCode, and Spec Kit.

Our first contract was **Feature 001: Reproducible Platform Baseline**: a backend, web UI, PostgreSQL, and Redis that could start reproducibly and leave verifiable evidence.

## The working hypothesis

Our hypothesis was:

> A precise specification, automated tests, independent review, and explicit human decision authority should make LLM-assisted development more controllable and observable.

The important word is “should.” We did not yet know whether the process would be faster or cheaper, and we were not presenting it as the one correct form of SDD.

## A canonical contract

The source of truth was not the chat. It was `specs/001-platform/spec.md`. Requirements received stable IDs: `PLAT-FR-001` for startup, `PLAT-FR-002` for readiness, `PLAT-FR-003` for correlation IDs, and `PLAT-FR-004` for deterministic reset.

The contract also set boundaries. Kubernetes and cloud deployment were outside Feature 001. The UI could not quietly absorb Compose or CI work, and CI could not substitute for acceptance evidence.

“Add a health check” became observable behaviour. Liveness was not readiness. A not-ready response identified the failing component without leaking secrets. The correlation ID had to match across the response header, structured log, and OpenTelemetry span attribute.

## A workflow with circuit breakers

We deliberately made the first workflow strict:

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

Before implementation, a human approved the meaning of the contract. If review found ambiguity, the specification changed first, not the behaviour inside the agent’s head.

After implementation, green checks did not complete the task. Independent acceptance review compared implementation and evidence with the contract. Only human approval could authorize a status change and atomic commit.

The `no commit before approval` rule was intentionally inconvenient. A commit meant a completed slice with an understandable history, not “save this just in case.” The Feature 001 log therefore shows separate steps for liveness, readiness, correlation, database lifecycle, UI, the Compose baseline, CI, evidence publication, and portability verification.

## Traceability as instrumentation

We wanted the complete chain:

```text
requirement -> implementation -> tests -> evidence
```

For `PLAT-FR-003`, middleware, logging, and tracing were only the implementation. Tests checked ID generation and preservation, while `docs/traceability.md` explained which checks supported the acceptance claim.

Runtime evidence also recorded environment, commit, procedure, observations, limitations, and cleanup. A green CI job could not silently become proof of everything.

## Measuring the process too

We wanted to observe where clarification appeared, how many correction and review cycles a candidate needed, what tests and independent review found, where a human decision was required, and whether the path from requirement to evidence could be reconstructed.

Complete early Feature 001 statistics were not preserved, so we cannot honestly claim that SDD reduced work by a percentage. The strict baseline did reveal which data future runs needed to record.

## Why the baseline helped

Feature 001 contained real boundaries: degraded dependencies, destructive reset, Docker-resource ownership, same-origin UI behaviour, a bootstrap deadline, and platform differences. It was more substantial than `hello world` without becoming the entire future product.

The strict workflow reduced room for silent requirement changes. Human gates kept decisions under human authority. Independent review separated author confidence from acceptance.

The first crack appeared quickly, however: green tests did not guarantee that the implementation satisfied the contract.

That is the next post: **Green tests, broken contract**.
