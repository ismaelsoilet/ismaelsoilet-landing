#!/usr/bin/env node
/**
 * scripts/visualize.mjs
 *
 * Prints a friendly URL map + what to expect on each page so the developer
 * can navigate a local dev/preview server with full context.
 *
 * Usage:
 *   pnpm visualize            # print the full map
 *   pnpm dev                  # (separate terminal) — then visit the URLs
 *   pnpm build && pnpm preview
 *
 * Optional: pass `--port=4321` to override the default Astro port.
 */

const port = (process.argv.find((a) => a.startsWith("--port=")) || "--port=4321").split("=")[1];
const base = `http://localhost:${port}`;

const map = [
  { group: "🏠 HOME", items: [
    { path: "/", desc: "Home com 10 seções (hero, diferenciais, solucoes, metricas, depoimentos, showcase, planos, mid-CTA, faq, cta-final). Teste o toggle de dark mode e o WhatsApp float." },
  ]},
  { group: "📄 PÁGINAS", items: [
    { path: "/sobre", desc: "Página institucional. Time (3 membros) e história da empresa." },
    { path: "/servicos", desc: "Catálogo de planos (Bronze/Gold/Diamond) com JSON-LD Service + FAQPage. 3 tiers do `src/content/services/`." },
    { path: "/contato", desc: "Formulário com honeypot. Submeta sem o honeypot e veja o POST em `/api/submit-form` no DevTools Network." },
    { path: "/blog", desc: "Hub de 7 artigos. Categorias: AIO, CRO, Performance, LGPD." },
    { path: "/privacidade", desc: "Política de privacidade (noindex). Conteúdo de `src/content/legal/privacidade.json`." },
    { path: "/termos", desc: "Termos de uso (noindex). Conteúdo de `src/content/legal/termos.json`." },
  ]},
  { group: "🛠️ CATÁLOGO & TUTORIAIS", items: [
    { path: "/components", desc: "Catálogo vivo de todos os 10 componentes UI (Button, Card, GlassCard, Section, Badge, Tabs, Accordion, Skeleton, ContactForm, Honeypot) em todos os estados." },
    { path: "/quickstart", desc: "Walkthrough de 5 passos para rebranding em 30 minutos." },
    { path: "/404", desc: "Página de erro customizada. Acesse qualquer URL inexistente para ver." },
  ]},
  { group: "📚 BLOG (7 posts)", items: [
    { path: "/blog/aio-ready-landing-page-para-chatgpt-claude-gemini", desc: "AIO Ready: Landing Pages para ChatGPT, Claude e Gemini" },
    { path: "/blog/core-web-vitals-2026-guia-definitivo-lcp-cls-inp", desc: "Core Web Vitals 2026: Guia Definitivo LCP, CLS e INP" },
    { path: "/blog/cro-avancado-12-tecnicas-de-conversao-2026", desc: "CRO Avançado: 12 Técnicas de Conversão de 2026" },
    { path: "/blog/como-roteamento-spa-vanilla-acelera-engajamento-organico", desc: "Roteador SPA Vanilla: Velocidade e Engajamento Orgânico" },
    { path: "/blog/lgpd-gdpr-checklist-tecnico-landing-page", desc: "Checklist Técnico LGPD e GDPR para Landing Pages" },
    { path: "/blog/como-integrar-webhooks-crm-em-landing-pages", desc: "Como Integrar Webhooks para CRM em Landing Pages" },
    { path: "/blog/arquitetura-css-tailwind-escalavel-para-landing-pages", desc: "Arquitetura CSS: Escalar Tailwind sem Poluir o HTML (bônus)" },
  ]},
  { group: "🔌 ENDPOINTS & META", items: [
    { path: "/llms.txt", desc: "Contexto LLM resumido. Aparece no robots de LLMs." },
    { path: "/llms-full.txt", desc: "Contexto LLM expandido." },
    { path: "/sitemap.xml", desc: "Sitemap gerado pelo @astrojs/sitemap (exclui páginas noindex)." },
    { path: "/sitemap-index.xml", desc: "Índice de sitemaps (gerado pela integração)." },
    { path: "/image-sitemap.xml", desc: "Sitemap de imagens." },
    { path: "/feed.xml", desc: "RSS 2.0 com últimos 20 posts." },
    { path: "/robots.txt", desc: "Diretivas de crawling + Sitemap." },
    { path: "/version.json", desc: "{ version, builtAt } — para health check programático." },
  ]},
  { group: "🧪 HEALTH CHECKS", items: [
    { path: "/api/status-heartbeat", desc: "Proxy para Uptime Kuma (200 se online). Configurado em `public/_redirects` para CF Pages, `vercel.json` para Vercel, e `nginx.conf` para Docker." },
  ]},
];

const c = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", cyan: "\x1b[36m", yellow: "\x1b[33m",
  magenta: "\x1b[35m", gray: "\x1b[90m",
};

console.log("");
console.log(`${c.bold}${c.cyan}🗺️  MAPA DE VISUALIZAÇÃO — template-landing v2.0.0${c.reset}`);
console.log(`${c.dim}Astro 6.4.4 + Tailwind v4.3.0 + pnpm@11.5.2 + Node ≥22.12.0${c.reset}`);
console.log(`${c.dim}Base URL: ${base}${c.reset}`);
console.log("");

for (const { group, items } of map) {
  console.log(`${c.bold}${c.yellow}${group}${c.reset}`);
  for (const { path, desc } of items) {
    const url = `${base}${path}`;
    console.log(`  ${c.green}${url}${c.reset}`);
    console.log(`    ${c.gray}${desc}${c.reset}`);
  }
  console.log("");
}

console.log(`${c.bold}${c.magenta}💡 CHECKLIST DE TESTE (5 minutos)${c.reset}`);
console.log(`  ${c.dim}1.${c.reset} Abra ${c.green}${base}/${c.reset} — confirme que o tema padrão (light) carrega SEM flash branco (FOUC)`);
console.log(`  ${c.dim}2.${c.reset} Clique no botão sol/lua no header — alterna tema, persistido em localStorage`);
console.log(`  ${c.dim}3.${c.reset} Abra DevTools → Network → recarregue — confirme JS principal ${c.bold}<= 30KB${c.reset} gzipped`);
console.log(`  ${c.dim}4.${c.reset} Abra DevTools → Application → Local Storage — veja o item 'theme: light|dark'`);
console.log(`  ${c.dim}5.${c.reset} Abra DevTools → Elements → <head> — procure o <script is:inline> do theme bootstrap`);
console.log(`  ${c.dim}6.${c.reset} Navegue para ${c.green}${base}/blog/core-web-vitals-2026-guia-definitivo-lcp-cls-inp${c.reset} — confirme View Transition animation`);
console.log(`  ${c.dim}7.${c.reset} Pressione Tab na home — o primeiro focus deve ser o link "Pular para o conteúdo" (skip-to-content)`);
console.log(`  ${c.dim}8.${c.reset} Abra ${c.green}${base}/components${c.reset} — veja todos os 10 componentes em todos os estados`);
console.log(`  ${c.dim}9.${c.reset} Abra ${c.green}${base}/contato${c.reset} — submeta o form. DevTools Network: POST para /api/submit-form. Em dev, será 404 (proxy só existe em deploy).`);
console.log(`  ${c.dim}10.${c.reset} Inspecione a página → View Source → procure ${c.bold}application/ld+json${c.reset}. Deve ter Organization + WebPage (home) ou BlogPosting (post).`);
console.log("");
console.log(`${c.bold}📊 DIAGNÓSTICOS${c.reset}`);
console.log(`  ${c.dim}Tailwind:    ${c.reset}${c.green}pnpm exec tailwindcss --help${c.reset}  (não funciona — Tailwind v4 é via Vite plugin)`);
console.log(`  ${c.dim}Typecheck:   ${c.reset}${c.green}pnpm typecheck${c.reset}`);
console.log(`  ${c.dim}QA all:      ${c.reset}${c.green}pnpm verify${c.reset}  (typecheck + check-icons + smoke-test + qa-seo + size-limit)`);
console.log(`  ${c.dim}Full CI:     ${c.reset}${c.green}pnpm ci${c.reset}  (verify + build + broken-links + check-a11y)`);
console.log("");
