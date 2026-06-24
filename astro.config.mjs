import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// DEV ONLY: serve the shared design system at /design-system/ during `npm run dev`.
// In production the aggregator (website-cicd) publishes it at that exact path, so the
// `<link href="/design-system/...">` in BaseLayout is a plain runtime link with no copy
// committed here. Locally there's no such root, so this middleware streams the files
// straight from the design-system folder in the website-cicd repo (always in sync — no
// duplicate). Build/preview are untouched. Override the location with DESIGN_SYSTEM_DIR.
function designSystemDev() {
  const MIME = {
    '.css': 'text/css', '.html': 'text/html', '.json': 'application/json',
    '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml',
  };
  return {
    name: 'design-system-dev',
    hooks: {
      'astro:config:setup': ({ command, updateConfig, logger }) => {
        if (command !== 'dev') return;
        const dir = [
          process.env.DESIGN_SYSTEM_DIR,            // explicit override
          path.resolve(process.cwd(), '../../design-system'),        // submodule: website-cicd/projects/blog
          path.resolve(process.cwd(), '../website-cicd/design-system'), // standalone clone beside website-cicd
        ].filter(Boolean).find((d) => fs.existsSync(path.join(d, 'design-system.css')));
        if (!dir) {
          logger.warn('design-system not found — set DESIGN_SYSTEM_DIR; /design-system/ will 404 locally');
          return;
        }
        logger.info(`serving /design-system/ from ${dir}`);
        updateConfig({
          vite: {
            plugins: [{
              name: 'serve-design-system',
              configureServer(server) {
                // Mounted at the prefix, so req.url is the path *within* the folder.
                server.middlewares.use('/design-system', (req, res, next) => {
                  const rel = decodeURIComponent((req.url || '/').split('?')[0]);
                  const file = path.join(dir, rel === '/' ? 'index.html' : rel);
                  if (!path.resolve(file).startsWith(path.resolve(dir))) return next(); // traversal guard
                  fs.readFile(file, (err, data) => {
                    if (err) return next();
                    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
                    res.end(data);
                  });
                });
              },
            }],
          },
        });
      },
    },
  };
}

// Matches the live site layout: https://codetiger.in/blog/
// `site` + `base` keep every post at /blog/<slug>/ so existing URLs are preserved.
export default defineConfig({
  site: 'https://codetiger.in',
  base: '/blog',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap(), designSystemDev()],
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
  vite: {
    // Pre-bundle three.js + the TrackballControls addon at dev-server startup.
    // ShellViewer imports them in a client <script>, so Vite would otherwise
    // discover them lazily on first view of a three.js post, re-run its dep
    // optimizer, and invalidate chunk URLs the browser already holds — the
    // intermittent 504 "Outdated Optimize Dep". Listing them here bundles them
    // once, up front, so the URLs stay stable for the whole session.
    optimizeDeps: {
      include: ['three', 'three/addons/controls/TrackballControls.js'],
    },
  },
});
