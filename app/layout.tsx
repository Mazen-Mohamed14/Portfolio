import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// bundled (Latin subset) so the build never depends on fetching from Google Fonts
const anton = localFont({ src: "./fonts/Anton-Regular.woff2", weight: "400", variable: "--font-anton" });
const inter = localFont({ src: "./fonts/Inter-Latin.woff2", weight: "100 900", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mazen-mohamed.vercel.app"),
  title: "Mazen Mohamed — Full Stack Developer",
  description: "Mazen Mohamed builds web products from database to deploy with Next.js, React and Node.js. Based in Cairo.",
  openGraph: {
    title: "Mazen Mohamed — Full Stack Developer",
    description: "Full stack developer in Cairo: Next.js, React, Node.js, NestJS, PostgreSQL.",
    images: ["/crystal-poster.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#04050a", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
