import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts, postHref } from '../lib/posts';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE.title,
    description: SITE.tagline,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.excerpt ?? '',
      pubDate: p.data.date,
      link: postHref(p.data.slug), // /blog/<slug>/ — rss() resolves against `site`
      categories: p.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
