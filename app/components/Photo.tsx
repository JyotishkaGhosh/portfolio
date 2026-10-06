"use client";
import { useImage } from "./useImage";
import { me } from "../content";

// shows /public/me.jpg — falls back to a monogram until the photo is added
export default function Photo({ className = "", mono = "text-6xl" }: { className?: string; mono?: string }) {
  const ok = useImage(me.photo);
  if (ok)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={me.photo} alt={`${me.first} ${me.last}`} className={`object-cover ${className}`} />
    );
  return (
    <div className={`satin flex items-center justify-center ${className}`}>
      <span className={`rose-gold font-serif italic ${mono}`}>JG</span>
    </div>
  );
}
