# Template Landing Corp (v2.0.0)

Este é o blueprint de página de destino corporativa da Suitplus, totalmente reconstruído em **Astro 6**, **Tailwind CSS v4** e com foco estrito em conformidade com o **Core Web Vitals**, **Acessibilidade (WCAG AA)** e **AIO (Artificial Intelligence Optimization)**.

---

## ⚡ Diferenciais de Performance & SEO

- **Zero JS por padrão**: Código limpo de thread principal, reduzindo FBT e INP a zero.
- **Carregamento sob demanda**: Scripts de marketing e pixels são carregados em Web Workers separados via **Partytown**.
- **Fontes locais com Preload**: Fontes hospedadas localmente para evitar FOIT/FLUT.
- **Esquemas JSON-LD integrados**: Organization, WebSite, WebPage, FAQPage, Service, BlogPosting e HowTo gerados de forma tipada.
- **Manifestos AIO**: `/llms.txt` e `/llms-full.txt` dinâmicos para indexação por agentes autônomos de IA (ChatGPT, Claude, Gemini, etc.).

---

## 🚀 Como Iniciar (Quickstart)

### Requisitos
- Node.js `v22.12.0` ou superior.
- pnpm `v11.5.2` ou superior.

### Comandos de Desenvolvimento
```bash
# 1. Instalar dependências
pnpm install

# 2. Executar servidor de desenvolvimento local (:4321)
pnpm dev

# 3. Validar tipagem e integridade do projeto (Astro Check)
pnpm typecheck

# 4. Build de produção (saída estática compilada em dist/)
pnpm build

# 5. Visualizar localmente a build de produção (:4321)
pnpm preview
```

---

## 📋 Customização & Rebrand (Novo Cliente em 30 min)

Para implantar este template para um novo cliente em tempo recorde:
1. **Configuração Global**: Edite o arquivo central [src/content/site.ts](file:///home/ismaelsoilet/template-landing/src/content/site.ts) alterando dados da empresa (nome, url, contato, mídias sociais) e tokens de rastreamento.
2. **Identidade Visual**:
   - Substitua o logotipo em `public/logo.svg` e `src/assets/logo.svg`.
   - Coloque os novos favicons na raiz da pasta `public/` (`favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, etc.).
   - Configure a cor primária e os tokens visuais correspondentes no tema.
3. **Imagens Otimizadas**: Adicione novas fotos e assets de design na pasta `src/assets/` e importe-as usando o componente `<Image />` do Astro para compressão dinâmica em formato `.webp`.

Para um guia interativo passo a passo, inicie o servidor localmente e acesse a rota `/quickstart` no navegador.

---

## ✍️ Criação de Conteúdo (Content Authoring)

O projeto usa **Astro Content Collections** para tipagem forte de todo o conteúdo dinâmico. As seguintes coleções estão disponíveis em `src/content/`:

### 1. Blog
Localizado em `src/content/blog/`. Crie arquivos `.mdx` obedecendo à estrutura de frontmatter obrigatória:
```yaml
---
title: "Título SEO Otimizado (Máx 60 caracteres)"
description: "Descrição meta atraente com limites rígidos de 140 a 160 caracteres."
pubDate: "2026-06-06"
author: "Nome do Autor"
category: "SEO" # SEO | CRO | Performance | AIO | LGPD
keywords: ["tag1", "tag2"] # Limite de 1 a 8 palavras-chave
draft: false
---
Conteúdo do artigo em Markdown...
```

### 2. Serviços / Planos de Preços
Localizado em `src/content/services/`. Arquivos `.json` que definem os planos do site corporativo.
### 3. Depoimentos e Equipe
Modelados via JSON em `src/content/testimonials/` e `src/content/team/` para alimentação automática de seções dinâmicas do site.
### 4. Perguntas Frequentes (FAQs)
Localizado em `src/content/faqs/`. Estruturado em arquivos `.json` com geração automática de marcação `FAQPage` estruturada do Google.

---

## 🛡️ Configuração do Repositório & CI (Branch Protection)

Para garantir a qualidade estrita do código no branch `main`, configure a seguinte proteção de branch no GitHub:

1. Acesse as configurações do repositório no GitHub: **Settings -> Branches -> Add branch protection rule**.
2. Defina o padrão de branch como `main`.
3. Ative **"Require status checks to pass before merging"** e adicione as seguintes checagens obrigatórias:
   - `Continuous Integration` (executa o pipeline definido em `.github/workflows/ci.yml`)
4. O workflow do GitHub executa sequencialmente:
   - Validação de tipagem (`pnpm typecheck`)
   - Validação de referências do sprite SVG (`pnpm check-icons`)
   - Validação de emissão de Partytown (`pnpm check-tracking`)
   - Build estática (`pnpm build`)
   - Teste de FOUC (`pnpm smoke-test`)
   - Limites de tamanho de bundle JS/CSS (`pnpm size-limit`)
   - Auditorias de SEO / schemas JSON-LD (`pnpm qa-seo`)
   - Varredura de links quebrados (`pnpm broken-links`)
   - Auditorias de acessibilidade via axe-core (`pnpm check-a11y`)
   - Auditoria Lighthouse CI (`npx lhci`)

---

## 🌐 Deploy (Deploy Paths)

O template suporta compilação 100% estática e possui paridade de funcionalidades em três ambientes de deploy principais:

### 1. Servidor Dedicado / VPS (Docker + Nginx)
O projeto conta com um `Dockerfile` multi-stage otimizado e um `nginx.conf` pré-configurado com compressão Gzip/Brotli e cabeçalhos de segurança (CSP, HSTS).
```bash
# Construir a imagem Docker localmente
docker build -t landing-corp .

# Executar o container em background (mapeando porta 80)
docker run -d -p 80:80 --name landing-app landing-corp
```

### 2. Vercel
A implantação estática utiliza as regras declaradas em `vercel.json` para manter cabeçalhos de segurança HTTP e habilitar os proxies reversos necessários para o Uptime Kuma e formulários (n8n):
```bash
# Usando a CLI do Vercel
npm install -g vercel
vercel --prod
```

### 3. Cloudflare Pages
O projeto publica as configurações de cabeçalhos via `public/_headers` e regras de redirecionamento/proxy através de `public/_redirects`:
```bash
# Implantar usando Wrangler CLI
npx wrangler pages deploy dist --project-name=landing-corp
```

---

## 🤖 Programando com Assistentes de IA (Cursor/Windsurf)

Este repositório é otimizado para o desenvolvimento colaborativo com agentes e assistentes de IA:
- O manual arquitetônico canônico para humanos e agentes é o [agents.md](file:///home/ismaelsoilet/template-landing/agents.md). **Nunca remova ou ignore este arquivo**.
- As diretrizes do `agents.md` são espelhadas nos arquivos de configuração do assistente [.cursorrules](file:///home/ismaelsoilet/template-landing/.cursorrules) e [.windsurfrules](file:///home/ismaelsoilet/template-landing/.windsurfrules) na raiz.
- Ao atualizar o `agents.md`, certifique-se de replicar as alterações nos arquivos correspondentes.

---

## ❓ FAQ (Perguntas Frequentes)

#### Como funciona a máscara do input de telefone no formulário de contato?
Para evitar carregar scripts desnecessários no carregamento inicial da página (bloqueando a thread principal), a biblioteca `imask` (124KB) é carregada sob demanda (`import('imask')`) apenas quando o input de telefone (`#phone`) recebe o evento de foco.

#### Como o site protege contra SPAM sem reCAPTCHA pesado?
Implementamos o padrão **Honeypot**. Um campo invisível (`username`) é inserido no formulário. Bots preenchem automaticamente todos os inputs de formulário. Se o script detectar qualquer preenchimento neste campo, o formulário finge que obteve sucesso, limpa a tela de forma amigável, mas aborta imediatamente a requisição sem chamar o webhook do n8n.

#### Por que o Nginx / Vercel configuram proxies para Webhooks?
Para evitar expor o endpoint final do n8n/CRM diretamente no JavaScript do navegador (o que facilitaria spammers e ataques direcionados) e contornar restrições de CORS, o formulário envia dados para o caminho relativo `/api/submit-form`. A infraestrutura de nuvem selecionada (Nginx, Vercel ou Cloudflare Pages) faz o proxy reverso de forma segura para o destino correto.

---

## 🔧 Troubleshooting (Resolução de Problemas)

#### O build falha por causa de imagens ou frontmatter do blog
O Astro valida rigorosamente o frontmatter usando o schema Zod definido em `src/content.config.ts`. Certifique-se de que a `description` tenha exatamente entre 140 e 160 caracteres e que o campo `keywords` contenha pelo menos 1 item e no máximo 8.

#### Erros de CORS ao testar formulário localmente
Em desenvolvimento local (`pnpm dev`), a API local `/api/submit-form` não estará disponível a menos que haja um proxy dev correspondente. Para fins de testes locais, altere temporariamente o endpoint em `site.ts` ou inspecione a saída da requisição que deverá falhar graciosamente e cair no banner de erro do formulário, permitindo que a UI se recupere corretamente.
