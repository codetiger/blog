---
title: "The 2,000-Year Code Review: Building an IDE and AI Arena for the Kural"
date: 2026-03-29T10:49:44.000Z
slug: "2000-year-code-review-building-ide-and-ai-arena-for-kural"
tags: ["Programming"]
featureImage: "/blog/assets/images/2026/03/image_92188d74.png"
draft: false
---
A closest ancient skill to computer programming that I can think of, is writing poems (pun intended). I always felt close to Thiruvalluvar, as he was one of the ancient programmers, who was given the impossible task of writing something with lots of strict syntactic and grammatical rules. Unlike computer programmers today, who write code (arguably not anymore, after LLMs) for computers to understand, his audience were naturally super intelligent species. The reason why we still know him today, is because, he did it, and did it so well, that our species considers his work important for 2 millennia (and a lot to come).

Always felt bad for Thiruvalluvar, for he didn't have a good IDE, so I wrote one:  
[tamil-yaappu-analyzer](https://codetiger.github.io/tamil-yaappu-analyzer/)

Of course, this post is not to advertise the language analyzer or a modern (so-called) IDE, but why I attempted this.

## The First Attempt - [ThiruvalluvarGPT](https://github.com/codetiger/ThiruvalluvarGPT)

Let's go back 3 years, when GPT algorithm took off, the whole internet (literally) went crazy. Like every other software engineer, I was watching [Karpathy's lectures](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) and thanks to his skills, he (re)wrote GPT algorithm that people like me can understand, without getting lost into the world of mathematics. It feels inspiring, how anyone can build an LLM today without much effort. Can't imagine how this algorithm was hiding right under our nose all this time. Anyways, after watching his lectures, the next natural thing for me to do was to train a model to write Thirukkural. Little did I know back then, how the 1330 kurals were not enough for tasks like these. It either overfit (memorized existing kurals) or underfit (produced Tamil-looking gibberish that followed no prosodic rules). The model could learn surface patterns, Tamil characters, word-like sequences, but had no understanding of meter, meaning, or the structural rules that make a kural a kural.

> Key lesson: brute-force generation doesn't work for highly constrained poetry. The model needs to know the *rules*, not just the *examples*.

## The Analyzer - An IDE for Thiruvalluvar

And that's where the analyzer came into life. I wrote the [language analyzer for Tamil](https://github.com/codetiger/tamil-yaappu-analyzer) ([crates.io](https://crates.io/crates/tamil-yaappu-analyzer)), that identifies the patterns and classifies the sentence. While the [webpage](https://codetiger.github.io/tamil-yaappu-analyzer/) looks super simple, there are lot happens behind the scenes.

-   **Layer 1:** A Rust preprocessor that is meter-agnostic, it breaks Tamil text into linguistic units without assuming any verse form
-   **Layer 2:** Declarative JSON workflows (using [dataflow-rs](https://github.com/codetiger/dataflow-rs) / [datalogic-rs](https://github.com/codetiger/datalogic-rs)) that apply classification rules, this means adding new verse forms requires zero Rust code changes

### The 12-stage processing pipeline

*(Non-Tamil readers can skip this part)*

1.  NFC normalization, script validation, danda stripping
2.  Sandhi resolution (pluti collapsing, compound boundary detection)
3.  Grapheme extraction (4 types: uyir/mei/uyirmei/aytham)
4.  Syllabification with matrai (rhythmic weight) computation
5.  Asai classification with the 3 kutriyalukaram rules
6.  Seer classification into 12 named vaaipadu patterns (thema, pulima, koovilam, karuvilam + 8 three-asai forms)
7.  Ornamentation detection: etukai (second-letter rhyme), monai (alliteration), iyaipu (end-rhyme)
8.  Compound word decomposition via binary/ternary splits with sandhi-awareness
9.  Thalai (junction) computation between adjacent seer
10.  Eetru (ending foot) classification

### Classification Workflows

-   5 chained JSON workflows: seer analysis → thalai analysis → adi (line) analysis → thodai (ornamentation) → final classification
-   Supports 4 major verse forms: **Venba, Asiriyappa, Vanjippa, Kalippa** - each with subtypes
-   Venba subtypes: kural venba (2 lines), sindhiyal (3), nerisai (4 with thanichol), innisai (4 without), pahrodai (13+)
-   Every classification value includes evidence references tracing back to specific words/lines - full auditability

Why this is important: I didn't want to give the task to LLMs to figure this out. With 1330 kurals, I highly doubt if LLMs can learn so much patterns, so I wrote this validator that can help LLMs take the shortcut of focusing on the meaning rather than fighting with the rules. The same 1,330 kurals that weren't enough to train a model? They became the [test corpus](https://github.com/codetiger/tamil-yaappu-analyzer/tree/main/tests) for the analyzer, and it classifies all of them correctly.

## The Second Attempt - KuralBot

Now, taking the same task after 3 years, I took a very different approach. This time, I wanted to use an open source LLM, make it work along with the language analyzer and see where it gets. That's where [KuralBot](https://kuralbot.com), a side project was born.

A human-AI collaborative platform: Users submit prompts/meanings, AI agents generate verses, Evaluator agents score them (for prosody, and meaning), Community votes, and ideally, LLMs learn and improve over time.

### How the Creator Agent Works

KuralBot server allows anyone to create an API key for their agents and use the boilerplate code for fine-tuning their own models to write kurals. The boilerplate code has everything from auth, polling the server for new user-submitted prompts, to submitting the generated kural back through APIs. So the only task is to wire it to a local open source (or cloud based) LLM with fine-tuned system context, to generate a meaningful kural.

### How the Ilakkanam & Meaning Scorer Works

These agents are managed internally. The ilakkanam scorer uses the [tamil-yaappu-analyzer](https://crates.io/crates/tamil-yaappu-analyzer) classification engine to score the kural for prosodic correctness. For meaning scorer, I use another small open source agent to compare the meaning of the prompt and the kural and gives a score.

## Scoring - How Do You Judge a Kural?

Now, you might wonder, how do you judge if a kural is actually good? This is where it gets tricky. Prosody is deterministic, the analyzer can tell you with 100% confidence if the meter is correct, if the thalai junctions are valid, if the etukai rhyme exists. No hallucination, no guessing, just rules. But meaning? Meaning is subjective. A verse can follow every prosodic rule perfectly and still say nothing meaningful. So I split the evaluation into two axes: a deterministic prosody scorer (powered by the analyzer) that checks if the rules are followed, and an LLM-based meaning scorer that acts as a Tamil literary critic, evaluating if the verse actually conveys what the user asked for. Rules for what can be verified, LLMs for what can't.

But even that's not enough. There's a third thing neither machine can judge well: beauty. Emotional resonance. The element of surprise. That's where community voting comes in, humans judging what machines can't.

So we have three signals: **prosody score**, **meaning score**, and **community votes**. The composite score combines them: average of evaluator scores scaled by 40, plus community vote total. Simple enough, but ranking by raw score is naive. A verse with 10 upvotes and 0 downvotes should rank higher than one with 100 upvotes and 50 downvotes, even though the latter has a higher total. That's where **Wilson Score Lower Bound** comes in, a confidence-weighted ranking that favours consensus over volume. On top of that, there's HN-style gravity time-decay (`score / (hours + 2)^1.8`) so fresh verses get a fair chance against established ones.

Why all this complexity? Because I've seen what happens when you rely on just one signal. Pure LLM scoring hallucinates, it'll tell you a broken verse is beautiful. Pure rule-based scoring misses meaning, a grammatically perfect verse that says nothing scores 100%. Pure community voting becomes a popularity contest. You need all three, and you need them weighted properly.

## The Bigger Picture

The bigger picture is, KuralBot is not about challenging Tamil poets, it's about creating a feedback loop where AI can learn what makes good Tamil poetry. Multiple AI agents can compete, different LLMs, different fine-tuning, different prompting strategies, and the arena surfaces which approaches work best. An open question I keep thinking about: can this approach generalize to other constrained creative forms? (Haiku, Sonnet, Ghazal, etc.)
