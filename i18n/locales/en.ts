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
    blog: string;
    letsTalk: string;
    downloadCV: string;
    generating: string;
    toggleMenu: string;
    languageLabel: string;
    themeLabel: string;
    themeDark: string;
    themeLight: string;
    commandPalette: string;
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
    leaveMessage: string;
    leaveMessageHint: string;
  };
  message: {
    eyebrow: string;
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    backHome: string;
    privacyNote: string;
    failed: string;
  };
  caseStudy: {
    eyebrow: string;
    title: string;
    description: string;
    metrics: { value: string; label: string }[];
    overviewTitle: string;
    overviewBody: string;
    challengeTitle: string;
    challenges: string[];
    solutionTitle: string;
    solutions: string[];
    architectureTitle: string;
    architecture: { label: string; body: string }[];
    impactTitle: string;
    impact: string[];
  };
  command: {
    placeholder: string;
    hint: string;
    groups: {
      navigation: string;
      actions: string;
      preferences: string;
    };
    actions: {
      downloadCv: string;
      copyEmail: string;
      emailCopied: string;
      toggleTheme: string;
      switchLanguage: string;
    };
  };
  chat: {
    bubbleLabel: string;
    title: string;
    subtitle: string;
    online: string;
    greeting: string;
    suggestionLabel: string;
    suggestions: { label: string; prompt: string }[];
    inputPlaceholder: string;
    send: string;
    stop: string;
    reset: string;
    typing: string;
    poweredBy: string;
    disclaimer: string;
    errorGeneric: string;
    errorRateLimit: string;
    closeLabel: string;
    quickActionsTitle: string;
    quickActions: {
      email: string;
      whatsapp: string;
      linkedin: string;
    };
    cooldownHint: string;
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
    blog: "Blog",
    letsTalk: "Let's talk",
    downloadCV: "Download CV",
    generating: "Generating…",
    toggleMenu: "Toggle menu",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    commandPalette: "Command palette",
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
    leaveMessage: "Leave a message",
    leaveMessageHint: "Don't have email handy? Drop me a quick note instead.",
  },
  message: {
    eyebrow: "Leave a message",
    title: "Tell me what you're working on.",
    description:
      "Drop a note here and I'll reply to your email within a business day. No login, no fluff.",
    nameLabel: "Your name",
    namePlaceholder: "Jane Cooper",
    emailLabel: "Email",
    emailPlaceholder: "jane@company.com",
    subjectLabel: "Subject (optional)",
    subjectPlaceholder: "What's this about?",
    bodyLabel: "Message",
    bodyPlaceholder:
      "Tell me about the project, role, or problem you're trying to solve…",
    submit: "Send message",
    submitting: "Sending…",
    successTitle: "Message sent.",
    successBody:
      "Thanks for reaching out — I'll get back to you on email within a business day.",
    sendAnother: "Send another",
    backHome: "Back to homepage",
    privacyNote:
      "Your details are stored securely and only used to reply. No newsletters, no third parties.",
    failed: "Couldn't send your message. Please try again in a moment.",
  },
  caseStudy: {
    eyebrow: "Case Study",
    title: "Juragan Material: building the backbone for a B2B marketplace.",
    description:
      "A deeper look at how I approached backend architecture, integrations, and delivery for a construction-materials marketplace with vendors, payments, and logistics in one flow.",
    metrics: [
      { value: "B2B", label: "Marketplace model" },
      { value: "4+", label: "External integrations" },
      { value: "CI/CD", label: "Deployment workflow" },
      { value: "GCP", label: "Cloud foundation" },
    ],
    overviewTitle: "Context",
    overviewBody:
      "Juragan Material helps Indonesian businesses source construction materials from vendors across the country. The platform needed to support vendor catalogs, customer ordering, pay-later partnerships, logistics handoffs, and an internal CMS without becoming a brittle monolith.",
    challengeTitle: "Key challenges",
    challenges: [
      "Integrating multiple payment and logistics partners while keeping the core marketplace flow stable.",
      "Designing backend modules that could evolve with product experiments and vendor onboarding needs.",
      "Keeping production operations predictable with Docker, CI/CD, and clear deployment practices.",
      "Mentoring junior engineers so the codebase could scale with the team, not just with traffic.",
    ],
    solutionTitle: "What I did",
    solutions: [
      "Designed backend boundaries around catalog, order, payment, logistics, and internal CMS responsibilities.",
      "Built REST APIs and database structures that made marketplace workflows explicit and easier to test.",
      "Set up Dockerized development and deployment pipelines to reduce environment drift.",
      "Reviewed code, paired with engineers, and documented the system so ownership could spread across the team.",
    ],
    architectureTitle: "Architecture choices",
    architecture: [
      {
        label: "Backend core",
        body: "Node.js services with PostgreSQL as the transactional source of truth.",
      },
      {
        label: "Cloud & deploy",
        body: "Dockerized workflows deployed on Google Cloud Platform with CI/CD automation.",
      },
      {
        label: "Integrations",
        body: "Payment and logistics adapters isolated from marketplace domain logic.",
      },
    ],
    impactTitle: "Impact",
    impact: [
      "Created a backend foundation ready for marketplace growth and new vendor workflows.",
      "Reduced delivery risk by making integrations more isolated and testable.",
      "Improved team velocity through code review standards, mentoring, and documentation.",
    ],
  },
  command: {
    placeholder: "Type a command or jump to a section...",
    hint: "Press Esc to close · Enter to run",
    groups: {
      navigation: "Navigation",
      actions: "Actions",
      preferences: "Preferences",
    },
    actions: {
      downloadCv: "Download current-language CV",
      copyEmail: "Copy email address",
      emailCopied: "Email copied",
      toggleTheme: "Toggle light/dark theme",
      switchLanguage: "Switch language",
    },
  },
  chat: {
    bubbleLabel: "Chat with Dedy's AI assistant",
    title: "Ask about Dedy",
    subtitle: "AI assistant trained on his portfolio",
    online: "Online",
    greeting:
      "Hey 👋 I'm the bot Dedy parked here while he's heads-down coding. Ask me about his projects, stack, vibe, availability — or just say hi.",
    suggestionLabel: "Try asking:",
    suggestions: [
      {
        label: "TL;DR",
        prompt: "Give me a quick TL;DR on who Dedy is.",
      },
      {
        label: "Coolest project",
        prompt: "What's the coolest thing Dedy has shipped recently and why?",
      },
      {
        label: "Stack vibes",
        prompt: "What's Dedy's go-to stack, and what does he actually enjoy working with?",
      },
      {
        label: "Can I hire him?",
        prompt: "Is Dedy open to new gigs? What's the best way to reach him?",
      },
    ],
    inputPlaceholder: "Ask me anything about Dedy…",
    send: "Send",
    stop: "Stop",
    reset: "Start over",
    typing: "Thinking…",
    poweredBy: "Powered by Gemini",
    disclaimer: "AI responses may be inaccurate — verify important details.",
    errorGeneric:
      "Something went wrong while reaching the AI. Please try again in a moment.",
    errorRateLimit: "Too many messages. Please wait a moment before trying again.",
    closeLabel: "Close chat",
    quickActionsTitle: "Talk to Dedy directly:",
    quickActions: {
      email: "Email",
      whatsapp: "WhatsApp",
      linkedin: "LinkedIn",
    },
    cooldownHint: "Please wait a moment before sending another message.",
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
