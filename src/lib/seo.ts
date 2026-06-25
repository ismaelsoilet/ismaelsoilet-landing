import { site } from '../content/site';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  price?: string;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.org.url}/#organization`,
    "name": site.org.name,
    "url": site.org.url,
    "logo": {
      "@type": "ImageObject",
      "@id": `${site.org.url}/#logo`,
      "url": site.org.logo,
      "caption": site.org.name
    },
    "image": {
      "@id": `${site.org.url}/#logo`
    },
    "description": site.org.description,
    "sameAs": site.org.sameAs
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.org.url}/#website`,
    "url": site.org.url,
    "name": site.org.name,
    "description": site.org.description,
    "publisher": {
      "@id": `${site.org.url}/#organization`
    },
    "inLanguage": "pt-BR"
  };
}

export function buildWebPageSchema(path: string, title: string, description: string) {
  const canonicalUrl = `${site.org.url}${path.startsWith('/') ? path : '/' + path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}/#webpage`,
    "url": canonicalUrl,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": `${site.org.url}/#website`
    },
    "about": {
      "@id": `${site.org.url}/#organization`
    },
    "inLanguage": "pt-BR"
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith('http') ? item.item : `${site.org.url}${item.item.startsWith('/') ? item.item : '/' + item.item}`
    }))
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export function buildBlogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updated?: Date;
  author: string;
  cover?: string;
}) {
  const postUrl = `${site.org.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}/#entry`,
    "isPartOf": {
      "@type": "WebPage",
      "@id": `${postUrl}/#webpage`
    },
    "headline": post.title,
    "description": post.description,
    "datePublished": post.pubDate.toISOString(),
    "dateModified": (post.updated || post.pubDate).toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": site.org.url
    },
    "publisher": {
      "@id": `${site.org.url}/#organization`
    },
    "image": post.cover ? (post.cover.startsWith('http') ? post.cover : `${site.org.url}${post.cover}`) : site.org.logo,
    "mainEntityOfPage": postUrl
  };
}

export function buildHowToSchema(title: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    }))
  };
}

export function buildServiceSchema(services: ServiceItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Consulting and Technical Solutions",
    "provider": {
      "@id": `${site.org.url}/#organization`
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catálogo de Serviços",
      "itemListElement": services.map((s, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.name,
          "description": s.description
        },
        ...(s.price ? {
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": s.price.replace(/[^\d\.]/g, ''),
            "priceCurrency": "BRL"
          }
        } : {})
      }))
    }
  };
}
