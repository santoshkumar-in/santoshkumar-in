"use client";
import React from "react";
import { VersionProvider, useVersion } from "@/lib/VersionContext";
import { getColors, GLOBAL_STYLES, VERSION_CONFIG } from "@/lib/config";
import { useWidth } from "@/lib/hooks";
import { TopNav, MobileTabBar, BottomBar, MobileBottomBar } from "@/components/Navigation";
import { CookieConsent } from '@/components/CookieConsent'
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getPersonJsonLd } from "@/lib/metadata";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { version, setVersion } = useVersion();
  const w = useWidth();
  const isMobile = w !== null && w < 768;
  const C = getColors(version);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: C.bg, color: C.text, overflow: "hidden", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {!isMobile && <TopNav version={version} setVersion={setVersion} C={C} />}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {children}
        </div>
        {isMobile && <MobileTabBar version={version} setVersion={setVersion} C={C} />}
        {!isMobile && <BottomBar version={version} C={C} />}
        {isMobile && <MobileBottomBar version={version} C={C} />}
      </div>
    </>
  );
}

function CookieConsentContent() {
  const { version } = useVersion();
  const accent = VERSION_CONFIG[version].accent;
  return <CookieConsent accent={accent} />
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
  const jsonLd = getPersonJsonLd();
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics measurementId={gtmId} />
        <link rel="icon" type="image/svg+xml" />
        <title>Santosh Kumar - Portfolio</title>
        <meta name="description" content="Gen AI Engineer & Full-Stack Developer" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <GoogleTagManagerNoScript gtmId={gtmId} />
        <GoogleTagManager gtmId={gtmId} />
        <VersionProvider>
          <LayoutContent>{children}</LayoutContent>
          <CookieConsentContent />
        </VersionProvider>
      </body>
    </html>
  );
}
