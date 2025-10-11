import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const font = Host_Grotesk({
  subsets: ["latin"],
  preload: true,
});

const title = 'Helix'
const description = 'This is a platform where anyone can Transform ideas into stunning websites with AI-powered design and creativity.'

const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title,
  description,
  keywords: [
    "web design",
    "AI website builder",
    "no-code platform",
    "vibe coding platform"
  ],
  authors: [{ name: "Sky Gupta" }],
  creator: "Sky Gupta",
  openGraph: {
    title,
    description,
    type: 'website',
    images: [
      {
        url: '/logo.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: "Sky Gupta",
    creatorId: '@skyGuptaCS',
    images: [
      {
        url: '/logo.png',
      },
    ],
  },
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${font.className} antialiased relative`}>
        <div className="home-container fixed inset-0 z-0 overflow-hidden" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
