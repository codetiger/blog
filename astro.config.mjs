import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Matches the live site layout: https://codetiger.github.io/blog/
// `site` + `base` keep every post at /blog/<slug>/ so existing URLs are preserved.
export default defineConfig({
  site: 'https://codetiger.github.io',
  base: '/blog',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  redirects: {
    // Old Ghost URLs that have moved. Targets include the `/blog` base because
    // redirect values are emitted verbatim (base is not auto-prepended).
    '/rss': '/blog/rss.xml',
    '/sitemap.xml': '/blog/sitemap-index.xml',
  },
  markdown: {
    // Semi-dark code blocks that sit nicely on the dark page background.
    shikiConfig: { theme: 'github-dark-dimmed', wrap: false },
  },
});
