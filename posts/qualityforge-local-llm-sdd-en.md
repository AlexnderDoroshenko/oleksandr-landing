---
title: "QualityForge Lab #2: local LLMs, Ollama, OpenCode, and Spec Kit — our first SDD traps"
date: "2026-09-27"
summary: "How a local-first SDD setup with Ollama, OpenCode, and Spec Kit turned model infrastructure into an experiment of its own."
series: "qualityforge"
seriesOrder: 2
---

In the [first post](/blog/qualityforge-qa-polygon), I explained why a QA engineer might want a dedicated testing playground. The obvious next step seemed to be picking the first feature and starting to build the product.

We did something else first: we tried to build an environment in which a local LLM could work with specifications, code, and tests. QualityForge’s first experiment was therefore not Feature 001. It was an attempt to configure the development method itself.

On paper, the setup looked attractive:

```text
local model -> coding agent -> specification workflow -> repository
```

In practice, the space between those arrows became a separate project.

## Why local-first at all?

The idea was not to avoid cloud models at any cost. We wanted to test a more controlled setup: a model running locally through Ollama, an agent interacting with the repository through OpenCode, and Spec Kit providing a repeatable path from requirement to implementation.

The approach promised several useful properties: local data, a predictable environment, configuration control, and the ability to repeat a run without depending on one particular chat session. Specifications would remain ordinary versioned files instead of agreements buried somewhere between twenty messages.

Our initial hypothesis was deliberately cautious: if requirements, checks, and agent rules lived as versioned artifacts, we might evaluate not only generated code but also the development process itself.

This was not yet a claim that a local model was better. It was a question: **would it be sufficient for a controlled SDD cycle?**

## A running model is not a running experiment

The local tests ran on a MacBook Pro with an M2 Max and 32 GB of unified memory. That is a capable development machine. For a large model, an IDE, a browser, Docker, and a long context at the same time, it becomes a negotiation over every gigabyte.

We recorded two Ollama profiles in the repository:

- `gemma4:12b-mlx` as the faster profile for documentation, fixtures, unit tests, and small changes;
- `gemma4:26b-mlx` as the coding profile for feature implementation, debugging, and integration work.

We limited their context windows to 16,384 and 32,768 tokens, restricted each iteration to one task, and allowed at most five related files. Those rules reveal the reality of the experiment: context and resources were already part of the process design, not an invisible implementation detail.

Other candidates appeared in working notes, but we did not preserve a complete, equivalent benchmark across all models. There will be no “winner” table here. A model answering a prompt or editing a file proved nothing about its ability to complete a multi-step cycle reliably: read the contract, preserve scope, change the code, run checks, and stop honestly at a human gate.

There was also a very human LLM moment. During one analysis, the model suddenly switched to Bengali. I remember the incident, but the raw log is gone, so it belongs here as a lab anecdote, not a reproduced benchmark. The modest conclusion is that “it started” and “it can execute the workflow reliably” are different statuses.

## Ollama was only the bottom layer

Ollama handled inference: load a model and generate a response. Repository work required an agent layer for reading files, applying changes, running commands, and passing context. OpenCode was meant to provide that layer.

We then tried to install Spec Kit on top. Its purpose was not to “write the code for us,” but to make the stages explicit: constitution, specification, clarification, plan, tasks, and implementation. In QualityForge, the constitution would be the canonical rule set, and Feature 001 would become the first contract to pass through that route.

Spec Kit initialization did add the OpenCode integration, `.specify/`, a constitution copy, and a set of `speckit.*` command files. Git confirms that. But this produced the first important lesson: **the presence of a command file does not mean that the command is actually available to the agent**.

We had to verify the whole chain separately:

```text
command file -> discovery -> invocation -> context transfer -> actual agent behaviour
```

Every arrow could fail independently. OpenCode launched one way was not necessarily available as a normal shell command. A support directory could fail to enter git. The constitution could exist in two locations, raising a simple but uncomfortable question: which copy was authoritative? Generated slash commands looked convincing, but Markdown alone did not create magical runtime dispatch.

None of these issues was disastrous on its own. Together, they meant we were testing the toolchain glue more than QualityForge.

## What remained in git

Repository history makes the order visible. Before Spec Kit initialization, the project already contained `AGENTS.md`, a constitution, local-model profiles, and rules such as one task per iteration, focused tests before the full suite, and no commit without human approval.

The next planning commit installed Spec Kit 1.0.6 with OpenCode integration, adding `.specify/`, manifests, scripts, templates, and `speckit.*` commands. These were real artifacts, not just a proposed setup.

Git records files, however, not runtime behaviour. It can prove that a command existed, but not that a particular session discovered it, transferred the right context, and executed the intended role. That distinction between an **installed artifact** and **observed execution** becomes important again when we reach the reusable Codex Skill experiment.

## When setup became the main product

That was a useful moment to stop. Our original goal was to study SDD and QA practice on a real product. Instead, the experiment now contained at least four independent variables:

- local-model quality and size;
- memory and context-window constraints;
- agent-runtime reliability;
- Spec Kit integration with a particular client.

If the next task failed, we would not know what had caused it: a weak specification, an implementation defect, lost model context, or a command that had never been invoked in the way we assumed.

That is poor experimental design. With too many variables, every explanation becomes convenient and none becomes convincing.

## The turn toward Codex/ChatGPT

We did not prove that local models were unsuitable for SDD. Nor did we conduct a controlled local-model-versus-Codex comparison for time, cost, or quality.

We also lack a complete archive of equivalent runs for every model, precise timing measurements, or stable memory-pressure statistics. The decision did not come from a benchmark leaderboard. It came from observing the whole system: too much effort was going into stabilizing inference and integration before the SDD experiment itself could begin.

The decision was more pragmatic: remove one major source of uncertainty from the main QualityForge experiment. We moved implementation to Codex/ChatGPT and stopped treating local-first execution as a requirement. That let us study specifications, review, tests, evidence, and human decisions without mixing them with a separate benchmark of local inference.

The rules we had developed did not disappear. The repository retained its constitution, requirement IDs, scope boundaries, one-task-per-iteration rule, required checks, and prohibition on commits without human approval. We changed the engine without abandoning the controlled process.

## What the unsuccessful route actually gave us

The local-first attempt did not become QualityForge’s primary development method, but it was not wasted work.

It taught us three things.

First, a model cannot be evaluated separately from its runtime and tools. Reasoning, tool use, command discovery, and context transfer form one system.

Second, versioned Markdown is useful as a contract but is not proof of execution. An instruction, command, or eventually even a `SKILL.md` file still needs evidence of real invocation.

Third, experiment infrastructure can quietly become the experiment itself. Sometimes the correct engineering decision is not to “push the setup through,” but to remove an extra variable and return to the original question.

Only then did we move to Feature 001 and build the first strict cycle from specification to acceptance. That is where the canonical specification, independent review, human gates, and the `no commit before approval` rule entered the story.

But that is the next post: **from specification to acceptance — our first SDD workflow**.
