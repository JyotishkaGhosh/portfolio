"use client";
import { useEffect, useState } from "react";

// true once the image at `src` has actually loaded — so missing files never show a broken icon
export function useImage(src?: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setOk(true);
    img.src = src;
  }, [src]);
  return ok;
}
