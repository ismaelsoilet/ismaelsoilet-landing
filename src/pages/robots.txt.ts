import type { APIRoute } from 'astro';
import { site } from '../content/site';

const robotsTxt = `User-agent: *
Allow: /

# Block toxic scrapers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: ${site.org.url}/sitemap-index.xml
Sitemap: ${site.org.url}/image-sitemap.xml
`;

export const GET: APIRoute = async () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
