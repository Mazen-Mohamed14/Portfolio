export const CV_URL = "/Mazen-Mohamed-CV.pdf";
export const EMAIL = "mazen.mohamed.saeed14@gmail.com";
export const LINKEDIN = "https://linkedin.com/in/mazenmohamed1";
export const GITHUB = "https://github.com/Mazen-Mohamed14";

/** A short clip of the site in motion, in public/previews, shown in the hover window. */
export type Preview = { id: string; label: string };

export type Project = { name: string; url: string; what: string; stack: string; result?: string; preview: Preview };

export const PROJECTS: Project[] = [
  {
    name: "TrueForm",
    url: "https://trueform.cultivbureau.com/",
    what: "Multi-tenant SaaS form & exam builder. Led the frontend: drag-and-drop builder, AI-graded voice answers, Stripe billing.",
    stack: "Next.js · NestJS · PostgreSQL",
    preview: { id: "trueform", label: "trueform.cultivbureau.com" },
  },
  {
    name: "DietHub",
    url: "https://diethubeg.com/",
    what: "Led the portal revamp and built its CMS, with SEO and performance work.",
    stack: "React · Tailwind CSS",
    result: "+320% organic traffic",
    preview: { id: "diethub", label: "diethubeg.com" },
  },
  {
    name: "Bureau",
    url: "https://bureau.cultiv.llc/",
    what: "Responsive corporate website with custom animations.",
    stack: "React · Tailwind CSS",
    preview: { id: "bureau", label: "bureau.cultiv.llc" },
  },
  {
    name: "Riverty",
    url: "https://www.riverty.com/en/",
    what: "Buy-now-pay-later checkout extension. Delivered its PrestaShop integration and new checkout features.",
    stack: "Magento · PrestaShop · at Scandiweb",
    preview: { id: "riverty", label: "riverty.com" },
  },
];

export type Concept = { name: string; what: string; stack: string; preview: Preview };

/** Hero concepts for fictional brands, built to practise motion and polish. */
export const LAB: Concept[] = [
  {
    name: "Vela",
    what: "Two videos take turns behind glass slats that refract and dissolve.",
    stack: "Next.js · Canvas 2D",
    preview: { id: "vela", label: "vela · concept" },
  },
  {
    name: "Cerelo",
    what: "A golden-hour video hero with a masked headline reveal.",
    stack: "Next.js · CSS motion",
    preview: { id: "cerelo", label: "cerelo · concept" },
  },
  {
    name: "Somna",
    what: "A bedside hub drawn in SVG lands under a pure-CSS sky.",
    stack: "Next.js · SVG · CSS",
    preview: { id: "somna", label: "somna · concept" },
  },
];

export const STACK = ["TypeScript", "Next.js", "React", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Stripe", "OpenAI", "Playwright", "Docker"];

export const JOBS = [
  { company: "Cultiv LLC", detail: "Full Stack Developer · 2024 – now · Cairo" },
  { company: "Scandiweb", detail: "Full Stack Developer · 2022 – 2024 · Remote, Latvia" },
];

export const SECTION_IDS = ["top", "work", "lab", "stack", "experience", "contact"] as const;
