import React, { useState, useEffect } from "react";
import { PortfolioVersion, ColorScheme } from "@/types";
import { mono, sans } from "@/lib/config";
import { useWidth } from "@/lib/hooks";
import { IcoFile, IcoBrain, IcoClose, Dot } from "./Icons";

interface AboutPageProps {
  version: PortfolioVersion;
  C: ColorScheme;
}

export function AboutPage({ version, C }: AboutPageProps) {
  const [section, setSection] = useState("bio");
  const w = useWidth();
  const isMobile = w !== null && w < 768;
  const isTablet = w !== null && w < 1080;

  function kw(s: string) { return <span style={{ color: C.synKeyword }}>{s}</span>; }
  function fn(s: string) { return <span style={{ color: C.synFunc }}>{s}</span>; }
  function st(s: string) { return <span style={{ color: C.synStr }}>{s}</span>; }
  function ty(s: string) { return <span style={{ color: C.synType }}>{s}</span>; }
  function cm(s: string) { return <span style={{ color: C.synComment }}>{s}</span>; }
  function pr(s: string) { return <span style={{ color: C.synProp }}>{s}</span>; }
  function sp(n?: number) { return <span>{"\u00a0".repeat((n || 1) * 2)}</span>; }

  const bioLines = version === "genai" ? [
    cm("/**"),
    <span>{cm(" * @file")} genai_engineer.tsx</span>,
    <span>{cm(" * @role")} Generative AI Engineer · LLM Specialist</span>,
    <span>{cm(" * @focus")} Production AI systems · RAG · Vector Search</span>,
    cm(" */"),
    null,
    <span>{kw("interface")} {ty("AIEngineer")} {"{"}</span>,
    <span>{sp()}{pr("name")}{kw(":")} {ty("string")};</span>,
    <span>{sp()}{pr("specialization")}{kw(":")} {ty("string[]")};</span>,
    <span>{sp()}{pr("currentFocus")}{kw(":")} {ty("string")};</span>,
    "};",
    null,
    <span>{kw("const")} {fn("profile")}{kw(":")} {ty("AIEngineer")} = {"{"}</span>,
    <span>{sp()}{pr("name")}{kw(":")}{st('"Santosh Kumar"')},</span>,
    <span>{sp()}{pr("specialization")}{kw(":")} [</span>,
    <span>{sp(2)}{st('"Claude API · Anthropic SDK integration"')},</span>,
    <span>{sp(2)}{st('"OpenAI GPT-4 · Function calling"')},</span>,
    <span>{sp(2)}{st('"RAG systems · Vector databases (Pinecone · Chroma)"')},</span>,
    <span>{sp(2)}{st('"LangChain · Agentic workflows"')},</span>,
    <span>{sp(2)}{st('"Prompt engineering · Fine-tuning"')},</span>,
    <span>{sp(2)}{st('"Python · TypeScript · AI backend architecture"')},</span>,
    <span>{sp()}{"],"},</span>,
    <span>{sp()}{pr("currentFocus")}{kw(":")}{st('"Revising Gen AI certification"')},</span>,
    "};",
    null,
    cm("// Previously: 8+ years full-stack (Node.js · MERN · Laravel · AWS)"),
    cm("// Now: Transitioning to Gen AI engineering · Building LLM products"),
  ] : [
    cm("/**"),
    <span>{cm(" * @file")} about.tsx</span>,
    <span>{cm(" * @author")} Santosh Kumar</span>,
    <span>{cm(" * @role")} Senior Full-Stack Engineer · Freelancer</span>,
    <span>{cm(" * @available")} freelance contracts · full-time roles</span>,
    cm(" */"),
    null,
    <span>{kw("interface")} {ty("Profile")} {"{"}</span>,
    <span>{sp()}{pr("name")}{kw(":")} {ty("string")};</span>,
    <span>{sp()}{pr("type")}{kw(":")} {ty("string")};</span>,
    <span>{sp()}{pr("specialisms")}{kw(":")} {ty("string[]")};</span>,
    <span>{sp()}{pr("availability")}{kw(":")} {ty("string")};</span>,
    "};",
    null,
    <span>{kw("const")} {fn("santosh")}{kw(":")} {ty("Profile")} = {"{"}</span>,
    <span>{sp()}{pr("name")}{kw(":")}{st('"Santosh Kumar"')},</span>,
    <span>{sp()}{pr("type")}{kw(":")}{st('"Full-Stack Engineer · Freelancer"')},</span>,
    <span>{sp()}{pr("specialisms")}{kw(":")} [</span>,
    <span>{sp(2)}{st('"Node.js & MERN/MEVN full-stack architecture"')},</span>,
    <span>{sp(2)}{st('"Real-time systems — WebSockets, Socket.io"')},</span>,
    <span>{sp(2)}{st('"RESTful APIs, OAuth2, async/await patterns"')},</span>,
    <span>{sp(2)}{st('"AWS cloud: EC2 · S3 · ECS · Lambda · RDS"')},</span>,
    <span>{sp(2)}{st('"PHP / Laravel / Lumen / WordPress"')},</span>,
    <span>{sp(2)}{st('"Docker, containerisation, pen-test patching"')},</span>,
    <span>{sp()}{"],"},</span>,
    <span>{sp()}{pr("availability")}{kw(":")}{st('"freelance · consulting · senior roles"')},</span>,
    "};",
  ];

  function CodeView({ lines }: { lines: any[] }) {
    return (
      <div style={{ ...mono, fontSize: "13px", lineHeight: "1.75", paddingTop: "8px", paddingBottom: "24px", minWidth: "max-content" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
            <span style={{ width: "44px", textAlign: "right", paddingRight: "18px", paddingTop: "1px", paddingBottom: "1px", color: C.lineNum, fontSize: "12px", userSelect: "none", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ color: C.text, paddingRight: "24px" }}>{line}</span>
          </div>
        ))}
      </div>
    );
  }

  function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
    const c = color || C.accent;
    const [w, setW] = useState(0);
    useEffect(() => {
      const t = setTimeout(() => setW(level), 250);
      return () => clearTimeout(t);
    }, [level]);
    return (
      <div style={{ marginBottom: "11px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ ...mono, fontSize: "12px", color: C.text }}>{name}</span>
          <span style={{ ...mono, fontSize: "10px", color: C.textDim }}>{level}%</span>
        </div>
        <div style={{ height: "3px", background: C.border, borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${c}70, ${c})`, borderRadius: "2px", transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
      </div>
    );
  }

  const skillGroups = version === "genai" ? [
    { label: "LLM & APIs", color: C.accent, items: [{ name: "Claude API", level: 90 }, { name: "OpenAI GPT-4", level: 85 }, { name: "Anthropic SDK", level: 90 }] },
    { label: "AI Stack", color: C.purple, items: [{ name: "LangChain", level: 80 }, { name: "RAG Systems", level: 85 }, { name: "Vector DB", level: 75 }] },
    { label: "Backend", color: C.green, items: [{ name: "Python AI/ML", level: 80 }, { name: "Node.js APIs", level: 95 }, { name: "TypeScript", level: 90 }] },
  ] : [
    { label: "Backend", color: C.accent, items: [{ name: "Node.js / Express", level: 95 }, { name: "PHP / Laravel", level: 90 }, { name: "REST API Design", level: 95 }] },
    { label: "Frontend", color: C.purple, items: [{ name: "React / MERN", level: 90 }, { name: "Vue.js / MEVN", level: 85 }, { name: "TypeScript", level: 90 }] },
    { label: "Cloud & Ops", color: C.green, items: [{ name: "AWS (12+ services)", level: 85 }, { name: "Docker", level: 80 }, { name: "MySQL / MongoDB", level: 90 }] },
  ];

  function HDivider() { return <div style={{ height: "1px", background: C.border, flexShrink: 0 }} />; }

  const rightPanel = (
    <div style={{ height: "100%", overflowY: "auto", padding: "16px" }}>
      <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "14px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {version === "genai" ? <IcoBrain size={20} color={C.bg} /> : <span style={{ ...mono, fontSize: "14px", fontWeight: 700, color: C.bg }}>SK</span>}
          </div>
          <div>
            <div style={{ ...sans, fontSize: "14px", fontWeight: 500, color: C.textBright }}>Santosh Kumar</div>
            <div style={{ ...mono, fontSize: "11px", color: C.accent }}>{version === "genai" ? "Gen AI Engineer" : "Full-Stack Engineer"}</div>
          </div>
        </div>
        <HDivider />
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Dot color={version === "genai" ? C.accent : C.green} />
            <span style={{ ...mono, fontSize: "11px", color: C.textMid }}>
              {version === "genai" ? "AI projects & senior roles" : "Freelance & full-time open"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px" }}>{version === "genai" ? "⚡" : "📊"}</span>
            <span style={{ ...mono, fontSize: "11px", color: C.textMid }}>
              {version === "genai" ? "0 AI projects shipped" : "25+ projects shipped"}
            </span>
          </div>
        </div>
      </div>

      {skillGroups.map(g => (
        <div key={g.label} style={{ marginBottom: "16px" }}>
          <div style={{ ...mono, fontSize: "10px", color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>{g.label}</div>
          {g.items.map(s => <SkillBar key={s.name} name={s.name} level={s.level} color={g.color} />)}
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", height: "38px", minHeight: "38px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
          <button onClick={() => setSection("bio")} className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: section === "bio" ? C.textBright : C.textMid, background: section === "bio" ? C.panel : "transparent", borderRight: `1px solid ${C.border}`, borderBottom: section === "bio" ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            <IcoFile size={13} color={section === "bio" ? C.accent : C.textDim} />
            <span>bio.tsx</span>
          </button>
          <button onClick={() => setSection("skills")} className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: section === "skills" ? C.textBright : C.textMid, background: section === "skills" ? C.panel : "transparent", borderRight: `1px solid ${C.border}`, borderBottom: section === "skills" ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            {version === "genai" ? <IcoBrain size={13} color={section === "skills" ? C.accent : C.textDim} /> : <IcoFile size={13} color={section === "skills" ? C.accent : C.textDim} />}
            <span>skills</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {section === "skills" ? rightPanel : <CodeView lines={bioLines} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", height: "38px", minHeight: "38px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
          <button className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: C.textBright, background: C.panel, borderRight: `1px solid ${C.border}`, borderBottom: `2px solid ${C.accent}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            <IcoFile size={13} color={C.accent} />
            <span>{version === "genai" ? "genai_engineer.tsx" : "about.tsx"}</span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.orange, marginLeft: "4px" }} />
            <span style={{ marginLeft: "4px", opacity: 0.35 }}><IcoClose size={8} color={C.textDim} /></span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <CodeView lines={bioLines} />
        </div>
      </div>
      {!isTablet && (
        <>
          <div style={{ width: "1px", background: C.border, flexShrink: 0 }} />
          <div style={{ width: "300px", flexShrink: 0, background: C.panel, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "38px", minHeight: "38px", display: "flex", alignItems: "center", padding: "0 14px", background: C.sidebar, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ ...mono, fontSize: "11px", color: C.textDim }}>
                {version === "genai" ? "ai_skills.json" : "engineer_profile.json"}
              </span>
            </div>
            {rightPanel}
          </div>
        </>
      )}
    </div>
  );
}
