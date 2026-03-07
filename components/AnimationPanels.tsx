import { useRef, useEffect, useState } from "react";
import { ColorScheme } from "@/types";
import { mono, sans } from "@/lib/config";
import { Dot } from "./Icons";

interface AINetworkPanelProps {
  C: ColorScheme;
}

export function AINetworkPanel({ C }: AINetworkPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("neural");

  useEffect(() => {
    if (activeTab !== "neural") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: any[] = [];
    const numNodes = 40;
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167, 139, 250, 0.8)";
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.5 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }, [activeTab]);

  const tabs = [{ id: "neural", label: "neural_net" }, { id: "models", label: "llm_stack" }, { id: "apis", label: "apis" }];

  return (
    <div className="fade-r" style={{ width: "100%", height: "100%", maxHeight: "600px", display: "flex", flexDirection: "column", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: C.elevated, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "7px" }}>
          {[C.red, C.orange, C.green].map((color, i) => (
            <span key={i} style={{ width: "11px", height: "11px", borderRadius: "50%", background: color, display: "block" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className="cursor" style={{ ...mono, fontSize: "10px", padding: "3px 10px", borderRadius: "4px", cursor: "pointer", color: activeTab === t.id ? C.textBright : C.textDim, background: activeTab === t.id ? C.border : "transparent", border: "none", transition: "all 0.12s" }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Dot color={C.accent} />
          <span style={{ ...mono, fontSize: "10px", color: C.textDim }}>active</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {activeTab === "neural" && (
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", background: C.panel }} />
        )}

        {activeTab === "models" && (
          <div style={{ padding: "14px", overflowY: "auto", height: "100%" }}>
            <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>LLM & AI Stack</div>
            {[
              { label: "claude-sonnet-4", status: "primary", color: C.accent },
              { label: "gpt-4-turbo", status: "active", color: C.green },
              { label: "anthropic-sdk", status: "integrated", color: C.accent },
              { label: "openai-api", status: "integrated", color: C.green },
              { label: "langchain", status: "active", color: C.purple },
              { label: "vector-db", status: "pinecone", color: C.orange },
            ].map((m, i) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: `1px solid ${C.border}`, animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: m.color, flexShrink: 0, animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ ...mono, fontSize: "11px", color: C.text, flex: 1 }}>{m.label}</span>
                <span style={{ ...mono, fontSize: "9px", color: m.color, background: m.color + "15", padding: "2px 7px", borderRadius: "3px" }}>{m.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "apis" && (
          <div style={{ padding: "14px", overflowY: "auto", height: "100%" }}>
            <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>API Endpoints · RAG Systems</div>
            {[
              { method: "POST", endpoint: "/api/chat/stream", desc: "Claude streaming chat" },
              { method: "POST", endpoint: "/api/embeddings", desc: "Vector embeddings" },
              { method: "GET", endpoint: "/api/search/semantic", desc: "RAG similarity search" },
              { method: "POST", endpoint: "/api/completions", desc: "GPT-4 completions" },
            ].map((api, i) => (
              <div key={api.endpoint} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}`, animation: `fadeIn 0.3s ease ${i * 0.08}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ ...mono, fontSize: "9px", color: api.method === "GET" ? C.green : C.accent, background: (api.method === "GET" ? C.green : C.accent) + "15", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>{api.method}</span>
                  <span style={{ ...mono, fontSize: "11px", color: C.synStr }}>{api.endpoint}</span>
                </div>
                <div style={{ ...sans, fontSize: "10px", color: C.textDim, paddingLeft: "46px" }}>{api.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


interface TerminalPanelProps {
  C: ColorScheme;
}

export function TerminalPanel({ C }: TerminalPanelProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"terminal" | "metrics" | "git">("terminal");
  const scrollRef = useRef<HTMLDivElement>(null);

  const dim    = C.textDim;
  const mid    = C.textMid;

  // ── Tab: terminal ──────────────────────────────────────────────────────────
  // Reads like a genuine senior dev session:
  //   1. Check runtime
  //   2. Inspect a live prod cluster
  //   3. Run a quick load test
  //   4. Peek at recent git work
  //   5. Cheeky whoami
  const TERMINAL_LINES: { delay: number; text: string; color: string }[] = [
    { delay: 0,    text: "$ node --version",                                     color: mid    },
    { delay: 350,  text: "v20.11.0",                                              color: C.green },

    { delay: 900,  text: "$ aws ecs describe-services --cluster prod-ap-south-1", color: mid    },
    { delay: 1350, text: "  api-gateway       ACTIVE   desired:3  running:3",     color: C.green },
    { delay: 1500, text: "  websocket-hub     ACTIVE   desired:4  running:4",     color: C.green },
    { delay: 1650, text: "  worker-queue      ACTIVE   desired:2  running:2",     color: C.green },
    { delay: 1800, text: "  scheduler-lambda  ACTIVE   invocations/min: 240",     color: C.green },

    { delay: 2400, text: "$ autocannon -c 500 -d 10 https://api.prod/health",     color: mid    },
    { delay: 2850, text: "  500 connections | 10s | pipeline: 1",                 color: dim    },
    { delay: 3050, text: "  Req/sec avg: 14,823   p99 latency: 38ms",             color: C.accent },
    { delay: 3200, text: "  Throughput: 47.2 MB/s   0 errors",                    color: C.green },

    { delay: 3800, text: "$ git log --oneline -4",                                color: mid    },
    { delay: 4200, text: "  e1a03c2  feat: OAuth2 PKCE + refresh token rotation", color: C.synStr },
    { delay: 4350, text: "  b8f71d9  perf: MongoDB pipeline 3.2x speedup",        color: C.synStr },
    { delay: 4500, text: "  a4c90e1  fix: race condition in distributed queue",   color: C.synStr },
    { delay: 4650, text: "  9d3f28b  chore: Lambda ARM64 — 40% cost cut",         color: C.synStr },

    { delay: 5200, text: "$ whoami",                                               color: mid    },
    { delay: 5600, text: "  santosh · full-stack · freelancer · ships things",    color: C.accent },
  ];

  // ── Tab: metrics ───────────────────────────────────────────────────────────
  // Snapshot of real-world project numbers
  const METRICS = [
    { label: "Projects shipped",       value: "50+",    color: C.accent  },
    { label: "Avg API p99 latency",    value: "38 ms",  color: C.green   },
    { label: "AWS services mastered",  value: "12",     color: C.purple  },
    { label: "Uptime SLA (prod)",      value: "99.97%", color: C.green   },
    { label: "Concurrent WS clients",  value: "10 000", color: C.accent  },
    { label: "Lambda cost reduction",  value: "-40%",   color: C.green   },
    { label: "DB query optimisation",  value: "3.2×",   color: C.orange  },
    { label: "Freelance clients",      value: "20+",    color: C.accent  },
  ];

  // ── Tab: git ───────────────────────────────────────────────────────────────
  const COMMITS = [
    { hash: "e1a03c2", branch: "feat/auth",  msg: "OAuth2 PKCE flow with refresh token rotation",        time: "2h ago",  color: C.accent  },
    { hash: "b8f71d9", branch: "main",       msg: "MongoDB aggregation pipeline — 3.2× speedup",         time: "1d ago",  color: C.green   },
    { hash: "a4c90e1", branch: "main",       msg: "Fix race condition in distributed queue handler",      time: "2d ago",  color: C.orange  },
    { hash: "9d3f28b", branch: "infra/aws",  msg: "Migrate Lambda to ARM64 — 40% cost reduction",        time: "4d ago",  color: C.purple  },
    { hash: "7c2b18f", branch: "main",       msg: "WebSocket hub: scale to 10k concurrent connections",  time: "6d ago",  color: C.accent  },
    { hash: "5a9e04d", branch: "feat/cache", msg: "Redis layer cuts DB read load by 70%",                time: "1w ago",  color: C.green   },
  ];

  useEffect(() => {
    if (activeTab !== "terminal") return;
    setVisibleLines([]);
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [activeTab]);

  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const sans = { fontFamily: "'IBM Plex Sans', sans-serif" };

  const tabs = [
    { id: "terminal", label: "terminal" },
    { id: "metrics",  label: "metrics"  },
    { id: "git",      label: "git log"  },
  ] as const;

  return (
    <div
      className="fade-r"
      style={{
        width: "100%", height: "100%", maxHeight: "600px",
        display: "flex", flexDirection: "column",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: "10px", overflow: "hidden",
        boxShadow: `0 24px 64px rgba(0,0,0,0.4), 0 0 80px ${C.accent}08`,
      }}
    >
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: C.elevated, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "7px" }}>
          {[C.red, C.orange, C.green].map((color, i) => (
            <span key={i} style={{ width: "11px", height: "11px", borderRadius: "50%", background: color, display: "block" }} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                ...mono, fontSize: "10px", padding: "3px 10px", borderRadius: "4px",
                cursor: "pointer", border: "none", transition: "all 0.12s",
                color:      activeTab === t.id ? C.textBright : dim,
                background: activeTab === t.id ? C.border      : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 5px ${C.green}80`, flexShrink: 0 }} />
          <span style={{ ...mono, fontSize: "10px", color: dim }}>online</span>
        </div>
      </div>

      {/* ── Terminal tab ────────────────────────────────────────────────────── */}
      {activeTab === "terminal" && (
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {TERMINAL_LINES.map((line, i) =>
              visibleLines.includes(i) ? (
                <div
                  key={i}
                  style={{ ...mono, fontSize: "11.5px", color: line.color, lineHeight: "1.85", animation: "fadeIn 0.25s ease both" }}
                >
                  {line.text}
                </div>
              ) : null
            )}
            {/* blinking cursor */}
            {visibleLines.length < TERMINAL_LINES.length && (
              <span style={{ ...mono, fontSize: "11.5px", color: mid }}>
                {"$ "}<span className="cursor" style={{ color: C.accent }}>▋</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Metrics tab ─────────────────────────────────────────────────────── */}
      {activeTab === "metrics" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <p style={{ ...mono, fontSize: "10px", color: dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            prod snapshot · live numbers
          </p>
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}`, animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}
            >
              <span style={{ ...sans, fontSize: "12px", color: mid, fontWeight: 300 }}>{m.label}</span>
              <span style={{ ...mono, fontSize: "13px", color: m.color, fontWeight: 500 }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Git log tab ─────────────────────────────────────────────────────── */}
      {activeTab === "git" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <p style={{ ...mono, fontSize: "10px", color: dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            recent commits · main
          </p>
          {COMMITS.map((c, i) => (
            <div
              key={c.hash}
              style={{ display: "flex", gap: "10px", padding: "9px 0", borderBottom: i < COMMITS.length - 1 ? `1px solid ${C.border}` : "none", animation: `fadeIn 0.3s ease ${i * 0.07}s both` }}
            >
              {/* Graph line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", paddingTop: "3px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", border: `2px solid ${c.color}`, background: C.surface, flexShrink: 0, display: "block" }} />
                {i < COMMITS.length - 1 && <div style={{ width: "1px", flex: 1, background: C.border, minHeight: "14px" }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: "10px", color: c.color, background: c.color + "15", padding: "1px 6px", borderRadius: "3px" }}>{c.hash}</span>
                  <span style={{ ...mono, fontSize: "9px",  color: dim, background: C.elevated, padding: "1px 5px", borderRadius: "3px" }}>{c.branch}</span>
                  <span style={{ ...mono, fontSize: "9px",  color: dim, marginLeft: "auto" }}>{c.time}</span>
                </div>
                <p style={{ ...sans, fontSize: "11.5px", color: C.text, lineHeight: "1.5", fontWeight: 300, margin: 0 }}>{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}