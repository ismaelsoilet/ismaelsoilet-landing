# Relatório de Auditoria — template-landing

> **Data:** 25/06/2026  
> **Escopo:** Configuração, padronização e uso correto do framework Astro  
> **Stack:** Astro 6.4 · Tailwind CSS 4.3 · pnpm 11.5

---

## Sumário de Achados

| Severidade | Qtde |
|---|---|
| 🔴 Crítico | 3 |
| 🟡 Moderado | 6 |
| 🔵 Baixo / Recomendação | 5 |

---

## 🔴 Críticos

### 1. `index.astro` — Arquivo monolítico de 2.046 linhas (98 KB)

**Arquivo:** [`src/pages/index.astro`](file:///home/ismaelsoilet/template-landing/src/pages/index.astro)

O `index.astro` contém **~900 linhas de CSS inline dentro de uma tag `<style>`** que redefine um design system completo (variáveis, grid, botões, tipografia, animações, dark mode) diretamente dentro da página. Além disso, contém **~150 linhas de JavaScript inline** (`<script is:inline>`).

**Problemas:**
- **Viola o padrão Astro de componentização**: todo o conteúdo da home deveria ser dividido em componentes reutilizáveis dentro de `src/components/`.
- **O CSS inline da home cria um sistema de design paralelo** ao já existente em `global.css` + Tailwind — com variáveis duplicadas (`--primary`, `--bg-main`, `--font-title`) que sobrescrevem/conflitam com os tokens definidos no `@theme` do `global.css`.
- **Dark mode inconsistente**: a home usa `:global(.dark)` com CSS vanilla para dark mode, enquanto todo o resto do projeto usa `dark:` do Tailwind CSS.
- **JS inline impede tree-shaking**: o `<script is:inline>` não é processado pelo bundler do Astro, o que impede dead-code elimination, minificação e caching de longo prazo via hash de conteúdo.

**Impacto:** Performance (CSS/JS duplicado enviado ao client), manutenibilidade severa, impossível de escalar.

**Recomendação:** Extrair seções da home em componentes `.astro` individuais (ex: `HeroSection.astro`, `SolutionsCarousel.astro`, `FaqSection.astro`). Migrar o CSS vanilla para classes Tailwind + o design system já existente. Converter o `<script is:inline>` para `<script>` (processado).

---

### 2. URL hardcoded do OG Image com hash de build

**Arquivo:** [`src/components/layout/BaseHead.astro`](file:///home/ismaelsoilet/template-landing/src/components/layout/BaseHead.astro#L24)

```typescript
const absoluteImageUrl = image.startsWith('http')
  ? image
  : `${site.org.url}/_astro/og-image.D2f2sM0-_zxzRh.webp`;
```

O hash `D2f2sM0-_zxzRh` é gerado pelo Vite/Astro em build-time e **muda a cada rebuild quando o asset é alterado**. Hardcodá-lo significa que:
- Qualquer alteração na imagem OG quebrará silenciosamente as meta tags de social sharing.
- O mesmo hash hardcoded também aparece em [`image-sitemap.xml.ts`](file:///home/ismaelsoilet/template-landing/src/pages/image-sitemap.xml.ts#L17).

**Recomendação:** Usar a API de imagens do Astro (`import ogImage from '../assets/og-image.png'`) e passar `ogImage.src` para gerar a URL correta automaticamente.

---

### 3. Dependência `@fontsource-variable/inter` instalada mas não utilizada

**Arquivo:** [`package.json`](file:///home/ismaelsoilet/template-landing/package.json#L33)

A dependência `@fontsource-variable/inter` está listada em `dependencies`, porém **não é importada em nenhum arquivo do projeto**. O projeto carrega a fonte via `@font-face` manual em [`global.css`](file:///home/ismaelsoilet/template-landing/src/styles/global.css#L6-L13) apontando para `/fonts/inter-latin-wght-normal.woff2` no diretório `public/`.

**Impacto:** Dependência desnecessária inflando `node_modules` e o lockfile (~240 KB de `pnpm-lock.yaml`).

**Recomendação:** Remover `@fontsource-variable/inter` do `package.json` se a estratégia é self-host via `public/fonts/`.

---

## 🟡 Moderados

### 4. i18n configurado mas sem rotas ou conteúdo para o locale `en`

**Arquivo:** [`astro.config.mjs`](file:///home/ismaelsoilet/template-landing/astro.config.mjs#L45-L51)

```js
i18n: {
  defaultLocale: 'pt-BR',
  locales: ['pt-BR', 'en'],
  routing: { prefixDefaultLocale: false },
},
```

O locale `en` está declarado, mas:
- Não existe nenhuma página, layout ou content collection com conteúdo em inglês.
- As tags `hreflang` em [`BaseHead.astro`](file:///home/ismaelsoilet/template-landing/src/components/layout/BaseHead.astro#L52-L53) apontam self-referencial para `pt-BR` e `x-default`, sem gerar o alternate para `en`.

**Impacto:** Ruído de configuração que pode confundir o build e sinalizar para buscadores um locale que não existe.

**Recomendação:** Remover `'en'` da configuração até que haja conteúdo internacionalizado, ou implementar as rotas `/en/...`.

---

### 5. `pnpm-workspace.yaml` com configuração perigosa e sem workspaces

**Arquivo:** [`pnpm-workspace.yaml`](file:///home/ismaelsoilet/template-landing/pnpm-workspace.yaml)

```yaml
dangerouslyAllowAllBuilds: true
```

O arquivo contém apenas `dangerouslyAllowAllBuilds: true` sem declarar nenhum workspace (`packages:`). Em um projeto single-package, este arquivo é desnecessário e a flag `dangerouslyAllowAllBuilds` desabilita restrições de segurança do pnpm para lifecycle scripts.

**Recomendação:** Remover o arquivo ou adicionar `packages: []` e avaliar se `dangerouslyAllowAllBuilds` é realmente necessário.

---

### 6. `@tailwindcss/typography` em `devDependencies` — deve ser `dependencies`

**Arquivo:** [`package.json`](file:///home/ismaelsoilet/template-landing/package.json#L46)

O plugin `@tailwindcss/typography` é carregado via `@plugin "@tailwindcss/typography"` no [`global.css`](file:///home/ismaelsoilet/template-landing/src/styles/global.css#L2) e é usado no build de produção. Listá-lo como `devDependency` funciona localmente, mas pode falhar em ambientes CI/CD que fazem `pnpm install --prod` antes do build.

**Recomendação:** Mover para `dependencies` (junto com `tailwindcss` e `@tailwindcss/vite`).

---

### 7. Versão hardcoded em `version.json.ts` — desincronizada do `package.json`

**Arquivo:** [`src/pages/version.json.ts`](file:///home/ismaelsoilet/template-landing/src/pages/version.json.ts#L4)

```typescript
return new Response(JSON.stringify({ version: '2.1.1' }), { ... });
```

A versão `2.1.1` está duplicada e hardcoded. O [`Footer.astro`](file:///home/ismaelsoilet/template-landing/src/components/layout/Footer.astro#L7) faz `pkg.version` corretamente, mas este endpoint não.

**Recomendação:** Importar a versão do `package.json` como já é feito no Footer:
```typescript
import pkg from '../../package.json';
// ...
JSON.stringify({ version: pkg.version })
```

---

### 8. `ConsentBanner.astro` usa `<script is:inline>` e não funciona com View Transitions

**Arquivo:** [`src/components/integrations/ConsentBanner.astro`](file:///home/ismaelsoilet/template-landing/src/components/integrations/ConsentBanner.astro#L23)

O script do consent banner é `is:inline` e usa `document.getElementById` no momento da execução inicial. Com View Transitions (que estão habilitadas via `<ClientRouter />`), o script inline é executado apenas na primeira carga da página. Ao navegar via View Transitions, **o banner não será re-inicializado**, e se o consent não tiver sido dado, o banner não aparecerá em pages subsequentes.

**Recomendação:** Converter para `<script>` processado com `document.addEventListener('astro:page-load', ...)` como é feito corretamente nos outros componentes (Header, MobileMenu, ContactForm, etc.).

---

### 9. Duplicação de dados de FAQ na Home

**Arquivo:** [`src/pages/index.astro`](file:///home/ismaelsoilet/template-landing/src/pages/index.astro#L6-L19)

A home define os dados de FAQ inline no frontmatter, enquanto existe uma content collection `faqs` com 5 itens em [`src/content/faqs/`](file:///home/ismaelsoilet/template-landing/src/content/faqs). A página de serviços (`servicos.astro`) usa corretamente `getCollection('faqs')`.

**Impacto:** Os dados estão duplicados e podem divergir. Manutenção dupla.

**Recomendação:** Usar `getCollection('faqs')` também na home, ou pelo menos um subset dela.

---

## 🔵 Baixo / Recomendações

### 10. Footer mistura categorias no bloco "Legal"

**Arquivo:** [`src/components/layout/Footer.astro`](file:///home/ismaelsoilet/template-landing/src/components/layout/Footer.astro#L57-L66)

O bloco "Legal" do footer mistura páginas legais (Privacidade, Termos) com páginas de documentação técnica (Visual Catalog, Quickstart Guide) que são `noindex`. Isso pode confundir usuários e crawlers.

**Recomendação:** Separar em duas colunas ("Legal" e "Recursos") ou remover os links de documentação interna do footer público.

---

### 11. `FaqSchema.astro` é um componente wrapper não utilizado

**Arquivo:** [`src/components/seo/FaqSchema.astro`](file:///home/ismaelsoilet/template-landing/src/components/seo/FaqSchema.astro)

Existe um componente `FaqSchema.astro` que encapsula `JsonLd` + `buildFaqSchema`, mas nenhuma página o usa — todas chamam `buildFaqSchema()` + `<JsonLd>` diretamente.

**Recomendação:** Usar `FaqSchema.astro` nas páginas que injetam FAQ schema, ou remover o componente se a abordagem direta é preferida, para evitar código morto.

---

### 12. `<img>` nativas sem otimização do Astro Image

**Arquivos:** Múltiplos ([`sobre.astro`](file:///home/ismaelsoilet/template-landing/src/pages/sobre.astro#L76-L79), [`BlogPostLayout.astro`](file:///home/ismaelsoilet/template-landing/src/layouts/BlogPostLayout.astro#L122), [`blog/index.astro`](file:///home/ismaelsoilet/template-landing/src/pages/blog/index.astro#L76))

O projeto usa `<img>` nativas em vez do componente `<Image>` do Astro (`astro:assets`), desperdiçando:
- Geração automática de `srcset` responsivo
- Conversão para WebP/AVIF
- Geração de `width`/`height` automáticos (prevenção de CLS)

Nota: a dependência `sharp` já está instalada no projeto, então o pipeline de imagens do Astro está disponível.

**Recomendação:** Migrar para `import { Image } from 'astro:assets'` nos componentes que renderizam imagens.

---

### 13. CSP bloqueia Google Analytics/GTM/Pixel quando tracking é habilitado

**Arquivo:** [`vercel.json`](file:///home/ismaelsoilet/template-landing/vercel.json#L40-L41) e [`public/_headers`](file:///home/ismaelsoilet/template-landing/public/_headers#L10)

A Content-Security-Policy permite `script-src 'self' 'unsafe-inline'`, porém quando os tracking IDs são configurados, o `PartytownScripts.astro` injeta scripts que carregam de domínios externos (`googletagmanager.com`, `connect.facebook.net`, `clarity.ms`, `hotjar.com`). Esses domínios **não estão na whitelist da CSP**, o que bloqueará os scripts em produção.

**Recomendação:** Adicionar os domínios dos trackers à CSP condicionalmente, ou documentar que a CSP deve ser atualizada ao habilitar tracking.

---

### 14. `define:vars` em `<script type="text/partytown">` pode não funcionar

**Arquivo:** [`src/components/integrations/WebVitalsReporter.astro`](file:///home/ismaelsoilet/template-landing/src/components/integrations/WebVitalsReporter.astro#L12)

```html
<script type="text/partytown" define:vars={{ endpoint }}>
```

A diretiva `define:vars` do Astro injeta variáveis como declarações `const` no topo do script. Contudo, `type="text/partytown"` faz com que o Partytown processe o script em um web worker, e a injeção de `define:vars` pode não funcionar corretamente nesse contexto, já que o Astro pode não processar o script como esperado quando `type` não é `module`.

**Recomendação:** Testar em produção com o endpoint configurado. Se falhar, considerar usar `is:inline define:vars` ou interpolar diretamente na string do script como feito no `PartytownScripts.astro`.

---

## Resumo Geral

O projeto está **bem estruturado** em termos de arquitetura Astro (layouts, components, content collections, SEO schemas). Contudo, o maior problema é a **dualidade de design systems**: a home page (`index.astro`) opera como um projeto separado com CSS vanilla completo, enquanto todo o restante do site usa Tailwind CSS idiomático. Isso cria inconsistência de manutenção e performance.

### Prioridades de Correção Sugeridas

1. **Refatorar `index.astro`** — componentizar e migrar para Tailwind (maior impacto)
2. **Corrigir URL do OG Image** — usar import do Astro
3. **Remover `@fontsource-variable/inter`** — dependência morta
4. **Corrigir `ConsentBanner`** — compatibilidade com View Transitions
5. **Limpar i18n** — remover locale `en` fantasma
