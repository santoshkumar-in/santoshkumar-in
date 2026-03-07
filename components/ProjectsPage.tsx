import React from "react";
import { PortfolioVersion, ColorScheme } from "@/types";
import { mono, sans } from "@/lib/config";
import { useWidth } from "@/lib/hooks";
import { IcoFile, IcoClose } from "./Icons";

interface ProjectsPageProps {
  version: PortfolioVersion;
  C: ColorScheme;
}

export function ProjectsPage({ version, C }: ProjectsPageProps) {
  const w = useWidth();
  const isMobile = w !== null && w < 768;

  const projectsData = version === "genai" ? [
    // {
    //   id: "ai-chatbot",
    //   num: "01",
    //   name: "AI Chatbot System",
    //   tag: "Claude API",
    //   url: '#',
    //   desc: "Production-ready AI assistant using Claude API with streaming responses, context management, and conversation memory.",
    //   stack: ["Claude API", "Anthropic SDK", "TypeScript", "Streaming"],
    //   color: C.accent,
    // },
    // {
    //   id: "rag-system",
    //   num: "02",
    //   url: '#',
    //   name: "RAG Pipeline",
    //   tag: "Vector DB",
    //   desc: "Document Q&A system with RAG architecture. Vector embeddings, semantic search, and intelligent retrieval using Pinecone.",
    //   stack: ["LangChain", "Pinecone", "Python", "RAG"],
    //   color: C.purple,
    // },
    // {
    //   id: "ai-automation",
    //   num: "03",
    //   url: '#',
    //   name: "Workflow Agent",
    //   tag: "Agentic AI",
    //   desc: "Intelligent workflow automation using LLM agents with tool calling, multi-step reasoning, and task orchestration.",
    //   stack: ["Claude", "Function Calling", "Node.js", "Agents"],
    //   color: C.green,
    // },
  ] : [
    {
      id: "git-shrink",
      num: "01",
      name: "git-shrink",
      tag: "Node.js · CLI",
      desc: "Semantic git history compressor. Scores every pair of commits across message similarity, file proximity, and directory overlap — then suggests squash groups you can approve, edit, or skip before writing a ready-to-apply rebase script.",
      stack: ["Node.js", "simple-git", "Commander", "Jest"],
      url: "https://github.com/santoshkumar-in/git-shrink",
      color: C.accent,
    },
    {
      id: "schema-drift",
      num: "02",
      name: "schema-drift",
      tag: "Node.js · CLI",
      desc: "Detects breaking schema changes between API versions. Diffs OpenAPI specs across fields, types, and required constraints — flags regressions before they reach production.",
      stack: ["Node.js", "Commander", "js-yaml", "Jest"],
      url: "https://github.com/santoshkumar-in/schema-drift",
      color: C.orange,
    },
    {
      id: "reqflow",
      num: "03",
      name: "reqflow",
      tag: "Node.js · CLI",
      desc: "Zero-instrumentation HTTP request tracer. Sits between your services as a transparent proxy, injects W3C trace headers, and stitches spans into a waterfall timeline — without touching your application code.",
      stack: ["Node.js", "http-proxy", "Commander", "Jest"],
      url: "https://github.com/santoshkumar-in/reqflow",
      color: C.green,
    },
  ];

  function Chip({ label, color }: { label: string; color: string }) {
    const c = color || C.accent;
    return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", ...mono, color: c, background: c + "15", border: `1px solid ${c}35`, whiteSpace: "nowrap" }}>{label}</span>;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.panel }}>
      <div style={{ display: "flex", alignItems: "center", height: "38px", minHeight: "38px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
        <button className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: C.textBright, background: C.panel, borderRight: `1px solid ${C.border}`, borderBottom: `2px solid ${C.accent}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
          <IcoFile size={13} color={C.accent} />
          <span>{version === "genai" ? "ai_projects.tsx" : "projects.tsx"}</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.orange, marginLeft: "4px" }} />
          <span style={{ marginLeft: "4px", opacity: 0.35 }}><IcoClose size={8} color={C.textDim} /></span>
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ ...sans, fontSize: "18px", fontWeight: 500, color: C.textBright, marginBottom: "4px" }}>
            {version === "genai" ? "AI Projects" : "Projects"}
          </h2>
          <p style={{ ...mono, fontSize: "12px", color: C.synComment }}>
            {version === "genai" ? "// LLM-powered applications & AI systems" : "// select a project to view details"}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "14px" }}>
          {projectsData.map(proj => (
            <div key={proj.id} className="chover" style={{ display: "flex", flexDirection: "column", background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${proj.color}`, borderRadius: "8px", overflow: "hidden", transition: "all 0.18s" }}>
             <a target="_blank" href={proj.url || '#'}>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div>
                    <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginBottom: "3px" }}>{proj.num} · {proj.tag}</div>
                    <div style={{ ...sans, fontSize: "15px", fontWeight: 500, color: C.textBright }}>{proj.name}</div>
                  </div>
                </div>
                <p style={{ ...sans, fontSize: "12px", color: C.textMid, lineHeight: "1.65", marginBottom: "12px", fontWeight: 300 }}>{proj.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {proj.stack.map(s => <Chip key={s} label={s} color={proj.color} />)}
                </div>
              </div>
             </a>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
