import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource/pinyon-script/400.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jyotishka Ghosh — GTM Engineer",
  description:
    "Jyotishka Ghosh is a GTM engineer who builds the data pipelines, automations and ML models behind go-to-market — and has closed ₹35L in enterprise ACV herself.",
  openGraph: {
    title: "Jyotishka Ghosh — GTM Engineer",
    description: "Data pipelines, automations and ML models for go-to-market — built by someone who has closed the deals too.",
    type: "website",
  },
};

// runs before first paint: saved choice wins, otherwise follow the visitor's system theme
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
