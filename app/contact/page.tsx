"use client";
import { useEffect } from 'react'
import { ContactPage } from "../../components/ContactPage";
import { useVersion } from "../../lib/VersionContext";
import { getColors, VERSION_CONFIG } from "../../lib/config";
import { generateFaviconHref } from "../../components/BrandLogo";

export default function Contact() {
  const { version } = useVersion();
  const C = getColors(version);
  useEffect(() => {
    const accent = VERSION_CONFIG[version].accent;
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) link.href = generateFaviconHref(accent);
  }, [version]);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }, []);
  return <ContactPage version={version} C={C} />;
}
