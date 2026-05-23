export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  type: "Full-time" | "Freelance" | "Project Based";
  highlights: string[];
  stack?: string[];
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  link?: string;
  category: "Web" | "Mobile" | "Backend" | "Landing";
  accent: "violet" | "cyan" | "emerald" | "amber" | "rose";
};

export const profile = {
  name: "Dedy Priyatna",
  initials: "DP",
  role: "Engineering Lead · Full-Stack Architect",
  tagline:
    "Turning complex business problems into clean, scalable products that real people love to use.",
  intro:
    "I lead engineering teams that ship fast without breaking things. From e-commerce platforms serving thousands of users to internal tools that quietly save hundreds of work-hours, I focus on the details that compound — readable code, thoughtful architecture, and humans who feel respected by the software they touch.",
  location: "Green Ville Citra Maja City, Indonesia",
  email: "dedypry@gmail.com",
  phone: "+62 812-8614-1441",
  linkedin: "https://id.linkedin.com/in/dedy-priyatna-2b1801202",
  github: "https://github.com/dedypry",
  available: true,
  stats: [
    { label: "Years building software", value: "6+" },
    { label: "Production projects shipped", value: "15+" },
    { label: "Teams led & mentored", value: "5" },
    { label: "Stacks mastered", value: "12+" },
  ],
};

export const philosophy = [
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
];

export const experiences: Experience[] = [
  {
    period: "Mar 2024 — Present",
    role: "Lead E-commerce",
    company: "PT. Vigo Technologi Indonesia",
    location: "Jakarta",
    type: "Full-time",
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
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "GCP"],
  },
  {
    period: "Jan 2024 — Mar 2024",
    role: "Front-End Developer",
    company: "PT. Sinar Sakti International",
    location: "Jakarta",
    type: "Freelance",
    highlights: [
      "Designed and shipped responsive interfaces across TV, mobile, tablet, and desktop.",
      "Built mobile experiences with Flutter, collaborating tightly with design.",
      "Patched security holes and rolled out features without breaking existing flows.",
      "Presented product updates and new features directly to C-level executives.",
      "Integrated third-party services to extend platform capabilities.",
    ],
    stack: ["Flutter", "React", "TypeScript", "REST APIs"],
  },
  {
    period: "Oct 2023 — Dec 2023",
    role: "Senior Software Engineer",
    company: "Sprout Digital Lab",
    location: "Tangerang",
    type: "Freelance",
    highlights: [
      "Built clean, well-tested services in NestJS using a service-oriented / microservices approach.",
      "Owned Jira tickets end to end — from reproduction to production deploy.",
      "Integrated third-party APIs to enrich existing products.",
      "Authored shared libraries that became the team's reliable building blocks.",
      "Helped QA shape test cases and reproduce edge-case bugs.",
    ],
    stack: ["NestJS", "Node.js", "Microservices", "TypeScript"],
  },
  {
    period: "Jul 2022 — Aug 2023",
    role: "Senior Backend Engineer",
    company: "PT. Aneka Juragan Material",
    location: "Jakarta",
    type: "Full-time",
    highlights: [
      "Architected scalable, secure backends powering juraganmaterial.id — a B2B construction-materials marketplace.",
      "Built APIs, databases, and integrations connecting customers, vendors, payment gateways, and logistics.",
      "Set up CI/CD pipelines, Docker workflows, and Google Cloud deployments.",
      "Mentored junior engineers via code reviews and pair-programming.",
      "Investigated and resolved production issues with calm, data-driven debugging.",
    ],
    stack: ["Node.js", "PostgreSQL", "Firebase", "GCP", "Docker", "CI/CD"],
  },
  {
    period: "Jun 2021 — Jul 2022",
    role: "Full-Stack Developer",
    company: "PT. Jafra Cosmetic Indonesia",
    location: "Jakarta",
    type: "Full-time",
    highlights: [
      "Designed the backend powering Jafra Office Management (JOM) — staff orders, vendor requests, and approvals.",
      "Shipped a reimbursement module with end-to-end submission and tracking.",
      "Built an internal IT ticketing system to streamline support.",
      "Localized the platform for multiple countries where Jafra operates.",
      "Tuned performance, hardened security, and kept the app stable under real-world load.",
    ],
    stack: ["Laravel", "Vue.js", "Flutter", "PostgreSQL", "Firebase", "Nginx"],
  },
  {
    period: "Mar 2020 — Mar 2021",
    role: "Senior Backend Engineer",
    company: "PT. Solusi Ekosistem Global",
    location: "Jakarta",
    type: "Full-time",
    highlights: [
      "Delivered cross-border commerce platforms: idnstore.tw, indomatjar.com, and a China event store.",
      "Translated technical needs into reliable, maintainable systems with the design team.",
      "Modernized legacy code to improve UX and performance.",
      "Stood up automated testing and validation procedures for repeatable releases.",
    ],
    stack: ["Laravel", "Vue.js", "Node.js", "React", "Flutter", "MongoDB", "Socket.io"],
  },
  {
    period: "Nov 2019 — Mar 2020",
    role: "Full-Stack Engineer",
    company: "PT. Rekayasa Aplikasi Digital",
    location: "Jakarta",
    type: "Freelance",
    highlights: [
      "Delivered remote, target-driven projects including PLN's online interview platform and KampusDigi.",
      "Maintained legacy products while gradually modernizing them with newer stacks.",
      "Worked with DevOps to ship to production with minimum disruption.",
      "Helped PMs scope, estimate, and forecast realistic milestones.",
    ],
    stack: ["Laravel", "Vue.js", "Node.js", "React", "React Native"],
  },
];

export const projects: Project[] = [
  {
    name: "Elefin",
    tagline: "B2B platform under Mayapada Group",
    description:
      "An enterprise B2B web application built for Mayapada Group — combining a React front-end with a Node.js backend to streamline business workflows at scale.",
    stack: ["React", "Node.js", "TypeScript"],
    category: "Web",
    accent: "violet",
  },
  {
    name: "Juragan Material",
    tagline: "B2B marketplace for construction materials",
    description:
      "A startup connecting Indonesian SMEs with building-material vendors nationwide. Powered by flexible pay-later partnerships (Paper, Coint Work, Credilink) and integrated logistics.",
    stack: ["Node.js", "PostgreSQL", "Firebase", "GCP"],
    link: "https://juraganmaterial.id/",
    category: "Web",
    accent: "amber",
  },
  {
    name: "JOM — Jafra Office Management",
    tagline: "Paperless office in one click",
    description:
      "A management system that replaces signature-heavy manual workflows with a single click — approvals, requests, and tracking all in one place.",
    stack: ["Laravel", "Vue.js", "Flutter", "PostgreSQL"],
    category: "Web",
    accent: "cyan",
  },
  {
    name: "Indomatjar",
    tagline: "Cross-border commerce for Indonesian SMEs",
    description:
      "A platform helping Indonesian SMEs sell to Arab nations, China, Taiwan, and Hong Kong — with UnionPay, Alipay, WeChat Pay, and credit-card support, plus shipping via Pos Indonesia, DHL, and TGI.",
    stack: ["Laravel", "Vue.js", "Node.js", "MongoDB"],
    category: "Web",
    accent: "rose",
  },
  {
    name: "PDEkpor",
    tagline: "Empowering Indonesian SMEs to go global",
    description:
      "A sister product to Indomatjar — guiding Indonesian small and medium businesses through the realities of exporting to international markets.",
    stack: ["Laravel", "Vue.js"],
    category: "Web",
    accent: "emerald",
  },
  {
    name: "Labamu",
    tagline: "Mobile cashier app for everyday merchants",
    description:
      "A mobile point-of-sale app built with Flutter — designed with a small team to make daily transactions effortless for micro-merchants.",
    stack: ["Flutter", "Mobile"],
    category: "Mobile",
    accent: "cyan",
  },
  {
    name: "PLN Online Interview",
    tagline: "Pandemic-era hiring, accelerated",
    description:
      "Built during the pandemic to give PLN candidates a fast, real-time online interview experience with immediate feedback — turning days into minutes.",
    stack: ["Laravel", "Vue.js", "WebRTC"],
    category: "Web",
    accent: "violet",
  },
  {
    name: "General Ledger Web",
    tagline: "From desktop to anywhere",
    description:
      "A Laravel + MySQL re-platforming of a legacy desktop app — letting employees access financial data securely from home.",
    stack: ["Laravel", "MySQL"],
    category: "Web",
    accent: "amber",
  },
  {
    name: "Anggaran Web",
    tagline: "Budgeting on top of the GL",
    description:
      "Built with Laravel 8 and Vue 2.6, consuming data from the General Ledger web app to deliver budget planning and tracking.",
    stack: ["Laravel", "Vue.js"],
    category: "Web",
    accent: "emerald",
  },
  {
    name: "BeFinance",
    tagline: "Personal finance, simplified",
    description:
      "A clean Flutter mobile app for tracking incoming and outgoing money — built for clarity, not feature bloat.",
    stack: ["Flutter"],
    category: "Mobile",
    accent: "cyan",
  },
  {
    name: "Hijaiyah Kids Game",
    tagline: "Learning Hijaiyah letters through play",
    description:
      "An educational Flutter game for kids — teaching Hijaiyah letters via sound and a matching mini-game where children pair what they hear with what they see.",
    stack: ["Flutter"],
    category: "Mobile",
    accent: "rose",
  },
  {
    name: "Bram Enterprise · Pendi Jaya",
    tagline: "Landing pages with intention",
    description:
      "Two Bootstrap-powered landing pages: Bram Enterprise (IT consulting) and Pendi Jaya Aluminium — both focused on clarity, conversion, and craft.",
    stack: ["Bootstrap", "HTML/CSS"],
    category: "Landing",
    accent: "amber",
  },
];

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "PHP", "Dart", "SQL"],
  },
  {
    title: "Frontend",
    items: ["React", "Vue.js", "Vite", "Tailwind CSS", "React Native", "Flutter"],
  },
  {
    title: "Backend",
    items: ["Node.js", "NestJS", "Laravel", "REST APIs", "Microservices", "Socket.io"],
  },
  {
    title: "Data & Cloud",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "GCP", "Docker", "Nginx"],
  },
  {
    title: "Practices",
    items: [
      "Team Leadership",
      "Architecture Design",
      "Code Review",
      "Mentoring",
      "Agile / Scrum",
      "CI/CD",
    ],
  },
];

export const education = {
  school: "Universitas Pamulang",
  location: "Tangerang",
  period: "2019 — 2022",
  degree: "Bachelor's Degree, Elementary Education",
};
