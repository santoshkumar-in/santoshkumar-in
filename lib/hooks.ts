import { useState, useEffect } from "react";

export function useWidth() {
  const [w, setW] = useState<number | null>(null);

  useEffect(() => {
    setW(window.innerWidth);
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return w;
}
