# 👀 Como Visualizar as Páginas (Antes do Deploy)

> Guia rápido e definitivo. **Você não precisa de deploy para ver tudo funcionando** — o dev server do Astro renderiza exatamente o mesmo HTML que vai para produção.

---

## ⚡ TL;DR (3 comandos)

```bash
cd /home/ismaelsoilet/template-landing
pnpm install            # 1ª vez: ~30s (com lockfile)
pnpm dev                # http://localhost:4321
# Em outro terminal (opcional):
pnpm visualize          # imprime o mapa de URLs + checklist de teste
```

Abra **http://localhost:4321** no navegador. Pronto. 🎉

---

## 📋 Pré-requisitos

```bash
node --version    # precisa ser >= 22.12.0
pnpm --version    # precisa ser 11.5.2 (declarado em packageManager)
```

Se `pnpm` não estiver instalado:
```bash
corepack enable
corepack prepare pnpm@11.5.2 --activate
```

Se você preferir usar `npm` em vez de `pnpm`, **funciona** (o lockfile é `pnpm-lock.yaml` mas `npm install` vai criar `package-lock.json` paralelo). O CI está fixado em pnpm, então a recomendação é pnpm.

---

## 🚀 Passo 1 — Instalar Dependências

```bash
cd /home/ismaelsoilet/template-landing
pnpm install --frozen-lockfile
```

**O que acontece:**
- Lê `pnpm-lock.yaml` (já commitado, 84 packages).
- Baixa ~85MB em `node_modules/`.
- Prepara o cache do pnpm (offline-friendly para próximos installs).

**Tempo esperado:** 30-60 segundos (com internet boa).

**Saída esperada (final):**
```
Done in 42.3s using pnpm v11.5.2
85 packages installed
```

---

## 🎬 Passo 2 — Iniciar o Dev Server

```bash
pnpm dev
```

**O que acontece:**
- Astro 6 sobe um Vite dev server.
- HMR (hot module reload) ativo: editar qualquer arquivo `.astro` recarrega a página instantaneamente.
- Acessa `src/content/*` (Zod schemas) na inicialização — erro de frontmatter aparece aqui.

**Saída esperada:**
```
  ╭──────────────────────────────────────────────────╮
  │ Astro v6.4.4                                     │
  │ ready in 432 ms                                  │
  │                                                  │
  │ ▶ Local    http://localhost:4321/                │
  │ ▶ Network  http://192.168.X.X:4321/              │
  ╰──────────────────────────────────────────────────╯
```

Abra **http://localhost:4321** no navegador. Você deve ver:

1. **Hero section** com headline "Suitplus" (ou seu nome, depois de rebranding), fundo radial slate-900 → 950, 2 botões CTA.
2. **Diferenciais** com 6 cards em grid.
3. **Soluções** com 4 cards.
4. **Métricas** com 4 stats grandes em fundo escuro.
5. **Depoimentos** com 3 cards de testemunho.
6. **Showcase** com grid de cases.
7. **Planos** com 3 tiers (Bronze, Gold, Diamond).
8. **Banner CTA** mid-page com gradient.
9. **FAQ** com 5 perguntas em accordion (clique para expandir).
10. **CTA Final** com 2 blurs cyan/indigo.
11. **Footer** com 4 colunas.

**Botão flutuante** do WhatsApp no canto inferior direito (em todas as páginas).

---

## 🗺️ Passo 3 — Navegar pelo Mapa de URLs

Execute em **outro terminal** (com o `pnpm dev` rodando no primeiro):

```bash
pnpm visualize
```

**Saída:** mapa colorido com 30+ URLs e o que esperar em cada uma. Inclui:

- **🏠 HOME** (`/`) — 10 seções
- **📄 PÁGINAS** (`/sobre`, `/servicos`, `/contato`, `/blog`, `/privacidade`, `/termos`)
- **🛠️ CATÁLOGO & TUTORIAIS** (`/components`, `/quickstart`, `/404`)
- **📚 BLOG** (7 posts individuais)
- **🔌 ENDPOINTS** (`/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/feed.xml`, `/robots.txt`, `/version.json`)
- **🧪 HEALTH CHECKS** (`/api/status-heartbeat`)

Cada item mostra a URL completa e uma descrição do que ver.

---

## ✅ Checklist de Teste (5 minutos)

| # | Ação | Onde ver | Esperado |
|---|------|----------|----------|
| 1 | Carregar `/` | Visual | Sem flash branco (FOUC). Tema light carrega direto. |
| 2 | Toggle dark mode | Header (botão sol/lua) | Troca de tema. Recarregue: persiste. |
| 3 | Inspecionar Network → JS | DevTools | Bundle principal **≤ 30KB gz** (excluindo Partytown). |
| 4 | Inspecionar localStorage | DevTools → Application | Item `theme: light` ou `dark`. |
| 5 | Inspecionar `<head>` | DevTools → Elements | `<script is:inline>` de theme bootstrap (sem `type="module"`, sem `defer`). |
| 6 | Navegar `/` → `/blog` → voltar | Visual | View Transition animation (slide/fade) entre páginas. |
| 7 | Pressionar Tab na `/` | Visual | **Primeiro focus** = "Pular para o conteúdo" (skip-to-content). |
| 8 | Abrir `/components` | Visual | 10 componentes em todos os estados (light/dark, default/hover/disabled). |
| 9 | Abrir `/contato` e submeter | DevTools Network | POST para `/api/submit-form` (em dev = 404; em prod = proxy real). |
| 10 | View Source → procurar `application/ld+json` | View Source | JSON-LD Organization + WebPage (home) ou BlogPosting (post). |
| 11 | Mobile: DevTools → iPhone SE | Visual | Layout colapsado, menu hamburger, **sem** backdrop-blur (regra do `theme.ts`). |
| 12 | `prefers-reduced-motion: reduce` em DevTools → Rendering | Visual | Animações desabilitam (transitions e WhatsApp float parado). |

---

## 🏗️ Modo Produção (Preview do Build)

Quando quiser ver **exatamente** o que vai para deploy:

```bash
# Terminal 1
pnpm build             # gera dist/ (~912K, ~10s)
pnpm preview           # serve dist/ em http://localhost:4321
```

**Diferenças vs dev:**
- Sem HMR (edits não recarregam).
- HTML/CSS/JS minificados e hasheados.
- Partytown em modo produção.
- Lighthouse scores reais (use `pnpm dev` para editar; `pnpm preview` para validar).

**Para Lighthouse CI completo:**

```bash
pnpm build
pnpm dlx @lhci/cli@0.15 autorun
# Gera relatório em .lighthouseci/ e falha o build se perf < 0.90 mobile ou < 0.95 desktop.
```

---

## 🐳 Modo Docker (Simula Deploy Real)

Para testar como o site vai se comportar em produção (nginx, security headers, API proxies):

```bash
pnpm build             # gera dist/
docker build -t template-landing:test .
docker run -d -p 8080:80 --name tpl template-landing:test
# Acesse http://localhost:8080
curl -I http://localhost:8080/    # veja os headers de segurança
curl http://localhost:8080/llms.txt | head
docker stop tpl && docker rm tpl
```

**Valide:**
- `Content-Security-Policy` header presente.
- `Strict-Transport-Security` presente.
- `Llms-Txt: /llms.txt` header presente.
- `/api/submit-form` retorna 200 (proxy para n8n — se não estiver online, 502/504 do n8n, o que é esperado).

---

## 🧪 Rodar Todos os Testes

```bash
pnpm typecheck        # astro check (TypeScript strict)
pnpm check-icons      # valida <use href="#icon-...">
pnpm check-tracking   # garante que Partytown é zero-JS quando tracking vazio
pnpm check-ai-files   # (warn) paridade agents.md/.cursorrules/.windsurfrules
pnpm check-a11y       # axe-core em todas as páginas
pnpm smoke-test       # valida theme script is:inline no HTML
pnpm qa-seo           # valida JSON-LD, llms.txt, sitemaps, placeholders
pnpm broken-links     # crawla dist/ e detecta 404
pnpm size-limit       # JS bundle ≤ 30KB gz

# Aliases de conveniência:
pnpm verify           # typecheck + check-icons + smoke-test + qa-seo + size-limit
pnpm ci               # verify + build + broken-links + check-a11y
```

**Saída esperada de `pnpm verify` (todos os checks devem passar):**
```
✔ typecheck    — 0 errors
✔ check-icons  — 47/47 icons resolved
✔ smoke-test   — 14/14 pages have is:inline theme script
✔ qa-seo       — 14/14 JSON-LD valid, llms.txt complete
✔ size-limit   — 28.4 kB gz (under 30 kB limit)
```

---

## 🎨 Customização Rápida (Rebranding em 30 min)

Edite **um arquivo** + substitua **um logo**:

```bash
nano src/content/site.ts        # ou seu editor favorito
```

```typescript
export const site: SiteConfig = {
  org: {
    name: "Sua Empresa",                          // ← mude
    url: "https://seudominio.com.br",             // ← mude
    logo: "https://seudominio.com.br/logo.svg",  // ← mude
    description: "Sua frase de posicionamento.",  // ← mude
    sameAs: [/* suas redes sociais */]            // ← mude
  },
  contact: {
    email: "voce@suaempresa.com.br",              // ← mude
    phone: "+55 (11) 98888-7777",                 // ← mude
    whatsapp: "https://wa.me/5511988887777"       // ← mude
  },
  // ... (resto fica igual por enquanto)
};
```

Substitua o logo:
```bash
cp /caminho/do/seu/logo.svg public/logo.svg
```

**Recarregue o navegador.** Em segundos, TODO o site atualiza:
- Header (logo + nome)
- Footer
- Sitemap
- llms.txt
- llms-full.txt
- JSON-LD Organization
- `<title>` de todas as páginas
- Open Graph tags

**Depois:** edite `src/content/blog/*.mdx` (delete ou adapte os 7 posts), `src/content/faqs/*.json`, `src/content/team/*.json`, `src/content/services/*.json`. Cada arquivo JSON tem 1 objeto por linha. `pnpm build` valida tudo via Zod.

**O guia `/quickstart`** no site (ou `http://localhost:4321/quickstart`) tem 5 passos visuais.

---

## 🚨 Troubleshooting

### "Module not found" no `pnpm dev`
- Você rodou `pnpm install`? Rode agora.
- Limpe o cache: `rm -rf node_modules .astro && pnpm install`.

### "Port 4321 already in use"
```bash
pnpm dev -- --port 4322
# ou mata o processo:
lsof -i :4321 -t | xargs kill -9
```

### "Partytown warning: tracking IDs are empty"
- Isso é **normal** quando `site.tracking` está vazio. O template é zero-JS por padrão. Para ativar tracking, preencha os IDs em `src/content/site.ts`.

### "Astro check: 0 errors, 0 warnings, X hints"
- Hints são **avisos não-críticos** (ex: "this CSS rule is unused"). Não bloqueiam o build. Para limpar, remova a regra ou use `// astro-ignore`.

### "size-limit: 30 kB exceeded by 2.3 kB"
- Você adicionou uma dependência JS grande. Reveja `package.json` deps e prefira componentes estáticos.
- Para checar qual arquivo estourou: `pnpm exec size-limit --why`.

### "View Transitions não animam"
- View Transitions API é suportada em Chromium-based browsers. Firefox e Safari têm fallback (transição instantânea). Normal.

### "Form de contato dá 404 em dev"
- Em dev (`pnpm dev`), o proxy `/api/submit-form` **não existe** — ele é configurado no deploy (nginx, Vercel, CF Pages). Para testar o flow, faça deploy ou use `pnpm build && pnpm preview` + configure um endpoint stub.

### "Light mode tem flash branco antes do dark"
- O script `is:inline` no `<head>` está ausente ou atrasado. Confirme em DevTools → Elements → `<head>` que o primeiro `<script>` é o theme bootstrap. Se sumiu após uma edição, recoloque de `src/lib/theme.ts` no `BaseHead.astro`.

---

## 📚 Próximos Passos

Quando estiver satisfeito com a visualização local:

1. **Rebrand** o site (30 min) — siga `/quickstart` ou a seção "Customização Rápida" acima.
2. **Build de produção** — `pnpm build`. Confirme que `dist/` foi gerado.
3. **Valide** — `pnpm ci` (todos os checks). Deve passar tudo.
4. **Deploy** — escolha um dos 3 alvos:
   - **Docker/nginx:** `docker build -t site . && docker run -d -p 80:80 site`
   - **Vercel:** `vercel --prod` (lê `vercel.json`)
   - **Cloudflare Pages:** `wrangler pages deploy dist/`
5. **Configure DNS** e ative SSL.
6. **Verifique com PageSpeed Insights:** https://pagespeed.web.dev/

---

> **Dúvidas?** Abra `agents.md` (o manual arquitetural canônico, 240+ linhas) ou `.cursorrules` / `.windsurfrules` (resumos para AI tools). Tudo que você precisa saber sobre as decisões de design está documentado.
