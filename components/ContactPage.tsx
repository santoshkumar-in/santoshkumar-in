import { useState, useEffect } from "react";
import { PortfolioVersion, ColorScheme } from "@/types";
import { mono, sans } from "@/lib/config";
import { useWidth } from "@/lib/hooks";
import { validateContactForm, ValidationError } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import { IcoMail, IcoBrain, Dot, IcoGithub, IcoLinkedIn, IcoUpwork } from "./Icons";

interface ContactPageProps {
  version: PortfolioVersion;
  C: ColorScheme;
}

const SOCIALS = [
  { key: "github", label: "santoshkumar-in", href: "https://github.com/santoshkumar-in", Icon: IcoGithub },
  { key: "linkedin", label: "santoshkumar-in", href: "https://www.linkedin.com/in/santoshkumar-in/", Icon: IcoLinkedIn },
  { key: "upwork", label: "santoshkumar", href: "https://www.upwork.com/freelancers/~012dfc919f360b2068", Icon: IcoUpwork },
];

export function ContactPage({ version, C }: ContactPageProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const w = useWidth();
  const isMobile = w !== null && w < 768;
  const isTablet = w !== null && w < 1080;

  // Load reCAPTCHA script
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured");
      return;
    }

    if (typeof window !== "undefined" && !window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.head.appendChild(script);
    } else if (window.grecaptcha) {
      setRecaptchaLoaded(true);
    }

    // Cleanup on unmount — fires when user leaves /contact
    return () => {
      const script = document.getElementById("recaptcha-script");
      if (script) script.remove();
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) badge.parentElement?.remove();
      delete (window as any).grecaptcha;
    };
  }, []);

  const valid = {
    name: form.name.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    message: form.message.trim().length >= 10,
  };
  const allValid = valid.name && valid.email && valid.message;

  async function handleSubmit() {
    setTouched({ name: true, email: true, message: true });
    setFieldErrors({});
    setErrorMessage("");

    if (!allValid || status === "sending") return;

    // Client-side validation
    const validation = validateContactForm(form);
    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((err: ValidationError) => {
        errors[err.field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setStatus("sending");

    try {
      // Get reCAPTCHA token
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error("reCAPTCHA is not configured");
      }

      let recaptchaToken = "";
      if (window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: "contact" });
      }

      // Send to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          from: version,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Field-level errors
          const errors: Record<string, string> = {};
          data.errors.forEach((err: ValidationError) => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
          setStatus("idle");
        } else {
          // General error
          throw new Error(data.error || "Failed to send message");
        }
        return;
      }

      //Track event      
      trackEvent("contact_form_submit",  {
        form_name: 'contact',
        form_location: '/contact',
        version, // 'genai' or 'fullstack'
      });

      setStatus("sent");
      setTimeout(() => {
        setForm({ name: "", email: "", message: "" });
        setTouched({});
        setStatus("idle");
      }, 5000);
    } catch (error: any) {
      console.error("Contact form error:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  function fieldStyle(f: string) {
    let border = `1px solid ${C.border}`;
    if (focused === f) border = `1px solid ${C.accent}`;
    else if (fieldErrors[f]) border = `1px solid ${C.red}`;
    else if (touched[f] && !valid[f as keyof typeof valid]) border = `1px solid ${C.red}`;
    else if (touched[f] && valid[f as keyof typeof valid]) border = `1px solid ${C.green}`;
    return {
      width: "100%",
      background: C.surface,
      color: C.textBright,
      ...mono,
      fontSize: "13px",
      padding: "10px 14px",
      borderRadius: "5px",
      border,
      boxShadow: focused === f ? `0 0 0 3px ${C.accentDim}` : "none",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
      resize: "vertical" as const,
    };
  }

  function HDivider() {
    return <div style={{ height: "1px", background: C.border, flexShrink: 0 }} />;
  }

  const infoPanel = (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {version === "genai" ? <IcoBrain size={18} color={C.bg} /> : <span style={{ ...mono, fontSize: "13px", fontWeight: 700, color: C.bg }}>SK</span>}
          </div>
          <div>
            <div style={{ ...sans, fontSize: "14px", fontWeight: 500, color: C.textBright }}>Santosh Kumar</div>
            <div style={{ ...mono, fontSize: "11px", color: C.accent }}>
              {version === "genai" ? "Gen AI Engineer · Freelancer" : "Full-Stack Engineer · Freelancer"}
            </div>
          </div>
        </div>
        <HDivider />
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "7px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Dot color={version === "genai" ? C.accent : C.green} />
            <span style={{ ...mono, fontSize: "11px", color: C.textMid }}>
              {version === "genai" ? "Open to AI projects & senior roles" : "Open to freelance & senior roles"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px" }}>⏱</span>
            <span style={{ ...mono, fontSize: "11px", color: C.textMid }}>Responds within 24–48 hrs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px" }}>🌍</span>
            <span style={{ ...mono, fontSize: "11px", color: C.textMid }}>Remote & hybrid welcome</span>
          </div>
        </div>
      </div>

      <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "14px" }}>
        <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Find me on</div>
        {SOCIALS.map(s => (
          <a key={s.key} href={s.href} target="_blank" rel="noreferrer" className="lhover"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 4px", borderRadius: "4px", ...mono, fontSize: "12px", color: C.textMid }}>
            <s.Icon size={14} color={C.textMid} />
            {s.key}/{s.label}
          </a>
        ))}
      </div>

      <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "14px" }}>
        <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {version === "genai" ? "AI Stack" : "Core Stack"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {(version === "genai"
            ? ["Claude API", "OpenAI", "LangChain", "RAG", "Python", "Vector DB"]
            : ["Node.js", "PHP", "React", "Vue.js", "TypeScript", "AWS", "Docker", "MongoDB", "Laravel"]
          ).map(s => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", ...mono, color: C.accent, background: C.accent + "15", border: `1px solid ${C.accent}35`, whiteSpace: "nowrap" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const formEl = (
    <div style={{ padding: isMobile ? "20px" : "32px 40px", maxWidth: "580px" }}>
      <h2 style={{ ...sans, fontSize: "22px", fontWeight: 400, color: C.textBright, marginBottom: "4px" }}>
        {version === "genai" ? "Let's build AI together" : "Get in touch"}
      </h2>
      <p style={{ ...mono, fontSize: "12px", color: C.synComment, marginBottom: "28px" }}>
        {version === "genai"
          ? "// Freelance AI projects · Gen AI consulting · Senior roles"
          : "// Freelance contracts, consulting, or senior engineering roles."}
      </p>

      {status === "sent" ? (
        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}40`, borderRadius: "8px", padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✓</div>
          <div style={{ ...sans, fontSize: "16px", fontWeight: 500, color: C.textBright, marginBottom: "4px" }}>Message sent!</div>
          <div style={{ ...mono, fontSize: "12px", color: C.textMid }}>I'll respond within 24–48 hours.</div>
        </div>
      ) : status === "error" ? (
        <div style={{ background: C.red + "15", border: `1px solid ${C.red}40`, borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ ...sans, fontSize: "14px", color: C.red, marginBottom: "8px", fontWeight: 500 }}>Error</div>
          <div style={{ ...mono, fontSize: "12px", color: C.text }}>{errorMessage}</div>
        </div>
      ) : null}

      {status !== "sent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {[
            { key: "name", type: "text", label: "Name", ph: "Your name" },
            { key: "email", type: "email", label: "Email", ph: "you@company.com" },
          ].map(f => (
            <div key={f.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ ...mono, fontSize: "12px", color: C.textMid }}>{f.label}</label>
                {(fieldErrors[f.key] || (touched[f.key] && !valid[f.key as keyof typeof valid])) && (
                  <span style={{ ...mono, fontSize: "10px", color: C.red }}>
                    {fieldErrors[f.key] || "Required"}
                  </span>
                )}
                {touched[f.key] && valid[f.key as keyof typeof valid] && !fieldErrors[f.key] && (
                  <span style={{ ...mono, fontSize: "10px", color: C.green }}>✓</span>
                )}
              </div>
              <input
                type={f.type}
                placeholder={f.ph}
                value={form[f.key as keyof typeof form]}
                onChange={e => {
                  const v = e.target.value;
                  setForm(p => ({ ...p, [f.key]: v }));
                  if (fieldErrors[f.key]) {
                    setFieldErrors(prev => ({ ...prev, [f.key]: "" }));
                  }
                }}
                onFocus={() => setFocused(f.key)}
                onBlur={() => {
                  setFocused(null);
                  setTouched(t => ({ ...t, [f.key]: true }));
                }}
                style={fieldStyle(f.key)}
                disabled={status === "sending"}
              />
            </div>
          ))}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ ...mono, fontSize: "12px", color: C.textMid }}>Message</label>
              {(fieldErrors.message || (touched.message && !valid.message)) && (
                <span style={{ ...mono, fontSize: "10px", color: C.red }}>
                  {fieldErrors.message || "Min 10 chars"}
                </span>
              )}
              {touched.message && valid.message && !fieldErrors.message && (
                <span style={{ ...mono, fontSize: "10px", color: C.green }}>✓</span>
              )}
            </div>
            <textarea
              rows={5}
              placeholder={version === "genai" ? "Tell me about your AI project..." : "Tell me about your project or role."}
              value={form.message}
              onChange={e => {
                const v = e.target.value;
                setForm(p => ({ ...p, message: v }));
                if (fieldErrors.message) {
                  setFieldErrors(prev => ({ ...prev, message: "" }));
                }
              }}
              onFocus={() => setFocused("message")}
              onBlur={() => {
                setFocused(null);
                setTouched(t => ({ ...t, message: true }));
              }}
              style={fieldStyle("message")}
              disabled={status === "sending"}
            />
          </div>

          {recaptchaLoaded && (
            <div style={{ ...mono, fontSize: "10px", color: C.textDim, marginTop: "-8px" }}>
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: C.accent }}>
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ color: C.accent }}>
                Terms of Service
              </a>{" "}
              apply.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === "sending" || !recaptchaLoaded}
            className={allValid && recaptchaLoaded ? "cursor" : ""}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px", borderRadius: "6px", cursor: allValid && recaptchaLoaded ? "pointer" : "default", background: allValid && recaptchaLoaded ? C.accent : C.elevated, color: allValid && recaptchaLoaded ? C.bg : C.textDim, border: `1px solid ${allValid && recaptchaLoaded ? C.accent : C.border}`, ...mono, fontSize: "13px", fontWeight: 500, opacity: status === "sending" ? 0.6 : 1, transition: "all 0.15s" }}>
            <IcoMail size={15} color={allValid && recaptchaLoaded ? C.bg : C.textDim} />
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", height: "38px", minHeight: "38px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
          <button className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: C.textBright, background: C.panel, borderRight: `1px solid ${C.border}`, borderBottom: `2px solid ${C.accent}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            <IcoMail size={13} color={C.accent} />
            <span>contact.tsx</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {formEl}
          <div style={{ borderTop: `1px solid ${C.border}` }}>{infoPanel}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", height: "38px", minHeight: "38px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 }}>
          <button className="thover" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", ...mono, fontSize: "12px", color: C.textBright, background: C.panel, borderRight: `1px solid ${C.border}`, borderBottom: `2px solid ${C.accent}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
            <IcoMail size={13} color={C.accent} />
            <span>contact.tsx</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{formEl}</div>
      </div>
      {!isTablet && (
        <>
          <div style={{ width: "1px", background: C.border, flexShrink: 0 }} />
          <div style={{ width: "300px", flexShrink: 0, background: C.panel, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "38px", minHeight: "38px", display: "flex", alignItems: "center", padding: "0 14px", background: C.sidebar, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ ...mono, fontSize: "11px", color: C.textDim }}>contact_info.json</span>
            </div>
            {infoPanel}
          </div>
        </>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}
