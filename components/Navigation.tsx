"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PortfolioVersion, ColorScheme } from "../types";
import { VERSION_CONFIG, SOCIALS, mono } from "../lib/config";
import { BrandLogo } from "./BrandLogo";
import { IcoFile, IcoMail, IcoSwap, IcoHome, IcoUser, IcoBriefcase, IcoGithub, IcoLinkedIn, IcoUpwork } from "./Icons";

interface TopNavProps {
  version: PortfolioVersion;
  setVersion: (v: PortfolioVersion) => void;
  C: ColorScheme;
}

export function TopNav({ version, setVersion, C }: TopNavProps) {
  const pathname = usePathname();
  const config = VERSION_CONFIG[version];
  
  const tabs = [
    { href: "/", label: "hello.tsx" },
    { href: "/about", label: "about.tsx" },
    { href: "/projects", label: "projects.tsx" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav style={{ display: "flex", alignItems: "stretch", height: "46px", minHeight: "46px", background: C.sidebar, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div className="cursor" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 20px", borderRight: `1px solid ${C.border}`, flexShrink: 0 }}>
        <BrandLogo size={26} version={version} />
        <span style={{ ...mono, fontSize: "13px", color: C.textBright, letterSpacing: "0.02em" }}>
          santosh<span style={{ color: C.accent }}>.</span>kumar
        </span>
      </div>
      <div style={{ display: "flex", flex: 1, overflowX: "auto" }}>
        {tabs.map(t => {
          const on = isActive(t.href);
          return (
            <Link key={t.href} href={t.href} className="thover"
              style={{ display: "flex", alignItems: "center", gap: "7px", height: "100%", padding: "0 18px", ...mono, fontSize: "13px", color: on ? C.textBright : C.textMid, background: on ? C.panel : "transparent", borderRight: `1px solid ${C.border}`, borderBottom: on ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s", textDecoration: "none" }}>
              <IcoFile size={13} color={on ? C.accent : C.textDim} />
              {t.label}
              {on && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.orange, marginLeft: "4px" }} />}
            </Link>
          );
        })}
      </div>
      <button onClick={() => setVersion(version === "genai" ? "fullstack" : "genai")} className="thover"
        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", flexShrink: 0, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, ...mono, fontSize: "11px", cursor: "pointer", background: "transparent", color: C.textMid, border: "none", transition: "all 0.15s", letterSpacing: "0.02em" }}>
        <IcoSwap size={14} color={C.textMid} />
        <span className="hidden lg:inline">{version === "genai" ? "Full-Stack" : "Gen AI"}</span>
      </button>
      <Link href="/contact" className={pathname === "/contact" ? "" : "thover"}
        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", flexShrink: 0, ...mono, fontSize: "12px", cursor: "pointer", background: pathname === "/contact" ? C.accent : "transparent", color: pathname === "/contact" ? C.bg : C.accent, border: "none", transition: "all 0.15s", letterSpacing: "0.02em", textDecoration: "none" }}>
        <IcoMail size={14} color={pathname === "/contact" ? C.bg : C.accent} />
        {config.ctaText}
      </Link>
    </nav>
  );
}

interface MobileTabBarProps {
  C: ColorScheme;
}

export function MobileTabBar({ C }: MobileTabBarProps) {
  const pathname = usePathname();
  
  const tabs = [
    { href: "/", label: "Home", Icon: IcoHome },
    { href: "/about", label: "About", Icon: IcoUser },
    { href: "/projects", label: "Work", Icon: IcoBriefcase },
    { href: "/contact", label: "Contact", Icon: IcoMail },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div style={{ display: "flex", background: C.sidebar, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
      {tabs.map(t => {
        const on = isActive(t.href);
        return (
          <Link key={t.href} href={t.href}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", padding: "8px 0", background: "transparent", cursor: "pointer", borderTop: on ? `2px solid ${C.accent}` : "2px solid transparent", transition: "all 0.15s", textDecoration: "none" }}>
            <t.Icon size={18} color={on ? C.accent : C.textDim} />
            <span style={{ ...mono, fontSize: "9px", color: on ? C.accent : C.textDim, letterSpacing: "0.04em" }}>{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

interface BottomBarProps {
  version: PortfolioVersion;
  C: ColorScheme;
}

export function BottomBar({ version, C }: BottomBarProps) {
  const [time, setTime] = React.useState("");
  const config = VERSION_CONFIG[version];

  React.useEffect(() => {
    function tick() { setTime(new Date().toLocaleTimeString("en-GB", { hour12: false })); }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const iconMap = { github: IcoGithub, linkedin: IcoLinkedIn, upwork: IcoUpwork };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "24px", minHeight: "24px", padding: "0 14px", background: C.accent, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ ...mono, fontSize: "11px", color: C.bg, fontWeight: 600, letterSpacing: "0.04em" }}>◆ {version}</span>
        <span style={{ ...mono, fontSize: "10px", color: C.bg + "aa" }}>{config.bottomBar}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {SOCIALS.map(s => {
          const Icon = iconMap[s.key as keyof typeof iconMap];
          return (
            <a key={s.key} href={s.href} target="_blank" rel="noreferrer" style={{ display: "flex", cursor: "pointer" }}>
              <Icon size={13} color={C.bg} />
            </a>
          );
        })}
        <span style={{ ...mono, fontSize: "10px", color: C.bg + "99" }}>{time}</span>
      </div>
    </div>
  );
}
