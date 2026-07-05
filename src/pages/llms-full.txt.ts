import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../content/site';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => !post.data.draft);

  const content = `# ${site.person?.name || site.org.name}

> Esta é a documentação completa do portfólio profissional e artigos de ${site.person?.name || site.org.name} para agentes de IA e ferramentas LLM.

## Sitemap de Conteúdo
- Home: [${site.org.url}/](${site.org.url}/)
- Blog: [${site.org.url}/blog](${site.org.url}/blog)

## Recursos Adicionais
- Sitemap XML: [${site.org.url}/sitemap-index.xml](${site.org.url}/sitemap-index.xml)
- Sitemap de Imagens: [${site.org.url}/image-sitemap.xml](${site.org.url}/image-sitemap.xml)
- Feed RSS: [${site.org.url}/feed.xml](${site.org.url}/feed.xml)
- Versão: [${site.org.url}/version.json](${site.org.url}/version.json)

## Índice do Blog (Todos os Artigos)
${posts.map(post => `### ${post.data.title}
- Categoria: ${post.data.category}
- URL: [${site.org.url}/blog/${post.id}](${site.org.url}/blog/${post.id})
- Descrição: ${post.data.description}
- Data de Publicação: ${post.data.pubDate.toLocaleDateString('pt-BR')}`).join('\n\n')}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
