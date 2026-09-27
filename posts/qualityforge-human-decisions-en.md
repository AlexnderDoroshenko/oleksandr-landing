---
title: "QualityForge Lab #8: where the agent must stop"
date: "2026-09-27"
summary: "Three security decisions from AUTH-T01, T02, and T04 that required a human gate instead of agent improvisation."
---

SDD v2 allowed an agent to correct in-scope defects without constant permission. A security task, however, can be technically clear while lacking a correct answer until a product decision is made.

`AUTH-T01`, `AUTH-T02`, and `AUTH-T04` gave us three examples of a correct stop.

## T01: what multiple roles mean

The identity foundation stored tenant-local users and roles. Tables alone could not decide whether multiple roles combine their grants or one role wins, how email should be normalized, or whether dots and plus suffixes should receive special treatment.

These were not implementation details. They affected authorization and uniqueness. A human approved union-of-grants after tenant and status checks, a tenant-local Admin, and trim plus lowercase of the full email without special dot or plus processing.

Only then could the Builder implement a frozen contract.

## T02: authentication is a set of policy decisions

Registration, login, and refresh required decisions about who could register, into which tenant, which status and role an account received, how access and refresh tokens behaved, what an attacker saw in errors, and which task owned rate limiting.

The human approved Customer self-registration into an existing tenant, a 15-minute access JWT, a hashed rotating opaque refresh token lasting seven days, and generic safe errors. Rate limiting remained with a later task instead of being added invisibly “for security.”

The gate did not ask a human to name a function. It resolved the product and security contract.

## T04: where the first Admin comes from

The role-assignment and audit slice had already passed review. Privileged provisioning exposed two gaps: who supplies the initial password, and how can the first Admin appear if only an Admin may create one?

This was a real `BLOCKED_DECISION`. The agent could not invent an invitation flow, default password, or public bootstrap endpoint.

The human approved an Admin-supplied initial password using existing T02 hashing and an operator-only local bootstrap for an existing tenant. The command fails closed if an Admin already exists; the password is not passed through argv or environment; no HTTP bootstrap route was added.

## A useful stop is concrete

“Clarification required” is weak. The Orchestrator should identify the blocked requirement, explain why the contract has no answer, present bounded options, and describe which downstream implementation each option enables.

After the decision, the canonical specification changes and the Builder continues without asking the same question again.

Each of these tasks required one consolidated human intervention before the final gate. That is not zero, but it is also not continuous manual control.

`AUTH-T03` showed the other case: a HIGH-risk authorization task that required no new product decision. That is the next post.
