import type { Metadata, Viewport } from "next";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/700.css";
import "@fontsource/silkscreen/400.css";
import "@fontsource/vt323/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jyotishka Ghosh — GTM Engineer",
  description:
    "Jyotishka Ghosh is a GTM engineer who builds the pipelines, automations and ML models behind go-to-market — and has closed ₹35L in enterprise ACV herself. Explore her pink voxel desktop.",
  openGraph: {
    title: "Jyotishka Ghosh — GTM Engineer",
    description: "Pipelines, automations and ML models behind go-to-market — built by someone who has closed the deals too.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffe3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1d0618" },
  ],
};

// runs before first paint: saved choice wins, otherwise follow the visitor's system theme
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
