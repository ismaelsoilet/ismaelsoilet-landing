import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../content/site';

export async function GET(context: any) {
  const posts = await getCollection('blog', (post) => !post.data.draft);
  const sortedPosts = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 20);

  return rss({
    title: site.org.name,
    description: site.org.description,
    site: context.site || site.org.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: `<category>${post.data.category}</category>`,
      link: `/blog/${post.id}/`,
    })),
  });
}
