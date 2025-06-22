import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CosmicBackground from "@/components/CosmicBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helix - Create Stunning 3D Websites with AI",
  description: "Build the future of web design with AI-powered 3D website creation. Transform your ideas into reality with drag-and-drop simplicity and cosmic creativity.",
  keywords: "3D websites, AI website builder, web design, drag and drop, website creation",
  authors: [{ name: "Helix Team" }],
  openGraph: {
    title: "Helix - Create Stunning 3D Websites with AI",
    description: "Transform your ideas into stunning 3D experiences with AI-powered design and cosmic creativity.",
    type: "website",
    locale: "en_US",
    siteName: "Helix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix - Create Stunning 3D Websites with AI",
    description: "Transform your ideas into stunning 3D experiences with AI-powered design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} antialiased relative bg-black text-white`}>
        <div className="fixed inset-0 z-0">
          <CosmicBackground />
        </div>
        {children}
      </body>
    </html>
  );
}
