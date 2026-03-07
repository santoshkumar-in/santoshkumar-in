// lib/metadata.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single metadata covering both portfolio versions.
// Strategy:
//   - Root layout gets the merged metadata (both audiences, all keywords)
//   - Each version route overrides only title + description + canonical
//   - JSON-LD is merged into one Person object with the full skill set
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";

export const BASE_URL = "https://www.santoshkumar.in";

const AUTHOR = "Santosh Kumar";

// ─── Merged description ───────────────────────────────────────────────────────
// Covers both hiring intents in one coherent sentence set.
// Google truncates at ~155 chars for SERPs — the first sentence is the hook.
const MERGED_DESCRIPTION =
  "Full-Stack Engineer & Generative AI Engineer. " +
  "Expert in Node.js, React, Vue.js, Laravel, AWS, and LLM integration. " +
  "Hands-on with Claude API, OpenAI GPT-4, RAG systems, and LangChain. " +
  "25+ projects shipped. Open to senior engineering, AI roles, and freelance contracts.";

// ─── Merged keyword pool ──────────────────────────────────────────────────────
// Union of both audiences: recruiters, freelance clients, AI hiring teams.
const MERGED_KEYWORDS = [
  // Identity
  "Santosh Kumar",
  "santoshkumar.in",

  // Full-Stack
  "Senior Full-Stack Engineer",
  "Node.js Developer",
  "React Developer",
  "Vue.js Developer",
  "Laravel Developer",
  "MERN Stack Developer",
  "MEVN Stack Developer",
  "AWS Engineer",
  "TypeScript Developer",
  "Backend Engineer",
  "Full-Stack Developer India",
  "Remote Software Engineer",
  "Tech Lead",
  "MongoDB Developer",
  "Docker",
  "WebSockets",
  "REST API Developer",

  // Freelance
  "Freelance Full-Stack Developer",
  "Contract Developer",
  "Hire Node.js Developer",
  "Hire React Developer",
  "Upwork Developer",

  // Gen AI
  "Generative AI Engineer",
  "LLM Engineer",
  "AI Engineer",
  "Claude API Developer",
  "OpenAI GPT-4 Developer",
  "Anthropic SDK",
  "RAG Developer",
  "Retrieval Augmented Generation",
  "LangChain Developer",
  "Vector Database",
  "Pinecone Developer",
  "Prompt Engineer",
  "AI Backend Engineer",
  "Python AI Developer",
  "Agentic AI Workflows",
  "Gen AI Certification",
  "Full-Stack AI Engineer",
];

// ─── OG image — use a single image that works for both versions ───────────────
// Design tip: dark card with "Full-Stack · Gen AI" subtitle covers both.
const OG_IMAGE = `${BASE_URL}/cover.png`;

// ─── Root / shared metadata ───────────────────────────────────────────────────
// Used by app/layout.tsx — applies to every route unless overridden.
export const rootMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // Title template: child pages get "Page Name | Santosh Kumar" automatically
  title: {
    default:  "Santosh Kumar | Full-Stack & Gen AI Engineer",
    template: "%s | Santosh Kumar",
  },

  description:  MERGED_DESCRIPTION,
  keywords:     MERGED_KEYWORDS,
  authors:      [{ name: AUTHOR, url: BASE_URL }],
  creator:      AUTHOR,
  publisher:    AUTHOR,
  category:     "technology",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type:        "website",
    url:         BASE_URL,
    title:       "Santosh Kumar | Full-Stack & Gen AI Engineer",
    description: MERGED_DESCRIPTION,
    siteName:    "Santosh Kumar",
    locale:      "en_US",
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    "Santosh Kumar — Full-Stack & Gen AI Engineer",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Santosh Kumar | Full-Stack & Gen AI Engineer",
    description: MERGED_DESCRIPTION,
    creator:     "@santoshkumar_in",
    images:      [OG_IMAGE],
  },

  robots: {
    index:     true,
    follow:    true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  icons: {
    icon:     "/favicon.ico",
    apple:    "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },

  verification: {
    google: "REPLACE_WITH_SEARCH_CONSOLE_TOKEN",
  },
};

// ─── Per-version overrides ────────────────────────────────────────────────────
// Use these in the route segment layout, e.g. app/ai/layout.tsx.
// Next.js deep-merges these on top of rootMetadata automatically.
export const versionMetadata = {

  fullstack: {
    title:       "Santosh Kumar | Senior Full-Stack Engineer",
    description:
      "Senior Full-Stack Engineer specialising in Node.js, React, Vue.js, Laravel, and AWS. " +
      "Production REST APIs, real-time WebSocket systems, and cloud-native microservices. " +
      "50+ projects shipped. Open to senior roles, tech lead positions, and freelance contracts.",
    alternates: { canonical: BASE_URL },
    openGraph:  { url: BASE_URL },
  } satisfies Partial<Metadata>,

  genai: {
    title:       "Santosh Kumar | Generative AI Engineer",
    description:
      "Generative AI Engineer with hands-on experience in Claude API, OpenAI GPT-4, RAG systems, " +
      "LangChain, and agentic workflows. Full-stack foundation in Node.js and AWS. " +
      "Pursuing Gen AI certification. Open to AI engineering roles and LLM product teams.",
    alternates: { canonical: `${BASE_URL}` },
    openGraph:  { url: `${BASE_URL}` },
  } satisfies Partial<Metadata>,

};

// ─── Merged JSON-LD structured data ──────────────────────────────────────────
// Single Person object — lists both job titles and the full combined skill set.
// Inject once in app/layout.tsx.
export function getPersonJsonLd() {
  return {
    "@context":  "https://schema.org",
    "@type":     "Person",
    name:        AUTHOR,
    url:         BASE_URL,
    image:       OG_IMAGE,
    description: MERGED_DESCRIPTION,

    // Both titles — Google picks the most relevant for the query
    jobTitle: [
      "Senior Full-Stack Engineer",
      "Generative AI Engineer",
    ],

    // Full union of skills from both About.tsx skill groups
    knowsAbout: [
      // Gen AI
      "Claude API", "Anthropic SDK", "OpenAI GPT-4",
      "LangChain", "RAG Systems", "Vector Databases",
      "Pinecone", "Chroma", "Prompt Engineering",
      "LLM Fine-tuning", "Agentic Workflows",
      "Embeddings", "Semantic Search",

      // Full-Stack
      "Node.js", "Express", "PHP", "Laravel", "Lumen",
      "React", "Vue.js", "TypeScript", "JavaScript ES6+",
      "MongoDB", "MySQL", "MSSQL", "Firebase",
      "AWS EC2", "AWS S3", "AWS ECS", "AWS Lambda", "AWS RDS",
      "Docker", "WebSockets", "Socket.io", "REST APIs", "OAuth2",
      "Python", "Git", "WordPress", "WooCommerce",
    ],

    sameAs: [
      "https://github.com/santoshkumar-in",
      "https://www.linkedin.com/in/santoshkumar-in/",
      "https://www.upwork.com/freelancers/~012dfc919f360b2068",
      "https://stackoverflow.com/users/8621306/santosh-kumar",
    ],
  };
}