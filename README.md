# Small World

A pure-markdown, component-capable blog built with [Astro](https://astro.build) + MDX,
deployed to GitHub Pages at <https://codetiger.github.io/blog/>. Migrated from Ghost.

Posts are plain markdown (`.md`); articles that need interactive 3D/canvas use `.mdx`
and embed components as Astro islands (e.g. the live WebGL raymarcher in
`interactive-ray-tracing-in-the-browser`).

## Project layout

```
src/
  content/posts/      articles (.md migrated from Ghost, .mdx for interactive ones)
  content/pages/      standalone pages (about-me.md) — kept out of the post feed
  pages/              routes: index (paginated), [...slug], tag/[tag], author/[author],
                      about-me, 404, rss.xml
  layouts/            BaseLayout (SEO/head/theme), PostLayout
  components/         PostList, TagList, Pager, Seo, RaytracerCanvas
  lib/                site.ts (constants), posts.ts, tags.ts
public/               favicon.png, robots.txt, assets/ (images, cover, author photo)
scripts/convert.mjs   Ghost-export → markdown converter
astro.config.mjs      site/base (/blog), mdx, sitemap, redirects, Shiki theme
.github/workflows/    deploy.yml (GitHub Pages via Actions)
```

## Commands

```bash
npm install
npm run dev            # local dev at http://localhost:4321/blog/
npm run build          # static output to dist/
npm run preview        # serve the built dist/
npm run migrate:all    # re-run the Ghost-export → markdown conversion (all posts + pages)
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
import RaytracerCanvas from '../../components/RaytracerCanvas.astro';

Prose… <RaytracerCanvas /> …more prose.
```

Tag pages, the author page, RSS, the sitemap and pagination all update automatically
from the posts. Pagination page count = `ceil(posts / SITE.pageSize)` (`pageSize` in
`src/lib/site.ts`).

## Re-importing from Ghost

`scripts/convert.mjs` reads the Ghost JSON export and, per entry:

1. Converts the rendered **`html`** field → markdown via `turndown` (works for both
   lexical and mobiledoc posts — every post has `html`).
2. Rewrites `__GHOST_URL__/content/images/…` → `/blog/assets/images/…` and internal
   `__GHOST_URL__/slug/` links → `/blog/slug/`.
3. Converts Ghost **bookmark cards** → clean quoted links and captioned images →
   `<figure>/<figcaption>`.
4. Copies referenced images into `public/assets/images/`, plus the favicon, social
   cover, and author photo.
5. Emits frontmatter and writes posts to `src/content/posts/` and pages to
   `src/content/pages/`.

Edit the absolute paths at the top of the script if the export/image locations change.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `dist/` to GitHub Pages. The repo's **Settings → Pages → Source** must be set
to **GitHub Actions** (one-time). `site` + `base: '/blog'` in `astro.config.mjs` keep
every URL at `https://codetiger.github.io/blog/…`, matching the previous Ghost site.

## Notes

- Code blocks carry no language hint from Ghost (fenced without a language). Add a
  ```` ```lang ```` to a fence if you want per-language Shiki highlighting.
- Ghost gallery cards become a sequence of standalone images.
