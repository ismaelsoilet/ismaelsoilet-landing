# Plano de Correção de Acessibilidade

> **Data:** 7 de junho de 2026
> **Ferramenta de referência:** PageSpeed Insights / Lighthouse 13.3.0
> **URL testado:** `https://template.suitplus.com.br/`
> **Nota atual:** Acessibilidade 95 (meta: 100)

---

## 1. CONTRASTE — Cores de primeiro e segundo plano insuficientes

### Falha 1.1 — Badge da Hero (CRÍTICO)

**Arquivo:** `src/pages/index.astro`
**Linha:** 1085
**Elemento:** `<span>` com texto "🚀 Seção Hero: A Primeira Impressão do Usuário"

```html
<span style="font-family: var(--font-title); font-weight: 700; text-transform: uppercase; color: var(--primary); font-size: 0.875rem; letter-spacing: 0.1em; display: inline-block; margin-bottom: 1rem;">
```

**Problema:** `--primary` = `#6366f1` (indigo-500) sobre fundo `#f8fafc` (slate-50) resulta em contraste ~4.4:1. Falha WCAG AA (mínimo 4.5:1).

**Correção:** Trocar `color: var(--primary)` por `color: #4f46e5` (indigo-600). Contraste resultante: ~5.3:1.

```diff
- color: var(--primary);
+ color: #4f46e5;
```

---

### Falha 1.2 — Texto dentro de `.home-wrapper`

**Arquivo:** `src/pages/index.astro`
**Linha:** 1080
**Elemento:** `<div class="home-wrapper">`

**Problema:** O Lighthouse reporta o wrapper como contexto de contraste. A causa raiz é o badge acima (Falha 1.1). Corrigir 1.1 resolve esta falha automaticamente.

---

## 2. NAVEGAÇÃO — Ordem de títulos não sequencial

### Falha 2.1 — `h4` após `h2` no Epicentro Tabs (CRÍTICO)

**Arquivo:** `src/pages/index.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 1238 | `<h4>Landing Page Premium</h4>` | Após h2 "O epicentro..." | `h3` |
| 1266 | `<h4>HUB Digital Corporativo</h4>` | Após h2 "O epicentro..." | `h3` |
| 1294 | `<h4>Consultoria Digital</h4>` | Após h2 "O epicentro..." | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.2 — `h4` após `h2` no Solutions Tabs

**Arquivo:** `src/pages/index.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 1395 | `<h4>Otimização para Alta Conversão (CRO)</h4>` | Após h2 "Nossos Módulos..." | `h3` |
| 1416 | `<h4>Performance Extrema (Core Web Vitals)</h4>` | Após h2 "Nossos Módulos..." | `h3` |
| 1437 | `<h4>Automação de Webhooks Assíncronos</h4>` | Após h2 "Nossos Módulos..." | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.3 — `h4` após `h2` na seção Estatísticas

**Arquivo:** `src/pages/index.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 1564 | `<h4>Pontuação de Velocidade</h4>` | Após h2 "Como um site..." | `h3` |
| 1573 | `<h4>Mais Otimizado para IAs</h4>` | Após h2 "Como um site..." | `h3` |
| 1582 | `<h4>Tempo de Resposta SPA</h4>` | Após h2 "Como um site..." | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.4 — `h4` no Footer (CRÍTICO — visível no relatório)

**Arquivo:** `src/components/layout/Footer.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 48 | `<h4>Mapa do Site</h4>` | Após h2 implícito do layout | `h3` |
| 59 | `<h4>Legal</h4>` | Após h2 implícito do layout | `h3` |
| 70 | `<h4>Contato</h4>` | Após h2 implícito do layout | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.5 — `h4` após `h2` no index-exemplo (Tabs)

**Arquivo:** `src/pages/index-exemplo.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 196 | `<h4>Otimização da Taxa de Conversão (CRO)</h4>` | Após h2 "Foco total..." | `h3` |
| 208 | `<h4>SEO Avançado e Preparação para IA</h4>` | Após h2 "Foco total..." | `h3` |
| 220 | `<h4>Integrações de Formulários & Webhooks</h4>` | Após h2 "Foco total..." | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.6 — `h4` após `h2` no index-exemplo (Métricas)

**Arquivo:** `src/pages/index-exemplo.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 239 | `<h4>Velocidade</h4>` | Após h2 "O que dizem..." | `h3` |
| 245 | `<h4>Conversão</h4>` | Após h2 "O que dizem..." | `h3` |
| 251 | `<h4>Uptime</h4>` | Após h2 "O que dizem..." | `h3` |
| 257 | `<h4>Lighthouse</h4>` | Após h2 "O que dizem..." | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 4 linhas.

---

### Falha 2.7 — `h4` após `h2` no index-exemplo (Depoimentos)

**Arquivo:** `src/pages/index-exemplo.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 297 | `<h4>{item.data.clientName}</h4>` | Após h2 "O que dizem..." | `h3` |

**Correção:** Trocar `<h4>` por `<h3>`.

---

### Falha 2.8 — `h4` após `h2` no components (Tabs)

**Arquivo:** `src/pages/components.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 178 | `<h4>Conteúdo da Aba de Informações</h4>` | Após h2 "Abas (Tabs)" | `h3` |
| 184 | `<h4>Especificações Técnicas</h4>` | Após h2 "Abas (Tabs)" | `h3` |
| 190 | `<h4>Canais de Suporte Dedicados</h4>` | Após h2 "Abas (Tabs)" | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 3 linhas.

---

### Falha 2.9 — `h4` após `h2` no components (KPIs)

**Arquivo:** `src/pages/components.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 220 | `<h4>Uptime</h4>` | Após h2 "Estatísticas e KPIs" | `h3` |
| 224 | `<h4>Usuários</h4>` | Após h2 "Estatísticas e KPIs" | `h3` |
| 228 | `<h4>Satisfação</h4>` | Após h2 "Estatísticas e KPIs" | `h3` |
| 232 | `<h4>Respostas</h4>` | Após h2 "Estatísticas e KPIs" | `h3` |

**Correção:** Trocar todos os `<h4>` por `<h3>` nestas 4 linhas.

---

### Falha 2.10 — `h4` após `h2` no sobre (Depoimentos)

**Arquivo:** `src/pages/sobre.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 123 | `<h4>{item.data.clientName}</h4>` | Após h2 "Opinião de quem confia..." | `h3` |

**Correção:** Trocar `<h4>` por `<h3>`.

---

### Falha 2.11 — `h3` após `h1` no servicos (CRÍTICO)

**Arquivo:** `src/pages/servicos.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 62 | `<h3>{tier.name}</h3>` | Após h1 "Estruturas sob medida..." | `h2` |

**Correção:** Trocar `<h3>` por `<h2>`.

---

### Falha 2.12 — `h3` após `h1` no servicos (Garantia)

**Arquivo:** `src/pages/servicos.astro`

| Linha | Atual | Contexto | Correção |
|-------|-------|----------|----------|
| 117 | `<h3>Garantia de Uptime</h3>` | Após h2 "O que está incluído..." | OK (sequência correta) |

**Status:** ✅ Correto — h3 após h2 é válido.

---

## 3. ARIA — Melhorias em componentes de abas

### Falha 3.1 — Epicentro Tabs sem `aria-label` no tablist

**Arquivo:** `src/pages/index.astro`
**Linha:** 1216

```html
<div role="tablist">
```

**Correção:** Adicionar `aria-label`:

```diff
- <div role="tablist">
+ <div role="tablist" aria-label="Serviços oferecidos">
```

---

### Falha 3.2 — Epicentro Tabs sem `id` e `aria-controls`

**Arquivo:** `src/pages/index.astro`
**Linhas:** 1217-1228

Os tabs do epicentro não têm `id` nem `aria-controls`, e os painéis não têm `aria-labelledby`.

**Correção:** Adicionar IDs e atributos ARIA nos tabs e painéis:

```diff
- <button role="tab" aria-selected="true" data-target="epi-landing" class="epicentro-tab active">
+ <button role="tab" id="epi-tab-landing" aria-selected="true" aria-controls="epi-panel-landing" data-target="epi-landing" class="epicentro-tab active">

- <button role="tab" aria-selected="false" data-target="epi-hubs" class="epicentro-tab">
+ <button role="tab" id="epi-tab-hubs" aria-selected="false" aria-controls="epi-panel-hubs" data-target="epi-hubs" class="epicentro-tab">

- <button role="tab" aria-selected="false" data-target="epi-consultoria" class="epicentro-tab">
+ <button role="tab" id="epi-tab-consultoria" aria-selected="false" aria-controls="epi-panel-consultoria" data-target="epi-consultoria" class="epicentro-tab">
```

E nos painéis:

```diff
- <div class="epicentro-panel grid grid-2" data-panel="epi-landing" style="align-items: center; gap: 4rem;">
+ <div class="epicentro-panel grid grid-2" id="epi-panel-landing" data-panel="epi-landing" role="tabpanel" aria-labelledby="epi-tab-landing" style="align-items: center; gap: 4rem;">

- <div class="epicentro-panel grid grid-2 hidden" data-panel="epi-hubs" style="align-items: center; gap: 4rem;">
+ <div class="epicentro-panel grid grid-2 hidden" id="epi-panel-hubs" data-panel="epi-hubs" role="tabpanel" aria-labelledby="epi-tab-hubs" style="align-items: center; gap: 4rem;">

- <div class="epicentro-panel grid grid-2 hidden" data-panel="epi-consultoria" style="align-items: center; gap: 4rem;">
+ <div class="epicentro-panel grid grid-2 hidden" id="epi-panel-consultoria" data-panel="epi-consultoria" role="tabpanel" aria-labelledby="epi-tab-consultoria" style="align-items: center; gap: 4rem;">
```

---

### Falha 3.3 — Solutions Tabs sem `aria-label` no tablist

**Arquivo:** `src/pages/index.astro`
**Linha:** 1340

```html
<div role="tablist">
```

**Correção:** Adicionar `aria-label`:

```diff
- <div role="tablist">
+ <div role="tablist" aria-label="Módulos de soluções">
```

---

### Falha 3.4 — Solutions Tabs sem `aria-controls` nos tabs

**Arquivo:** `src/pages/index.astro`
**Linhas:** 1341-1355

Os tabs já têm `id` e os painéis já têm `aria-labelledby`, mas os tabs não têm `aria-controls`.

**Correção:** Adicionar `aria-controls`:

```diff
- <button role="tab" aria-selected="true" id="tab-modulo-a" data-system="modulo-a" style="--system-color: var(--primary);"
+ <button role="tab" aria-selected="true" id="tab-modulo-a" aria-controls="panel-modulo-a" data-system="modulo-a" style="--system-color: var(--primary);"

- <button role="tab" aria-selected="false" id="tab-modulo-b" data-system="modulo-b" style="--system-color: var(--accent);"
+ <button role="tab" aria-selected="false" id="tab-modulo-b" aria-controls="panel-modulo-b" data-system="modulo-b" style="--system-color: var(--accent);"

- <button role="tab" aria-selected="false" id="tab-modulo-c" data-system="modulo-c" style="--system-color: var(--secondary);"
+ <button role="tab" aria-selected="false" id="tab-modulo-c" aria-controls="panel-modulo-c" data-system="modulo-c" style="--system-color: var(--secondary);"
```

E nos painéis, adicionar `id`:

```diff
- <div class="solutions-panel space-y-6" data-system="modulo-a" role="tabpanel" aria-labelledby="tab-modulo-a">
+ <div class="solutions-panel space-y-6" id="panel-modulo-a" data-system="modulo-a" role="tabpanel" aria-labelledby="tab-modulo-a">

- <div class="solutions-panel space-y-6 hidden" data-system="modulo-b" role="tabpanel" aria-labelledby="tab-modulo-b">
+ <div class="solutions-panel space-y-6 hidden" id="panel-modulo-b" data-system="modulo-b" role="tabpanel" aria-labelledby="tab-modulo-b">

- <div class="solutions-panel space-y-6 hidden" data-system="modulo-c" role="tabpanel" aria-labelledby="tab-modulo-c">
+ <div class="solutions-panel space-y-6 hidden" id="panel-modulo-c" data-system="modulo-c" role="tabpanel" aria-labelledby="tab-modulo-c">
```

---

## 4. RESUMO DE ALTERAÇÕES

### Arquivos afetados

| Arquivo | Alterações |
|---------|-----------|
| `src/pages/index.astro` | 12 correções de heading + 2 correções de ARIA + 1 correção de contraste |
| `src/components/layout/Footer.astro` | 3 correções de heading |
| `src/pages/index-exemplo.astro` | 8 correções de heading |
| `src/pages/components.astro` | 7 correções de heading |
| `src/pages/sobre.astro` | 1 correção de heading |
| `src/pages/servicos.astro` | 1 correção de heading |

### Total de alterações

- **Contraste:** 1 correção
- **Heading hierarchy:** 31 correções (h4→h3: 28, h3→h2: 1, h4→h3 no footer: 3)
- **ARIA:** 6 correções (aria-label: 2, aria-controls: 4, role/aria-labelledby: 6)

### Hierarquia corrigida

Após as correções, a hierarquia de títulos ficará:

```
h1 (único por página)
├── h2 (seções principais)
│   ├── h3 (subseções/cards)
│   │   └── h4 (se aplicável, dentro de h3)
```

Sem pulos de nível.

---

## 5. VALIDAÇÃO

Após aplicar as correções, rodar:

```bash
pnpm typecheck && pnpm build && pnpm check-a11y
```

Se o Chrome não estiver disponível localmente, validar via PageSpeed Insights após deploy:

```
https://pagespeed.web.dev/analysis?url=https://template.suitplus.com.br/
```

**Meta:** Acessibilidade 100/100

---

## 6. OBSERVAÇÕES

### Já corrigido anteriormente

- ✅ `MobileMenu` usa `inert` + toggle em `openMenu()`/`closeMenu()`
- ✅ `html lang="pt-BR"` definido no `BaseLayout`
- ✅ Skip link presente no `BaseLayout`
- ✅ Form labels com `for`/`id` no `ContactForm`
- ✅ `aria-live` regions no `ContactForm`
- ✅ Honeypot com `aria-hidden="true"`
- ✅ `prefers-reduced-motion` suportado
- ✅ Tabs component (`Tabs.astro`) já tem ARIA completo
- ✅ FAQ com `aria-expanded` e `aria-controls`

### Não corrigido (fora do escopo deste plano)

-  `vanilla-tilt.min.js` ainda referenciado (impacto performance, não acessibilidade)
- ❌ Google Fonts CDN (impacto performance, já documentado no LIGHTHOUSE-AUDIT.md)
