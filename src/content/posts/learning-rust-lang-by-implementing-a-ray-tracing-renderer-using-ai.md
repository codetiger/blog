---
title: "Learning Rust lang by implementing a Ray Tracing renderer using AI"
date: 2024-09-15T00:47:02.000Z
slug: "learning-rust-lang-by-implementing-a-ray-tracing-renderer-using-ai"
tags: ["Ray Tracing", "Rust", "Programming"]
featureImage: "/blog/assets/images/2024/09/output.png"
draft: false
---
## **Ray Tracing: My Go-To Experiment for Learning New Languages**

Whenever I want to learn a new programming language, explore an acceleration framework, or dive into a new chipset or math co-processor, my go-to experiment is implementing a ray tracing renderer. It’s a concept that’s simple to grasp but offers endless possibilities for code optimization, making it a great starting point that’s deceptively challenging to perfect in terms of performance. Over the past two decades, I’ve experimented with at least 50 variations of this.

## **Why Rust? Overcoming My Biases as a C Developer**

This time, I decided to tackle Rust, a language that has been on my to-learn list for quite a while. I’ve often heard that C developers tend to love Rust, but my deep attachment to C made me reluctant to explore alternatives. For most of my personal projects, I default to either C or Python unless a company or platform forces me to branch out. Still, I set my biases aside to discover what makes Rust so compelling—especially since it’s gaining traction within the open-source community. While most new languages have large corporate sponsors—like Shopify for Ruby, Facebook for PHP, and Google for Kotlin, Go, and Dart—Rust’s rise seems to have come from nowhere, which makes its growing popularity in the OSS world particularly intriguing.

## **Exploring Three Approaches to Learning Rust**

This time, I decided to approach learning a new programming language using three different methods:

1.  **Classic Development**: Using Google Search and VSCode.
2.  **AI-Guided Development**: Using Google Search, VSCode, and GitHub Copilot.
3.  **AI Co-Development**: Using ChatGPT (o1-preview) alongside a compiler.

To ensure that the learning order didn’t skew the results, I warmed up my Rust syntax with small examples beforehand for couple of hours. Since I’m already very familiar with the problem I’m tackling, the order of these approaches shouldn’t affect the outcome much.

## **The Experiment: Writing a Ray Tracing Renderer in Rust**

The goal of this experiment is to write a ray tracing renderer from scratch, starting from the conceptual level and moving toward a basic implementation. Performance optimizations will be considered a bonus but are not part of the completion criteria. Ultimately, I want to document the overall experience of each development approach and compare the time taken for each.

## **Results: Experience & Time taken**

![](/blog/assets/images/2024/09/Screenshot-2024-09-15-at-10.47.38-AM.png)

## Verdict

After dedicating a weekend to this experiment, my journey into learning Rust yielded unexpected insights beyond the initial scope. While AI-guided development initially appeared as the optimal or safer choice, the introduction of the o1-preview model in ChatGPT dramatically shifted my perspective.

### Experience

The effectiveness of any development approach hinges on a deep understanding of both the problem at hand and fundamental programming concepts. This knowledge guards against the occasional missteps or ‘hallucinations’ AI might produce, underlining the unique advantages of human oversight. Some colleagues argue that a proficient product manager could leverage AI tools like ChatGPT to generate functional code, and while this might hold for prototypes or early development stages, constructing a robust system demands a thorough understanding of both technological and practical aspects to correct AI biases.

### **Information Security**

A significant hurdle preventing broader AI integration in professional settings is the concern over information security. The industry is rife with discussions on this topic. AI-guided development can risk exposing the entire codebase to the model, creating potential liabilities for the information security of the organization. Conversely, the co-development approach—akin to Apple’s strategy—allows the developer to control what information the AI accesses, typically limited to the specific class or function being worked on, thereby enhancing security.

### Final words:

AI co-development is poised to revolutionize how we code. It partners with the developer like a knowledgeable peer programmer, engaging in meaningful dialogue and aiding in co-development. The challenge remains in refining the user experience to integrate ChatGPT effectively without compromising information security. Once that balance is achieved, AI co-development will undoubtedly shape the future of programming.

**Final Code**: [https://github.com/codetiger/RayTracingRust](https://github.com/codetiger/RayTracingRust)
