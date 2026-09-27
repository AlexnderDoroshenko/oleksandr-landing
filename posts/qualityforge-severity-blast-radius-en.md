---
title: "QualityForge Lab #6: Severity ≠ blast radius"
date: "2026-09-27"
summary: "Why finding severity determines importance but does not determine the scope of correction, validation, or repeated review."
---

Feature 001 repeatedly exposed the same trap: if a finding is Major, repeat almost everything after the correction. It sounds responsible and often wastes time.

Severity answers: **how strongly does this finding block acceptance?** Blast radius answers: **what changed, and which existing evidence might no longer apply?**

Those are different axes.

## A Major can have a small correction

Imagine mandatory Linux evidence missing one environment field. The portability claim cannot be accepted without it, so the finding is Major. If the value already exists in a preserved run log, however, the correction is documentary: recover the field, verify its references, and perform delta review.

Repeating the Docker experiment adds nothing. Runtime code, dependencies, environment, and outcome have not changed.

Similarly, correcting one endpoint’s redirect classification requires its positive, negative, and leakage cases. It does not automatically require a full cross-platform bootstrap.

## Validation reuse is not corner-cutting

Reuse is valid only when we can identify the previous check, its source inputs and configuration, its environment, and why the current correction does not affect it.

A SHA alone is not enough, especially for a dirty candidate. SDD v2 therefore records input hashes, affected paths, execution environment, and the reason to execute or reuse each check.

A dependency, shared authorization policy, migration, or runtime-configuration change expands the blast radius. Fixing an evidence link does not. Severity cannot answer that question automatically.

## Delta review instead of amnesia

After correction, the Reviewer checks the named finding, actual diff, and affected accepted behaviour. Unchanged results remain valid when their inputs are untouched.

This does not mean “never run full regression.” It belongs at the feature or PR gate, or after a genuinely cross-cutting change. A broad run should have a technical reason, not be ritual penance for the word Major.

The practical route became:

```text
finding -> correction scope -> affected validation -> delta review
```

That idea made the move from SDD v1 to a risk-based workflow possible. Independent acceptance remained where consequences were high, but a narrow correction no longer erased every piece of accumulated evidence.

The next post covers the full design: **SDD v2 with Orchestrator, Builder, and Reviewer**.
