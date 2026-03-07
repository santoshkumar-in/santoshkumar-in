"use client";
import { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { HelloPage } from "@/components/HelloPage";
import { useVersion } from "@/lib/VersionContext";
import { getColors, VERSION_CONFIG } from "@/lib/config";
import { generateFaviconHref } from "@/components/BrandLogo";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const { version } = useVersion();
  const C = getColors(version);
  const router = useRouter();

  useEffect(() => {
    const accent = VERSION_CONFIG[version].accent;
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) link.href = generateFaviconHref(accent);
  }, [version]);

  useEffect(() => {
    trackEvent("page_view", { page_path: window.location.pathname, version });
  }, []);
  return <HelloPage onContactClick={() => router.push("/contact")} version={version} C={C} />;
}
