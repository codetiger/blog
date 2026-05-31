// Single source of truth for site-wide constants (used by SEO, RSS, author page).
export const SITE = {
  title: 'Small World',
  tagline: 'Random ideas, and attempts',
  description:
    'Blog on random ideas & hobbies by Harishankar (Codetiger). Interesting automation projects on electronics & programming using Raspberry Pi and ESP32.',
  ogSiteName: 'Small World',
  defaultImage: '/blog/assets/cover.jpeg',
  twitter: '@codetiger',
  pageSize: 10,
  author: {
    name: 'Harishankar',
    slug: 'codetiger',
    twitter: '@codetiger',
    bio: 'An ordinary human with huge passion towards electronics design from childhood. Later seduced by computer programming & became software architect by profession.',
    image: '/blog/assets/author.jpeg',
    links: [
      { label: '@codetiger on GitHub', href: 'https://github.com/codetiger' },
      { label: '@code42tiger on LinkedIn', href: 'https://www.linkedin.com/in/code42tiger/' },
      { label: '@codetiger on Twitter', href: 'https://twitter.com/codetiger' },
    ],
  },
} as const;
