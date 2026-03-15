import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Fredoka, Noto_Sans_SC, Noto_Sans_TC } from "next/font/google";
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DirectionProvider } from "@/context/DirectionContext";

import { InstallPrompt } from "@/components/InstallPrompt";

import { ExchangeRateProvider } from "@/context/ExchangeRateContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://borderq.com"),
    title: t('title'),
    description: t('description'),
    manifest: "/manifest.json",
    icons: {
      icon: "/icon-v2.png",
      apple: "/icon-v2.png",
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
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
      locale: locale === 'zh-CN' ? 'zh_CN' : locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ["/icon-v2.png"],
    },
  };
}

import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine the primary font based on locale
  let fontClasses = `${geistSans.variable} ${geistMono.variable} ${fredoka.variable}`;
  if (locale === 'zh-CN') {
    fontClasses += ` ${notoSansSC.variable}`;
  } else if (locale === 'zh-TW') {
    fontClasses += ` ${notoSansTC.variable}`;
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && document.referrer) {
                  var ref = document.referrer.toLowerCase();
                  if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com') || ref.includes('android-app://com.twitter.android')) {
                    var url = new URL(window.location.href);
                    if (!url.searchParams.has('utm_source')) {
                      url.searchParams.set('utm_source', 'twitter');
                      url.searchParams.set('utm_medium', 'social');
                      url.searchParams.set('utm_campaign', 'referral');
                      window.history.replaceState({}, '', url.toString());
                    }
                  }
                }
              } catch(e) {}
            `
          }}
        />
      </head>
      <body
        className={`${fontClasses} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <DirectionProvider>
            <ExchangeRateProvider>
              <SiteHeader />
              <main>{children}</main>
              <InstallPrompt />
              <SiteFooter />
            </ExchangeRateProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    </html>
  );
}
