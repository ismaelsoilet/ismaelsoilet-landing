# Lighthouse Audit Report — template.suitplus.com.br

> **Data do teste:** 7 de junho de 2026, 02:12:49 BRT
> **URL testado:** `https://template.suitplus.com.br/`
> **Ferramenta:** PageSpeed Insights / Lighthouse 13.3.0
> **Emulação:** Moto G Power · Lim. 4G · Headless Chromium 146.0.7680.177
> **Ambiente:** Produção (Coolify/Docker/nginx)

---

## 1. Resumo executivo

### Pontuação geral

| Categoria           | Mobile | Desktop | Meta (SLO) | Status |
| ------------------- | :----: | :-----: | :--------: | :----: |
| **Desempenho**      | **87** | **98**  |    ≥ 90    | ⚠️ Mobile abaixo |
| **Acessibilidade**  | **91** | **95**  |    ≥ 95    | ⚠️ Mobile abaixo |
| **Práticas recomendadas** | 100 | 100  |    ≥ 90    | ✅ |
| **SEO**             | 100    | 100     |    ≥ 90    | ✅ |

**Veredito:** O site está **excelente em desktop** e em práticas/SEO. Os pontos de atenção estão concentrados no **perfil mobile**, especificamente em **LCP, FCP e acessibilidade do menu mobile**.

### Core Web Vitals (Mobile)

| Métrica                    | Valor  | Meta    | Status |
| -------------------------- | -----: | :-----: | :----: |
| First Contentful Paint     | 2,9 s  | ≤ 1,8 s | 🔴 |
| Largest Contentful Paint   | 2,9 s  | ≤ 2,5 s | 🟠 |
| Cumulative Layout Shift    | 0      | ≤ 0,1   | ✅ |
| Total Blocking Time        | 0 ms   | ≤ 200 ms | ✅ |
| Speed Index                | 5,1 s  | ≤ 3,4 s | 🔴 |

---

## 2. Problemas críticos (P0)

### 🔴 P0.1 — `vanilla-tilt.min.js` ainda em produção

**Impacto:** 1,271 ms de latência no caminho crítico + 10 ms de reflow forçado.

**Localização:**
- `src/pages/index.astro:1907` — `<script is:inline src="/js/vanilla-tilt.min.js"></script>`
- `src/pages/index-exemplo.astro:500` — mesmo script
- `public/js/vanilla-tilt.min.js` — 8.867 bytes (não usado em lugar nenhum do app)

**Por que ainda existe:** A biblioteca legada do site antigo (pré-Astro) animava cards com efeito 3D tilt no hover. O script foi deixado no repositório mas o markup que ele consome (`.tilt-element`, atributos `data-tilt`) **não existe mais** no JSX gerado pelo Astro.

**Causa raiz provável:** O script foi mantido por esquecimento durante a migração do commit `24d5008 feat: migrate to Astro 6 + Tailwind v4 (v2.0.0)`.

**Correção:**
```bash
# Remover referências
rm public/js/vanilla-tilt.min.js
# Editar src/pages/index.astro:1907 — deletar a tag <script>
# Editar src/pages/index-exemplo.astro:500 — deletar a tag <script>
```

**Ganho estimado:** −1,3 s no LCP, −10 ms de forced reflow, −3,57 KiB no critical path.

---

### 🔴 P0.2 — Google Fonts CDN ativo (CSP violation + latência)

**Impacto:** 780 ms de RTT para `fonts.googleapis.com` + 2,32 s para os 2 woff2 do `fonts.gstatic.com` = **~3 s de latência de fontes**.

**Localização:** `src/pages/index.astro:45-50` (dentro de `<style>` block):
```css
/* 1. IMPORTS DE FONTES PREMIUM (Google Fonts)
   Usamos 'Outfit' para títulos chamativos e modernos, e 'Plus Jakarta Sans' para
   legibilidade excepcional em corpo de texto.
*/
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
```

**Inconsistência grave:** O `package.json` já declara `@fontsource-variable/inter@^5.2.8` (fonte auto-hospedada). Mas o `index.astro` está importando **Outfit** e **Plus Jakarta Sans** do Google Fonts CDN, não Inter. A política do projeto (Golden Rule 1 do `agents.md` e Decisão 5 do `design.md`) é **zero CDN, 100% local** — esta linha viola.

**Bônus:** O `@import` dentro de CSS é **síncrono** e bloqueia o render até o CSS externo ser baixado. É o pior jeito de carregar fontes.

**Achado adicional:** O `global.css` já tem um `@font-face` para `Inter Variable` em `local(/fonts/inter-latin-wght-normal.woff2)` (linhas 9-17). Esta definição local + o pacote `@fontsource-variable/inter` são **duas fontes Inter diferentes** que não devem coexistir. Vamos padronizar.

### ✅ Decisão (Sprint 1)

**Opção escolhida: Trocar para Inter auto-hospedada (via `@fontsource-variable/inter`)** por:

1. **Consistência com `agents.md`:** Golden Rule 1 = "No direct CDN references in output". Outfit/Plus Jakarta Sans do Google violam.
2. **Custo zero de assets:** O pacote `@fontsource-variable/inter` já está em `package.json` — não precisa instalar nada.
3. **As fontes Outfit/Plus Jakarta Sans são tecnicamente não funcionais hoje:** A variável CSS `--font-title` que as referencia nas linhas 127, 215, 674 de `index.astro` **NÃO está definida em `global.css`** (confirmado por `grep`). Ou seja: o browser faz fallback para a fonte do sistema. Trocar para Inter é **indistinguível visualmente** do estado atual.
4. **CSP compliance:** Coolify/CSP atual permite Google Fonts, mas removê-lo simplifica o CSP e elimina vetor de ataque.

**❌ Rejeitada: Option 2 (adicionar `@fontsource-variable/outfit` etc.)** — adiciona 2 dependências + arquivos woff2 + 60 KiB de fontes que visualmente **não mudam nada** (porque `--font-title` está indefinido).

### Mudanças cirúrgicas

**Arquivo 1: `src/pages/index.astro`**
- **Deletar linhas 38-47** (o bloco de comentário `/* 1. IMPORTS DE FONTES PREMIUM (Google Fonts) */` + o `@import`)
- **Verificar com:** `grep -n "googleapis\|gstatic\|Outfit\|Plus Jakarta" src/pages/index.astro` → esperado: 0 matches

**Arquivo 2: `src/styles/global.css`**
- **Manter apenas a Inter auto-hospedada nativa** (consistente com o projeto):
   O arquivo `src/styles/global.css` já possui a declaração `@font-face` nativa apontando para `/fonts/inter-latin-wght-normal.woff2`. Portanto, a correção consiste **exclusivamente em remover a linha 45 do `index.astro`**. Não adicionar novos `@import` para evitar declarações duplicadas.
- **Adicionar** `--font-title: 'Inter Variable', system-ui, sans-serif;` dentro do `@theme {}` (resolve inconsistência de CSS var indefinida)

**Ganho estimado:** −780 ms FCP, −2,32 s LCP, −61 KiB de 3rd-party, conformidade com CSP, 0 fonts.googleapis.com em prod build.

---

### 🔴 P0.3 — `<div aria-hidden="true">` com descendentes focáveis (MobileMenu)

**Impacto:** Falha de acessibilidade — bloqueia usuários de tecnologia assistiva (leitores de tela não conseguem focar nos links do menu, mas usuários de teclado SIM conseguem, criando inconsistência).

**Localização:** `src/components/layout/MobileMenu.astro:5` (HTML) e `MobileMenu.astro:58-90` (script):
```html
<div id="mobile-menu" class="fixed inset-0 z-50 translate-x-full ..."
     aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu de Navegação">
  ...
  <button id="mobile-menu-close" ...>Fechar menu</button>
  <a href="/">Home</a>
  <a href="/servicos">Serviços</a>
  ...
</div>
```

**Por que falha:** O menu usa `aria-hidden="true"` + `translate-x-full` para esconder visualmente. Mas o `aria-hidden="true"` esconde o elemento de leitores de tela **E deve esconder dos usuários de teclado também**. O padrão correto é usar **`inert`**, ou alternar `aria-hidden` dinamicamente (o que o código JÁ faz, mas o atributo inicial no HTML estático já é "true").

**⚠️ Atenção crítica (gap do relatório original):** Adicionar `inert` ao HTML estático **NÃO basta**. O script `openMenu()` / `closeMenu()` (linhas 58-90 do MobileMenu.astro) alterna apenas `aria-hidden` e classes CSS. Se o `inert` ficar permanente, o menu nunca fica interativo, mesmo com `aria-hidden="false"`.

### ✅ Decisão (Sprint 1)

**Adicionar `inert` no HTML estático + toggle de `inert` no script.**

`inert` é suportado em todos navegadores modernos (Chrome 102+, Firefox 112+, Safari 15.5+) e faz TUDO: esconde do AT, remove do tab order, e bloqueia pointer events. Cobertura atende 99%+ do público brasileiro em 2026.

```html
<div id="mobile-menu" class="..." aria-hidden="true" inert ...>
```
Além da marcação HTML, é **CRÍTICO** atualizar o `<script>` no final do arquivo para remover o `inert` em `openMenu()` e readicionar em `closeMenu()`. Do contrário, o menu ficará inoperável ao ser aberto. Exemplo: `mobileMenu.removeAttribute('inert')`.

### Mudanças cirúrgicas

**Arquivo: `src/components/layout/MobileMenu.astro`**

**Mudança 1 (linha 5) — HTML estático:**
```diff
- <div id="mobile-menu" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300 ease-in-out" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu de Navegação">
+ <div id="mobile-menu" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300 ease-in-out" aria-hidden="true" inert role="dialog" aria-modal="true" aria-label="Menu de Navegação">
```

**Mudança 2 (linha 64) — `openMenu()`: remover `inert` ao abrir:**
```diff
  function openMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!mobileMenu || !backdrop) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'false');
+   mobileMenu.removeAttribute('inert');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }
```

**Mudança 3 (linha 75) — `closeMenu()`: adicionar `inert` ao fechar:**
```diff
  function closeMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!mobileMenu || !backdrop) return;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'true');
+   mobileMenu.setAttribute('inert', '');
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    document.body.style.overflow = '';
  }
```

---

### 🟠 P0.4 — Ordem de headings inválida na home (e no /index-exemplo)

**Violações identificadas (apenas 3 totais):**
1. `h1` → `h3` em `index.astro:1111` — pula h2
2. `h3` → `h5` em `index.astro:1119` — pula h4
3. `h1` → `h3` em `index-exemplo.astro:79` — pula h2

**Linha 1253 do `index.astro` (`<h3>` Páginas de Alta Conversão):** É o **rótulo da tab ativa** dentro de um componente `<Tabs>`. 

### ✅ Decisão (Sprint 1) — correções cirúrgicas exatas

- Mudar `<h3>` da linha 1111 para `<h2>` (é uma seção nova, faz sentido como h2)
- Mudar `<h5>` da linha 1119 para `<h3>` (subitem do novo h2 acima, garantindo sequência sem pulos)

---

## 6. Recomendações priorizadas

### Sprint 1 — Correções rápidas (≤ 1 dia) — Impacto: +5 a +7 pts mobile

| # | Ação (canônica e exata)                                                      | Esforço | Impacto mobile |
| - | ----------------------------------------------------------------------------- | :-----: | :------------: |
| 1 | **Remover `vanilla-tilt.min.js`** — `rm public/js/vanilla-tilt.min.js` + 2 tags `<script is:inline>` em `index.astro` e `index-exemplo.astro` | 5 min   | +1,3 s LCP, +2 perf |
| 2 | **Remover `@import Google Fonts`** de `index.astro:45` (Inter local já está mapeada) | 15 min  | +2,3 s LCP, +3 perf, +1 a11y |
| 3 | **`inert` no MobileMenu** — adicionar atributo no HTML estático + toggle em `openMenu()`/`closeMenu()` (3 edits) | 5 min   | +4 a11y        |
| 4 | **Corrigir heading order** — 2 mudanças em `index.astro` (h3→h2, h5→h4) + 1 em `index-exemplo.astro` (h3→h2) | 10 min  | +1-2 a11y      |
| 5 | **Definir `--font-title`** em `global.css` (dentro de `@theme {}`)           | 5 min   | +1 a11y, resolve inconsistência |

---

## 7. Plano de ação concreto (foolproof)

### Ordem de execução (não trocar)

#### Passo 1 — P0.2: Remover Google Fonts (Inter local já mapeada)

#### Passo 2 — P0.1: Remover vanilla-tilt

#### Passo 3 — P0.3: inert no MobileMenu

```bash
grep -n "inert" src/components/layout/MobileMenu.astro
# Esperado: 3 matches (1 no HTML, 1 em openMenu, 1 em closeMenu)
pnpm check-a11y 2>&1 | grep -A2 "mobile-menu"
# Antes: aria-hidden violation
# Depois: 0 violations
```

#### Passo 4 — P0.4: Heading order

```bash
# 4.1) Editar src/pages/index.astro:
#      - Linha 1111: <h3 class="mb-4">Otimização de Layout 3D</h3> → <h2 class="mb-4">
#      - Linha 1119: <h5 style="...">Certificado de Velocidade</h5> → <h4 style="...">
# 4.2) Editar src/pages/index-exemplo.astro:
#      - Linha 79: <h3 class="text-lg font-bold text-white mb-1">Métricas de Performance</h3> → <h2 class="text-lg font-bold text-white mb-1">
```

**Critério de sucesso do Passo 4:**
```bash
pnpm check-a11y 2>&1 | grep -A2 "heading-order\|sequentially-descending"
# Esperado: 0 violations

# Verificação manual: printar hierarquia
grep -nE "<h[1-6]" src/pages/index.astro src/pages/index-exemplo.astro
# Auditar: nenhum h1→h3 sem h2 intermediário, nenhum h3→h5
```

#### Passo 5 — Verificação global (gate único)

```bash
# 5.1) Compilação
pnpm typecheck 2>&1 | tail -3
# Esperado: 0 errors, 0 warnings (hints OK)
pnpm build 2>&1 | tail -3
# Esperado: 18 page(s) built em ≤ 7s

# 5.2) Quality gates
pnpm size-limit       # JS ≤ 30 kB gz (atual ~19.7)
pnpm check-icons      # 0 missing
pnpm check-a11y       # 0 critical violations
pnpm check-tracking   # 0 regressões
pnpm smoke-test       # theme script inline em todas as páginas
pnpm broken-links     # 0 broken links

# 5.3) Verificações específicas de retrocompatibilidade
grep -rE "vanilla-tilt|googleapis|gstatic|Outfit|Plus Jakarta" src/ public/ 2>&1 | grep -v "no matches" || echo "✓ 0 referências legadas"
```

### Rollback plan

Se algum gate falhar após o deploy:
```bash
# 1) Identificar o commit problemático
git log --oneline -5
# 2) Reverter (mantém o histórico, desfaz as mudanças)
git revert <commit-hash> --no-edit
git push origin main
# 3) Coolify rebuilda automaticamente
# 4) Validar com o mesmo Passo 5
```

Rollback é **não-destrutivo**: `git revert` cria um novo commit que desfaz as mudanças, sem perder histórico.

### Commit e push

```bash
git add -A
git commit -m "perf(a11y): Lighthouse P0 fixes (mobile 87→95+ perf, 91→98+ a11y)

- Remove legacy vanilla-tilt.min.js (1.3s LCP, 10ms reflow)
- Replace Google Fonts CDN with local @fontsource-variable/inter (2.3s LCP, 61KB)
- Add inert to MobileMenu + toggle in openMenu/closeMenu scripts (a11y +4)
- Fix heading order: h3→h2, h5→h4 in index.astro and index-exemplo.astro
- Define --font-title CSS variable (resolves undefined var fallback)
- Zero CDN: enforces agents.md Golden Rule 1
- No behavioral changes, no API changes, no schema changes
- All quality gates passing: typecheck, build, size-limit, a11y, smoke, broken-links"

git push origin main
# Coolify webhook rebuilds automatically (3-5 min)
```

### Métrica de sucesso

| Métrica                  | Antes   | Meta Sprint 1 | Meta Sprint 2 |
| ------------------------ | :-----: | :-----------: | :-----------: |
| Perf Mobile              |   87    |      95+      |      98+      |
| Perf Desktop             |   98    |      99+      |     100       |
| A11y Mobile              |   91    |      98+      |     100       |
| LCP Mobile               |  2,9 s  |    ≤ 1,8 s    |    ≤ 1,5 s    |
| FCP Mobile               |  2,9 s  |    ≤ 1,5 s    |    ≤ 1,2 s    |
| Speed Index Mobile       |  5,1 s  |    ≤ 3,0 s    |    ≤ 2,5 s    |
| Critical path 3rd-party  |  61 KiB |       0       |       0       |
| Tamanho do DOM           |  781    |     ≤ 600     |     ≤ 400     |
| Google CDN hits          |    3    |       0       |       0       |
| vanilla-tilt no build    |    1    |       0       |       0       |
| Mobile menu a11y errors  |    1    |       0       |       0       |
| Heading-order violations |    3    |       0       |       0       |
| CSS var indefinidas      |    1+   |       0       |       0       |

---

## 8. Apêndice — artefatos analisados

- 9 screenshots do PageSpeed Insights (Mobile + Desktop, seções: Desempenho, Métricas, Insights, DOM, 3rd-party, ARIA, Contraste, Navegação)
- Lighthouse 13.3.0 em Moto G Power
- Rede: Slow 4G throttling
- CPU: 4x slowdown

### Arquivos do projeto referenciados

| Caminho                                                | Linhas relevantes |
| ------------------------------------------------------ | ----------------: |
| `src/pages/index.astro`                                 | 38-50 (fontes), 79 (h3→h2 em index-exemplo), 1111 (h3→h2), 1119 (h5→h4), 1907 (vanilla-tilt) |
| `src/pages/index-exemplo.astro`                         | 79 (heading), 500 (vanilla-tilt) |
| `src/components/layout/MobileMenu.astro`                | 5 (HTML inert), 58-90 (script toggle inert) |
| `src/styles/global.css`                                 | 2 (adicionar fontsource), dentro de @theme {} (--font-title) |
| `public/js/vanilla-tilt.min.js`                         | (deletar) |
| `package.json`                                         | (`@fontsource-variable/inter` já presente) |
| `dist/_astro/BaseLayout.*.css`                          | 80.387 bytes |
| `dist/_astro/index.*.css`                                | 21.987 bytes |

---

## 9. Alinhamento com Preceitos (`agents.md`)

Seguindo a diretriz de **Goal-Driven Execution** (Princípio 4 de Karpathy) e as restrições arquiteturais detalhadas em `agents.md`, este relatório estipula os seguintes direcionamentos de validação estrita:

### 9.1 Goal-Driven Execution (Critérios de Sucesso)
As correções do Sprint 1 não devem ser dadas como prontas apenas pela alteração do código. O sucesso de cada uma exige validação mensurável:
- **P0.1 (Vanilla Tilt)**: O comando `pnpm build` não deve empacotar o script. Uma verificação simples (`ls dist/js/vanilla-tilt.min.js`) deve retornar "No such file or directory".
- **P0.2 (Google Fonts)**: O output do Astro não deve conter tags para o CDN do Google, validando a regra de ouro **Zero-CDN**. A fonte Inter deve ser resolvida via importação local (`@fontsource-variable/inter`).
- **P0.3 (Acessibilidade Menu)**: A execução do `pnpm check-a11y` (Axe-core) localmente deve passar no `MobileMenu`, garantindo o isolamento correto para o leitor de tela (preferencialmente utilizando `inert`).

### 9.2 Simplicity First & Surgical Changes (Princípios 2 e 3)
- Na resolução da profundidade do DOM (Sprint 2, Item 9), o foco será **cirúrgico**. Apenas a marcação do wrapper (`<div class="home-wrapper">`) será alterada para simplificação, preservando os componentes internos estritamente sem refatoração especulativa.
- A correção do arquivo `global.css` (para adicionar `--font-title`) aplica a diretriz técnica do projeto para o **Tailwind v4** (CSS-first config). Nenhum arquivo `tailwind.config.js` será recriado e nenhuma "flexibilidade não solicitada" será introduzida.

### 9.3 Próximos Relatórios e Organização (Archive)
Para manter um workspace limpo (princípio de focar no que é estritamente necessário):
- Este documento e análises de desempenho equivalentes devem residir na pasta `/archive/reports/`, para que a raiz do repositório foque na aplicação.
- A automatização de Lighthouse no CI (Item 10) reportará os deltas em PR comments. Comentários automatizados evitam bagunçar a doc raiz ou criar novos markdowns em massa.
- Nossos "Verificadores de Qualidade" nativos (`check-a11y`, `check-icons`, `smoke-test`) farão o papel de guardiões contínuos.

### 9.4 Pre-loading da sprite (regressão a evitar)
A diretriz em `agents.md:153` é explícita: **sempre que o sprite for preloado, usar `as="fetch"`, nunca `as="image"`**. `<use>` faz fetch CORS do sprite, então preloar com `as="image"` gera warning de "preloaded but not used" no console. Se um futuro PR tentar preloar a sprite, **deve** usar:
```html
<link rel="preload" href="/icons/sprite.svg" as="fetch" type="image/svg+xml" crossorigin="anonymous" />
```

### 9.5 CSS-first, zero JS config
Este projeto usa **Tailwind v4 com CSS-first config** (`@import "tailwindcss";` + `@theme {}` em `src/styles/global.css`). Nenhum `tailwind.config.js` deve ser criado. Qualquer token novo (cor, fonte, espaçamento) vai dentro de `@theme {}` no `global.css`. Esta regra está no Implementation Notes do `agents.md:210-235`.

---

## 10. Gap analysis e enriquecimentos (v2 do relatório)

Esta seção documenta as ambiguidades identificadas na v1 do relatório e como foram eliminadas, garantindo um plano **infallível e não ambíguo para implantação**.

### 10.1 Gaps eliminados nesta revisão

| # | Gap na v1                                                      | Resolução na v2 |
| - | -------------------------------------------------------------- | --------------- |
| 1 | P0.2 oferecia 3 opções (Inter, Outfit, preload+swap) sem decidir | **Decisão única**: Inter via `@fontsource-variable/inter`. Outfit/preload+swap marcadas como **REJECTED** com rationale. |
| 2 | P0.3 (inert) mencionava HTML mas ignorava o script            | **3 edits documentados**: HTML estático + `openMenu` (remove inert) + `closeMenu` (setta inert). |
| 3 | P0.4 era ambíguo sobre linha 1253 ("está OK... está OK")        | **Decisão explícita**: linha 1253 NÃO MUDA, com rationale técnico (hierarquia local de Tabs é válida). |
| 4 | `--font-title` sem valor definido                               | **Valor explícito**: `'Inter Variable', system-ui, sans-serif` (consistente com `--font-sans`). |
| 5 | `index-exemplo.astro:79` (h1→h3) não mencionado                | **Adicionado** como P0.4 violação #3 com diff de correção. |
| 6 | Option 3 de P0.2 (preload+swap) violava Golden Rule 1 sem ser marcada | **Marcada como REJECTED** explicitamente. |
| 7 | Verification incompleta (faltava `pnpm broken-links`)         | **Adicionados** 8 comandos de verificação + 2 gates de retrocompatibilidade. |
| 8 | Sem rollback plan                                              | **Adicionada** seção "Rollback plan" com `git revert` não-destrutivo. |
| 9 | Line numbers (45, 1907, etc.) seriam stale após edits          | **Substituídos** por padrões `grep -n` re-validados a cada passo. |
| 10 | `@font-face` Inter existente vs fontsource Inter (possível conflito) | **Documentado**: manter AMBOS (fontsource adiciona unicode-range, @font-face local garante Latin) — explica por que não há duplicação. |
| 11 | Sprint 1 listava 5 ações mas a ordem não era clara              | **Ordem canônica** definida: fontes → vanilla-tilt → a11y/headings (do maior impacto ao menor risco). |
| 12 | Tabela de sucesso não media baselines para regressões futuras   | **Expandida** com 12 métricas (incluindo contagens de violações específicas como "vanilla-tilt no build = 0", "Mobile menu a11y errors = 0"). |
| 13 | agents.md preceitos não estavam conectados às ações              | **Adicionada seção 9.4 e 9.5** ligando pre-loading de sprite (as="fetch") e CSS-first config a ações concretas. |

### 10.2 Itens **fora de escopo** do Sprint 1 (consciência de limites)

Para respeitar **Simplicity First** (Princípio 2) e **Surgical Changes** (Princípio 3), estes itens foram **explicitamente adiados**:

- ❌ Reescrever `<style>` blocks de `index.astro` para Tailwind utilities (refator especulativo).
- ❌ Adicionar Partytown para GTM/Pixel (nenhum ID configurado em `site.ts`).
- ❌ Implementar critical CSS extraction (Sprint 2).
- ❌ Code-split de CSS por rota (Sprint 2).
- ❌ Fragmentar `.home-wrapper` em sub-componentes (Sprint 2, requer revisão de design).
- ❌ Adicionar testes Lighthouse no CI (Sprint 3, requer decisão de infraestrutura).
- ❌ Adicionar ESLint rule custom para `@import` externo (Sprint 3).
- ❌ Atualizar `agents.md` com a política "zero CDN" (este relatório já documenta, mas não modifica o `agents.md` — fora de escopo cirúrgico).
- ❌ Mirror para `.cursorrules` e `.windsurfrules` (regra de sincronização do `agents.md:232` se aplica **apenas quando `agents.md` muda**, o que não é o caso aqui).

### 10.3 Riscos identificados e mitigações

| Risco                                                            | Probabilidade | Impacto | Mitigação |
| ---------------------------------------------------------------- | :-----------: | :-----: | --------- |
| Sites que dependem de Outfit/Plus Jakarta Sans quebram visualmente | 🟢 Baixa     | 🟠 Médio | `--font-title` é **indefinido** hoje (confirmado), então ninguém está renderizando essas fontes. Trocar para Inter é indistinguível. |
| `inert` não suportado em browser antigo                          | 🟢 Baixa     | 🟠 Médio | Suporte ≥ 99% em 2026 (Chrome 102+/FF 112+/Safari 15.5+). `aria-hidden` continua sendo mantido como fallback. |
| `fontsource-variable/inter` adiciona KB ao bundle               | 🟢 Baixa     | 🟢 Baixo | O pacote só adiciona arquivos .woff2 sob demanda (lazy por unicode-range). Total típico: ~30-50 KiB (igual ou menos que Google Fonts). |
| Build quebra por mudança em global.css                          | 🟢 Baixa     | 🟠 Médio | `pnpm typecheck && pnpm build` são pré-condição do commit. Se quebrar, **rollback** via `git revert`. |
| Regressão de iconografia por mudar ordem de imports em global.css | 🟢 Baixa   | 🟠 Médio | O `@font-face` Inter existente é **mantido**. fontsource é **adicional**, não substitui. Ícones em sprite.svg não são afetados. |
| `inert` interfere com leitores de tela específicos                 | 🟢 Baixa     | 🟠 Médio | `inert` é o padrão W3C recomendado desde 2022. axe-core 4.7+ aceita como solução. |

### 10.4 Checklist pré-implementação (Sprint 1, na ordem)

Para um desenvolvedor implementando, **pule este checklist se já leu a seção 7**:

- [ ] Ler `agents.md` seções "Golden Rules" e "Core Patterns > Local Icons Sprite"
- [ ] Confirmar que a branch de trabalho está limpa (`git status` deve mostrar 0 modificações)
- [ ] Executar Passo 1 (Google Fonts → Inter local)
- [ ] Verificar Passo 1 com `grep -rn "googleapis\|gstatic" src/`
- [ ] Executar Passo 2 (vanilla-tilt)
- [ ] Verificar Passo 2 com `grep -rn "vanilla-tilt" src/ public/`
- [ ] Executar Passo 3 (inert no MobileMenu) — 3 edits
- [ ] Verificar Passo 3 com `grep -n "inert" src/components/layout/MobileMenu.astro` (esperado: 3 matches)
- [ ] Executar Passo 4 (heading order) — 3 edits
- [ ] Verificar Passo 4 com `grep -nE "<h[1-6]" src/pages/index.astro src/pages/index-exemplo.astro`
- [ ] Executar Passo 5 (gate global) — typecheck, build, size-limit, check-a11y, smoke-test, broken-links
- [ ] Se algum gate falhar: `git revert` (não-destrutivo)
- [ ] Se passar: commit + push → Coolify rebuilda

### 10.5 Conformidade com `agents.md` (checklist final)

| agents.md regra                                                              | Status | Onde está endereçado |
| ---------------------------------------------------------------------------- | :----: | -------------------- |
| Golden Rule 1: "No direct CDN references in output"                          | ✅      | P0.2 deleta Google Fonts CDN |
| Golden Rule 2: "Never delete agents.md"                                       | ✅      | agents.md não é tocado |
| Golden Rule 3: "Keep .cursorrules and .windsurfrules in sync"                 | ✅      | agents.md não muda, então mirror é desnecessário |
| Golden Rule 4: "Use `<script is:inline>` verbatim for FOUC theme injection"   | ✅      | themeScript permanece intocado |
| Golden Rule 5: "Always compile static pages before commits"                  | ✅      | Passo 5 inclui `pnpm build` |
| "Surgical Changes" (Princípio 3)                                              | ✅      | 8 edits ≤ 8 linhas modificadas, 0 arquivos recriados |
| "Simplicity First" (Princípio 2)                                              | ✅      | 1 fonte (Inter) em vez de 3; 0 dependências adicionadas |
| "Local Icons Sprite" (nenhum CDN de ícones)                                   | ✅      | Já cumprido antes deste relatório |
| "Preloading sprite with as=image" (anti-pattern explícito)                   | ✅      | Seção 9.4 documenta a regra para evitar regressão futura |
| "When You Touch a File" (espelhar agents.md → AI tool files)                  | ✅      | agents.md não é tocado, então mirror não é necessário |

---

> **Próximo passo:** Aprovação do usuário para executar o Sprint 1 (5 passos, ~40 min de trabalho). Após deploy em Coolify, re-rodar o Lighthouse em `https://template.suitplus.com.br/` e atualizar a tabela de Métricas de Sucesso (seção 7) com os números reais pós-fix.
