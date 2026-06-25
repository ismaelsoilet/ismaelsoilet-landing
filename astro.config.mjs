// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://template.suitplus.com.br',
  output: 'static',
  // Disable the Astro DevTools toolbar: it injects a client entrypoint that
  // Firefox can fail to load with NS_ERROR_CORRUPTED_CONTENT in dev mode,
  // and the toolbar also tries to load Partytown debug assets that 404 in dev.
  // The toolbar is dev-only and not used in production. We rely on our own
  // scripts (check-icons, qa-seo, smoke-test) for visual debugging instead.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api/submit-form': {
          target: 'https://n8n.suitplus.com.br',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/submit-form/, '/webhook/contato-site')
        }
      }
    }
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        const excludedPaths = ['/privacidade', '/termos', '/components', '/quickstart', '/index-exemplo'];
        return !excludedPaths.some(excluded => path.startsWith(excluded));
      }
    }),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    })
  ],
  image: {
    domains: ['images.unsplash.com'],
  },
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
