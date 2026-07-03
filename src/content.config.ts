import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(60, "O título deve ter no máximo 60 caracteres."),
    description: z.string().min(140, "A descrição deve ter no mínimo 140 caracteres.").max(160, "A descrição deve ter no máximo 160 caracteres."),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string(),
    category: z.enum(['Gestão Pública', 'Tecnologia', 'Ciência de Dados', 'Inovação']),
    keywords: z.array(z.string()).min(1, "Insira pelo menos 1 palavra-chave.").max(8, "Limite de 8 palavras-chave."),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false).optional(),
    steps: z.array(z.string()).optional() // For HowTo schema on "como-" guides
  })
});

const legal = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/legal' }),
  schema: z.object({
    lastUpdated: z.coerce.date(),
    sections: z.array(z.object({
      heading: z.string(),
      body: z.string()
    })).min(1, "A página legal precisa de pelo menos 1 seção de texto.")
  })
});

export const collections = {
  blog,
  legal
};

