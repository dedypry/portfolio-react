/**
 * Static, non-translatable portfolio data.
 * Translatable strings (role, descriptions, highlights, etc.) live in
 * `src/i18n/locales/{en,id}.ts` and are referenced by these IDs.
 */

export const profile = {
  name: "Dedy Priyatna",
  initials: "DP",
  email: "dedypry@gmail.com",
  phone: "+62 812-8614-1441",
  location: "Green Ville Citra Maja City, Indonesia",
  linkedin: "https://id.linkedin.com/in/dedy-priyatna-2b1801202",
  github: "https://github.com/dedypry",
  available: true,
};

export type ExperienceType = "fulltime" | "freelance" | "projectBased";

export type ExperienceMeta = {
  id: string;
  type: ExperienceType;
  stack?: string[];
};

export const experienceIds = [
  "vigo",
  "sinarsakti",
  "sproutdigital",
  "anekajuragan",
  "jafra",
  "solusiekosistem",
  "rekayasa",
] as const;

export type ExperienceId = (typeof experienceIds)[number];

export const experiencesMeta: Record<ExperienceId, ExperienceMeta> = {
  vigo: {
    id: "vigo",
    type: "fulltime",
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "GCP"],
  },
  sinarsakti: {
    id: "sinarsakti",
    type: "freelance",
    stack: ["Flutter", "React", "TypeScript", "REST APIs"],
  },
  sproutdigital: {
    id: "sproutdigital",
    type: "freelance",
    stack: ["NestJS", "Node.js", "Microservices", "TypeScript"],
  },
  anekajuragan: {
    id: "anekajuragan",
    type: "fulltime",
    stack: ["Node.js", "PostgreSQL", "Firebase", "GCP", "Docker", "CI/CD"],
  },
  jafra: {
    id: "jafra",
    type: "fulltime",
    stack: ["Laravel", "Vue.js", "Flutter", "PostgreSQL", "Firebase", "Nginx"],
  },
  solusiekosistem: {
    id: "solusiekosistem",
    type: "fulltime",
    stack: [
      "Laravel",
      "Vue.js",
      "Node.js",
      "React",
      "Flutter",
      "MongoDB",
      "Socket.io",
    ],
  },
  rekayasa: {
    id: "rekayasa",
    type: "freelance",
    stack: ["Laravel", "Vue.js", "Node.js", "React", "React Native"],
  },
};

export type ProjectCategory = "Web" | "Mobile" | "Backend" | "Landing";
export type ProjectAccent = "violet" | "cyan" | "emerald" | "amber" | "rose";

export type ProjectMeta = {
  id: string;
  category: ProjectCategory;
  accent: ProjectAccent;
  stack: string[];
  link?: string;
};

export const projectIds = [
  "elefin",
  "juraganmaterial",
  "jom",
  "indomatjar",
  "pdekpor",
  "labamu",
  "pln",
  "generalledger",
  "anggaranweb",
  "befinance",
  "hijaiyah",
  "landingpages",
] as const;

export type ProjectId = (typeof projectIds)[number];

export const projectsMeta: Record<ProjectId, ProjectMeta> = {
  elefin: {
    id: "elefin",
    category: "Web",
    accent: "violet",
    stack: ["React", "Node.js", "TypeScript"],
  },
  juraganmaterial: {
    id: "juraganmaterial",
    category: "Web",
    accent: "amber",
    stack: ["Node.js", "PostgreSQL", "Firebase", "GCP"],
    link: "https://juraganmaterial.id/",
  },
  jom: {
    id: "jom",
    category: "Web",
    accent: "cyan",
    stack: ["Laravel", "Vue.js", "Flutter", "PostgreSQL"],
  },
  indomatjar: {
    id: "indomatjar",
    category: "Web",
    accent: "rose",
    stack: ["Laravel", "Vue.js", "Node.js", "MongoDB"],
  },
  pdekpor: {
    id: "pdekpor",
    category: "Web",
    accent: "emerald",
    stack: ["Laravel", "Vue.js"],
  },
  labamu: {
    id: "labamu",
    category: "Mobile",
    accent: "cyan",
    stack: ["Flutter", "Mobile"],
  },
  pln: {
    id: "pln",
    category: "Web",
    accent: "violet",
    stack: ["Laravel", "Vue.js", "WebRTC"],
  },
  generalledger: {
    id: "generalledger",
    category: "Web",
    accent: "amber",
    stack: ["Laravel", "MySQL"],
  },
  anggaranweb: {
    id: "anggaranweb",
    category: "Web",
    accent: "emerald",
    stack: ["Laravel", "Vue.js"],
  },
  befinance: {
    id: "befinance",
    category: "Mobile",
    accent: "cyan",
    stack: ["Flutter"],
  },
  hijaiyah: {
    id: "hijaiyah",
    category: "Mobile",
    accent: "rose",
    stack: ["Flutter"],
  },
  landingpages: {
    id: "landingpages",
    category: "Landing",
    accent: "amber",
    stack: ["Bootstrap", "HTML/CSS"],
  },
};

export const projectCategories: ProjectCategory[] = [
  "Web",
  "Mobile",
  "Backend",
  "Landing",
];

export const skillGroupIds = [
  "languages",
  "frontend",
  "backend",
  "dataCloud",
  "practices",
] as const;
export type SkillGroupId = (typeof skillGroupIds)[number];

export const skillGroupItems: Record<SkillGroupId, string[]> = {
  languages: ["TypeScript", "JavaScript", "PHP", "Dart", "SQL"],
  frontend: ["React", "Vue.js", "Vite", "Tailwind CSS", "React Native", "Flutter"],
  backend: [
    "Node.js",
    "NestJS",
    "Laravel",
    "REST APIs",
    "Microservices",
    "Socket.io",
  ],
  dataCloud: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Firebase",
    "GCP",
    "Docker",
    "Nginx",
  ],
  // Practices are translatable so will be sourced from i18n
  practices: [],
};
