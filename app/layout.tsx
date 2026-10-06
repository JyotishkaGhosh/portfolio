import type { Metadata } from "next";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource/pinyon-script/400.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jyotishka Ghosh — soft heart, sharp mind",
  description:
    "Portfolio of Jyotishka Ghosh: GTM operator and engineer building data pipelines, ML models and AI products like Kairo and SignalStack.",
  openGraph: {
    title: "Jyotishka Ghosh",
    description: "I close deals and I ship code.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
