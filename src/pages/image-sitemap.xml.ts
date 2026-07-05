import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../content/site';
import profilePhoto from '../assets/ISMAEL PERFIL_COMPLETA.png';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => !post.data.draft);

  // Define page-to-image mapping
  const imageEntries = [
    {
      page: '',
      images: [
        { loc: '/logo-v2.svg', title: site.org.name },
        { loc: '/og-image.png', title: `${site.org.name} Hero` },
        { loc: profilePhoto.src, title: site.person?.name || site.org.name }
      ]
    },
    {
      page: '/blog',
      images: [
        { loc: '/logo-v2.svg', title: site.org.name }
      ]
    },
    ...posts.map(post => ({
      page: `/blog/${post.id}`,
      images: [
        { loc: '/logo-v2.svg', title: site.org.name },
        ...(post.data.cover ? [{ loc: post.data.cover, title: post.data.title }] : [])
      ]
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map(entry => `  <url>
    <loc>${escapeXml(site.org.url)}${escapeXml(entry.page)}</loc>
${entry.images.map(img => `    <image:image>
      <image:loc>${escapeXml(img.loc.startsWith('http') ? img.loc : `${site.org.url}${img.loc}`)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
