import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Helix",
  description: "Build the future of web design with AI-powered 3D website creation. Transform your ideas into reality with cosmic creativity.",
  keywords: ["3D websites", "AI website builder", "web design", "website creation", "no-code platform"],
  authors: [{ name: "Helix" }],
  creator: "Helix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Helix",
    description: "Transform your ideas into stunning 3D experiences with AI-powered design and cosmic creativity.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Helix",
    images: [
      {
        url: '/logo.png',
        alt: 'Helix',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix",
    description: "Transform your ideas into stunning 3D experiences with AI-powered design.",
    creator: '@skyGuptaCS',
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
    <html lang="en">
      <body className={`${inter.className} antialiased relative`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
