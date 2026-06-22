import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Matches the live site layout: https://codetiger.in/blog/
// `site` + `base` keep every post at /blog/<slug>/ so existing URLs are preserved.
export default defineConfig({
  site: 'https://codetiger.in',
  base: '/blog',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  redirects: {
    // Old Ghost URLs that have moved. Targets include the `/blog` base because
    // redirect values are emitted verbatim (base is not auto-prepended).
    '/rss': '/blog/rss.xml',
    '/sitemap.xml': '/blog/sitemap-index.xml',
    // Renamed from the slug-less Ghost export ("untitled").
    '/untitled': '/blog/complex-gesture-recognition-using-kinect',
  },
  markdown: {
    // Semi-dark code blocks that sit nicely on the dark page background.
    shikiConfig: { theme: 'github-dark-dimmed', wrap: false },
    // LaTeX: remark-math parses $…$ / $$…$$, rehype-katex renders it to HTML
    // at build time (no client-side JS). The KaTeX stylesheet is loaded in
    // BaseLayout.astro. MDX inherits this config automatically.
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
