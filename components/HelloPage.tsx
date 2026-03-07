import React, { useRef, useEffect } from "react";
import { PortfolioVersion, ColorScheme } from "@/types";
import { mono, sans, VERSION_CONFIG } from "@/lib/config";
import { useWidth } from "@/lib/hooks";
import { Dot, IcoBrain, IcoMail, IcoGithub, IcoLinkedIn, IcoUpwork } from "./Icons";
import { AINetworkPanel, TerminalPanel } from "./AnimationPanels";

interface HelloPageProps {
  onContactClick: () => void;
  version: PortfolioVersion;
  C: ColorScheme;
}

const SOCIALS = [
  { key: "github", label: "santoshkumar-in", href: "https://github.com/santoshkumar-in", Icon: IcoGithub, shortLabel: "GitHub" },
  { key: "linkedin", label: "santoshkumar-in", href: "https://www.linkedin.com/in/santoshkumar-in/", Icon: IcoLinkedIn, shortLabel: "LinkedIn" },
  { key: "upwork", label: "santoshkumar", href: "https://www.upwork.com/freelancers/~012dfc919f360b2068", Icon: IcoUpwork, shortLabel: "Upwork" },
];

export function HelloPage({ onContactClick, version, C }: HelloPageProps) {
  const w = useWidth();
  const isMobile = w !== null && w < 768;
  const isNarrow = w !== null && w < 1100;
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const config = VERSION_CONFIG[version];

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!containerRef.current || !glowRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      glowRef.current.style.left = e.clientX - rect.left - 200 + "px";
      glowRef.current.style.top = e.clientY - rect.top - 200 + "px";
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const stats = version === "genai"
    ? [
        { label: "AI Projects", value: "0" },
        { label: "LLM APIs Used", value: "0" },
        { label: "Vector DBs", value: "0" },
        { label: "RAG Systems", value: "0" },
      ]
    : [
        { label: "Projects Shipped", value: "25+" },
        { label: "AWS Services Used", value: "10+" },
        { label: "Tech in Stack", value: "20+" },
        { label: "Freelance Clients", value: "10+" },
      ];

  return (
    <div ref={containerRef} style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
      <div ref={glowRef} style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${C.accentDim} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.5 }} />

      <div style={{ position: "relative", zIndex: 1, flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "24px 24px 48px" : "0 48px 0 72px" }}>
        <div className="fade-1" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Dot color={C.green} />
            <span style={{ ...mono, fontSize: "12px", color: C.textMid, letterSpacing: "0.03em" }}>
              {version === "genai" ? "Available for AI projects & roles" : "Available for projects & roles"}
            </span>
          </div>
          <span style={{ ...mono, fontSize: "10px", padding: "2px 9px", borderRadius: "99px", background: C.accent + "15", color: C.accent, border: `1px solid ${C.accent}35` }}>
            {version === "genai" ? "Gen AI Engineer" : "Freelancer"}
          </span>
          <span style={{ ...mono, fontSize: "10px", padding: "2px 9px", borderRadius: "99px", background: C.green + "15", color: C.green, border: `1px solid ${C.green}35` }}>
            {version === "genai" ? "Freelancer" : "Open to hire"}
          </span>
        </div>

        <h1 className="fade-2" style={{ ...sans, fontWeight: 300, letterSpacing: "-0.03em", fontSize: isMobile ? "2.6rem" : "clamp(2.4rem,5vw,4.5rem)", lineHeight: 1.05, color: C.textBright, marginBottom: "6px" }}>
          Santosh Kumar
        </h1>

        <p className="fade-3" style={{ ...mono, fontSize: isMobile ? "14px" : "clamp(13px,1.4vw,16px)", color: C.accent, marginBottom: version === "genai" ? "8px" : "24px", display: "flex", alignItems: "center", gap: "8px" }}>
          {version === "genai" ? <IcoBrain size={18} color={C.accent} /> : null}
          {config.tagline}
        </p>

        <p className="fade-3" style={{ ...sans, fontSize: "15px", color: C.textMid, maxWidth: "500px", lineHeight: "1.75", marginBottom: "36px", fontWeight: 300 }}>
          {version === "genai"
            ? "Building production AI systems with Claude, GPT-4, and custom LLM architectures. Specializing in RAG pipelines, vector databases, agentic workflows, and AI-powered applications. Open for freelance contracts and senior AI engineering roles."
            : "I architect and ship production-grade systems — real-time Node.js APIs, MERN/MEVN SPAs, Laravel back-ends, containerised microservices on AWS. Available for freelance contracts, consulting, and senior full-time roles."}
        </p>

        <div className="fade-4" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          <button onClick={onContactClick} className="cursor"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 22px", background: C.accent, color: C.bg, border: "none", borderRadius: "6px", cursor: "pointer", ...mono, fontSize: "13px", fontWeight: 500, transition: "background 0.15s" }}>
            <IcoMail size={14} color={C.bg} /> {version === "genai" ? "Hire me" : "Get in touch"}
          </button>
          {SOCIALS.map(s => (
            <a key={s.key} href={s.href} target="_blank" rel="noreferrer" className="thover"
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 16px", background: "transparent", border: `1px solid ${C.borderMd}`, borderRadius: "6px", ...mono, fontSize: "13px", color: C.textMid, cursor: "pointer", transition: "all 0.15s" }}>
              <s.Icon size={14} color="currentColor" />
              <span style={{ display: isMobile ? "none" : "inline" }}>{s.shortLabel}</span>
            </a>
          ))}
        </div>

        <div className="fade-5" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.border, maxWidth: "480px", borderRadius: "8px", overflow: "hidden" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: C.surface, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ ...mono, fontSize: isMobile ? "18px" : "20px", color: version === "genai" ? C.accent : C.textBright, fontWeight: 500, marginBottom: "2px" }}>{s.value}</div>
              <div style={{ ...sans, fontSize: "10px", color: C.textDim, lineHeight: 1.4, fontWeight: 300 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && !isNarrow && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", flex: "1 1 0", minWidth: 0, padding: "24px 40px" }}>
          {version === "genai" ? <AINetworkPanel C={C} /> : <TerminalPanel C={C} />}
        </div>
      )}
    </div>
  );
}
