import type {
  ExperienceId,
  ExperienceType,
  ProjectCategory,
  ProjectId,
  SkillGroupId,
} from "../../data/portfolio";

type ExperienceCopy = {
  period: string;
  role: string;
  company: string;
  location: string;
  highlights: string[];
};

type ProjectCopy = {
  name: string;
  tagline: string;
  description: string;
};

export type TranslationShape = {
  meta: {
    title: string;
    description: string;
    languageName: string;
    languageCode: string;
  };
  nav: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    contact: string;
    letsTalk: string;
    downloadCV: string;
    generating: string;
    toggleMenu: string;
    languageLabel: string;
  };
  hero: {
    statusOpen: string;
    statusBusy: string;
    greeting: string;
    headlineLine1: string;
    headlineHighlight: string;
    primaryCta: string;
    seeWork: string;
    portraitNowLabel: string;
    portraitNowValue: string;
    chipSinceLabel: string;
    chipSinceValue: string;
    chipStackLabel: string;
    chipStackValue: string;
    stats: { label: string; value: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; body: string }[];
    tagline: string;
    role: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    types: Record<ExperienceType, string>;
    items: Record<ExperienceId, ExperienceCopy>;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    filters: { all: string } & Record<ProjectCategory, string>;
    items: Record<ProjectId, ProjectCopy>;
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    groupTitles: Record<SkillGroupId, string>;
    practices: string[];
    education: {
      degree: string;
      school: string;
      location: string;
      period: string;
    };
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    cardTitle: string;
    cardDescription: string;
    emailMe: string;
    elsewhereTitle: string;
    elsewhereDescription: string;
    statusOpen: string;
  };
  footer: {
    crafted: string;
    location: string;
  };
  pdf: {
    summary: string;
    experience: string;
    skills: string;
    projects: string;
    education: string;
    pageOf: string;
  };
};

export const en: TranslationShape = {
  meta: {
    title:
      "Dedy Priyatna · Engineering Lead & Full-Stack Architect",
    description:
      "Dedy Priyatna — Lead E-commerce Engineer & Full-Stack Architect. Building scalable, human-centered software since 2019.",
    languageName: "English",
    languageCode: "EN",
  },
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    letsTalk: "Let's talk",
    downloadCV: "Download CV",
    generating: "Generating…",
    toggleMenu: "Toggle menu",
    languageLabel: "Language",
  },
  hero: {
    statusOpen: "Open for new opportunities",
    statusBusy: "Currently engaged",
    greeting: "Hi, I'm",
    headlineLine1: "I build software",
    headlineHighlight: "that ships.",
    primaryCta: "Let's build something",
    seeWork: "See my work",
    portraitNowLabel: "Currently",
    portraitNowValue: "Lead E-commerce · Vigo",
    chipSinceLabel: "Since",
    chipSinceValue: "2019",
    chipStackLabel: "Stack",
    chipStackValue: "TS · Node · React",
    stats: [
      { label: "Years building software", value: "6+" },
      { label: "Production projects shipped", value: "15+" },
      { label: "Teams led & mentored", value: "5" },
      { label: "Stacks mastered", value: "12+" },
    ],
  },
  about: {
    eyebrow: "About",
    title: "A pragmatic engineer who leads from the keyboard.",
    description:
      "I lead engineering teams that ship fast without breaking things. From e-commerce platforms serving thousands of users to internal tools that quietly save hundreds of work-hours, I focus on the details that compound — readable code, thoughtful architecture, and humans who feel respected by the software they touch.",
    items: [
      {
        title: "Architecture that scales with the team",
        body: "I design systems that stay readable on day one and on day one-thousand — modular, observable, and boring in the best way.",
      },
      {
        title: "Lead by clearing roadblocks",
        body: "My job as a lead is to make my team faster than I ever was. Pair, review, mentor, then get out of the way.",
      },
      {
        title: "Ship value, not vanity",
        body: "Every line of code should map back to a user need or a business outcome. If it doesn't, we cut it.",
      },
    ],
    tagline:
      "Turning complex business problems into clean, scalable products that real people love to use.",
    role: "Engineering Lead · Full-Stack Architect",
  },
  experience: {
    eyebrow: "Experience",
    title:
      "Six years, twelve stacks, one consistent goal: ship the right thing.",
    description:
      "A short timeline of where I've been — from full-stack freelancer to engineering lead — and the kinds of problems I've enjoyed solving along the way.",
    types: {
      fulltime: "Full-time",
      freelance: "Freelance",
      projectBased: "Project Based",
    },
    items: {
      vigo: {
        period: "Mar 2024 — Present",
        role: "Lead E-commerce",
        company: "PT. Vigo Technologi Indonesia",
        location: "Jakarta",
        highlights: [
          "Lead a cross-functional engineering team to ship features on schedule without sacrificing quality.",
          "Design scalable, modular system architectures for a growing portfolio of e-commerce products.",
          "Stay hands-on with code — owning core features and untangling the gnarliest technical problems myself.",
          "Drive end-to-end testing culture: unit, integration, and UAT, baked into every release.",
          "Mentor engineers, run reviews, and grow people into the seniors we'll need next year.",
          "Partner closely with product, design, and stakeholders to align every sprint with the product vision.",
          "Plan timelines, estimate effort, and translate ambiguity into shippable milestones.",
          "Continuously monitor performance and apply optimizations before they become incidents.",
          "Champion best practices and Agile rituals that actually make the team faster.",
        ],
      },
      sinarsakti: {
        period: "Jan 2024 — Mar 2024",
        role: "Front-End Developer",
        company: "PT. Sinar Sakti International",
        location: "Jakarta",
        highlights: [
          "Designed and shipped responsive interfaces across TV, mobile, tablet, and desktop.",
          "Built mobile experiences with Flutter, collaborating tightly with design.",
          "Patched security holes and rolled out features without breaking existing flows.",
          "Presented product updates and new features directly to C-level executives.",
          "Integrated third-party services to extend platform capabilities.",
        ],
      },
      sproutdigital: {
        period: "Oct 2023 — Dec 2023",
        role: "Senior Software Engineer",
        company: "Sprout Digital Lab",
        location: "Tangerang",
        highlights: [
          "Built clean, well-tested services in NestJS using a service-oriented / microservices approach.",
          "Owned Jira tickets end to end — from reproduction to production deploy.",
          "Integrated third-party APIs to enrich existing products.",
          "Authored shared libraries that became the team's reliable building blocks.",
          "Helped QA shape test cases and reproduce edge-case bugs.",
        ],
      },
      anekajuragan: {
        period: "Jul 2022 — Aug 2023",
        role: "Senior Backend Engineer",
        company: "PT. Aneka Juragan Material",
        location: "Jakarta",
        highlights: [
          "Architected scalable, secure backends powering juraganmaterial.id — a B2B construction-materials marketplace.",
          "Built APIs, databases, and integrations connecting customers, vendors, payment gateways, and logistics.",
          "Set up CI/CD pipelines, Docker workflows, and Google Cloud deployments.",
          "Mentored junior engineers via code reviews and pair-programming.",
          "Investigated and resolved production issues with calm, data-driven debugging.",
        ],
      },
      jafra: {
        period: "Jun 2021 — Jul 2022",
        role: "Full-Stack Developer",
        company: "PT. Jafra Cosmetic Indonesia",
        location: "Jakarta",
        highlights: [
          "Designed the backend powering Jafra Office Management (JOM) — staff orders, vendor requests, and approvals.",
          "Shipped a reimbursement module with end-to-end submission and tracking.",
          "Built an internal IT ticketing system to streamline support.",
          "Localized the platform for multiple countries where Jafra operates.",
          "Tuned performance, hardened security, and kept the app stable under real-world load.",
        ],
      },
      solusiekosistem: {
        period: "Mar 2020 — Mar 2021",
        role: "Senior Backend Engineer",
        company: "PT. Solusi Ekosistem Global",
        location: "Jakarta",
        highlights: [
          "Delivered cross-border commerce platforms: idnstore.tw, indomatjar.com, and a China event store.",
          "Translated technical needs into reliable, maintainable systems with the design team.",
          "Modernized legacy code to improve UX and performance.",
          "Stood up automated testing and validation procedures for repeatable releases.",
        ],
      },
      rekayasa: {
        period: "Nov 2019 — Mar 2020",
        role: "Full-Stack Engineer",
        company: "PT. Rekayasa Aplikasi Digital",
        location: "Jakarta",
        highlights: [
          "Delivered remote, target-driven projects including PLN's online interview platform and KampusDigi.",
          "Maintained legacy products while gradually modernizing them with newer stacks.",
          "Worked with DevOps to ship to production with minimum disruption.",
          "Helped PMs scope, estimate, and forecast realistic milestones.",
        ],
      },
    },
  },
  projects: {
    eyebrow: "Selected Work",
    title: "Products I've shipped, teams I've helped, problems I've solved.",
    description:
      "A curated tour of platforms, mobile apps, and internal tools across e-commerce, B2B, finance, and education.",
    filters: {
      all: "All",
      Web: "Web",
      Mobile: "Mobile",
      Backend: "Backend",
      Landing: "Landing",
    },
    items: {
      elefin: {
        name: "Elefin",
        tagline: "B2B platform under Mayapada Group",
        description:
          "An enterprise B2B web application built for Mayapada Group — combining a React front-end with a Node.js backend to streamline business workflows at scale.",
      },
      juraganmaterial: {
        name: "Juragan Material",
        tagline: "B2B marketplace for construction materials",
        description:
          "A startup connecting Indonesian SMEs with building-material vendors nationwide. Powered by flexible pay-later partnerships (Paper, Coint Work, Credilink) and integrated logistics.",
      },
      jom: {
        name: "JOM — Jafra Office Management",
        tagline: "Paperless office in one click",
        description:
          "A management system that replaces signature-heavy manual workflows with a single click — approvals, requests, and tracking all in one place.",
      },
      indomatjar: {
        name: "Indomatjar",
        tagline: "Cross-border commerce for Indonesian SMEs",
        description:
          "A platform helping Indonesian SMEs sell to Arab nations, China, Taiwan, and Hong Kong — with UnionPay, Alipay, WeChat Pay, and credit-card support, plus shipping via Pos Indonesia, DHL, and TGI.",
      },
      pdekpor: {
        name: "PDEkpor",
        tagline: "Empowering Indonesian SMEs to go global",
        description:
          "A sister product to Indomatjar — guiding Indonesian small and medium businesses through the realities of exporting to international markets.",
      },
      labamu: {
        name: "Labamu",
        tagline: "Mobile cashier app for everyday merchants",
        description:
          "A mobile point-of-sale app built with Flutter — designed with a small team to make daily transactions effortless for micro-merchants.",
      },
      pln: {
        name: "PLN Online Interview",
        tagline: "Pandemic-era hiring, accelerated",
        description:
          "Built during the pandemic to give PLN candidates a fast, real-time online interview experience with immediate feedback — turning days into minutes.",
      },
      generalledger: {
        name: "General Ledger Web",
        tagline: "From desktop to anywhere",
        description:
          "A Laravel + MySQL re-platforming of a legacy desktop app — letting employees access financial data securely from home.",
      },
      anggaranweb: {
        name: "Anggaran Web",
        tagline: "Budgeting on top of the GL",
        description:
          "Built with Laravel 8 and Vue 2.6, consuming data from the General Ledger web app to deliver budget planning and tracking.",
      },
      befinance: {
        name: "BeFinance",
        tagline: "Personal finance, simplified",
        description:
          "A clean Flutter mobile app for tracking incoming and outgoing money — built for clarity, not feature bloat.",
      },
      hijaiyah: {
        name: "Hijaiyah Kids Game",
        tagline: "Learning Hijaiyah letters through play",
        description:
          "An educational Flutter game for kids — teaching Hijaiyah letters via sound and a matching mini-game where children pair what they hear with what they see.",
      },
      landingpages: {
        name: "Bram Enterprise · Pendi Jaya",
        tagline: "Landing pages with intention",
        description:
          "Two Bootstrap-powered landing pages: Bram Enterprise (IT consulting) and Pendi Jaya Aluminium — both focused on clarity, conversion, and craft.",
      },
    },
  },
  skills: {
    eyebrow: "Toolkit",
    title:
      "The stack I reach for — and the practices that hold it together.",
    description:
      "Tools change every year. The instinct to choose the simplest one that solves the actual problem doesn't.",
    groupTitles: {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend",
      dataCloud: "Data & Cloud",
      practices: "Practices",
    },
    practices: [
      "Team Leadership",
      "Architecture Design",
      "Code Review",
      "Mentoring",
      "Agile / Scrum",
      "CI/CD",
    ],
    education: {
      degree: "Bachelor's Degree, Elementary Education",
      school: "Universitas Pamulang",
      location: "Tangerang",
      period: "2019 — 2022",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Got a problem worth solving?",
    description:
      "Whether it's an ambitious greenfield product, a stuck legacy system, or an engineering team that needs leadership — I'd love to hear about it.",
    cardTitle: "Let's start a conversation.",
    cardDescription:
      "The fastest way to reach me is email. I usually reply within a business day.",
    emailMe: "Email me",
    elsewhereTitle: "Find me elsewhere",
    elsewhereDescription:
      "I'm most active on LinkedIn for collaboration and on GitHub for code.",
    statusOpen:
      "Currently open to senior / lead engineering roles & consulting.",
  },
  footer: {
    crafted:
      "Crafted with React, Vite, TypeScript & Tailwind CSS.",
    location: "Designed and shipped from Indonesia.",
  },
  pdf: {
    summary: "Summary",
    experience: "Experience",
    skills: "Skills",
    projects: "Selected Projects",
    education: "Education",
    pageOf: "Page {{n}} of {{total}}",
  },
};
