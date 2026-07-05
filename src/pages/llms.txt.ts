import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../content/site';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => !post.data.draft);
  
  const content = `# ${site.person?.name || site.org.name}

> ${site.person?.description || site.org.description}

## Informações de Contato
- E-mail: ${site.contact.email}
- Telefone: ${site.contact.phone}
- Website: [${site.org.url}](${site.org.url})

## Redes Profissionais
- [LinkedIn](${site.social.linkedin})
- [GitHub](${site.social.github})

## Artigos do Blog (Insights)
${posts.slice(0, 5).map(post => `- [${post.data.title}](${site.org.url}/blog/${post.id}): ${post.data.description}`).join('\n')}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
