"use client";
import { useState, useEffect } from "react";
import { VERSION_CONFIG } from "../lib/config";


interface CookieConsentProps {
    accent: string;
}

export function CookieConsent({ accent = "#a78bfa" }: CookieConsentProps) {
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const [btnColor, setBtnColor] = useState('');

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            setShow(true);
            setTimeout(() => setVisible(true), 50);
        }
    }, []);

    function accept() {
        localStorage.setItem("cookie-consent", "accepted");
        setVisible(false);
        setTimeout(() => setShow(false), 300);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "cookie_consent_granted" });
    }

    function decline() {
        localStorage.setItem("cookie-consent", "declined");
        setVisible(false);
        setTimeout(() => setShow(false), 300);
    }

    if (!show) return null;

    return (
        <>
            <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
        .cookie-accept:hover { background: #8b6de0 !important; }
        .cookie-decline:hover {
          border-color: #2e3a50 !important;
          color: #cdd6e8 !important;
          background: #1a1f2b !important;
        }
      `}</style>

            <div
                style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    /* centering is baked into the keyframe so it never flashes off-center */
                    transform: visible ? "translate(-50%, 0)" : "translate(-50%, 16px)",
                    width: "min(520px, calc(100vw - 32px))",
                    zIndex: 9999,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    animation: "cookieSlideUp 0.35s ease both",
                    background: "#10131a",
                    border: "1px solid #252d3d",
                    borderRadius: "10px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px #1e2535",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                {/* Accent bar using the two brand colors */}
                <div style={{ height: "2px", background: "linear-gradient(90deg, #a78bfa, #4ec9b0)" }} />

                <div style={{ padding: "18px 20px 20px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "14px" }}>🍪</span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", fontWeight: 600, color: "#e8edf5", letterSpacing: "0.02em" }}>
                            cookie_consent<span style={{ color: "#a78bfa" }}>.</span>tsx
                        </span>
                        {/* "required" badge in teal */}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", padding: "1px 7px", borderRadius: "99px", background: "#4ec9b018", color: "#4ec9b0", border: "1px solid #4ec9b035", marginLeft: "auto", whiteSpace: "nowrap" }}>
                            required
                        </span>
                    </div>

                    {/* Body */}
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "13px", color: "#8a97b0", lineHeight: "1.65", fontWeight: 300, marginBottom: "16px" }}>
                        This site uses cookies and{" "}
                        <span style={{ color: "#cdd6e8" }}>Google Tag Manager</span> for
                        analytics. No personal data is sold or shared with third parties.
                    </p>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                            onClick={accept}
                            className="cookie-accept"
                            style={{
                                padding: "8px 20px",
                                background: accent,
                                color: "#0c0e12",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                                transition: "background 0.15s",
                            }}
                        >
                            Accept all
                        </button>

                        <button
                            onClick={decline}
                            className="cookie-decline"
                            style={{
                                padding: "8px 16px",
                                background: "transparent",
                                color: "#8a97b0",
                                border: "1px solid #1e2535",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "12px",
                                letterSpacing: "0.02em",
                                transition: "all 0.15s",
                            }}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}