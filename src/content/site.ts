export interface SiteConfig {
  org: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
    description: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  social: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
    threads?: string;
  };
  webhook: {
    contact: string;
  };
  theme: {
    colors: {
      light: string; // e.g. hex color for theme-color meta in light mode
      dark: string;  // e.g. hex color for theme-color meta in dark mode
    };
  };
  tracking: {
    gtmId?: string;
    metaPixelId?: string;
    hotjarId?: string;
    clarityId?: string;
    webVitalsEndpoint?: string;
  };
}

export const site: SiteConfig = {
  org: {
    name: "Suitplus",
    url: "https://template.suitplus.com.br",
    logo: "https://template.suitplus.com.br/logo.svg",
    description: "Plataforma premium de aceleração de resultados e soluções corporativas inteligentes.",
    sameAs: [
      "https://www.linkedin.com/company/suitplus",
      "https://www.instagram.com/suitplus",
      "https://github.com/suitplus"
    ]
  },
  contact: {
    email: "contato@suitplus.com.br",
    phone: "+55 (11) 99999-9999",
    whatsapp: "https://wa.me/5513996603357"
  },
  social: {
    linkedin: "https://www.linkedin.com/company/suitplus",
    instagram: "https://www.instagram.com/suitplus",
    github: "https://github.com/suitplus",
    facebook: "https://facebook.com/suitplus",
    threads: "https://threads.net/@suitplus",
    twitter: "https://x.com/suitplus"
  },
  webhook: {
    contact: "/api/submit-form" // Relative path matches proxy configured in Nginx/Vercel/CF
  },
  theme: {
    colors: {
      light: "#ffffff",
      dark: "#020617" // tailwind slate-950
    }
  },
  tracking: {
    // Left empty for default zero-JS, but can be set for testing/client rebrand
    gtmId: "",
    metaPixelId: "",
    hotjarId: "",
    clarityId: "",
    webVitalsEndpoint: ""
  }
};
