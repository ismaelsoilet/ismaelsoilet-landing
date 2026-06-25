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
    category: z.enum(['SEO', 'CRO', 'Performance', 'AIO', 'LGPD']),
    keywords: z.array(z.string()).min(1, "Insira pelo menos 1 palavra-chave.").max(8, "Limite de 8 palavras-chave."),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false).optional(),
    steps: z.array(z.string()).optional() // For HowTo schema on "como-" guides
  })
});

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    features: z.array(z.string()).min(1, "O serviço deve ter pelo menos 1 feature."),
    tiers: z.array(z.object({
      name: z.string(),
      price: z.string(),
      features: z.array(z.string())
    })).min(1, "Insira pelo menos 1 tier de preço.")
  })
});

const team = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional()
  })
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/testimonials' }),
  schema: z.object({
    clientName: z.string(),
    clientRole: z.string(),
    company: z.string(),
    quote: z.string(),
    avatar: z.string(),
    rating: z.number().min(1).max(5).default(5)
  })
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string().max(200, "A pergunta deve ter no máximo 200 caracteres."),
    answer: z.string().max(1000, "A resposta deve ter no máximo 1000 caracteres.")
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
  services,
  team,
  testimonials,
  faqs,
  legal
};
