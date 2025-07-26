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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: "Helix",
  description:
    "Build the future of web design with AI-powered website creation. Transform your ideas into reality with cosmic creativity.",
  keywords: [
    "AI website builder",
    "web design",
    "website creation",
    "no-code platform",
  ],
  authors: [{ name: "Helix" }],
  creator: "Helix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Helix",
    description:
      "Transform your ideas into stunning websites with AI-powered design and cosmic creativity.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Helix",
    images: {
      url: "/logo.png",
      alt: "Helix",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix",
    description:
      "Transform your ideas into stunning websites with AI-powered design.",
    creator: "@skyGuptaCS",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.className} antialiased relative bg-background dark:bg-[#151515]`}
      >
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
