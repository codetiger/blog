// Ghost export -> Astro markdown converter.
//
// Converts each post's rendered `html` field to markdown (works for both
// lexical and mobiledoc posts, since every post has `html`), rewrites the
// `__GHOST_URL__` placeholders, copies the referenced original images, and
// writes `src/content/posts/<slug>.md` with YAML frontmatter.
//
// Usage:
//   node scripts/convert.mjs            # POC: just the 3 representative posts
//   node scripts/convert.mjs --all      # every published post
//   node scripts/convert.mjs slug-a slug-b   # specific slugs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXPORT_JSON = '/Users/codetiger/Development/ghost/blog-export-2026-05-31.json';
const IMAGES_SRC = '/Users/codetiger/Development/ghost/content/images';
const OUT_POSTS = path.join(ROOT, 'src/content/posts');
const OUT_PAGES = path.join(ROOT, 'src/content/pages');
const OUT_IMAGES = path.join(ROOT, 'public/assets/images');
const PUBLIC_DIR = path.join(ROOT, 'public');

// URL prefix images/links resolve to on the deployed site (base = /blog).
const IMG_WEB_PREFIX = '/blog/assets/images/';
const SITE_BASE = '/blog';

const POC_SLUGS = [
  'learning-rust-lang-by-implementing-a-ray-tracing-renderer-using-ai',
  'interfacing-ublox-gps-m8n-with-raspberry-pi',
  'the-day-my-smart-vacuum-turned-against-me',
];

// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const ALL = args.includes('--all');
const explicitSlugs = args.filter((a) => !a.startsWith('--'));

const data = JSON.parse(fs.readFileSync(EXPORT_JSON, 'utf8')).data;
const posts = data.posts;
const tagsById = Object.fromEntries(data.tags.map((t) => [t.id, t]));
const metaByPost = Object.fromEntries((data.posts_meta || []).map((m) => [m.post_id, m]));

// post_id -> [tag name] ordered by sort_order
const tagsByPost = {};
for (const pt of data.posts_tags || []) {
  (tagsByPost[pt.post_id] ||= []).push(pt);
}
for (const id of Object.keys(tagsByPost)) {
  tagsByPost[id] = tagsByPost[id]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((pt) => tagsById[pt.tag_id]?.name)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  hr: '---',
});
td.use(gfm);

// Single-image Ghost cards with a caption -> semantic <figure>/<figcaption>.
// (Emitting HTML, not `*italic*`, so styling a caption can't be confused with
// inline emphasis. Images without captions fall through to markdown ![](src).)
td.addRule('imageFigure', {
  filter: (node) =>
    node.nodeName === 'FIGURE' &&
    !/kg-bookmark-card|kg-gallery-card/.test(node.getAttribute('class') || '') &&
    !!node.querySelector('img') &&
    !!node.querySelector('figcaption'),
  replacement: (_content, node) => {
    const img = node.querySelector('img');
    const src = img.getAttribute('src') || '';
    const alt = (img.getAttribute('alt') || '').replace(/"/g, '&quot;');
    const cap = node.querySelector('figcaption')?.textContent?.trim() || '';
    return `\n\n<figure>\n  <img src="${src}" alt="${alt}" />\n  <figcaption>${cap}</figcaption>\n</figure>\n\n`;
  },
});

// Any remaining figcaptions (e.g. gallery captions) -> raw <figcaption>.
td.addRule('figcaption', {
  filter: 'figcaption',
  replacement: (content) => (content.trim() ? `\n\n<figcaption>${content.trim()}</figcaption>\n\n` : ''),
});

// Ghost "bookmark cards" (link-preview cards) otherwise flatten into a broken
// favicon image + run-on text. Render them as a clean quoted link card instead.
td.addRule('bookmarkCard', {
  filter: (node) =>
    node.nodeName === 'FIGURE' && /kg-bookmark-card/.test(node.getAttribute('class') || ''),
  replacement: (_content, node) => {
    const href = (node.querySelector('a.kg-bookmark-container')?.getAttribute('href') || '')
      .replace('https://codetiger.github.io/blog/', '/blog/');
    const title = node.querySelector('.kg-bookmark-title')?.textContent?.trim() || href;
    const desc = node.querySelector('.kg-bookmark-description')?.textContent?.trim() || '';
    return `\n\n> **[${title}](${href})**${desc ? `  \n> ${desc}` : ''}\n\n`;
  },
});

function yamlStr(s) {
  return JSON.stringify(s ?? ''); // double-quoted, safely escaped — valid YAML
}

function rewriteGhostUrls(md) {
  return md
    .split('__GHOST_URL__/content/images/')
    .join(IMG_WEB_PREFIX)
    // old absolute live-site image URLs -> local assets
    .split('https://codetiger.github.io/blog/content/images/')
    .join(IMG_WEB_PREFIX)
    // any remaining __GHOST_URL__ are internal links: __GHOST_URL__/slug/ -> /blog/slug/
    .split('__GHOST_URL__')
    .join(SITE_BASE);
}

function copyReferencedImages(md, featureImage) {
  const refs = new Set();
  const re = new RegExp(`${IMG_WEB_PREFIX.replace(/\//g, '\\/')}([^\\s)"'\\]]+)`, 'g');
  let m;
  while ((m = re.exec(md))) refs.add(decodeURIComponent(m[1]));
  if (featureImage) refs.add(decodeURIComponent(featureImage));

  let copied = 0;
  const missing = [];
  for (const rel of refs) {
    const src = path.join(IMAGES_SRC, rel);
    const dest = path.join(OUT_IMAGES, rel);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copied++;
    } else {
      missing.push(rel);
    }
  }
  return { copied, missing };
}

function convertPost(p) {
  const bodyMd = rewriteGhostUrls(td.turndown(p.html || '')).trim();

  const featureRel = p.feature_image
    ? p.feature_image.replace('__GHOST_URL__/content/images/', '')
    : null;
  const featureWeb = featureRel ? IMG_WEB_PREFIX + featureRel : null;

  const { copied, missing } = copyReferencedImages(bodyMd, featureRel);

  const tags = tagsByPost[p.id] || [];
  const excerpt = (metaByPost[p.id]?.meta_description || '').trim();
  const date = new Date(p.published_at).toISOString();

  const fm = [
    '---',
    `title: ${yamlStr(p.title)}`,
    `date: ${date}`,
    `slug: ${yamlStr(p.slug)}`,
    excerpt ? `excerpt: ${yamlStr(excerpt)}` : null,
    `tags: [${tags.map(yamlStr).join(', ')}]`,
    featureWeb ? `featureImage: ${yamlStr(featureWeb)}` : null,
    `draft: ${p.status !== 'published'}`,
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  fs.mkdirSync(OUT_POSTS, { recursive: true });
  fs.writeFileSync(path.join(OUT_POSTS, `${p.slug}.md`), fm + bodyMd + '\n');

  return { copied, missing };
}

// Standalone Ghost pages (type === 'page') -> src/content/pages/<slug>.md
function convertPage(p) {
  const bodyMd = rewriteGhostUrls(td.turndown(p.html || '')).trim();
  const { copied, missing } = copyReferencedImages(bodyMd, null);
  const desc = (metaByPost[p.id]?.meta_description || '').trim();

  const fm = ['---', `title: ${yamlStr(p.title)}`, desc ? `description: ${yamlStr(desc)}` : null, '---', '']
    .filter((l) => l !== null)
    .join('\n');

  fs.mkdirSync(OUT_PAGES, { recursive: true });
  fs.writeFileSync(path.join(OUT_PAGES, `${p.slug}.md`), fm + bodyMd + '\n');
  return { copied, missing };
}

// Copy the fixed site assets (favicon, social cover, author photo) into public/.
// These are referenced by config, not post bodies, so they must be copied explicitly.
function copySiteAssets() {
  const settings = Object.fromEntries((data.settings || []).map((s) => [s.key, s.value]));
  const author = (data.users || [])[0] || {};
  const jobs = [
    [author.profile_image, path.join(PUBLIC_DIR, 'assets/author.jpeg')],
    [settings.cover_image, path.join(PUBLIC_DIR, 'assets/cover.jpeg')],
    ['__GHOST_URL__/content/images/icon/faviconV2', path.join(PUBLIC_DIR, 'favicon.png')],
  ];
  let n = 0;
  for (const [ghostUrl, dest] of jobs) {
    if (!ghostUrl) continue;
    const rel = ghostUrl.replace('__GHOST_URL__/content/images/', '');
    const src = path.join(IMAGES_SRC, decodeURIComponent(rel));
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      n++;
    } else {
      console.log(`  ⚠ site asset missing on disk: ${src}`);
    }
  }
  return n;
}

// ---------------------------------------------------------------------------

let postSel, pageSel;
if (explicitSlugs.length) {
  postSel = posts.filter((p) => p.type === 'post' && explicitSlugs.includes(p.slug));
  pageSel = posts.filter((p) => p.type === 'page' && explicitSlugs.includes(p.slug));
} else if (ALL) {
  postSel = posts.filter((p) => p.status === 'published' && p.type === 'post');
  pageSel = posts.filter((p) => p.status === 'published' && p.type === 'page');
} else {
  postSel = posts.filter((p) => POC_SLUGS.includes(p.slug));
  pageSel = [];
}

console.log(`Converting ${postSel.length} post(s) + ${pageSel.length} page(s)…\n`);
let totalImages = 0;
const allMissing = [];
for (const p of postSel) {
  const { copied, missing } = convertPost(p);
  totalImages += copied;
  allMissing.push(...missing);
  console.log(`  ✓ posts/${p.slug}.md  (${copied} images${missing.length ? `, ${missing.length} missing` : ''})`);
}
for (const p of pageSel) {
  const { copied, missing } = convertPage(p);
  totalImages += copied;
  allMissing.push(...missing);
  console.log(`  ✓ pages/${p.slug}.md  (${copied} images${missing.length ? `, ${missing.length} missing` : ''})`);
}
const assets = copySiteAssets();
console.log(`\nDone. ${postSel.length} posts, ${pageSel.length} pages, ${totalImages} images, ${assets} site assets copied.`);
if (allMissing.length) {
  console.log(`\n⚠  ${allMissing.length} referenced image(s) not found on disk:`);
  for (const m of [...new Set(allMissing)]) console.log(`     ${m}`);
}
