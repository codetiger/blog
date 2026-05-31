# Small World

A pure-markdown, component-capable blog built with [Astro](https://astro.build) + MDX,
deployed to GitHub Pages at <https://codetiger.github.io/blog/>.

Posts are plain markdown (`.md`); articles that need interactive 3D/canvas use `.mdx`
and embed components as Astro islands.

## Project layout

```
src/
  content/posts/      articles (.md, plus .mdx for interactive ones)
  content/pages/      standalone pages (about-me.md) — kept out of the post feed
  pages/              routes: index (paginated), [...slug], tag/[tag], author/[author],
                      about-me, 404, rss.xml
  layouts/            BaseLayout (SEO/head/theme), PostLayout
  components/         PostList, TagList, Pager, Seo, AuthorCard
  lib/                site.ts (constants), posts.ts, tags.ts
public/               favicon.png, robots.txt, assets/ (images, cover, author photo)
astro.config.mjs      site/base (/blog), mdx, sitemap, redirects, Shiki theme
.github/workflows/    deploy.yml (GitHub Pages via Actions)
```

## Commands

```bash
npm install
npm run dev            # local dev at http://localhost:4321/blog/
npm run build          # static output to dist/
npm run preview        # serve the built dist/
```

## Writing a new post

Add `src/content/posts/<slug>.md` with frontmatter:

```markdown
---
title: "My new post"
date: 2026-06-01T00:00:00.000Z
slug: my-new-post
excerpt: "One-line summary used in lists, RSS, and social cards."
tags: ["electronics", "raspberry pi"]
featureImage: "/blog/assets/images/2026/06/hero.jpg"   # optional
draft: false
---
Body in markdown…
```

For an interactive article, use `.mdx` and import a component:

```mdx
import MyWidget from '../../components/MyWidget.astro';

Prose… <MyWidget /> …more prose.
```

Tag pages, the author page, RSS, the sitemap and pagination all update automatically
from the posts. Pagination page count = `ceil(posts / SITE.pageSize)` (`pageSize` in
`src/lib/site.ts`).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages. The repo's **Settings → Pages → Source** must be set
to **GitHub Actions** (one-time). `site` + `base: '/blog'` in `astro.config.mjs` keep
every URL at `https://codetiger.github.io/blog/…`, matching the previous Ghost site.

## Notes

- A fenced code block with no language gets no Shiki highlighting — add a
  ```` ```lang ```` to the fence to enable it.
