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
      light: string;
      dark: string;
    };
  };
  tracking: {
    gtmId?: string;
    metaPixelId?: string;
    hotjarId?: string;
    clarityId?: string;
    webVitalsEndpoint?: string;
  };
  person?: {
    name: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    roles: string[];
    description: string;
    image: string;
    url: string;
    sameAs: string[];
    credentials: Array<{
      name: string;
      category: string;
      recognizedBy: string;
    }>;
  };
}

export const site: SiteConfig = {
  org: {
    name: "Ismael Soilet",
    url: "https://ismaelsoilet.suitplus.com.br",
    logo: "/logo.svg",
    description: "Líder em Transformação Digital, Gestão Pública, Ciência de Dados e Desenvolvimento de Software.",
    sameAs: [
      "https://www.linkedin.com/in/ismael-soilet/",
      "https://github.com/ismaelsoilet"
    ]
  },
  contact: {
    email: "ismael.soilet@hotmail.com",
    phone: "+55 (13) 99796-1799",
    whatsapp: "https://wa.me/5513997961799"
  },
  social: {
    linkedin: "https://www.linkedin.com/in/ismael-soilet/",
    github: "https://github.com/ismaelsoilet"
  },
  webhook: {
    contact: "/api/submit-form"
  },
  theme: {
    colors: {
      light: "#f3f2ef", // LinkedIn light background
      dark: "#1d2226" // LinkedIn dark background
    }
  },
  tracking: {
    gtmId: "",
    metaPixelId: "",
    hotjarId: "",
    clarityId: "",
    webVitalsEndpoint: ""
  },
  person: {
    name: "Ismael Hosni Soilet de Lima",
    firstName: "Ismael",
    lastName: "Soilet",
    jobTitle: "Product Owner & Tech Leader",
    roles: [
      "Product Owner",
      "Desenvolvedor Full-Stack",
      "Gestor Público",
      "Cientista de Dados",
      "Empreendedor"
    ],
    description: "Transformo regras de negócio complexas em soluções digitais de alto impacto, unindo Tecnologia da Informação, Ciência de Dados e Gestão Estratégica.",
    image: "/src/assets/photo.jpg", // Real/placeholder path
    url: "https://ismaelsoilet.suitplus.com.br",
    sameAs: [
      "https://www.linkedin.com/in/ismael-soilet/",
      "https://github.com/ismaelsoilet"
    ],
    credentials: [
      {
        name: "CRA-SP 6-2962",
        category: "Professional Registration",
        recognizedBy: "Conselho Regional de Administração de São Paulo"
      }
    ]
  }
};

