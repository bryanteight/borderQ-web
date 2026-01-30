import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Fredoka } from "next/font/google";
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "600"],
});

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DirectionProvider } from "@/context/DirectionContext";

import { InstallPrompt } from "@/components/InstallPrompt";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://borderq.com"),
  title: "BorderQ | BC-Washington Border Wait Times & AI Traffic Forecast",
  description: "Real-time BC-Washington border wait times, AI-powered traffic predictions, and live camera feeds for Peace Arch, Pacific Highway, and Aldergrove.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-v2.png",
    apple: "/icon-v2.png",
  },
  openGraph: {
    title: "BorderQ | AI Border Traffic Forecast",
    description: "Beat the border wait with AI-powered predictions and live camera feeds.",
    url: "https://borderq.com",
    siteName: "BorderQ",
    images: [
      {
        url: "/icon-v2.png",
        width: 1200,
        height: 630,
        alt: "BorderQ Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BorderQ | AI Border Traffic Forecast",
    description: "Real-time BC-Washington border wait times and AI-powered predictions.",
    images: ["/icon-v2.png"],
  },
};

import { GoogleAnalytics } from '@next/third-parties/google'

import { ExchangeRateProvider } from "@/context/ExchangeRateContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} antialiased`}
      >
        <DirectionProvider>
          <ExchangeRateProvider>
            <SiteHeader />
            {children}
            <InstallPrompt />
            <SiteFooter />
          </ExchangeRateProvider>
        </DirectionProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
